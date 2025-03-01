import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, Text, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT  } from 'react-native-maps';
import { Slider } from 'native-base';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapScreen({ onClose }) {
  const [location, setLocation] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [radius, setRadius] = useState(20);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const mapViewRef = useRef<MapView | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite" | "hybrid">("standard");

  const toggleMapType = () => {
    setMapType((prev) => (prev === "standard" ? "hybrid" : "standard"));
  };

  useEffect(() => {
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
    let lat = coordinates?.lat || location?.coords.latitude;
    let lon = coordinates?.lon || location?.coords.longitude;
    if (onClose) {
      onClose();
    }
    if (lat && lon) {
      Alert.alert('Vị trí đã lưu');
      await AsyncStorage.setItem('Latitude', lat.toString());
      await AsyncStorage.setItem('Longitude', lon.toString());
    } else {
      Alert.alert('Lỗi', 'Không thể lưu vị trí. Hãy thử lại.');
    }
  };

  const handleFocusLocation = () => {
    if (location) {
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      };
      
      mapViewRef.current?.animateToRegion(region, 1000);
      setMarker({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  if (!location) {
    return <Text>Đang lấy vị trí...</Text>;
  }

  return (
    <View style={styles.container}>
      
      <MapView
        provider={PROVIDER_DEFAULT}
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        mapType={mapType}
        onLongPress={handleLongPress}
      >
        {marker && (
          <>
            <Marker coordinate={marker} title="Vị trí chọn" />
            <Circle center={marker} radius={radius} strokeWidth={2} strokeColor="blue" fillColor="rgba(0, 0, 255, 0.1)" />
          </>
        )}
        {!marker && location && (
          <>
            <Marker coordinate={location.coords} title="Vị trí của bạn" />
            <Circle center={location.coords} radius={radius} strokeWidth={2} strokeColor="red" fillColor="rgba(255, 0, 0, 0.1)" />
          </>
        )}
        <View style={styles.mapButtonContainer}>
          <TouchableOpacity 
            style={styles.mapButton} 
            onPress={toggleMapType}
          >
            <Text style={styles.buttonText}>🗺</Text>
          </TouchableOpacity>
        </View>
      </MapView>

      
      <View style={{ flexDirection:"column", alignItems:"center" }}>
      <Slider
      w="3/4"
      maxW="300"
      defaultValue={40}
      minValue={10}
      maxValue={120}
      step={10}
      accessibilityLabel="Thanh trượt"
      onChange={(value) => setRadius(value)} 

    >
      <Slider.Track bg="gray.300">
        <Slider.FilledTrack bg="blue.500"/>
      </Slider.Track>
      <Slider.Thumb bg="blue.500" />
    </Slider>
    <Text>Bán kính: {radius}m</Text>
    </View>

      <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.button} onPress={handleSaveLocation} >
        <Text style={styles.buttonText}>Xác nhận vị trí</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleFocusLocation}>
        <Text style={styles.buttonText}>Về vị trí hiện tại</Text>
      </TouchableOpacity>

      </View>

      <Text style={styles.note}>Vui lòng xác nhận vị trí trước khi tạo hoạt động.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '80%' },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  note: {
    color: "grey",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: 'transparent', // Màu nền xanh dương
    
  },
  
  buttonText: {
    color: '#0066CC',
    fontSize: 17
  },
  mapButtonContainer: {
    position: "absolute",
    top: 20, // Khoảng cách từ trên xuống
    left: 20, // Góc trái
  },
  mapButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Nền trong suốt
    padding: 10,
    borderRadius: 8,
  },
});
