import React from "react";
import { View, Text, Button } from "react-native";

const Welcome = ({ navigation }) => {
  const goToLogin = () => {
    navigation.replace("Login");
  };

  return (
    <View>
      <Text>Welcome</Text>
      <Button title="Next" onPress={goToLogin} />
    </View>
  );
};

export default Welcome;
