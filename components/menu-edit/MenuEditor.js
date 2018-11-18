import React, { Component } from 'react';
import {
    CheckBox, Dimensions, StyleSheet, View, Text, TouchableHighlight,
    ScrollView, Button, ToastAndroid, TextInput, ActivityIndicator,YellowBox
} from 'react-native';
import CustomButton from './CustomButton';
import CloseButton from './CloseButton';
import { db } from '../config/db';

YellowBox.ignoreWarnings(['Setting a timer']);

export default class MenuEditor extends Component {

    state = {
        data: [],
        isUploadingData: false
    }

    componentDidMount() {
        this.setState({ isUploadingData: true })
        var that = this;
        db.ref('food-menu')
            .on('value', snapshot => {
                var menu = [];
                snapshot.forEach(childSnapshot => {
                    var item = childSnapshot.val();
                    console.log(item);
                    menu.push(item);
                });
                that.setState({
                    data: menu,
                    isUploadingData: false
                });
            })
    }

    addNewRow() {
        var currentMenu = this.state.data;
        var newItem = {
            key: Math.random().toString(36).substring(7),       //generates random key of length 5
            itemName: '',
            itemPrice: '',
            isAvailable: true
        }
        currentMenu.push(newItem);
        this.setState({ data: currentMenu })

        this.refs.scrollView.scrollToEnd(true);
    }

    removeRow(index) {
        var currentMenu = this.state.data;

        //fix error when last item is removed
        if (index == currentMenu.length - 1) {
            currentMenu.pop();
            this.setState({ data: currentMenu });
            return;
        }

        currentMenu.splice(index, 1);

        this.setState({ data: currentMenu });
    }

    updateName = (text, key) => {
        var currentMenu = this.state.data;
        const index = currentMenu.map(i => { return i.key }).indexOf(key);

        var targetData = currentMenu[index];
        targetData.itemName = text;
        currentMenu[index] = targetData;

        this.setState({ data: currentMenu });
    }

    updatePrice = (text, key) => {
        var currentMenu = this.state.data;
        const index = currentMenu.map(i => { return i.key }).indexOf(key);

        var targetData = currentMenu[index];
        targetData.itemPrice = text;
        currentMenu[index] = targetData;

        this.setState({ data: currentMenu });
    }

    toggleCheckBox = (key) => {
        var currentMenu = this.state.data;
        const index = currentMenu.map(i => { return i.key }).indexOf(key);

        var targetData = currentMenu[index];
        targetData.isAvailable = !targetData.isAvailable;
        currentMenu[index] = targetData;

        this.setState({ data: currentMenu });
    }

    uploadToFirebase() {
        this.setState({ isUploadingData: true })

        var currentMenu = this.state.data;

        var flag = false;
        currentMenu.map(item => {
            if (item.itemName == 'New Item' || item.itemName == ''
                || item.itemPrice <= '0' || item.itemPrice == '') {
                ToastAndroid.show('Please complete the menu and try again', ToastAndroid.LONG);
                flag = true;
            }
        });
        if (flag) {
            this.setState({ isUploadingData: false })
            return;
        }
        console.log(this.state.data);

        var that = this;
        db.ref('/food-menu').set(currentMenu, error => {
            if (error) {
                ToastAndroid.show(error + '', ToastAndroid.LONG);
                that.setState({ isUploadingData: false })
            } else {
                ToastAndroid.show('Menu has been updated', ToastAndroid.SHORT);
                that.setState({ isUploadingData: false })
            }
        });
    }

    render() {

        const renderMenuItems = this.state.data.map(item => {
            var currentMenu = this.state.data;
            const index = currentMenu.map(i => { return i.key }).indexOf(item.key);

            return <Row
                key={item.key}
                dataKey={item.key}
                itemName={item.itemName}
                itemPrice={item.itemPrice}
                isAvailable={item.isAvailable}

                index={index}
                onRemoveButtonPress={() => this.removeRow(index)}
                updateName={this.updateName}
                updatePrice={this.updatePrice}
                toggleCheckBox={this.toggleCheckBox}
            />
        })

        return (

            <View style={styles.container}>

                <ScrollView
                    ref='scrollView'>
                    {renderMenuItems}
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <CustomButton style={styles.addButton}
                        title={'Add Field'}
                        disabled={this.state.isUploadingData}
                        onPress={() => this.addNewRow()} />

                    <CustomButton style={styles.uploadButton}
                        title={'Upload'}
                        disabled={this.state.isUploadingData}
                        onPress={() => this.uploadToFirebase()} />

                </View>

                <ActivityIndicator style={[styles.loadingIndicator, { opacity: this.state.isUploadingData ? 1 : 0 }]}
                    animating={true}
                    color='#b9162d'
                    size='large' />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffebcd',
        justifyContent: 'space-between'
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row'
    },
    addButton: {
        flex: 1,
        backgroundColor: '#0997E5'
    },
    uploadButton: {
        flex: 1,
        backgroundColor: '#F5840C'
    },
    loadingIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height / 2
    }
})

class Row extends React.Component {

    render() {

        const styles = StyleSheet.create({
            container: {
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 2,
            },
            inputContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                flex: 0.8,
            },
            close: {
                flex: 0.1,
            },
            checkBox: {
                flex: 0.1,
            },
            index: {
                flex: 0.2,
                textAlign: 'center'
            },
            name: {
                flex: 0.5,
                textAlign: 'center'
            },
            rate: {
                flex: 0.3,
                textAlign: 'center'
            },
        })

        const key = this.props.dataKey;

        return (
            <View style={styles.container}>

                <CloseButton style={styles.close}
                    onPress={this.props.onRemoveButtonPress} />

                <View style={styles.inputContainer}>
                    <Text style={styles.index}>{this.props.index + 1 + '.'}</Text>

                    <TextInput style={styles.name}
                        defaultValue={this.props.itemName}
                        placeholder='Item Name'
                        onChangeText={text => this.props.updateName(text, key)} />

                    <TextInput style={styles.name}
                        defaultValue={this.props.itemPrice}
                        placeholder='Item Price (Rs.)'
                        keyboardType='decimal-pad'
                        onChangeText={text => { this.props.updatePrice(text, key) }} />
                </View>
                
                <CheckBox style={styles.checkBox}
                    value={this.props.isAvailable}
                    onValueChange={() => { this.props.toggleCheckBox(key) }} />
            </View>
        )
    }
}