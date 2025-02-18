import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";

//Authentication
import HomeScreen from "./screens/Authentication/Homescr";
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

import TestScreen from "./screens/Test";
import StudentDetail from "./screens/Student/StdentDetail";
import StdentAcpRC from "./screens/Student/StudentAcpRC";
//Context
import { AuthProvider } from "./Context/Authcontext";

import AttendanceHistory from "./screens/Student/AttendanceHistory";

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NativeBaseProvider>

    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator  initialRouteName="Login">
          <Stack.Screen name="Homescreen" component={HomeScreen} options={{ headerShown: false }} />

          {/* Student */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          
          <Stack.Screen name="FaceAuth" component={FaceAuth} options={{ headerShown: false }} />


          <Stack.Screen name="Activitylist" component={ActivityList} options={{ headerShown: false }} />
          <Stack.Screen name="StudentRC" component={StdentRC} options={{ headerShown: false }} />
          <Stack.Screen name="StdentAcpRC" component={StdentAcpRC} options={{ headerShown: false }} />
          <Stack.Screen name="AttHisory" component={AttendanceHistory} options={{ headerShown: false }} />
          <Stack.Screen name="StudentDetail" component={StudentDetail} options={{ headerShown: false }} />
          <Stack.Screen name="TermsAndPrivacy" component={TermsAndPrivacyScreen} options={{ headerShown: false }} />

          {/* Admin */}
          <Stack.Screen name="AdCreate" component={AdminCreate} options={{ headerShown: false }}/>

          <Stack.Screen name="Test" component={TestScreen} options={{ headerShown: false }} />


          

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>

    </NativeBaseProvider>
  );
};
