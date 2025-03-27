import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Snackbar, Card } from "react-native-paper";
import api from "../utils/api";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await api.post("/register", { name, email, password });
      console.log("Registration Successful:", response.data);

      alert("User registered successfully!");
      navigation.navigate("Login"); // Redirect to Login screen
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Register" titleStyle={styles.title} />
        <Card.Content>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Register
          </Button>
          <Button mode="outlined" onPress={() => navigation.navigate("Login")}>
            Go to Login
          </Button>
        </Card.Content>
      </Card>

      {/* Snackbar for error messages */}
      <Snackbar visible={visible} onDismiss={() => setVisible(false)} duration={3000}>
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f4f4f4",
  },
  card: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginBottom: 10,
  },
});

export default RegisterScreen;
