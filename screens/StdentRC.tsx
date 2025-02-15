import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box, Text, VStack, Spinner, Button } from "native-base";
import axios from "axios";
import { SafeAreaView } from "react-native";
import VideoScreen from "../component/FaceAuthScreen";
import CameraScreen from "../component/FaceAuthVerify";
import LocationAuth from "../component/LocationAuth";
const StdentRC = () => {

  return (
    <Box>
        <SafeAreaView style={{ flex: 1 }}>
          <CameraScreen />
        </SafeAreaView>
        <SafeAreaView>
          <LocationAuth />
        </SafeAreaView>
        
    </Box>

      
  );
};

export default StdentRC;
