import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export default function Hello() {

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      alert("Push Notifications chỉ chạy trên thiết bị thật");
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        alert("Bạn cần cấp quyền thông báo!");
        return;
      }
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  }

  return (
    <View>
      <Text>Expo Push Token:</Text>
      <Text>{}</Text>
    </View>
  );
}
