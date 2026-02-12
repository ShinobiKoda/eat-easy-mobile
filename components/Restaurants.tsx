import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";

import { Restaurant } from "../types/restaurant";
import { fetchNearbyPlaces } from "../lib/tomtom";

const RestaurantFinder: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Finding restaurants near you...");

  const findFood = async () => {
    setLoading(true);
    setStatus("Requesting permission...");

    const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
    if (permissionStatus !== "granted") {
      setLoading(false);
      Alert.alert("Permission Denied", "We need location access to find food.");
      return;
    }

    try {
      setStatus("Locating you...");
      
      // 2. Get Coords
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setStatus("Fetching data...");

      // 3. CALL THE IMPORTED SERVICE
      // We moved the fetch logic out of this file!
      const data = await fetchNearbyPlaces(latitude, longitude, 'food');

      setRestaurants(data);
      
      if (data.length > 0) {
        setStatus(`Found ${data.length} places!`);
      } else {
        setStatus("No places found nearby.");
      }

    } catch (error) {
      console.error(error);
      setStatus("Error fetching data");
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findFood();
  }, []);

  const renderItem: ListRenderItem<Restaurant> = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.poi.name}</Text>
      <Text style={styles.address}>{item.address.freeformAddress}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.distance}>📍 {item.dist.toFixed(0)}m away</Text>
        {item.poi.phone && <Text style={styles.phone}>📞 {item.poi.phone}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍔 Restaurant Finder</Text>
        <Text style={styles.status}>{status}</Text>
        <Button title="Refresh" onPress={findFood} disabled={loading} />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  header: { padding: 20, backgroundColor: "white", elevation: 3 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  status: { textAlign: "center", marginBottom: 15, color: "#666" },
  list: { padding: 15 },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  address: { color: "#555", marginTop: 5 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  distance: { color: "green", fontWeight: "600" },
  phone: { color: "blue" },
});

export default RestaurantFinder;