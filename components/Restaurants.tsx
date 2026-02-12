import * as Location from "expo-location";
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

// --- CONFIG ---
const TOMTOM_API_KEY = "XDARPUDQwiGaEQpycYJrvQW5OcjJD3NV";

// --- TYPES ---
interface Restaurant {
  id: string;
  poi: {
    name: string;
    phone?: string;
    categories: string[];
  };
  address: {
    freeformAddress: string;
  };
  dist: number; // Distance in meters
}

interface TomTomResponse {
  results: Restaurant[];
}

const RestaurantFinder: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(
    "Finding restaurants near you...",
  );

  // --- MAIN FUNCTION ---
  const findFood = async () => {
    setLoading(true);
    setStatus("Requesting permission...");

    // 1. Request Permission (Expo way)
    const { status: permissionStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (permissionStatus !== "granted") {
      setLoading(false);
      Alert.alert(
        "Permission Denied",
        "Allow location access to find restaurants.",
      );
      return;
    }

    setStatus("Getting location...");

    try {
      // 2. Get Location (Expo way)
      let location = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;
      setStatus("Fetching restaurants...");

      // 3. Call API
      await fetchTomTomRestaurants(latitude, longitude);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Could not fetch location");
      console.error(error);
    }
  };

  // --- API CALL ---
  const fetchTomTomRestaurants = async (lat: number, lon: number) => {
    const radius = 2000;
    const limit = 20;
    const category = "7315"; // Restaurant category

    const url = `https://api.tomtom.com/search/2/nearbySearch/.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=${radius}&limit=${limit}&categorySet=${category}`;

    console.log("TomTom API URL:", url);
    try {
      const response = await fetch(url);
      const json: TomTomResponse = await response.json();
      console.log("TomTom API response:", JSON.stringify(json, null, 2));

      if (json.results && json.results.length > 0) {
        setRestaurants(json.results);
        setStatus(`Found ${json.results.length} places nearby!`);
      } else {
        console.log("No results in response:", json);
        setStatus("No restaurants found.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Failed to connect to TomTom.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger location search on mount
  useEffect(() => {
    findFood();
  }, []);

  // --- RENDER ---
  const renderItem: ListRenderItem<Restaurant> = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.poi.name}</Text>
      <Text style={styles.address}>{item.address.freeformAddress}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.distance}>📍 {item.dist.toFixed(0)}m away</Text>
        {item.poi.phone && (
          <Text style={styles.phone}>📞 {item.poi.phone}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍔 Restaurant Finder</Text>
        <Text style={styles.status}>{status}</Text>
        <Button
          title="Find Food Near Me"
          onPress={findFood}
          disabled={loading}
        />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      )}

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  distance: { color: "green", fontWeight: "600" },
  phone: { color: "blue" },
});

export default RestaurantFinder;
