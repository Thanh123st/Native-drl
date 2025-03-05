import React, { useEffect, useState ,useContext} from "react";
import { ScrollView,Animated } from "react-native";
import { Box, Text, VStack, Spinner, Button } from "native-base";
import axios from "axios";
import { StyleSheet, View , TouchableOpacity} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../../Context/Authcontext";
import { RootStackParamList } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HeaderComponent from "../../component/View/Header";
import Fooster from "../../component/View/Fooster";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';
import { Alert } from "react-native";
type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList,"Activitylist">;

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation<ListScreenNavigationProp>();
  const authContext = useContext(AuthContext);
  const { apiUrl, token } = authContext;

  
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/superadmin/activities`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setActivities(response.data);
        console.log(response.data[0]);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
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

          
            
        <ScrollView contentContainerStyle={{ alignItems:"center" , justifyContent: "flex-start",paddingBottom: 70 }}>
        <HeaderComponent></HeaderComponent>
        <View style={styles.btnctn}>
              <TouchableOpacity style={styles.btn} onPress={() => console.log("All")}>
                <Text style={styles.btnText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => console.log("Month")}>
                <Text style={styles.btnText}>Month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => console.log("Week")}>
                <Text style={styles.btnText}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => console.log("Day")}>
                <Text style={styles.btnText}>Day</Text>
              </TouchableOpacity>
            </View>
          
      <VStack space={4} p={4}>
        {activities.length === 0 ? (
          <Text textAlign="center" color="gray.500">Không có hoạt động nào.</Text>
        ) : (
            activities.slice().reverse().filter((activity) => activity.isLocked === false && new Date(activity.date) <= new Date()).map((activity) => (
            <Box key={activity._id} p={4} borderWidth={1} borderRadius="lg">
              <Text fontSize="lg" bold>{activity.name}</Text>
              <Text color="black">Mô tả: {activity.description}</Text>
              <Text fontSize="sm" color="black.400">
              🗓 Ngày tổ chức: {new Date(activity.date).toLocaleDateString()}
              </Text>

              
              <View style={{ flexDirection: "row", padding: 10 , justifyContent:"space-between", flexWrap: "wrap"  }}>
                <Button style={{ backgroundColor: "#0000DD", width: "100%"  }} onPress={() => navigation.navigate("StudentRC", { activityid: activity._id  })}>Điểm danh hoạt động</Button>
              </View>

            </Box>
          ))
         )}
        
        


      </VStack>
    </ScrollView>
    <Fooster selected={0}></Fooster>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1, 
    justifyContent: 'flex-start',  
  },
  actionButton: {
    backgroundColor: "#CC0000", 
    padding: 10,
    borderRadius: 5, 
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5, // Khoảng cách giữa các nút
    paddingLeft: 20,
    paddingRight: 20,
  },
  btnctn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },  
  btn: {
    flex: 1, // Chia đều không gian cho các nút
    alignItems: "center",
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  btntrash:{
    backgroundColor: "#333333"
  },
  btndelete: {
  backgroundColor: "#CC0000"
  },
  btnclip: {
  backgroundColor: "#33CC66"
  }
});

export default ActivityList;
