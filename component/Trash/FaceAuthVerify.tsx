import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../Context/Authcontext';
import * as FaceDetector from 'expo-face-detector';

export default function CameraScreen({ activityid }: { activityid: string }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Lưu trữ ảnh đã chụp
  const cameraRef = useRef(null); // Tham chiếu đến camera
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý
  const authContext = useContext(AuthContext);
  const { apiUrl, token,setTokenauth,tokenauth } = authContext;
  if (!permission) {
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
    const activityId = activityid; // Đảm bảo bạn có activity_id hợp lệ
  
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      formData.append('image', blob, 'image.jpg');
      formData.append('activity_id', activityId);  // Thêm activity_id vào formData
  
      console.log("Ảnh datapost đi", formData);
  
      const apiResponse = await axios.post(`${apiUrl}/api/face/verify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Đảm bảo Content-Type là 'multipart/form-data'
          Authorization: `Bearer ${token}`,  // Gửi token đúng trong header
        },
        timeout: 2000000,
      });
  
      // Kiểm tra mã trạng thái HTTP
      if (apiResponse.status >= 200 && apiResponse.status < 300) {
        console.log("Data res:", apiResponse.data);
        const tokenFromApi = apiResponse.data.token;
        setTokenauth(tokenFromApi);
        console.log("TOKEN AUTH Done", tokenauth);
  
        console.log('Token từ API:', tokenFromApi);
      } else {
        console.error('Lỗi từ API: ', apiResponse.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi gửi ảnh lên API:', error);
    }
  };
  
  console.log("TOKEN AUTH",tokenauth);


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
    borderRadius: 75,
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
