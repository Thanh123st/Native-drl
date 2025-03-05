import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../Context/Authcontext';
import { useNavigation } from '@react-navigation/native';
import * as ImageManipulator  from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from "expo-video-thumbnails";
import { Audio } from 'expo-av';
export default function FaceAuth() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const authContext = useContext(AuthContext);
  const { apiUrl, token,apiUrlface } = authContext;
  const navigation = useNavigation();

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




      async function captureAndUploadImages() {
        if (!cameraRef.current || capturing) return;
        setCapturing(true);
        let images = [];
        
        for (let i = 0; i < 30; i++) {
          try {
            const photo = await cameraRef.current.takePictureAsync({ base64: true, mute: true, quality: 0.01 });

            // Resize ảnh nhỏ hơn để tối ưu dung lượng
            const resizedPhoto = await ImageManipulator.manipulateAsync(
              photo.uri,
              [{ resize: { width: photo.width * 0.2, height: photo.height * 0.2 } }], 
              { compress: 0.01, format: ImageManipulator.SaveFormat.JPEG }
            );

            images.push(resizedPhoto.uri);

            // Chờ 66ms trước khi chụp ảnh tiếp theo
            await new Promise((resolve) => setTimeout(resolve, 66));
          } catch (error) {
            console.error(`Lỗi khi chụp ảnh thứ ${i + 1}:`, error);
          }
        }
        
        const formData = new FormData();
        images.forEach((uri, index) => {
          formData.append('files', {
            uri,
            name: `photo_${index}.jpg`,
            type: 'image/jpeg',
          });
        });

        try {
          console.log("Bắt đầu upload ảnh...");
          for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
          }

          const response = await axios.post(`${apiUrlface}/train_face`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
            },
          });

          console.log('Upload success:', response.data);
          alert('Upload thành công!');
        } catch (error) {
          console.error('Upload failed:', error);
          alert('Lỗi khi upload ảnh');
        }
        
        setCapturing(false);
    }

 
    async function captureAndUploadImagesTest() {
      if (!cameraRef.current || capturing) return;
      setCapturing(true);
      
      console.log("📸 Bắt đầu chụp ảnh...");
      const startTime = Date.now();
  
      let images = [];
      
      for (let i = 0; i < 30; i++) {
          try {
              const photo = await cameraRef.current.takePictureAsync({ base64: true, mute: true, quality: 0.1 });
  
              console.log(`📷 Ảnh ${i + 1}:`, photo.uri);
  
              // Resize ngay sau khi chụp
              const resized = await ImageManipulator.manipulateAsync(
                  photo.uri,
                  [{ resize: { width: 150, height: 200 } }],
                  { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
              );
  
              console.log(`🖼 Ảnh ${i + 1} sau khi resize:`, resized.uri);
              images.push(resized.uri);
  
              // Chờ 50ms trước khi chụp ảnh tiếp theo (tăng tốc)
              await new Promise((resolve) => setTimeout(resolve, 50));
  
          } catch (error) {
              console.error(`❌ Lỗi khi chụp ảnh thứ ${i + 1}:`, error);
          }
      }
  
      console.log(`✅ Chụp xong 30 ảnh sau ${Date.now() - startTime}ms`);
  
      // Upload ảnh
      console.log("📤 Bắt đầu upload ảnh...");
      const formData = new FormData();
      images.forEach((uri, index) => {
          formData.append("files", {
              uri,
              name: `photo_${index}.jpg`,
              type: "image/jpeg",
          });
      });
  
      for (let pair of formData.entries()) {
          console.log("📦 Dữ liệu gửi:", pair[0], pair[1]);
      }
  
      try {
          const response = await axios.post(`${apiUrlface}/train_face`, formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
                  "Authorization": `Bearer ${token}`,
              },
          });
  
          console.log("✅ Upload thành công:", response.data);
          alert("Upload thành công!");
      } catch (error) {
          console.error("❌ Upload thất bại:", error);
          alert("Lỗi khi upload ảnh");
      }
  
      console.log(`🚀 Hoàn thành toàn bộ quá trình sau ${Date.now() - startTime}ms`);
      setCapturing(false);
  }
  
    

 async function captureImagesFast() {
  if (!cameraRef.current || capturing) return;
    
    setCapturing(true);
    
    console.log("📸 Bắt đầu chụp ảnh...");
    const startTime = Date.now();
    let imageUris = [];

    for (let i = 0; i < 30; i++) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: false,mute: true, quality: 0.3 });
        imageUris.push(photo.uri);
        console.log(`📸 Đã chụp ảnh ${i + 1} / 30`);

        if (Platform.OS === 'ios') {
          await new Promise(resolve => setTimeout(resolve, 100)); // Giảm tải iOS
        }
      } catch (error) {
        console.error(`❌ Lỗi chụp ảnh thứ ${i + 1}:`, error);
      }
    }

    console.log(`✅ Chụp xong 30 ảnh sau ${Date.now() - startTime}ms`);
    console.log("📦 Ảnh đã chụp:", imageUris);

    // Resize & Upload
    await resizeAndUploadImages(imageUris);
    setCapturing(false);
  }

  async function resizeAndUploadImages(imageUris) {
    console.log("📩 Bắt đầu resize ảnh...");
    navigation.goBack();
    const startResize = Date.now();

    const resizedImages = await Promise.all(
      imageUris.map(async (uri) => {
        return await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 150, height: 200 } }],
          { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
        );
      })
    );

    console.log(`✅ Resize xong sau ${Date.now() - startResize}ms`);
    console.log("📤 Bắt đầu upload ảnh...");

    const formData = new FormData();
    resizedImages.forEach((img, index) => {
      formData.append("files", {
        uri: img.uri,
        name: `photo_${index}.jpg`,
        type: "image/jpeg",
      });
    });

    for (let pair of formData.entries()) {
      console.log("📦 Dữ liệu gửi:", pair[0], pair[1]);
    }

    try {
      const response = await axios.post(`${apiUrlface}/train_face`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });
      Alert.alert("✅ Upload thành công đã xác thực");
      console.log("✅ Upload thành công:", response.data);
    } catch (error) {
      console.error("❌ Lỗi upload:", error);
      Alert.alert("❌ Lỗi xác thực thất bại");
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

        <TouchableOpacity style={styles.captureButton} onPress={captureImagesFast} disabled={capturing}>
          <MaterialIcons name="camera-alt" size={50} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
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