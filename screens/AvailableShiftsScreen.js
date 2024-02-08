import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import ShiftButton from '../components/ShiftButton';
import { globalStyles } from '../styles/global';
import { FlatList } from 'react-native';
// import SafeAreaView from 'react-native-safe-area-view';

const AvailableShiftsScreen = ({navigation}) => {
  const [shifts, setShifts] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState({});
  const host = "https://b7e0-2401-4900-1c67-68ce-e84d-b552-a71f-aea3.ngrok-free.app";

//   useEffect(() => {
//     setShifts(shifts)
// }, [shifts])

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
    // console.log(res)
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
}, [navigation]);

  useEffect(()=> {
   
    fetchShifts();
  }, []);

  const cityFilterHandler = (city) => {
    setSelectedCity(city);
  };

  const filterShiftsByCity = () => {
    if (!selectedCity) {
      return shifts.filter(shift => !hasShiftEnded(shift));
    }
    return shifts.filter(shift => shift.area === selectedCity && !hasShiftEnded(shift));
  };  

  const renderCitiesFilter = () => {
  const cities = Array.from(new Set(shifts.map(shift => shift.area)));
  const sortedCities = cities.sort();
  console.log("sortedCities: ", sortedCities);

  if (!selectedCity && sortedCities.length > 0) {
    cityFilterHandler(sortedCities[0]);
  }

  return (
    <ScrollView
      horizontal
      style={globalStyles.citiesFilter}
    >
      {sortedCities.map(city => {
        // const filteredShifts = filterShiftsByCity();
        const shiftsInCity = shifts.filter(shift => shift.area === city && !hasShiftEnded(shift) && !startedButNotBooked(shift));

        return (
          <View
            key={city}
            style={globalStyles.citiesFilterBox}
          >
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => cityFilterHandler(city)}
            >
              <Text style={{ color: selectedCity === city ? "#004FB4" : "#CBD2E1", fontSize: 18, fontWeight: "600" }}>{`${city} (${shiftsInCity.length})`}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  
    return `${formattedHours}:${formattedMinutes}`;
  };

  const bookShift = async (shiftId) => {
    try {
      const result = await fetch(`${host}/shifts/${shiftId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const bookedShift = await result.json();
      console.log(bookedShift)

      setLoading(true);
      setShifts((prevShifts) =>
        prevShifts.map((shift) =>
          shift.id === bookedShift.id ? { ...shift, booked: true } : shift
        )
      );
      setLoading(false);
    } catch (error) {
      console.error('Error booking shift:', error);
    }
  };

  const renderShiftsByDate = (date) => {
    const shiftsInCity = filterShiftsByCity();
    const shiftsByDate = shiftsInCity.filter(
      (shift) => new Date(shift.startTime).toDateString() === date && !startedButNotBooked(shift)
    );

    if (shiftsByDate.length === 0) {
      return null;
    }

    return (
      <View key={date} style={globalStyles.shiftsList}>
        <Text style={globalStyles.currentDate}>{renderDateText(date)}</Text>
        {shiftsByDate.map((shift) => (
          <View key={shift.id} style={globalStyles.shiftBox}>
            <View style={globalStyles.shiftSubBox}>
              <Text style={globalStyles.shiftTimings}>
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </Text>
              <View style={{paddingRight: 5}}>
              {shift.booked && (
                <Text style={{ color: '#4F6C92', fontSize:17, fontWeight: "bold"}}>Booked</Text>
              )}
              {hasOverlappingBookedShift(shift) && (
              <Text style={{ color: '#E2006A', fontSize:17, fontWeight: "bold" }}>Overlapping</Text>
            )}
            {/* {!hasOverlappingBookedShift(shift) && !shift.booked && (
              <Text style={{ color: '#16A64D', fontSize:17, fontWeight: "bold" }}>Available</Text>
            )} */}
            </View>
            </View>
            <View>
              <ShiftButton
                title={shift.booked ? 'Cancel' : 'Book'}
                onPress={() => handleShiftButtonPress(shift)}
                loading={loading[shift.id]} 
                type={shift.booked ? 'cancel' : 'book'}
                shouldDisable={shouldDisableButton(shift)}
                shiftId={shift.id}
              />
            </View>
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

  const startedButNotBooked = (shift) => {
    const shiftStartTime = new Date(shift.startTime);;
    const now = new Date();
    return (shiftStartTime <= now && shift.booked==false)
  };
  

  const shouldDisableButton = (shift) => {
    const now = new Date();
    const shiftStartTime = new Date(shift.startTime);
    const shiftEndTime = new Date(shift.endTime);

    return (
      
      shiftStartTime <= now ||
      hasOverlappingBookedShift(shift)
    );
  };

  const hasOverlappingBookedShift = (shift) => {
    const bookedShifts = shifts.filter((s) => s.booked && s.id !== shift.id);
    const shiftStartTime = new Date(shift.startTime);
    const shiftEndTime = new Date(shift.endTime);

    return bookedShifts.some(
      (bookedShift) =>
        new Date(bookedShift.endTime) > shiftStartTime &&
        new Date(bookedShift.startTime) < shiftEndTime
    );
  };

  const handleShiftButtonPress = (shift) => {
    if (shift.booked && new Date(shift.startTime) <= new Date()) {
      return;
    }

    setLoading((prevLoading) => ({ ...prevLoading, [shift.id]: true }));
    setTimeout(() => {
      if (shift.booked) {
        setLoading((prevLoading) => ({ ...prevLoading, [shift.id]: false }));
        cancelShift(shift.id);
        setLoading(false);
      } else {
        setLoading((prevLoading) => ({ ...prevLoading, [shift.id]: false }));
        bookShift(shift.id);
        setLoading(false);
      }
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
    const shiftsInCity = filterShiftsByCity();
    const uniqueDates = Array.from(new Set(shiftsInCity.map(shift => new Date(shift.startTime).toDateString())));

    return (
      <View>
      <FlatList
      contentContainerStyle={{ paddingBottom: 400 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={uniqueDates}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderShiftsByDate(item)}
      />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ marginBottom: 10 }}>
    <View style={globalStyles.availableShiftScreen}>
      <View>
      {renderCitiesFilter()}
      </View>
      {/* <View style={{flex:1, marginBottom: 10 }}> */}
      {renderShifts()}
      {/* </View> */}
    </View>
     </SafeAreaView>
  );
};

export default AvailableShiftsScreen;
