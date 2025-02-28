import React, { useState, useEffect,useContext } from "react";
import { View, TextInput, TouchableOpacity, Alert, SafeAreaView,Platform,Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { VStack, Box, Button, ScrollView , Text, Icon} from "native-base";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../Context/Authcontext";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Attendance: React.FC = () => {
  const route = useRoute();
  const { activityId } = route.params as { activityId: string };
  const { ActivityName } = route.params as { ActivityName: string };
  const authContext = useContext(AuthContext);
  const {apiUrl, token} = authContext;
  const [studentId, setStudentId] = useState("");
  const [studentList, setStudentList] = useState<string[]>([]);
  const [showstudentList, setShowstudentList] = useState<string[]>([]);
  const navigation = useNavigation();




  const handleAddStudent = async () => {
    console.log(activityId);
    if (studentId.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập MSSV!");
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/api/superadmin/user/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const fetchedStudentId = response.data._id;
  
      if (!fetchedStudentId) {
        Alert.alert("Lỗi", "Không tìm thấy MSSV!");
        return;
      }
  
      if (studentList.includes(fetchedStudentId)) {
        Alert.alert("Lỗi", "MSSV đã có trong danh sách!");
        return;
      }
  
      setStudentList([...studentList, fetchedStudentId]);
      setShowstudentList([...studentList, studentId]);
      setStudentId("");
    } catch (error: any) {
      console.error("Lỗi khi lấy ID sinh viên:", error);
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể kết nối đến server!");
    }
  };
  
  

  const handleRemoveStudent = (id: string) => {
    setStudentList(studentList.filter((sid) => sid !== id));
    setShowstudentList(showstudentList.filter((sid) => sid !== id));
  };
  const [loading,setLoading]= useState(false);

  const handleSubmitAttendance = async () => {
    if (studentList.length === 0) {
      Alert.alert("Lỗi", "Chưa có sinh viên nào được thêm vào danh sách!");
      return;
    }
  
    setLoading(true);
    try {
      // 🛠 Log request để kiểm tra dữ liệu
      console.log("📤 Gửi dữ liệu:", {
        studentIds: studentList,
        activityId: activityId,
      });
  
      const response = await axios.post(
        `${apiUrl}/api/superadmin/check-in`,
        {
          studentIds: studentList,
          activityId: activityId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("✅ Response:", response.data);
  
      if (response.data.status === 201) {
        Alert.alert("Thành công", "Điểm danh hoàn tất!");
        setStudentList([]);
        setShowstudentList([]);
      } else {
        Alert.alert("Thất bại", "Điểm danh không hoàn tất!");
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi điểm danh:", error.response?.data || error.message);
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4} color="blue.600">
              Điểm danh: {ActivityName}
            </Text>

            <VStack space={3} marginBottom={4}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  backgroundColor: "white",
                  paddingHorizontal: 12,
                }}
              >
                <TextInput
                  style={{ flex: 1, height: 48, fontSize: 16 }}
                  placeholder="Nhập MSSV"
                  value={studentId}
                  onChangeText={setStudentId}
                />
              </View>
              <Button colorScheme="blue" onPress={handleAddStudent}>
                Thêm MSSV
              </Button>
            </VStack>

            {/* Danh sách sinh viên */}
            {/* Danh sách sinh viên có ScrollView */}
            {/* Bọc ScrollView trong View để kiểm soát layout */}
            <View style={{ maxHeight: "70%", flex: 1 }}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <VStack space={3} marginBottom={4}>
                  {showstudentList.map((id) => (
                    <Box
                      key={id}
                      padding={3}
                      borderWidth={1}
                      borderRadius={8}
                      borderColor="gray.300"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      backgroundColor="white"
                      shadow={1}
                      style={{ marginBottom: 5 }} // Giúp tránh chồng lên nhau
                    >
                      <Text style={{ fontSize: 16 }}>{id}</Text>
                      <TouchableOpacity onPress={() => handleRemoveStudent(id)}>
                        <Text style={{ color: "red", fontSize: 14 }}>Xóa</Text>
                      </TouchableOpacity>
                    </Box>
                  ))}
                </VStack>
              </ScrollView>
            </View>


            {/* Nút điểm danh */}
            
          </ScrollView>
          <View style={{ justifyContent:"center",alignItems:"center",marginVertical: 20,flexDirection:"row", gap: 10 }}>
          <Button  isLoading={loading} isLoadingText="Đang điểm danh..." colorScheme="green" onPress={handleSubmitAttendance}>
              Xác nhận điểm danh
            </Button>
            <Button  colorScheme="red" onPress={() => navigation.goBack()}>
              Quay lại
            </Button>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Attendance;
