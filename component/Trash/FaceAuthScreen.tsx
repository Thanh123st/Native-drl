import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../Context/Authcontext';

export default function VideoScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImages, setCapturedImages] = useState<string[]>([]); // Lưu trữ các ảnh đã chụp
  const cameraRef = useRef(null); // Tham chiếu đến camera
  const [isRecording, setIsRecording] = useState(false); // Trạng thái quay video
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const authContext = useContext(AuthContext);
  const { apiUrl, token } = authContext;

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
          if (capturedImagesDuringRecording.length <= 5) {
            setCapturedImages(prev => [...prev, photo.uri]); // Thêm ảnh vào state, nhưng chỉ giới hạn 5 ảnh
          }
          elapsedTime += 1000; // Cập nhật thời gian đã trôi qua
        } else {
          clearInterval(intervalRef.current as NodeJS.Timeout); // Dừng quay khi hết 2 giây
          resolve(); // Kết thúc quá trình chụp ảnh sau khi hết thời gian
        }
      }, 1000); // Chụp ảnh mỗi 0,2 giây
    });

    // Đợi cho quá trình chụp ảnh hoàn tất rồi mới gửi ảnh lên API
    await captureImages;

    // Gửi ảnh lên API sau khi quá trình chụp ảnh hoàn tất
    postImagesToApi(capturedImagesDuringRecording);

    setIsRecording(false); // Dừng quay video
  };

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_IMAGES = 5; // Giới hạn số ảnh tải lên

  const postImagesToApi = async (capturedImages: string[]) => {
    const formData = new FormData();
    
    // Giới hạn chỉ lấy tối đa 5 ảnh
    const imagesToSend = capturedImages.slice(0, MAX_IMAGES);

    console.log('Starting to fetch images...');
    
    // Sử dụng vòng lặp for để đồng bộ hóa quá trình tải ảnh và thêm vào formData
    for (let index = 0; index < imagesToSend.length; index++) {
      try {
        const response = await fetch(imagesToSend[index]);
        const blob = await response.blob();

        // Kiểm tra dung lượng của ảnh
        if (blob.size > MAX_IMAGE_SIZE) {
          console.error(`Image${index + 1} is too large (${blob.size / (1024 * 1024)}MB). Skipping...`);
          continue; // Bỏ qua ảnh nếu quá lớn
        }

        if (blob && blob.size > 0) {
          formData.append('image', blob, `image${index + 1}.jpg`);
          console.log(`Added image${index + 1}.jpg to formData`);
        } else {
          console.error(`Blob for image${index + 1} is invalid`);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        // Có thể log thêm để xem lỗi chính xác
        console.log(error);
      }
    }

    // Gửi yêu cầu lên API sau khi tất cả ảnh đã được tải xong
    try {
      console.log('All images fetched, now sending to API...');
      const response = await axios.post(`${apiUrl}/api/face/train`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response from API:', response.data);
    } catch (error) {
      console.error('Error posting images to API:', error);
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
          <TouchableOpacity style={styles.button} onPress={startRecording} disabled={isRecording}>
            <Text style={styles.text}>{isRecording ? "Recording..." : "Start Recording"}</Text>
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
