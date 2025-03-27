import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Ensure axios is imported
import api from "./utils/api";
import { Button } from "react-native-paper"; // Import Paper UI components

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.name);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token before logout:", token);

      if (!token) {
        Alert.alert("Logout Failed", "No token found. Please log in again.");
        return;
      }

      const response = await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Logout Response:", response.data);

      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      navigation.replace("Auth"); // Ensure it returns to the Auth Stack
    } catch (error) {
      console.error("Logout Error:", error.response ? error.response.data : error.message);
      Alert.alert("Logout Failed", "Something went wrong while logging out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>🏡 Welcome, {userName}!</Text>

      <Button mode="contained" onPress={() => navigation.navigate("RealTimeMap")} style={styles.mapButton}>
        🗺️ Go to Map
      </Button>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.buttonText}
      >
        🚪 Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  welcomeText: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  mapButton: { backgroundColor: "#007bff", width: "80%", padding: 10, marginBottom: 10, borderRadius: 10 },
});

export default HomeScreen;
