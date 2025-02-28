import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../Context/Authcontext';
export default function FaceAuth() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const authContext = useContext(AuthContext);
  const { apiUrl, token } = authContext;

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
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function captureAndUploadImages() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    let images = [];
    
    for (let i = 0; i < 15; i++) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      images.push(photo.uri);
      await new Promise((resolve) => setTimeout(resolve, 133)); // 2s / 15 = ~133ms per capture
    }
    
    const formData = new FormData();
    images.forEach((uri, index) => {
      formData.append('image', {
        uri,
        name: `photo_${index}.jpg`,
        type: 'image/jpeg',
      });
    });
    
    try {
      const response = await axios.post(`${apiUrl}/api/face/train`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Upload success:', response.data);
      alert(response.message);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setCapturing(false);
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Lật ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={captureAndUploadImages}>
            <Text style={styles.text}>{capturing ? 'Capturing...' : 'Chụp và gửi ảnh đi '}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    margin: 20,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});