import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { auth } from "../Firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { AuthContext } from "../context/Authcontext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import navigation

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const { setIsLoggedIn, setEmail:setAuthemail , setToken, apiUrl } = authContext;
  const navigation = useNavigation(); // Khởi tạo navigation

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Đăng nhập Firebase thành công!");

      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email: email,
        password: password,
      },{
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ API Response:", response.data);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setAuthemail(email);
      setToken(response.data.token);
      setIsLoggedIn(true);
      navigation.replace('StdentRC');
    } catch (error: any) {
      console.error("❌ Lỗi đăng nhập:", error.message);
    }
  };

  



  return (
    <View>
      <Text>Đăng nhập</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;


