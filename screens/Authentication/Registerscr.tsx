import React, { useState, useContext } from "react";
import { VStack, Button, Icon, Text, Box, Pressable, Heading, ScrollView, Center } from "native-base";
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


const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState(""); 
  const authContext = useContext(AuthContext);
  const {apiUrl} = authContext;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if(email != null){
      try {  
        const response = await axios.post(`${apiUrl}/api/auth/send-verification-email`, {
          email: email,
        }, {
          headers: { "Content-Type": "application/json" },
        });
    
        console.log("✅ API Response:", response.data);
    
        if (response.status === 201) {
          Alert.alert("✅ Đăng ký thành công vui lòng kiểm tra email xác thực tài khoản!");
          navigation.replace('Login');
        } else {
          console.error("❌ Đăng nhập thất bại, mã phản hồi không phải 200.");
        }
      } catch (error: any) {
        console.error("❌ Lỗi đăng nhập:", error.message);
      }
    }else{
      Alert.alert("Mật khẩu không khớp!");
    }
    
  };

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
              Đăng Ký
            </Heading>

            {/* Trường nhập email */}
            <TextInput
              label="Nhập email"
              value={email}
              onChangeText={setEmail}
              left={<TextInput.Icon icon={() => <FontAwesome name="envelope" size={20}/>} />}
              mode="outlined"
              style={{ marginBottom: 8,borderBlockColor:"black", backgroundColor:"white" }}
            />

            {/* Trường nhập mật khẩu */}
            <VStack space={1} alignItems="flex-end">
              <Pressable onPress={() => {navigation.navigate("Login")}}>
                <Text color="blue.500" style={{ fontSize: 16 }}>Đã có tài khoản</Text>
              </Pressable>
            </VStack>

            <Button
              borderRadius="xl"
              _pressed={{ opacity: 0.7 }}
              onPress={handleLogin}
              bgColor="#0066CC"
            >
              Đăng ký
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
    </ImageBackground>
  );
};

export default RegisterScreen;
