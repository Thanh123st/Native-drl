import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { AuthContext } from '../Context/Authcontext';
import { useNavigation } from "@react-navigation/native"; 
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
export default function FaceVerity({ activityid }: { activityid: string }) {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const authContext = useContext(AuthContext);
  const { apiUrl, token,setTokenauth,tokenauth ,apiUrlface } = authContext;
  const navigation = useNavigation(); // Lấy navigation
  const [capturing, setCapturing] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
      <Text style={styles.message}>Chúng tôi cần sự xác nhận của bạn</Text>
      <Text style={styles.message}>trong việc chụp ảnh và quay video khi dùng ứng dụng</Text>

      <TouchableOpacity style={styles.buttonacpcam} onPress={requestPermission}>
        <Text style={styles.buttonText}>Xác nhận chấp nhận sử dụng</Text>
      </TouchableOpacity>
    </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      setCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: false, quality: 0.1 });
        console.log('Ảnh chụp:', photo.uri);
        const resizedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: photo.width * 0.5, height: photo.height * 0.5 } }], // Resize xuống 50%
          { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG } // Nén xuống 40%
        );
        await uploadImage(resizedPhoto.uri);
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
      } finally {
        setCapturing(false); // Bật lại nút chụp sau khi xử lý xong
      }
    }
  }

  async function uploadImage(uri: string) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        Alert.alert('Lỗi', 'Không tìm thấy ảnh');
        return;
      }

      let formData = new FormData();
      formData.append('file', {
        uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('activity_id', activityid);

      const response = await fetch(`${apiUrlface}/verify_face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("ADSGfdfsgsdffgs",result);
      if (result.is_match===true) {
        Alert.alert('Thành công', 'Ảnh đã được gửi');
        setTokenauth(result.new_token);
        navigation.navigate("StdentAcpRC", { activityid });
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể gửi ảnh');
        navigation.navigate("Activitylist", { activityid });
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh');
      navigation.navigate("Activitylist", { activityid });
    }
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <View style={styles.cameraWrapper}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      </View>

      {/* Nút điều khiển */}
      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={capturing}>
          <MaterialIcons name="camera-alt" size={50} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={(toggleCameraFacing)}>
          <Ionicons name="camera-reverse" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Giống ứng dụng camera
    justifyContent: "center",
    alignItems: "center",
  },
  cameraWrapper: {
    width: "90%",
    aspectRatio: 3 / 4, // Camera hình oval
    borderRadius: 200, // Bo tròn giống quả trứng
    overflow: "hidden", // Ẩn phần camera ngoài khung
    alignSelf: "center",
    backgroundColor: "black", // Đảm bảo nền tối
  },
  camera: {
    flex: 1,
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    position: "absolute",
    bottom: 30,
  },
  controlButton: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
  },
  captureButton: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 50,
  },
  permissionButton: {
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  buttonacpcam: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5, 
    marginHorizontal: 50
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});