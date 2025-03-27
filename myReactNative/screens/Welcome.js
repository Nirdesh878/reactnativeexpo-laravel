import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";

const Welcome = ({ navigation }) => {
  const goToLogin = () => {
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/welcome.webp")} style={styles.image} />

      <Text style={styles.title}>Welcome to My App</Text>
      <Text style={styles.subtitle}>Your journey starts here!</Text>

      <Button mode="contained" onPress={goToLogin} style={styles.button}>
        Next
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    width: 200,
  },
});

export default Welcome;
