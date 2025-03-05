import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Button, ScrollView } from 'react-native';
import { Container, Card, Center, Box, Spinner } from 'native-base';
import { AuthContext } from '../../Context/Authcontext';
import HeaderComponent from '../../component/View/Header';
import Fooster from '../../component/View/Fooster';
const AttendanceScreen = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);
  const { apiUrl, token } = authContext;


  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/students/attendance/history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Đưa token vào header
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setAttendanceData(data.history || []);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceHistory();
  }, []);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" color="primary.500" />
      </Box>
    );
  }


  const renderItem = ({ item }) => {
    
    const activity = item.activity_id;
    if(!activity){
      return
    }else{
      return (
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.headerText}>Tên hoạt động: {activity.name}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardText}>Ngày: {new Date(activity.date).toLocaleDateString()}</Text>
            <Text style={styles.cardText}>Trạng thái: {item.status==="present"?"Đã điểm danh":"Chưa điểm danh"}</Text>
            <Text style={styles.cardText}>Thời gian: {new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        </Card>
      );
    }

  };

  return (
    <View style={styles.pageContainer}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <HeaderComponent></HeaderComponent>
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Lịch sử điểm danh</Text>
      </View>
      {attendanceData.length === 0 ? (
        <Center>
          <Text style={{ color: "black",margin: 50 }}>Bạn chưa có hoạt động nào</Text>
        </Center>
      ) : (
        <FlatList
          data={attendanceData}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ alignItems: "center", width: "100%" }}
        />
      )}
    </View>
    </ScrollView>
    <Fooster selected={1}></Fooster>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,  
    justifyContent: 'flex-end',  
  },
  scrollViewContent: {
    paddingBottom: 50,  
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%"
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: "100%"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
    alignItems: "center",
    justifyContent: "center",
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff", // Nền trắng tinh tế
    borderRadius: 15, // Bo góc mềm mại
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5, // Đổ bóng trên Android
  },
  cardHeader: {
    backgroundColor: "#007AFF", // Màu xanh hiện đại
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardBody: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  cardText: {
    fontSize: 14,
    color: "#333", // Màu chữ tối để dễ đọc
    marginBottom: 5,
  },
  statusPresent: {
    color: "#27ae60", // Màu xanh lá cho trạng thái "Đã điểm danh"
    fontWeight: "bold",
  },
  statusAbsent: {
    color: "#e74c3c", // Màu đỏ cho trạng thái "Chưa điểm danh"
    fontWeight: "bold",
  },
});

export default AttendanceScreen;
