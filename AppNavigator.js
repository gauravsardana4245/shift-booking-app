import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AvailableShiftsScreen from './screens/AvailableShiftsScreen';
import MyShiftsScreen from './screens/MyShiftsScreen';
import { Text, TouchableOpacity, View } from 'react-native';
const Tab = createBottomTabNavigator();

const MyTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', 
    justifyContent: 'space-around', 
    borderTopColor: "#A4B8D3",
    borderTopWidth: 0.2,
    // backgroundColor: '#2C3E50'
     }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{ padding: 16 }}
          >
            <Text style={{ color: isFocused ? '#1482ff' : '#ECF0F1', fontSize: 16, fontWeight:"bold" }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const AppNavigator = () => {
    return (
        <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
          <Tab.Screen 
          name="My Shifts" 
          component={MyShiftsScreen} 
          options={{ headerShown: false, tabBarLabel: 'My Shifts' }} />
          <Tab.Screen 
          name="Available Shifts" 
          component={AvailableShiftsScreen} 
          options={{ headerShown: false, tabBarLabel: 'Available Shifts'  }} />
        </Tab.Navigator>
      );
}

export default AppNavigator
