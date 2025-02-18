import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator,ScrollView, Button } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../Context/Authcontext';
import HeaderComponent from '../../component/View/Header';
import Fooster from '../../component/View/Fooster';
import { useNavigation } from '@react-navigation/native';


interface StudentInfo {
  name: string;
  email: string;
  gpa: number;
  specialRecognition: string;
}



const StudentDetail: React.FC = () => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const { token, apiUrl } = authContext;

  useEffect(() => {
    // Gửi yêu cầu GET đến API
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/students/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Đưa token vào header
          },
        });
        setStudentInfo(response.data.user); // Lưu thông tin sinh viên vào state
        setLoading(false);
      } catch (err) {
        setError('Có lỗi khi lấy thông tin sinh viên');
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const navigation = useNavigation();

  const handleFaceAuthNavigation = () => {
    // Điều hướng đến màn hình FaceAuth
    navigation.navigate('FaceAuth');
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <HeaderComponent></HeaderComponent>
    <View style={styles.container}>
      {studentInfo ? (
        <>
          <Text style={styles.title}>Thông tin sinh viên</Text>
          <Text><Text style={styles.label}>Tên: </Text>{studentInfo.name}</Text>
          <Text><Text style={styles.label}>Email: </Text>{studentInfo.email}</Text>
          <Text><Text style={styles.label}>GPA: </Text>{studentInfo.gpa}</Text>
          <Text><Text style={styles.label}>Chứng nhận đặc biệt: </Text>{studentInfo.specialRecognition}</Text>
        </>
      ) : (
        <Text>Không có thông tin sinh viên.</Text>
      )}
    </View>
    <Button title='Xác thực khuôn mặt' style={styles.button} onPress={handleFaceAuthNavigation}/>
        

    </ScrollView>
    <Fooster></Fooster>
    </View>
  );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,  // This ensures that the page takes up the full height of the screen
        justifyContent: 'flex-end',  // Ensures footer is at the bottom
      },
      scrollViewContent: {
        flexGrow: 1,  // Ensures ScrollView content can expand but footer stays at the bottom
        paddingBottom: 50,  // Adjust this value to give space above the footer
      },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    label: {
      fontWeight: 'bold',
    },
    button: {
      marginTop: 20,
      backgroundColor: '#0066CC',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });

export default StudentDetail;
