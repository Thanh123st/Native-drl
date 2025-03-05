import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity  } from 'react-native';
import { Box, Text, Button, Container,Spinner } from 'native-base';
import axios from 'axios';
import { AuthContext } from '../../Context/Authcontext';
import HeaderComponent from '../../component/View/Header';
import Fooster from '../../component/View/Fooster';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

interface StudentInfo {
  name: string;
  email: string;
  gpa: number;
  specialRecognition: string;
  _id: string;

}

const StudentDetail: React.FC = () => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { token, apiUrl } = authContext;
  const navigation = useNavigation();


  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/students/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentInfo(response.data.user);
        console.log("asdfsdg",studentInfo);
        setLoading(false);
      } catch (err) {
        setError('Có lỗi khi lấy thông tin sinh viên');
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, [token]);


  
  const [drl,setDrl] = useState("");
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!studentInfo) return; 
      try {
        const response = await axios.get(`${apiUrl}/api/evaluation/${studentInfo._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrl(response.data.total_score);
      } catch (err) {
        console.log();
      }
    };
  
    fetchAdditionalData();
  }, [studentInfo]); 
  

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" color="primary.500" />
      </Box>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <HeaderComponent />
        <View style={styles.container}>
          {studentInfo ? (
            <>
              <Text style={styles.title}>Thông tin sinh viên</Text>
              <Box style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>Tên: </Text> {studentInfo.name}
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>Email: </Text> {studentInfo.email}
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>GPA: </Text> <Text style={{ color: studentInfo.gpa >= 3.6 ? "green" : studentInfo.gpa >= 3.2 ? "#FFCC00" : studentInfo.gpa >= 2.5 ? "orange" : "red" }}>{studentInfo.gpa < 2 ? "Cảnh báo học vụ" : studentInfo.gpa}</Text>
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>Danh hiệu: </Text> {studentInfo.specialRecognition}
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>Điểm rèn luyện: </Text><Text style={{ color: drl > 80 ? "green" : drl > 60 ? "#FFCC00" : drl > 40 ? "orange" : "red" }}>{drl==="" ?<Text>Chưa có điểm</Text>: drl }</Text>
                </Text>
              </Box>
            </>
          ) : (
            <Text style={styles.noInfoText}>Không có thông tin sinh viên.</Text>
          )}
        </View>

        
        <View style={ styles.buttonview }>
        <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('TermsAndPrivacy')}>
          <Text style={styles.customButtonText}>Điều khoản sử dụng & Chính sách bảo mật</Text>
        </TouchableOpacity>
        <Button
          colorScheme="blue"
          borderRadius="md"
          mt="4"
          style={ styles.button}
          onPress={() => navigation.navigate('FaceAuth')}
        >
          Xác thực khuôn mặt
        </Button>

        {/* Nút Đăng xuất */}
        <Button
          colorScheme="red"
          borderRadius="md"
          mt="4"
          style={ styles.button}
          onPress={() => navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }], // Đặt tên màn hình đăng nhập của bạn
            })
          )}
        >
          Đăng xuất
        </Button>
        </View>
      </ScrollView>
      <Fooster selected={3} />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  load:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    padding: 20
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#0066CC',
  },
  noInfoText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  button: {
    width: "50%",
    borderRadius: 5
  },
  buttonview: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  customButton: {
    backgroundColor: 'transparent', // Màu xanh lá nhẹ
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
    marginTop:30
  },
  customButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StudentDetail;
