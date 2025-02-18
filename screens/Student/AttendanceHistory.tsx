import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Button, ScrollView } from 'react-native';
import { Container, Card } from 'native-base';
import { AuthContext } from '../../Context/Authcontext';
import HeaderComponent from '../../component/View/Header';
import Fooster from '../../component/View/Fooster';
const AttendanceScreen = () => {
  const [attendanceData, setAttendanceData] = useState(null);
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
        setAttendanceData(data.history);
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
    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>{activity.name}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardText}>Ngày: {new Date(activity.date).toLocaleDateString()}</Text>
          <Text style={styles.cardText}>Trạng thái: {item.status}</Text>
          <Text style={styles.cardText}>Thời gian: {new Date(item.timestamp).toLocaleString()}</Text>
        </View>
        <View style={styles.cardFooter}>
          <Button title="Chi tiết" onPress={() => console.log('Xem chi tiết')} />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.pageContainer}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <HeaderComponent></HeaderComponent>
    <Container>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Lịch sử điểm danh</Text>
      </View>
      <FlatList
        data={attendanceData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </Container>
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
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
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
    elevation: 3,
  },
  cardHeader: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
