import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { auth } from "../Firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Đăng ký thành công!");
      
    } catch (error: any) {
      console.error("❌ Lỗi đăng ký:", error.message);
    }
  };

  return (
    <View>
      <Text>Đăng ký</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Đăng ký" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
