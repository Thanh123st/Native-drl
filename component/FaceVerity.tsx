import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { AuthContext } from '../Context/Authcontext';
import { useNavigation } from "@react-navigation/native"; 
export default function FaceVerity({ activityid }: { activityid: string }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const authContext = useContext(AuthContext);
  const { apiUrl, token,setTokenauth,tokenauth } = authContext;
  const navigation = useNavigation(); // Lấy navigation

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: false });
        console.log('Ảnh chụp:', photo.uri);
        await uploadImage(photo.uri);
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
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
      formData.append('image', {
        uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('activity_id', activityid);

      const response = await fetch(`${apiUrl}/api/face/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("ADSGfdfsgsdffgs",result);
      if (result.status===200) {
        Alert.alert('Thành công', 'Ảnh đã được gửi');
        setTokenauth(result.token);
        navigation.navigate("StdentAcpRC", { activityid });
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể gửi ảnh');
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh');
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                  <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                  <Text style={styles.text}>Capture</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
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
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
