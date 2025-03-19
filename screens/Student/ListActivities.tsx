import React, { useEffect, useState ,useContext, useCallback} from "react";
import { ScrollView,Animated } from "react-native";
import { Box, Text, VStack, Spinner, Button } from "native-base";
import axios from "axios";
import { StyleSheet, View , TouchableOpacity} from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../../Context/Authcontext";
import { RootStackParamList } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HeaderComponent from "../../component/View/Header";
import Fooster from "../../component/View/Fooster";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import "moment/locale/vi";
type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList,"Activitylist">;

const ActivityList = () => {
  const [error, setError] = useState(null);
  const navigation = useNavigation<ListScreenNavigationProp>();
  const authContext = useContext(AuthContext);
  const { apiUrl, token,activities, setActivities } = authContext;
  const [role, setRole] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem("role");
      setRole(storedRole);
    };

      fetchRole();
    }, []);
  
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
      } 
    };

  useFocusEffect(
    useCallback(() => {
      fetchActivities(); 
    }, [])
  );

  const formatDate = (isoString) => {
    return moment(isoString).locale("vi").format("dddd, DD [tháng] MM YYYY, HH:mm:ss");
  };

  const filteredActivities = activities
  .slice()
  .reverse()
  .filter((activity) => {
    const activityDate = new Date(activity.date);
    const now = new Date();

    switch (filter) {
      case "today":
        return moment(activityDate).isSame(now, "day");
      case "week":
        return moment(activityDate).isSame(now, "week");
      case "month":
        return moment(activityDate).isSame(now, "month");
      case "year":
        return moment(activityDate).isSame(now, "year");
      default:
        return true;
    }
  })
  .filter((activity) => !activity.isLocked && new Date(activity.date) < new Date());



  return (
    <View style={styles.pageContainer}>

          
            
        <ScrollView contentContainerStyle={{ alignItems:"center" , justifyContent: "flex-start",paddingBottom: 70 }}>
        <HeaderComponent></HeaderComponent>
        <View style={styles.btnctn}>
              <TouchableOpacity style={styles.btn} onPress={() => setFilter("all")}>
                <Text style={styles.btnText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => setFilter("month")}>
                <Text style={styles.btnText}>Month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => setFilter("week")}>
                <Text style={styles.btnText}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => setFilter("today")}>
                <Text style={styles.btnText}>Day</Text>
              </TouchableOpacity>
            </View>
          
      <VStack space={4} p={4} style={{ width: "80%" }}>
        {activities.length === 0 ? (
          <Text textAlign="center" color="gray.500">Không có hoạt động nào.</Text>
        ) : (
          filteredActivities.map((activity) => (
            <Box key={activity._id} p={4} borderWidth={1} borderRadius="lg">
              <Text fontSize="lg" bold>{activity.name}</Text>
              <Text color="black">Mô tả: {activity.description}</Text>
              <Text fontSize="sm" color="black.400">
              🗓 Thời gian tổ chức:{"\n"} {formatDate(activity.date)}
              </Text>
              <Text fontSize="sm" color="black.400">
              🗓 Loại hoạt động: {activity.type}
              </Text>
              {(role !== "admin" && role !== "super_admin") && (
              <View style={{ flexDirection: "row", padding: 10 , justifyContent:"space-between", flexWrap: "wrap"  }}>
                <Button style={{ backgroundColor: "#0000DD", width: "100%"  }} onPress={() => navigation.navigate("StudentRC", { activityid: activity._id  })}>Điểm danh hoạt động</Button>
              </View>
              )}
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
