import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";
import LoginScreen from "./screens/Loginscr";
import RegisterScreen from "./screens/Registerscr";
import HomeScreen from "./screens/Homescr";
import ActivityList from "./screens/ListActivities";
import StdentRC from "./screens/StdentRC";
import VideoScreen from "./component/FaceAuthScreen";
import { AuthProvider } from "./context/Authcontext";
import LocationAuth from "./component/LocationAuth";
const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NativeBaseProvider>

    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Location">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Homescreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FaceAuth" component={VideoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Activitylist" component={ActivityList} options={{ headerShown: false }} />
          <Stack.Screen name="StudentRC" component={StdentRC} options={{ headerShown: false }} />
          <Stack.Screen name="Location" component={LocationAuth} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>

    </NativeBaseProvider>
  );
};
