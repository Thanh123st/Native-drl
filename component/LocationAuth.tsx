import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import axios from 'axios';

import * as Device from 'expo-device';
import * as Location from 'expo-location';

export default function LocationAuth() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<{ lat: number, lon: number } | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLocationData({
        lat: location.coords.latitude,
        lon: location.coords.longitude
      });
    }

    getCurrentLocation();
  }, []);

  const postAttendance = async () => {
    if (!locationData) {
      console.error('Location data is not available');
      return;
    }

    const url = 'http://192.168.10.47:8000/api/students/attendance';
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWYyNjlhM2RkZDE3OTAyNDRiZWIxYSIsImVtYWlsIjoic3R1ZGVudEBleGFtcGxlLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiYWN0aXZpdHlfaWQiOiI2N2IwNmVlMmU3MTE0NDJjZDhhYTQwYjYiLCJpYXQiOjE3Mzk2MTkyMzMsImV4cCI6MTczOTYyMTAzM30.loQZg-p1aNjjb2Kjn9jbJu2IqlAEG6nB2rLVmGNOBSE";

    const requestData = {
      activity_id: "67b07f93358f6cbbe93c5cd4",
      isOnSchoolWiFi: false,
      userLocation: locationData
    };

    console.log("asfsdgsfdg",requestData);
    try {
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('Response from API:', response.data);
    } catch (error) {
      console.error('Error posting attendance:', error);
    }
  };

  let text: string;
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  } else {
    text = 'Loading location...';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <Button title="Post Attendance" onPress={postAttendance} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
