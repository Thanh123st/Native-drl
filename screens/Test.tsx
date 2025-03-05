import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

export default function FaceWebView() {
  return (
    <WebView
      source={{ uri: "http://192.168.1.227:5173" }}
      originWhitelist={["*"]}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
    />
  );
}
