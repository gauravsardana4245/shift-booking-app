import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import ShiftButton from '../components/ShiftButton';
import { globalStyles } from '../styles/global';

const MyShiftsScreen = ({navigation}) => {
  const [shifts, setShifts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState({});
  const host = "https://b7e0-2401-4900-1c67-68ce-e84d-b552-a71f-aea3.ngrok-free.app";

  const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear();
  };

  const isTomorrow = (someDate) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return someDate.getDate() === tomorrow.getDate() &&
      someDate.getMonth() === tomorrow.getMonth() &&
      someDate.getFullYear() === tomorrow.getFullYear();
  };

  const renderDateText = (date) => {
    const currentDate = new Date(date);
    if (isToday(currentDate)) {
      return 'Today';
    } else if (isTomorrow(currentDate)) {
      return 'Tomorrow';
    } else {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return currentDate.toLocaleDateString('en-US', options);
    }
  };

  const fetchShifts = async () => {
    try {
      console.log("res")
    const result = await fetch(`${host}/shifts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  });
  const res = await result.json();
    setShifts(res)
} catch (error) {
    console.error(error);
}
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchShifts();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      fetchShifts();
    });

    return unsubscribe;
}, []);

  useEffect(() => {
    fetchShifts();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  };

  const renderShiftsByDate = (date) => {
    const shiftsByDate = shifts.filter(
      (shift) =>
        new Date(shift.startTime).toDateString() === date && shift.booked
    );
  
    if (shiftsByDate.length === 0) {
      return null;
    }
  
    const numberOfShifts = shiftsByDate.length;
    const totalDuration = shiftsByDate.reduce((sum, shift) => {
      const startTime = new Date(shift.startTime).getTime();
      const endTime = new Date(shift.endTime).getTime();
      return sum + (endTime - startTime);
    }, 0);
  
    const totalDurationHours = Math.floor(totalDuration / (60 * 60 * 1000));
    const totalDurationMinutes = Math.floor((totalDuration % (60 * 60 * 1000)) / (60 * 1000));
  
    return (
      <View key={date} style={globalStyles.shiftsList}>
        <View style={globalStyles.shiftDateNDetails}>
        <Text style={globalStyles.currentDate}>
          {renderDateText(date)}  
        </Text>
        <Text style={globalStyles.shiftsInfo}>
        {numberOfShifts} {numberOfShifts>1?`shifts`:`shift`}, {totalDurationHours}h {totalDurationMinutes}m
        </Text>
        </View>
        {shiftsByDate.map((shift) => (
          <View key={shift.id} style={globalStyles.shiftBox}>
            <View>
              <Text style={globalStyles.shiftTimings}>
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </Text>
              <Text>
                {shift.area}
              </Text>
            </View>
            <ShiftButton
              title="Cancel"
              onPress={() => handleShiftButtonPress(shift)}
              loading={loading[shift.id]} 
              type="cancel"
              shouldDisable={shouldDisableButton(shift)}
              shiftId={shift.id}
            />
          </View>
        ))}
      </View>
    );
  };

  const hasShiftEnded = (shift) => {
    const shiftEndTime = new Date(shift.endTime);
    const now = new Date();
    return shiftEndTime < now;
  };
  

  const shouldDisableButton = (shift) => {
    const now = new Date();
    const shiftStartTime = new Date(shift.startTime);
    const shiftEndTime = new Date(shift.endTime);

    return (
      
      shiftStartTime <= now
    );
  };

  const handleShiftButtonPress = (shift) => {
    if (shift.booked && new Date(shift.startTime) <= new Date()) {
      return;
    }

    setLoading((prevLoading) => ({ ...prevLoading, [shift.id]: true }));
    setTimeout(() => {
        setLoading((prevLoading) => ({ ...prevLoading, [shift.id]: false }));
        cancelShift(shift.id);
        setLoading(false);
    }, 2000);
  };

  const cancelShift = async (shiftId) => {
    try {
      const result = await fetch(`${host}/shifts/${shiftId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const canceledShift = await result.json();

      setShifts((prevShifts) =>
        prevShifts.map((shift) =>
          shift.id === canceledShift.id ? { ...shift, booked: false } : shift
        )
      );
    } catch (error) {
      console.error('Error canceling shift:', error);
    }
  };

  const renderShifts = () => {
    const uniqueDates = Array.from(
      new Set(
        shifts
          .filter((shift) => shift.booked)
          .map((shift) => new Date(shift.startTime).toDateString())
      )
    );

    console.log(uniqueDates.length)

    if (uniqueDates.length === 0 || shifts.length === 0) {
      return (
        <View style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center" }}>
          <Text style={{ color: 'black', fontSize: 18 }}>
            You don't have any booked shifts to display
          </Text>
        </View>
      );
    }

    return (
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {uniqueDates.map((date) => renderShiftsByDate(date))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{paddingTop:30}}>
    <View style={globalStyles.myShiftsScreen}>
      <View>{renderShifts()}</View>
    </View>
    </SafeAreaView>
  );
};

export default MyShiftsScreen;
