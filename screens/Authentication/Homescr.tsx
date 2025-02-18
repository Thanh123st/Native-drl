import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";



const HomeScreen = ({ navigation }: { navigation: any }) => {


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với HomeScreen! 🏠</Text>
{/* 
      {userInfo ? (
        <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      ) : (
        <Button disabled={!request} onPress={() => WebBrowser.openAuthSessionAsync(request.url)}>
          Đăng nhập với Google
        </Button>
      )} */}

      <Button mode="contained" onPress={() => navigation.navigate("Login")} style={styles.button}>
        Đăng nhập
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate("Register")} style={styles.button}>
        Đăng ký
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "80%",
    marginVertical: 10,
  },
});

export default HomeScreen;
