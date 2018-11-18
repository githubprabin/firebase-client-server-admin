import React, { Component } from 'react';
import {
  ActivityIndicator, YellowBox, Dimensions, StyleSheet,
  Text, View, ToastAndroid, ScrollView, FlatList, TouchableOpacity
} from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

import { db } from '../config/db';
import PushNotification from 'react-native-push-notification';
import { SwipeListView } from 'react-native-swipe-list-view';
import CustomButton from '../menu-edit/CustomButton';
import CloseButton from '../menu-edit/CloseButton';

/* import BackgroundTask from 'react-native-background-task';

BackgroundTask.define(() => {

})
 */

var date;
// var requestList = [];

export default class RequestList extends Component {

  state = {
    loading: true,
    requestList: [],
  }

  constructor() {
    super();
    date = new Date().toLocaleDateString('en-us').replace(/\//g, '-');

    if (date.length > 8) {
      date = date.substring(0, 6) + date.substring(8, 11);
    }
  }

  componentDidMount() {
    this.fetchAllData();
    this.listenRequest();
  }

  fetchAllData() {
    var that = this;
    db.ref('/request-list/' + date)
      .on('value', function (snapshot) {
        var dataList = [];
        snapshot.forEach(function (childSnapshot) {
          var data = childSnapshot.val();

          const item = {
            key: childSnapshot.key,
            isOrderCompleted: data.isOrderCompleted,
            isOrderCompleted: data.isOrderCompleted,
            requestTime: data.requestTime,
            userEmail: data.userEmail,
            userName: data.userName,
            orderedItems: data.orderedItems
          }

          dataList.push(item);
        });

        that.setState({ requestList: dataList })
        that.setState({ loading: false })

      });

  }

  listenRequest() {

    db.ref('/request-list/' + date)
      .limitToLast(1)
      .once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var data = childSnapshot.val();

          const sender = data.userName;
          var displayMessage = 'Request from ' + sender;

            if(!data.isOrderCompleted) {

              PushNotification.localNotification({
                message: displayMessage,
                soundName: 'default'
              })
              
            } 
        })
      });
  }

  renderRequestRow(data) {
    return (
      <RequestListItem
        key={data.key}
        itemKey={data.key}
        requestData={data}
        onPress={() => this.toggleOrderCompleted(data.item.key)} 
        onClosePress={()=> this.closeSelected(data.item.key)}/>
    )
  }

  toggleOrderCompleted(key) {
    const index = this.state.requestList.map(i => { return i.key }).indexOf(key);

    var targetData = this.state.requestList[index];
    targetData.isOrderCompleted = !targetData.isOrderCompleted;
    targetData.key = ''

    db.ref('request-list/' + date+ '/' + key+'/').set(targetData);

    console.log(targetData)
  }

  closeSelected(key) {

    db.ref('request-list/' + date + '/' + key + '/').remove();
   
  }


  render() {

    return (
      <View style={styles.container}>

        <ScrollView style={styles.requestsList}>
          <FlatList
            data={this.state.requestList}
            renderItem={(data) => this.renderRequestRow(data)}
          />
        </ScrollView>

        <ActivityIndicator
          style={[styles.loadingIndicator, { opacity: this.state.loading ? 1 : 0 }]}
          animating={true}
          color='#b9162d'
          size='large' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffebcd',
  },
  requestsList: {
    width: '100%'
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height / 2
  }
});

class RequestListItem extends Component {

  renderBillItem = (item) => {
    // console.log(item);
    return (
      <BillItem
        key={Math.random().toString(36).substring(7)}
        itemName={item.item.itemName}
        itemRate={item.item.itemRate}
        quantity={item.item.quantityOrdered} />
    )
  }

  render() {

    const styles = StyleSheet.create({
      container: {
        margin: 2,
        padding: 10,
        width: '100%',
        elevation: 2,
        borderRadius: 2,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
      },
      textSender: {
        fontWeight: 'bold'
      },
      textTime: {
        color: '#888',
        marginBottom: 2
      },
      textItems: {

      }
    });

    const data = this.props.requestData;

    //calculate bill total
    const orderedItems = data.item.orderedItems;
    var total = 0;
    if (orderedItems != null) {
      for (let item of orderedItems) {
        total += item.itemRate * item.quantityOrdered;
      }
    }

    if (data.item.isOrderCompleted)
      return (
        <TouchableOpacity style={[styles.container,
        { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0000'}]}
          active={0.7}
          onPress={this.props.onPress}>

          <Text style={styles.textSender}>{data.item.userName}</Text>
          <Text style={styles.textTime}>{data.item.requestTime}</Text>
        
          <CloseButton onPress={this.props.onClosePress} />
        </TouchableOpacity>
      )
    else return (
      <TouchableOpacity style={styles.container}
        activeOpacity={0.7}
        onPress={this.props.onPress}>

        <Text style={styles.textSender}>{data.item.userName}</Text>
        <Text style={styles.textTime}>{data.item.requestTime}</Text>

        <FlatList
          data={orderedItems}
          renderItem={(item) => this.renderBillItem(item)} />

        <BillItem total={total} />

      </TouchableOpacity>
    )
  }
}

class BillItem extends Component {

  render() {

    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row'
      },
      itemName: {
        flex: 0.4
      },
      itemRate: {
        flex: 0.3,
        textAlign: 'right'
      },
      itemPrice: {
        flex: 0.3,
        textAlign: 'right'
      }
    })

    const itemName = this.props.itemName;
    const itemRate = this.props.itemRate;
    const quantity = this.props.quantity;
    const total = this.props.total;

    if (total == null) {
      return (
        <View style={styles.container}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text style={styles.itemRate}>{'Rs. ' + itemRate + ' x ' + quantity}</Text>
          <Text style={styles.itemPrice}>{'Rs. ' + parseInt(itemRate) * parseInt(quantity)}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text style={[styles.itemRate, { fontWeight: 'bold' }]}>Total</Text>
          <Text style={[styles.itemPrice, { fontWeight: 'bold' }]}>{'Rs. ' + total}</Text>
        </View>
      )
    }
  }
}