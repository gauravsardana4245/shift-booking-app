import React from 'react';
import { Button } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

const ShiftButton = ({ title, onPress, loading, type, shiftId, shouldDisable }) => {
  const whatColor= (type,shouldDisable)=> {
    if(shouldDisable) return "#CBD2E1";
    else return type === 'cancel' ? '#E2006A' : '#16A64D';
  } 
  return (
    <View>
    <TouchableOpacity
  //   titleStyle={{
  //     color: type === 'cancel' ? 'red' : 'green',
  //  }}
      // title={title}
      onPress={onPress}
      disabled={loading || shouldDisable}
      // loading={loading}
      style={{...styles.buttonStyle,borderColor: whatColor(type,shouldDisable)}}
    >
    {!loading?
    <Text style={{...styles.buttonText,color: whatColor(type,shouldDisable)}}>{title}</Text> :
    <ActivityIndicator size="large" color={whatColor(type,shouldDisable)} />
}
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: "bold",
    paddingVertical: 8, 
    fontSize: 18, 
    alignItems: "center",
    justifyContent: "center"
  },
  buttonStyle: { 
    backgroundColor:"white",
    borderRadius: 30,
    borderWidth: 1,
    marginVertical: 2.5,
    paddingHorizontal: 30 ,
    width: 120, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: "center"
  }
})

export default ShiftButton;
