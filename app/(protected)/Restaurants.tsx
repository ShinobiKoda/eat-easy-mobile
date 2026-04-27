import PrimaryButton from "@/components/PrimaryButton";
import { SlideInUpView } from "@/components/animations/reanimated";
import AppLayout from "@/components/layout/AppLayout";
import RestaurantSkeleton from "@/components/ui/RestaurantSkeleton";
import { useRestaurant } from "@/contexts/RestaurantContext";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItem,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { fetchNearbyPlaces } from "../../lib/tomtom";
import { Restaurant } from "../../types/restaurant";

const RestaurantFinder: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(
    "Finding restaurants near you...",
  );
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);

  const { setSelectedRestaurant } = useRestaurant();
  const router = useRouter();

  const findFood = async () => {
    setLoading(true);
    setStatus("Requesting permission...");

    const { status: permissionStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (permissionStatus !== "granted") {
      setLoading(false);
      Alert.alert("Permission Denied", "We need location access to find food.");
      return;
    }

    try {
      setStatus("Locating you...");

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setStatus("Fetching data...");

      const data = await fetchNearbyPlaces(latitude, longitude, "food");

      setRestaurants(data);

      if (data.length > 0) {
        setStatus(`Found ${data.length} places!`);
      } else {
        setStatus("No places found nearby.");
        // Default to Gbam Bistro when no restaurants found
        const defaultRestaurant = {
          id: 'gbam-bistro-default',
          name: 'Gbam Bistro',
        } as any;
        setSelectedRestaurant(defaultRestaurant);
        router.push("/(protected)/Homepage");
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

  const handleContinue = () => {
    const selected = restaurants.find((r) => r.id === selectedRestaurantId);
    if (selected) {
      setSelectedRestaurant({
        id: selected.id,
        name: selected.poi.name,
      } as any);
    }
    router.push("/(protected)/Homepage");
  };

  const renderItem: ListRenderItem<Restaurant> = ({ item, index }) => {
    const isSelected = selectedRestaurantId === item.id;
    return (
      <SlideInUpView delay={index * 100}>
        <TouchableOpacity
          onPress={() => setSelectedRestaurantId(item.id)}
          className="flex flex-row items-center justify-between p-5 bg-white shadow-md dark:bg-neutral-700 rounded-xl mb-4"
        >
          <View className="flex flex-col gap-3 flex-1 mr-4">
            <Text className="font-mulish-semibold text-base text-neutral-900 dark:text-white">
              {item.poi.name}
            </Text>
            <Text className="font-mulish-medium text-sm text-neutral-500 dark:text-neutral-300">
              {item.address.freeformAddress}
            </Text>
          </View>
          <View
            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
              isSelected
                ? "border-yellow-1"
                : "border-neutral-300 dark:border-neutral-500 bg-white dark:bg-neutral-700"
            }`}
          >
            {isSelected && (
              <View className="w-2.5 h-2.5 rounded-full bg-yellow-1" />
            )}
          </View>
        </TouchableOpacity>
      </SlideInUpView>
    );
  };

  if (loading) {
    return (
      <AppLayout title="" showMenuButton={true} locationIcon={false}>
        <View className="flex-1">
          <View className="mt-3 flex flex-col gap-[14px]">
            <Text className="font-dm-medium text-[22px] text-neutral-800 text-center dark:text-white">
              Share your Location with us to order
            </Text>
            <Text className="font-mulish-medium text-neutral-600 text-center dark:text-neutral-150">
              Please enter your location or allow access to your location to
              find all restaurants that are near you{" "}
            </Text>
          </View>
          <ScrollView
            className="mt-6 flex-1"
            showsVerticalScrollIndicator={false}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <RestaurantSkeleton key={index} />
            ))}
          </ScrollView>
          <PrimaryButton
            text="Continue"
            bgClass="bg-neutral-400 my-4"
            onPress={() => {}}
            disabled={true}
          />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="" showMenuButton={true} locationIcon={false}>
      <View className="flex-1">
        <View className="mt-3 flex flex-col gap-[14px]">
          <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white text-center">
            Share your Location with us to order
          </Text>
          <Text className="font-mulish-medium text-neutral-600 text-center dark:text-neutral-150">
            Please allow access to your location to find all restaurants that
            are near you{" "}
          </Text>
        </View>
        <View className="mt-6 flex-1">
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="text-center mt-10 font-mulish-medium text-neutral-500">
                {status !== "Finding restaurants near you..."
                  ? "No restaurants found."
                  : status}
              </Text>
            }
          />
        </View>
        <PrimaryButton
          text="Continue"
          bgClass={selectedRestaurantId ? "bg-purple-2 my-4" : "bg-neutral-400 my-4"}
          onPress={handleContinue}
          disabled={!selectedRestaurantId}
        />
      </View>
    </AppLayout>
  );
};

export default RestaurantFinder;
