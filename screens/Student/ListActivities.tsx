import React, { useEffect, useState ,useContext} from "react";
import { ScrollView } from "react-native";
import { Box, Text, VStack, Spinner, Button } from "native-base";
import axios from "axios";
import { StyleSheet, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../../Context/Authcontext";
import { RootStackParamList } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HeaderComponent from "../../component/View/Header";
import Fooster from "../../component/View/Fooster";
type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList,"Activitylist">;

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation<ListScreenNavigationProp>();
  const authContext = useContext(AuthContext);
  const { apiUrl, token } = authContext;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/superadmin/activities`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setActivities(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
  
    fetchActivities();
  }, []);
  

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" color="primary.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <View style={styles.pageContainer}>
            <HeaderComponent></HeaderComponent>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <VStack space={4} p={4}>
        {activities.length === 0 ? (
          <Text textAlign="center" color="gray.500">Không có hoạt động nào.</Text>
        ) : (
          activities.map((activity) => (
            <Box key={activity._id} p={4} borderWidth={1} borderRadius="lg">
              <Text fontSize="lg" bold>{activity.name}</Text>
              <Text color="gray.600">{activity.description}</Text>
              <Text fontSize="sm" color="gray.400">
                Ngày tổ chức: {new Date(activity.date).toLocaleDateString()}
              </Text>

              {/* Kiểm tra nếu có địa điểm thì hiển thị */}
              {activity.locations?.length > 0 && (
                <VStack mt={2}>
                  <Text bold>📍 Địa điểm:</Text>
                  {activity.locations.map((loc) => (
                    <Text key={loc._id}>
                      - Lat: {loc.lat}, Lon: {loc.lon}, Bán kính: {loc.radius}m
                    </Text>
                  ))}
                </VStack>
              )}
              <Button onPress={() => navigation.navigate("StudentRC", { activityid: activity._id, name: activity.name  })}>Điểm danh hoạt động</Button>
            </Box>
          ))
        )}
        
        


      </VStack>
    </ScrollView>
    <Fooster></Fooster>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1, 
    justifyContent: 'flex-end',  
  },
  scrollViewContent: {
    flexGrow: 1,  // Ensures ScrollView content can expand but footer stays at the bottom
    paddingBottom: 50,  // Adjust this value to give space above the footer
  }
});

export default ActivityList;
