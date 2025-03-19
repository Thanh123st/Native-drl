import React, { useState, useContext, useEffect } from "react";
import { VStack, Button, Text, Box, Pressable, Heading, ScrollView, Center } from "native-base";
import { Alert, ImageBackground,View } from "react-native";
import axios from "axios";
import { AuthContext } from "../../Context/Authcontext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import { TextInput } from 'react-native-paper';  // Sử dụng TextInput từ react-native-paper
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';  // Import kiểu navigation
type RootStackParamList = {
  Forgetpass: undefined;
  Register: undefined;
  Activitylist: undefined;
};


const LoginScreen: React.FC = () => {

  const decodeJWT = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");
  
      const payload = JSON.parse(atob(parts[1])); // Giải mã phần Payload
      return payload;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };
  
  const [email, setEmail] = useState(""); 

  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const { setEmail: setAuthemail, setToken, apiUrl,setGroupId } = authContext;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Khởi tạo navigation

  const handleLogin = async () => {
    console.log("📤 Đang gửi dữ liệu đăng nhập:", { email, password });
    if (!email.trim() || !password.trim()) {
      return Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin!");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Alert.alert("Lỗi", "Email không đúng định dạng!");
    }
    else{
      try {  
        const response = await axios.post(`${apiUrl}/api/auth/login`, {
          email: email,
          password: password,
        }, {
          headers: { "Content-Type": "application/json" },
        });
        
        console.log("✅ API Response:", response.data);
        if (response.status === 200) {
          const token = response.data.token;
          const decoded = decodeJWT(token);
          const expiryTime = decoded.exp * 1000;
          await AsyncStorage.setItem("expiryTime", expiryTime.toString());
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('role', decoded.role);
          setGroupId(decoded.groupIds);
          setAuthemail(email);
          setToken(response.data.token);
          Alert.alert("✅ Đăng nhập thành công, chuyển hướng...");
          console.log("✅ Đăng nhập thành công, chuyển hướng...");
          navigation.replace('Activitylist');
        }else if(response.status === 400){
          return Alert.alert("Lỗi", "Thông tin không hợp lệ!");
        } else {
          console.error("❌ Đăng nhập thất bại, mã phản hồi không phải 200.");
        }
      } catch (error: any) {
        console.error("❌ Lỗi đăng nhập:", error.message);
        Alert.alert("❌ Lỗi đăng nhập: Vui lòng xem lại kết nối mạng!");
        
      }
    }
    
  };

    useEffect(() => {
      registerForPushNotifications();
    }, []);
  
    async function registerForPushNotifications() {
      if (!Device.isDevice) {
        alert("Push Notifications chỉ chạy trên thiết bị thật");
        return;
      }
    
      // Yêu cầu quyền thông báo (sẽ hiển thị popup nếu chưa cấp)
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
    
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    
      if (finalStatus !== "granted") {
        alert("Bạn chưa cấp quyền thông báo!");
        return;
      }
    
      // Lấy Expo Push Token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
      await AsyncStorage.setItem('Pushtoken', token);
    }
    

  return (
    <ImageBackground 
      source={require("../../assets/picture/bgauth.jpg")}  // Thay bằng link ảnh hoặc require local
      style={{ flex: 1 }}
      imageStyle={{ resizeMode: "cover" }}
    >
    <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <Center flex={1} px={6}>
        <Box w="100%" maxW="400px" p={6} bg="white" shadow={5} borderRadius="lg">
          <VStack space={6}>
            <Heading textAlign="center" color="blue.600">
              Đăng Nhập
            </Heading>


            {/* Trường nhập email */}
            <TextInput
              label="Nhập email"
              value={email}
              onChangeText={setEmail}
              left={<TextInput.Icon icon={() => <FontAwesome name="envelope" size={20}/>} />}
              mode="outlined"
              style={{ marginBottom: 8 ,borderBlockColor:"black", backgroundColor:"white" }}
            />

            {/* Trường nhập mật khẩu */}
            <TextInput
              label="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}  // Đảm bảo mật khẩu được ẩn
              left={<TextInput.Icon icon={() => <FontAwesome name="lock" size={20}/>} />}
              mode="outlined"
              style={{ marginBottom: 8,color: "black",borderBlockColor:"black", backgroundColor:"white" }}
            />

            <VStack space={2} alignItems="flex-end">
              <Pressable onPress={() => {navigation.navigate("Forgetpass")}}>
                <Text color="blue.500" style={{ fontSize: 16, marginBottom:5 }}>Quên mật khẩu?</Text>
              </Pressable>
              <Pressable onPress={() => {navigation.navigate("Register")}}>
                <Text color="blue.500" style={{ fontSize: 16 }}>Tạo tài khoản</Text>
              </Pressable>
            </VStack>

            <Button
              borderRadius="xl"
              _pressed={{ opacity: 0.7 }}
              onPress={handleLogin}
              bgColor="#0066CC"
            >
              Đăng nhập
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
    </ImageBackground>
  );
};

export default LoginScreen;
