import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box, Text, VStack, Spinner, Button } from "native-base";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native";
import VideoScreen from "../component/FaceAuthScreen";
import CameraScreen from "../component/FaceAuthVerify";
import LocationAuth from "../component/LocationAuth";
const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://192.168.10.47:8000/api/superadmin/activities", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWYyNjlhM2RkZDE3OTAyNDRiZWIxYSIsImVtYWlsIjoic3R1ZGVudEBleGFtcGxlLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM5NjE2ODk3LCJleHAiOjE3Mzk2MjA0OTd9.K93b0xfiin7HUUYum9673KKry3aaB5t2NCFit-SsNgw`
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
    <ScrollView>
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
              <Button onPress={() => navigation.navigate("StudentRC")}>Điểm danh hoạt động</Button>
            </Box>
          ))
        )}
        {/* <SafeAreaView style={{ flex: 1 }}>
          <CameraScreen />
        </SafeAreaView> */}
        {/* <SafeAreaView>
          <LocationAuth />
        </SafeAreaView> */}
        


      </VStack>
    </ScrollView>
  );
};

export default ActivityList;
