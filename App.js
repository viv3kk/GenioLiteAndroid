import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, BackHandler, ActivityIndicator,PermissionsAndroid} from 'react-native';

// import module
import CustomWebView from "react-native-webview-android-file-upload"; 



console.ignoredYellowBox = ['Remote debugger'];

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component {

  constructor(){
    super();
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      platform:Platform.OS
    }
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  componentDidMount() {
    
      this.watchId = navigator.geolocation.watchPosition(
          (position) => {
              this.setState({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  error: null,
              },()=>{
                  this.webview.postMessage(JSON.stringify(this.state));
              });
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 0 },
      );

  }

  componentWillUnmount() {
    //navigator.geolocation.clearWatch(this.watchId);
    
    if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress');
    }

  }



  onAndroidBackPress = () => {
    this.webview.goBack();
    return true;
  }


  onErrorLoad_Webview(){
    return 
    (
      Alert.alert(
        'Alert Title',
        'My Alert Msg',
        [
          {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    )      
  }

  onNavigationStateChange(navState){
    console.log('navState',navState)
  }

  renderLoading(){
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ActivityIndicator size="small" color="#00ff00" />
        <ActivityIndicator size="large" color="#0000ff" />
        <ActivityIndicator size="small" color="#00ff00" />
      </View>
    )
    
  }

  render() {

    const uri_source = 'http://project02.vivek.26.blrsoftware.com/GENIO_LITE/genio_lite/#/';
    return (
      <CustomWebView
        webviewRef={e => (this.webview = e)} // webviewRef name should not changed
        source={{uri:uri_source}}
        domStorageEnabled={true}
        startInLoadingState={true}
        mediaPlaybackRequiresUserAction={true}
        onError={this.onErrorLoad_Webview.bind(this)}
        mixedContentMode={'compatibility'}
        geolocationEnabled={true} // Only for Android
        allowUniversalAccessFromFileURLs={true}
        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
        renderLoading={this.renderLoading.bind(this)}
        // any other props supported by React Native's WebView
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})

