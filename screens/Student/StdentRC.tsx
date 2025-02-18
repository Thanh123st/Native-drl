import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box, Text, VStack, Spinner, Button } from "native-base";
import axios from "axios";
import { SafeAreaView } from "react-native";
import VideoScreen from "../../component/Trash/FaceAuthScreen";
import CameraScreen from "../../component/Trash/FaceAuthVerify";
import LocationAuth from "../../component/LocationAuth";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import FaceVerity from "../../component/FaceVerity";

type StudentRCRouteProp = RouteProp<RootStackParamList, "StudentRC">;


const StdentRC = () => {
  const route = useRoute<StudentRCRouteProp>();
  const { activityid } = route.params;
  return (
    <FaceVerity activityid={activityid} />
  );
};

export default StdentRC;
