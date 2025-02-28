import React, { useState, useContext } from "react";
import { VStack, Button, Icon, Text, Box, Pressable, Heading, ScrollView, Center, useNativeBase } from "native-base";
import axios from "axios";
import { AuthContext } from "../../Context/Authcontext";
import { useNavigation } from '@react-navigation/native'; 
import { TextInput } from 'react-native-paper';  // Sử dụng TextInput từ react-native-paper
import { FontAwesome } from "@expo/vector-icons";
import { Alert } from "react-native";
import { ImageBackground } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';  // Import kiểu navigation

type RootStackParamList = {
  Login: undefined;
};


const Forgetpass: React.FC = () => {
  const [email, setEmail] = useState(""); 
  const authContext = useContext(AuthContext);
  const {apiUrl} = authContext;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Khởi tạo navigation
  const handleSubmit = async () => {
    console.log(email);

    // Kiểm tra email trước khi gửi request (có thể thêm validation email)
    if (!email) {
        console.error("❌ Email không hợp lệ!");
        Alert.alert("Lỗi", "❌ Email không hợp lệ!");
        return;  // Ngừng nếu email không có
    }

    try {  
        const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, {
            email: email,
        }, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("✅ API Response:", response.data);

        // Kiểm tra mã trạng thái của phản hồi
        if (response.status >= 200 && response.status < 300) {
            console.log("✅ Gửi thông báo về email thành công vui lòng xác nhận!");
            // Chuyển hướng đến trang đăng nhập
            navigation.replace('Login');
        } else {
            console.error("❌ Đã xảy ra lỗi khi gửi thông báo. Mã phản hồi không phải 2xx.");
            // Thêm thông báo lỗi cho người dùng
            alert("Đã có lỗi xảy ra, vui lòng thử lại sau.");
        }
    } catch (error: any) {
        console.error("❌ Lỗi khi gửi request:", error.message);
        // Thêm thông báo cho người dùng
        Alert.alert("Lỗi", "❌ Email không hợp lệ!");
    }
};


  return (
    <ImageBackground 
          source={require("../../assets/picture/bgauth.jpg")}  // Thay bằng link ảnh hoặc require local
          style={{ flex: 1 }}
          imageStyle={{ resizeMode: "cover" }}
        >
    <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <Center flex={1} px={6} >
        <Box w="100%" maxW="400px" p={6} bg="white" shadow={5} borderRadius="lg">
          <VStack space={6}>
            <Heading textAlign="center" color="blue.600">
              Lấy lại mật khẩu
            </Heading>


            <TextInput
              label="Nhập email"
              value={email}
              onChangeText={setEmail}
              left={<TextInput.Icon icon={() => <FontAwesome name="envelope" size={20}/>} />}
              mode="outlined"
              style={{ marginBottom: 8,borderBlockColor:"black", backgroundColor:"white" }}
            />

            

            

            

            <VStack space={1} alignItems="flex-end">
              <Pressable onPress={() => {navigation.navigate("Login")}}>
                <Text color="blue.500" style={{ fontSize: 16 }}>Đã có tài khoản</Text>
              </Pressable>
            </VStack>

            <Button
              borderRadius="xl"
              _pressed={{ opacity: 0.7 }}
              onPress={handleSubmit}
              bgColor="#0066CC"
            >
              Gửi xác thực
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
    </ImageBackground>
  );
};

export default Forgetpass;
