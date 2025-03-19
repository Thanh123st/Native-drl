import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Platform, ActivityIndicator,TextInput,FlatList  } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT,PROVIDER_GOOGLE  } from 'react-native-maps';
import { Slider } from 'native-base';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export default function MapScreen({ onClose }) {
  const [location, setLocation] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [radius, setRadius] = useState(20);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const mapViewRef = useRef<MapView | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite" | "hybrid">("standard");
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]); // Danh sách kết quả tìm kiếm

  const toggleMapType = () => {
    setMapType((prev) => (prev === "standard" ? "hybrid" : "standard"));
  };

  useEffect(() => {
    const fetchLocation = async (retryCount = 0) => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Lỗi quyền', 'Ứng dụng cần quyền truy cập vị trí');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(currentLocation);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy vị trí:", error);
        if (retryCount < 3) {
          setTimeout(() => fetchLocation(retryCount + 1), 3000);
        } else {
          Alert.alert('Lỗi', 'Không thể lấy vị trí. Vui lòng thử lại.');
          setLoading(false);
        }
      }
    };

    fetchLocation();
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
    
    if (!lat || !lon) {
      Alert.alert('Lỗi', 'Không thể lưu vị trí. Hãy thử lại.');
      return;
    }

    await AsyncStorage.setItem('Latitude', lat.toString());
    await AsyncStorage.setItem('Longitude', lon.toString());    Alert.alert('Thành công', 'Vị trí đã lưu.');
    if (onClose) onClose();


      
    
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


  
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (typingTimeout) {
      clearTimeout(typingTimeout); // Xóa timeout trước đó
    }

    const newTimeout = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: query,
            format: "json",
            limit: 5,
            countrycodes: "VN",
          },
        });

        setSearchResults(response.data);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        Alert.alert("Lỗi tìm kiếm địa điểm!");
      }
    }, 500); // Đợi 1 giây sau khi nhập xong mới gọi API

    setTypingTimeout(newTimeout);
  };

  // Khi người dùng chọn một địa điểm từ danh sách
  const handleSelectLocation = (location) => {
    const { lat, lon, display_name } = location;
    const newRegion = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    mapViewRef.current?.animateToRegion(newRegion, 1000);
    setMarker({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
    setSearchQuery(display_name); // Cập nhật ô nhập với địa điểm đã chọn
    setSearchResults([]); // Ẩn danh sách kết quả
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0066CC" style={styles.loading} />;
  }
  return (
    <>
      {Platform.OS === "ios" ?(<View style={styles.container}>
      {location ? (
        <>
      <MapView
        provider={Platform.OS === "ios" ?PROVIDER_DEFAULT : PROVIDER_GOOGLE}
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
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="Nhập địa điểm..."
            value={searchQuery}
            onChangeText={handleSearch} // Khi mất focus mới tìm kiếm
          />

          {/* Hiển thị danh sách kết quả tìm kiếm */}
          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              style={styles.searchResultsList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectLocation(item)}>
                  <Text>{item.display_name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
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
      
      </>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text>Đang tải vị trí...</Text>
        </View>
      )}
      
      <View style={{ flexDirection:"column", alignItems:"center" }}>
      <Slider
      w="80%"
      maxW="300"
      defaultValue={40}
      minValue={10}
      maxValue={120}
      step={10}
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
    </View>) : (<View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 10.762622,
          longitude: location?.coords.longitude || 106.660172,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
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
      </MapView>
      <View style={styles.andmapButtonContainer}>
          <TouchableOpacity 
            style={styles.mapButton} 
            onPress={toggleMapType}
          >
            <Text style={styles.buttonText}>🗺</Text>
          </TouchableOpacity>
        </View>
      <View style={styles.controls}>
        <Slider w="80%" maxW="300" defaultValue={40} minValue={10} maxValue={120} step={10} onChange={setRadius}>
          <Slider.Track bg="gray.300">
            <Slider.FilledTrack bg="blue.500" />
          </Slider.Track>
          <Slider.Thumb bg="blue.500" />
        </Slider>
        <Text>Bán kính: {radius}m</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.androidButton} onPress={handleSaveLocation}>
            <Text style={styles.buttonText}>Xác nhận vị trí</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.androidButton} onPress={handleFocusLocation}>
            <Text style={styles.buttonText}>Về vị trí hiện tại</Text>
          </TouchableOpacity>
        </View>

      </View>

      <Text style={styles.note}>Vui lòng xác nhận vị trí trước khi tạo hoạt động.</Text>
    </View>)}
    </>

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
  controls: {
    alignItems: 'center',
    marginTop: 10,
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
  andmapButtonContainer: {
    position: "absolute",
    top: 20, // Khoảng cách từ trên xuống
    left: 20, // Góc trái
    zIndex: 10
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidmapButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  androidButton: {
    marginHorizontal: 15, // Tạo khoảng cách đều hai bên
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  searchBox: {
    height: 45,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  searchResultsList: {
    maxHeight: 200, // Giới hạn chiều cao danh sách kết quả
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
