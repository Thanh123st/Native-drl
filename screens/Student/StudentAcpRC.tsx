import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box, Text, VStack, Spinner, Button } from "native-base";
import LocationAuth from "../../component/LocationAuth";
import { useRoute,RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
type StudentRCRouteProp = RouteProp<RootStackParamList, "StudentRC">;

const StdentAcpRC = () => {
  const route = useRoute<StudentRCRouteProp>();
  const { activityid } = route.params;

  return (
    <LocationAuth activityid={activityid}/>
  );
};

export default StdentAcpRC;
