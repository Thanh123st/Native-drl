import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Button, ScrollView } from 'react-native';
import { Container, Card, Center } from 'native-base';
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
      <Container style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </Container>
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
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    width: "100%",
    margin: 10
  },
  cardHeader: {
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBody: {
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  cardFooter: {
    justifyContent: 'flex-end',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default AttendanceScreen;
