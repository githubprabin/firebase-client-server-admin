import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';

export default class CloseButton extends Component {

  render() {

    return (
      <TouchableOpacity style={[styles.container, this.props.style]}
        onPress={this.props.onPress}
        activeOpacity={0.4}>

        <Image style={styles.image}
            source={require('../../assets/button_close.png')}/>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    height:30,
    width: 30,
  }
})