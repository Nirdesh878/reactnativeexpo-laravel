import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Snackbar, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import api from "../utils/api";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  // const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "myReactNative",
  });
  
  console.log("Redirect URI:", redirectUri);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "96114857371-ap1al0fh6gj498gf28knaegsg6cvadaa.apps.googleusercontent.com",
    webClientId: "96114857371-l0r5s5pp154l5qjni2gjn3f9o34jd5f2.apps.googleusercontent.com",
    redirectUri, // Use the Expo AuthSession proxy
    scopes: ["profile", "email"],
  });


  // Handle Google Login Response
  React.useEffect(() => {
    console.log("Google Response:", response);

    if (response?.type === "success") {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    } else {
      console.log("Google Login Failed:", response);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();

      // Send user details to backend API for login or registration
      const apiResponse = await api.post("/google-login", {
        email: user.email,
        name: user.name,
        google_id: user.id,
      });

      await AsyncStorage.setItem("token", apiResponse.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(apiResponse.data.user));
      navigation.replace("Main");
    } catch (err) {
      setError("Google Login Failed");
      setVisible(true);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      navigation.replace("Main");
    } catch (err) {
      setError("Invalid credentials");
      setVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Login" titleStyle={styles.title} />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
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
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Button>
          <Button
            mode="contained"
            onPress={() => promptAsync()}
            disabled={!request}
            style={styles.googleButton}
          >
            Login with Google
          </Button>
        </Card.Content>
      </Card>

      {/* Snackbar for error messages */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
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
  card: { padding: 20, borderRadius: 10 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  input: { marginBottom: 15 },
  button: { marginBottom: 10 },
  googleButton: { marginTop: 10, backgroundColor: "#DB4437" },
});

export default LoginScreen;
