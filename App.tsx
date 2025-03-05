import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

//Authentication
import LoginScreen from "./screens/Authentication/Loginscr";
import RegisterScreen from "./screens/Authentication/Registerscr";

//Student
import ActivityList from "./screens/Student/ListActivities";
import StdentRC from "./screens/Student/StdentRC";
import LocationAuth from "./component/LocationAuth";
import TermsAndPrivacyScreen from "./screens/DetailScreen/TermsAndPrivacy";
//Admin
import AdminCreate from "./screens/Admin/AdminCreate";

import FaceAuth from "./component/FaceAuth";
import FaceVerity from "./component/FaceVerity";

import StudentDetail from "./screens/Student/StdentDetail";
import StdentAcpRC from "./screens/Student/StudentAcpRC";
//Context
import { AuthProvider } from "./Context/Authcontext";
import MapScreen from "./component/View/MapScreen";
import AttendanceHistory from "./screens/Student/AttendanceHistory";
import Forgetpass from "./screens/Authentication/Forget-password";
import Attendance from "./screens/Admin/Attendance";

import AdList from "./screens/Admin/AdList";
import FaceWebView from "./screens/Test";

const Stack = createNativeStackNavigator();

export default function App(){
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const expiryTime = await AsyncStorage.getItem("expiryTime");

        if (!token || !expiryTime || Date.now() > Number(expiryTime)) {
          console.log("Token hết hạn hoặc không hợp lệ!");
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("expiryTime");
          setIsAuthenticated(false);
        } else {
          console.log("Token hợp lệ!");
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra token:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <NativeBaseProvider>

    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator  initialRouteName={isAuthenticated ? "Activitylist" : "Test"}>

          {/* Student */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Forgetpass" component={Forgetpass} options={{ headerShown: false }} />
          <Stack.Screen name="Activitylist" component={ActivityList} options={{ headerShown: false }} />
          <Stack.Screen name="StudentRC" component={StdentRC} options={{ headerShown: false }} />
          <Stack.Screen name="StdentAcpRC" component={StdentAcpRC} options={{ headerShown: false }} />
          <Stack.Screen name="StudentDetail" component={StudentDetail} options={{ headerShown: false }} />
          <Stack.Screen name="AttHisory" component={AttendanceHistory} options={{ headerShown: false }} />
          <Stack.Screen name="TermsAndPrivacy" component={TermsAndPrivacyScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FaceAuth" component={FaceAuth} options={{ headerShown: false }} />
          <Stack.Screen name="FaceVerity" component={FaceVerity} options={{ headerShown: false }} />

          {/* Admin */}
          <Stack.Screen name="AdCreate" component={AdminCreate} options={{ headerShown: false }}/>
          <Stack.Screen name="Attendance" component={Attendance} options={{ headerShown: false }}/>
          <Stack.Screen name="AdList" component={AdList} options={{ headerShown: false }}/>

          <Stack.Screen name="Test" component={FaceWebView} options={{ headerShown: false }}/>


          

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>

    </NativeBaseProvider>
  );
};
