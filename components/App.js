import React, { Component } from 'react';
import { YellowBox, StyleSheet, Text, View, ToastAndroid, BackAndroid, ScrollView, FlatList } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

import { db } from './components/config/db';
import PushNotification from 'react-native-push-notification';
import { SwipeListView } from 'react-native-swipe-list-view';
import Moment from 'react-moment';

/* import BackgroundTask from 'react-native-background-task';

BackgroundTask.define(() => {

})
 */

var date;
var requestList = [];

export default class App extends Component {

  state = {
    loading: true
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
          dataList.push(data);
        });
        // console.log(dataList)

        requestList = dataList;
        if (requestList.length > 0) {
          that.setState({ loading: false })
        }
      });

  }

  listenRequest() {

    db.ref('/request-list/' + date)
      .limitToLast(1)
      .on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var data = childSnapshot.val();

          // console.log(childSnapshot.key);

          const sender = data.userName;
          var displayMessage = 'Request from ' + sender;
          PushNotification.localNotification({
            message: displayMessage,
            soundName: 'default'
          })
        })
      });
  }

  renderRequestRow(data, rowMap) {
    return (
      <RequestListItem requestData={data} />
    )
  }

  renderActionsRow = (data, rowMap) => {
    <View>
      <Text>Left</Text>
      <Text>Right</Text>
    </View>
  }

  render() {

    if (this.state.loading) {
      return (<Text>Loading...</Text>)
    }
    return (
      <View style={styles.container}>

        <ScrollView style={styles.requestsList}>
          <SwipeListView
            useFlatList
            data={requestList}
            renderItem={(data, rowMap) => this.renderRequestRow(data, rowMap)}
            renderHiddenItem={(data, rowMap) => (
              <View style={{ flex: 1, backgroundColor: '#777', width: 100, alignSelf: 'flex-end', margin: 5 }}>

              </View>
            )}
            rightOpenValue={-100}
            disableRightSwipe={true}
            friction={20}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  requestsList: {
    width: '100%'
  }
});

class RequestListItem extends Component {

  timeSince(date) {

    var current = new Date().toLocaleDateString('en-us').replace(/\//g, '-');

    if (date.length > 8) {
      date = date.substring(0, 6) + date.substring(8, 11);
    };

    var seconds = Math.floor(current-date / 1000);
    var interval = Math.floor(seconds / 31536000);
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  renderBillItem=(item)=> {
    // console.log(item);
    return(
      <BillItem 
      itemName={item.item.itemName}
      itemRate={item.item.itemRate}
      quantity={item.item.quantityOrdered}/>
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

    const requestTime = data.item.requestTime;
    //find duration of time posted
    var relative = this.timeSince(requestTime);

    //calculate bill total
    const orderedItems = data.item.orderedItems;
    console.log(orderedItems);

    var total = 0;
    for (let item of orderedItems) {
      total += item.itemRate * item.quantityOrdered;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.textSender}>{data.item.userName}</Text>
        <Text style={styles.textTime}>{data.item.requestTime}</Text>

        <FlatList
          data={orderedItems}
          renderItem={(item)=>this.renderBillItem(item)}
        />

        <BillItem total={total}/>

      </View>
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