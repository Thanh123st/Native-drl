import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, Text, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Slider } from 'native-base';  // Import Slider từ Native Base
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapScreen() {
  const [location, setLocation] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [radius, setRadius] = useState(20);  // Radius in meters
  const [showMap, setShowMap] = useState(true);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  // Ref để tham chiếu đến MapView
  const mapViewRef = useRef<MapView | null>(null);

  useEffect(() => {
    // Yêu cầu quyền truy cập vị trí và lấy vị trí hiện tại của người dùng
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need location access to show your position');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handleLongPress = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    setMarker(coordinate);
    setCoordinates({
      lat: coordinate.latitude,
      lon: coordinate.longitude,
    });
  };

  const handleSaveLocation = async () => {
    if (coordinates) {
      Alert.alert('Vị trí đã lưu', `Latitude: ${coordinates.lat}\nLongitude: ${coordinates.lon}`);
      await AsyncStorage.setItem('Latitude', coordinates.lat.toString()); // Đảm bảo giá trị là chuỗi
      await AsyncStorage.setItem('Longitude', coordinates.lon.toString()); // Đảm bảo giá trị là chuỗi
      setShowMap(false);
    } else {
      Alert.alert('Error', 'Hãy chọn một vị trí trên bản đồ trước.');
    }
  };
  

  const handleFocusLocation = () => {
    setMarker(null);
    if (location) {
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0028386,
        longitudeDelta: 0.0003333,
      };

      mapViewRef.current?.animateToRegion(region, 1000); // Di chuyển bản đồ đến vị trí hiện tại với thời gian chuyển động là 1 giây
    }
  };






  if (!location) {
    return <Text>Đang lấy vị trí...</Text>;
  }

  return (
    <View style={styles.container}>
      {showMap && (
        <MapView
          ref={mapViewRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onLongPress={handleLongPress}
        >
          
          {marker && (
            <>
              <Marker coordinate={marker} title="Vị trí chọn" description="Bạn đã chọn vị trí này" />
              {/* Vẽ vòng tròn với bán kính */}
              <Circle
                center={marker}
                radius={radius} // bán kính trong đơn vị mét
                strokeWidth={2}
                strokeColor="blue"
                fillColor="rgba(0, 0, 255, 0.1)"
              />
            </>
          )}
          {location && !marker && (
            <>
            
            <Marker coordinate={{latitude: location.coords.latitude,longitude: location.coords.longitude}} title="Vị trí của bạn" description="Vị trí của bạn" />

            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={radius}
              strokeWidth={2}
              strokeColor="red"
              fillColor="rgba(255, 0, 0, 0.1)"
            />
            </>
          )}
        </MapView>
      )}

      {!showMap && coordinates && (
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>
            Vị trí đã chọn: {`Latitude: ${coordinates.lat}, Longitude: ${coordinates.lon}`}
          </Text>
        </View>
      )}

      <Button title="Lưu vị trí và đóng bản đồ" onPress={handleSaveLocation} />
      <Button title="Focus về vị trí hiện tại" onPress={handleFocusLocation} />

      {/* Thêm slider từ Native Base để thay đổi bán kính */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  coordinatesContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 20,
  },
  coordinatesText: {
    fontSize: 16,
  },
  
});
