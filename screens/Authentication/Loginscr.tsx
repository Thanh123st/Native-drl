import React, { useState, useContext } from "react";
import { VStack, Button, Icon, Text, Box, Pressable, Heading, ScrollView, Center } from "native-base";
import axios from "axios";
import { AuthContext } from "../../Context/Authcontext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import { TextInput } from 'react-native-paper';  // Sử dụng TextInput từ react-native-paper

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const { setIsLoggedIn, setEmail: setAuthemail, setToken, apiUrl } = authContext;
  const navigation = useNavigation(); // Khởi tạo navigation

  const handleLogin = async () => {
    console.log("📤 Đang gửi dữ liệu đăng nhập:", { email, password });
    try {  
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email: email,
        password: password,
      }, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("✅ API Response:", response.data);
  
      if (response.status === 200) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setAuthemail(email);
        setToken(response.data.token);
        setIsLoggedIn(true);
  
        console.log("✅ Đăng nhập thành công, chuyển hướng...");
        navigation.replace('Activitylist');
      } else {
        console.error("❌ Đăng nhập thất bại, mã phản hồi không phải 200.");
      }
    } catch (error: any) {
      console.error("❌ Lỗi đăng nhập:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <Center flex={1} px={6} bg="gray.100">
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
              left={<TextInput.Icon name="email" color="blue" />}
              mode="outlined"
              style={{ marginBottom: 16 }}
            />

            {/* Trường nhập mật khẩu */}
            <TextInput
              label="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}  // Đảm bảo mật khẩu được ẩn
              left={<TextInput.Icon name="lock" color="blue" />}
              mode="outlined"
              style={{ marginBottom: 16 }}
            />

            <VStack space={2} alignItems="flex-end">
              <Pressable onPress={() => {navigation.navigate("AdCreate")}}>
                <Text color="blue.500">Quên mật khẩu?</Text>
              </Pressable>
              <Pressable onPress={() => {navigation.navigate("Register")}}>
                <Text color="blue.500">Tạo tài khoản</Text>
              </Pressable>
            </VStack>

            <Button
              borderRadius="xl"
              _pressed={{ opacity: 0.7 }}
              onPress={handleLogin}
            >
              Đăng nhập
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

export default LoginScreen;
