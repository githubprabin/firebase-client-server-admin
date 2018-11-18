import React, { Component } from 'react';
import { YellowBox, StyleSheet, Text, View, ToolbarAndroid} from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

import RequestList from './request-wall/RequestList'
import MenuEditor from './menu-edit/MenuEditor'

export default class App extends Component {
  
  state= {
    currentScreen: 'Request List'
  }

  onActionSelected=(position)=> {
    if(position === 0) {
      this.setState({currentScreen: 'Request List'})
    } else if (position === 1) {
      this.setState({currentScreen: 'Menu Editor'})
    }
  }

  render() {
  
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title={this.state.currentScreen}
          actions={[
            {title: 'Request List',
            icon: require('../assets/list.png'), 
            show: 'always'
          }, 
          {
            title: 'Menu Editor',
            icon: require('../assets/edit.png'), 
            show: 'always'
          }]}
            onActionSelected={this.onActionSelected}/>

            <MainScreen style={styles.main}
             screen={this.state.currentScreen}/>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ddd'
  },
  toolbar: {
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    elevation: 2,
  },
  main:{
    width: '100%'
  }
});

class MainScreen extends Component {
    render() {
      const screen = this.props.screen;
      if(screen == 'Request List') 
         return <RequestList/>
      else if(screen == 'Menu Editor')
        return <MenuEditor/>
    }
}