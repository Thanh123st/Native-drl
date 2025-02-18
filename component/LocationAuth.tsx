import { useState, useEffect, useContext } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { AuthContext } from '../Context/Authcontext';
import { useNavigation } from "@react-navigation/native"; 


export default function LocationAuth({ activityid }: { activityid: string }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<{ lat: number; lon: number } | null>(null);
  const navigation = useNavigation(); // Lấy navigation

  const authContext = useContext(AuthContext);
  const { apiUrl, tokenauth } = authContext;
  console.log("TOKEN AUTH",tokenauth);
  // Khi locationData thay đổi, cập nhật requestData
  const [requestData, setRequestData] = useState({
    activity_id: activityid,
    isOnSchoolWiFi: false,
    userLocation: null, // Ban đầu là null
  });

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

  // Cập nhật requestData khi locationData thay đổi
  useEffect(() => {
    setRequestData((prev) => ({
      ...prev,
      userLocation: locationData,
    }));
  }, [locationData]);

  const postAttendance = async () => {
    if (!requestData.userLocation) {
      console.error('Location data is not available yet');
      return;
    }

    const url = `${apiUrl}/api/students/attendance`;

    console.log("Sending request:", requestData);
    try {
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenauth}`,
        }
      });
      console.log("adrgsdhgdfhdfggj",response.data);
      if(response.status === 201){
        console.log("Điểm danh thành công");
        navigation.navigate("AttHisory");
      }
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
