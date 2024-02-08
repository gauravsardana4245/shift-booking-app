import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyShiftsScreen from '../screens/MyShiftsScreen';
import AvailableShiftsScreen from '../screens/AvailableShiftsScreen';

const Stack = createStackNavigator();

const ShiftBookingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="MyShifts" component={MyShiftsScreen} />
      <Stack.Screen name="AvailableShifts" component={AvailableShiftsScreen} />
    </Stack.Navigator>
  );
};

export default ShiftBookingNavigator;
