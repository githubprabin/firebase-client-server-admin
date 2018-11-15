import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';

export default class MenuEditor extends Component {

  render() {

    return (
      <TouchableOpacity style={styles.container}
        onPress={this.props.onPress}
        activeOpacity={0.7}>

        <Text style={styles.title}>{this.props.title}</Text>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    backgroundColor: '#444'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  }
})