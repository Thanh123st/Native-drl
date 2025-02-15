import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import axios from 'axios';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Lưu trữ ảnh đã chụp
  const cameraRef = useRef(null); // Tham chiếu đến camera
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePhoto = async () => {
    setIsProcessing(true); // Đánh dấu quá trình đang diễn ra
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(); // Chụp ảnh
      setCapturedImage(photo.uri); // Lưu ảnh vào state

      // Gửi ảnh lên API
      postImageToApi(photo.uri);

      setIsProcessing(false); // Dừng trạng thái xử lý
    }
  };

  const postImageToApi = async (imageUri: string) => {
    const formData = new FormData();
    const activityId = '67b06ee2e711442cd8aa40b6'; // Đảm bảo bạn có activity_id hợp lệ
  
    try {
      // Tải ảnh từ URI về dưới dạng Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      // Thêm ảnh vào formData
      formData.append('image', blob, 'image.jpg');
      formData.append('activity_id', activityId);  // Thêm activity_id vào formData
  
      // Gửi yêu cầu lên API
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWYyNjlhM2RkZDE3OTAyNDRiZWIxYSIsImVtYWlsIjoic3R1ZGVudEBleGFtcGxlLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM5NjE2ODUzLCJleHAiOjE3Mzk2MjA0NTN9.Ab5qGPYcIgeO81cMqLqz9VSuaxgrm_4gHJlBxPYbn-k"; // Đảm bảo bạn có token hợp lệ
      console.log("Ảnh datapost đi",formData);
      const apiResponse = await axios.post('http://192.168.10.47:8000/api/face/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Đảm bảo Content-Type là 'multipart/form-data'
          Authorization: `Bearer ${token}`,  // Gửi token đúng trong header
        },
        timeout: 200000,
      });
  
      console.log("DAAT",apiResponse.data)
      const tokenFromApi = apiResponse.data.token;
      console.log('Token từ API:', tokenFromApi);
    } catch (error) {
      console.error('Lỗi khi gửi ảnh lên API:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto} disabled={isProcessing}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {capturedImage && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Captured Photo:</Text>
          <Image source={{ uri: capturedImage }} style={styles.image} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    margin: 5,
    borderRadius: 10,
  },
});
