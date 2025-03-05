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
  import { FontAwesome } from '@expo/vector-icons';
import { Alert } from "react-native";
type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList,"Activitylist">;

const AdList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation<ListScreenNavigationProp>();
    const authContext = useContext(AuthContext);
    const { apiUrl, token, groupId } = authContext;
    

    
    const fetchActivities = async () => {
      try {
        console.log("groupId:", groupId); // Debug xem groupId có dữ liệu không
    
        const response = await axios.post(`${apiUrl}/group-admin/activities`, {
          groupIds: Array.isArray(groupId) ? groupId : [groupId] // Chắc chắn là mảng
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
    
        console.log("Data:", response.data);
        const rawData = response.data || [];
    
        if (!Array.isArray(rawData)) {
          throw new Error("API không trả về mảng dữ liệu");
        }
    
        const allActivities = rawData.map(group => group.activities || []).flat();
        setActivities(allActivities);
        setError(null); 
        console.log("data",activities);
    
      } catch (error) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại!");
        setActivities([]); // Đảm bảo UI vẫn render
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



  const handleLockUser = async (id: string) => {
    console.log("block")
    try {
      const response = await fetch(`${apiUrl}/api/superadmin/toggle-lock/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      });
  
      if (response.status===200) {
        const data = await response.json();
        if(data.activity.isLocked){
          Alert.alert("Thành công", "Hoạt động đã được cập nhật đã khóa!");
        }else{
          Alert.alert("Thành công", "Hoạt động đã được cập nhật đã mở khóa!");
        }
      }
  
      
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thực hiện thao tác.");
    }
  };
  
  const handleDeleteActivity = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/superadmin/activity/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Không thể xóa hoạt động!");
      }
  
      Alert.alert("Thành công", "Hoạt động đã được xóa!");
      fetchActivities();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thực hiện thao tác.");
    }
  };


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
      {loading ? (
        <Text textAlign="center" color="blue.500">Đang tải dữ liệu...</Text>
      ) : error ? (
        <Text textAlign="center" color="red.500">{error}</Text>
      ) : activities.length === 0 ? (
        <Text textAlign="center" color="gray.500">Không có hoạt động nào.</Text>
      ) : (
        activities.map((activity) => (
          <Box key={activity._id} p={4} borderWidth={1} borderRadius="lg">
            <Text fontSize="lg" bold>{activity.name}</Text>

            <View style={{ flexDirection: "row", padding: 10 , justifyContent:"space-between", flexWrap: "wrap"  }}>
              <Button style={{ backgroundColor: "#0000DD", width: "100%"  }} onPress={() => navigation.navigate("StudentRC", { activityid: activity._id  })}>
                Điểm danh hoạt động
              </Button>
            </View>

            <View style={{ flexDirection: "row", padding: 10 , justifyContent:"space-between", flexWrap: "wrap"  }}>
              <TouchableOpacity style={[styles.actionButton,styles.btnclip]} onPress={() => navigation.navigate("Attendance", { activityId: activity._id, ActivityName: activity.name  })}>
                <FontAwesome name="clipboard" size={20} color="white"/>
              </TouchableOpacity>                
              <TouchableOpacity style={[styles.actionButton,styles.btndelete]} onPress={() => handleDeleteActivity(activity._id)}>
                <FontAwesome name="trash" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton,styles.btntrash]} onPress={() => handleLockUser(activity._id)}>
                <FontAwesome name="lock" size={20} color="white"/>
              </TouchableOpacity>
            </View>
          </Box>
        ))
      )}

              
        


      </VStack>
    </ScrollView>
    <Fooster selected={4}></Fooster>
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

export default AdList;
