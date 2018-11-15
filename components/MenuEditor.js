import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView, Button, ToastAndroid } from 'react-native';
import CustomButton from './CustomButton';

export default class MenuEditor extends Component {

    state = {
        data: []
    }

    addNewRow() {
        var currentMenu = this.state.data;
        var newItem = { key: currentMenu.length, text: 'New' }
        currentMenu.push(newItem);
        this.setState({ data: currentMenu })
    }

    removeRow(index) {
        var currentMenu = this.state.data;

        currentMenu.pop();
        this.setState({ data: currentMenu });

        // ToastAndroid.show(currentMenu, ToastAndroid.SHORT);

    }
    render() {

        const renderMenuItems = this.state.data.map(item => {
            var currentMenu = this.state.data;
            const index = currentMenu.map(function (i) { return i.key }).indexOf(item.key);

            return <Row
                key={item.key}
                text={item.text}

                index={index}
                onRemoveButtonPress={() => this.removeRow(index)} />
        })

        return (

            <View style={styles.container}>

                <ScrollView>
                    {renderMenuItems}
                </ScrollView>

                <CustomButton style={styles.addButton}
                    title={'+'}
                    onPress={() => this.addNewRow()} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd',
        justifyContent: 'space-between'
    },
    addButton: {
        height: 42
    }
})

class Row extends React.Component {

    render() {

        const style = StyleSheet.create({
            container: {
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 3,
                padding: 15,
                backgroundColor: '#fff'
            }
        })
        return (
            <View style={style.container}>
                <Text>{this.props.index + 1}</Text>
                <Text>2</Text>
                <Text>3</Text>
                <Text>4</Text>
                <Button title='x' onPress={this.props.onRemoveButtonPress} />
            </View>
        )
    }
}