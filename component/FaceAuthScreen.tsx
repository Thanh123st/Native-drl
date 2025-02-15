import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import axios from 'axios';

export default function VideoScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<string[]>([]); // Lưu trữ các ảnh đã chụp
  const cameraRef = useRef(null); // Tham chiếu đến camera
  const [isRecording, setIsRecording] = useState(false); // Trạng thái quay video
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Tham chiếu đến interval

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

  const startRecording = async () => {
    setCapturedImages([]); // Xóa danh sách ảnh trước khi quay lại
    setIsRecording(true); // Bắt đầu quay video
  
    let elapsedTime = 0;
    const endTime = 2000; // Thời gian quay video (2 giây)
  
    // Sử dụng một mảng để lưu trữ các ảnh đã chụp
    const capturedImagesDuringRecording: string[] = [];
  
    // Sử dụng Promise để đảm bảo các ảnh được chụp hoàn tất trước khi tiếp tục
    const captureImages = new Promise<void>((resolve) => {
      intervalRef.current = setInterval(async () => {
        if (cameraRef.current && elapsedTime < endTime) {
          const photo = await cameraRef.current.takePictureAsync(); // Chụp ảnh
          capturedImagesDuringRecording.push(photo.uri); // Lưu ảnh vào mảng
          setCapturedImages(prev => [...prev, photo.uri]); // Thêm ảnh vào state
          elapsedTime += 200; // Cập nhật thời gian đã trôi qua
        } else {
          clearInterval(intervalRef.current as NodeJS.Timeout); // Dừng quay khi hết 2 giây
          resolve(); // Kết thúc quá trình chụp ảnh sau khi hết thời gian
        }
      }, 200); // Chụp ảnh mỗi 0,2 giây
    });
  
    // Đợi cho quá trình chụp ảnh hoàn tất rồi mới gửi ảnh lên API
    await captureImages;
  
    // Gửi ảnh lên API sau khi quá trình chụp ảnh hoàn tất
    postImagesToApi(capturedImagesDuringRecording);
  
    setIsRecording(false); // Dừng quay video
  };
  
  const postImagesToApi = async (capturedImages: string[]) => {
    const formData = new FormData();
  
    // Lọc ra tối đa 20 ảnh từ capturedImages
    const imagesToSend = capturedImages.slice(0, 20);
  
    // Duyệt qua từng ảnh và thêm vào formData dưới dạng tệp
    imagesToSend.forEach((imageUri, index) => {
      // Bạn cần tải ảnh từ URI về dưới dạng Blob hoặc File
      fetch(imageUri)
        .then((response) => response.blob())
        .then((blob) => {
          formData.append('image', blob, `image${index + 1}.jpg`);
          
          // Log kiểm tra ảnh đã được thêm vào formData
          console.log(`Added image${index + 1}.jpg to formData`);
  
          // Sau khi thêm tất cả ảnh vào formData, gửi request
          if (index === imagesToSend.length - 1) {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWYyNjlhM2RkZDE3OTAyNDRiZWIxYSIsImVtYWlsIjoic3R1ZGVudEBleGFtcGxlLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM5NjE2ODUzLCJleHAiOjE3Mzk2MjA0NTN9.Ab5qGPYcIgeO81cMqLqz9VSuaxgrm_4gHJlBxPYbn-k";
            axios.post('http://192.168.10.47:8000/api/face/train', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',  // Đảm bảo Content-Type là 'multipart/form-data'
                Authorization: `Bearer ${token}`,  // Gửi token đúng trong header
              },
            })
            .then(response => {
              console.log('Response from API:', response.data);
            })
            .catch(error => {
              console.error('Error posting images to API:', error);
            });
          }
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    });
  };
  
  
  
  

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={startRecording} disabled={isRecording}>
            <Text style={styles.text}>Start Recording</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {capturedImages.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Captured Photos:</Text>
          <View style={styles.imagesContainer}>
            {capturedImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.image} />
            ))}
          </View>
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
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
});
