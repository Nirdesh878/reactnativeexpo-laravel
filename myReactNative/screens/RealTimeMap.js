import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; // Import Expo Location API
import api from "../utils/api";

const RealTimeMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [washers, setWashers] = useState([]);

  // Request Location Permission
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to enable location permissions."
      );
      return false;
    }
    return true;
  };

  // Get User Location
  const getUserLocation = async () => {
    console.log("Checking location permission...");

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    console.log("Fetching location...");
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    if (location) {
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      sendLocationToServer(latitude, longitude);
    }
  };

  // Send Location to Backend
  const sendLocationToServer = async (latitude, longitude) => {
    try {
      await api.post("/update-location", { latitude, longitude });
      console.log("User location updated!");
    } catch (error) {
      console.error("Failed to send location:", error);
    }
  };

  // Fetch Nearby Washers
  const fetchNearbyWashers = async () => {
    try {
      const response = await api.get("/get-nearby-washers");
      console.log("Nearby Washers Data:", response.data);
  
      // Convert latitude and longitude to numbers
      const formattedWashers = response.data.map(washer => ({
        ...washer,
        latitude: parseFloat(washer.latitude),
        longitude: parseFloat(washer.longitude),
      }));
  
      setWashers(formattedWashers);
    } catch (error) {
      console.error("Failed to fetch washers:", error);
    }
  };  

  useEffect(() => {
    getUserLocation();
    const interval = setInterval(fetchNearbyWashers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : undefined
        }
        showsUserLocation={true}
      >
        {/* Show Nearby Washers */}
        {washers
  .filter(washer => washer.latitude && washer.longitude) // Ensure valid coordinates
  .map((washer, index) => (
    <Marker
      key={index}
      coordinate={{ latitude: washer.latitude, longitude: washer.longitude }}
      title={`Washer ${washer.user?.name || "Unknown"}`}
    />
))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});

export default RealTimeMap;
