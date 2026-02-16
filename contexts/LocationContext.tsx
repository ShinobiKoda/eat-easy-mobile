import { reverseGeocode } from "@/lib/tomtom";
import * as Location from "expo-location";
import React, { createContext, useContext, useState } from "react";

type LocationType = {
  latitude: number;
  longitude: number;
} | null;

interface LocationContextType {
  location: LocationType;
  address: string | null;
  errorMsg: string | null;
  isLoading: boolean;
  fetchLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<LocationType>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission denied");
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationResult.coords;

      setLocation({ latitude, longitude });

      const fetchedAddress = await reverseGeocode(latitude, longitude);
      setAddress(fetchedAddress);
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Unknown Location");
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally fetch on mount if no location data exists
  // useEffect(() => {
  //   if (!location) {
  //     fetchLocation();
  //   }
  // }, []);

  return (
    <LocationContext.Provider
      value={{ location, address, errorMsg, isLoading, fetchLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
