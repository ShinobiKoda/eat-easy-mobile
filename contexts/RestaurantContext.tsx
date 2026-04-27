import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Restaurant } from '../types';

interface RestaurantContextType {
    selectedRestaurant: Restaurant | null;
    setSelectedRestaurant: (restaurant: Restaurant) => void;
    isLoading: boolean;
    getStorageKey: (baseKey: string) => string;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

/**
 * Build a restaurant-scoped AsyncStorage key.
 * e.g. getRestaurantStorageKey("abc-123", "eat-easy-cart") → "abc-123:eat-easy-cart"
 */
export function getRestaurantStorageKey(restaurantId: string | null, baseKey: string): string {
    if (!restaurantId) return baseKey; // fallback to global key if no restaurant selected
    return `${restaurantId}:${baseKey}`;
}

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedRestaurant, setSelectedRestaurantState] = useState<Restaurant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function loadSelectedRestaurant() {
            try {
                const saved = await AsyncStorage.getItem('selectedRestaurant');
                if (isMounted && saved) {
                    setSelectedRestaurantState(JSON.parse(saved));
                } else if (isMounted) {
                    // Default to Gbam Bistro if no restaurant was previously selected
                    const defaultRestaurant: Restaurant = {
                        id: 'gbam-bistro-default',
                        name: 'Gbam Bistro',
                    } as Restaurant;
                    setSelectedRestaurantState(defaultRestaurant);
                    await AsyncStorage.setItem('selectedRestaurant', JSON.stringify(defaultRestaurant));
                }
            } catch (error) {
                console.error("Failed to load selected restaurant", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadSelectedRestaurant();
        return () => {
            isMounted = false;
        };
    }, []);

    const setSelectedRestaurant = async (restaurant: Restaurant) => {
        setSelectedRestaurantState(restaurant);
        try {
            await AsyncStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
        } catch (error) {
            console.error("Failed to save selected restaurant", error);
        }
    };

    const getStorageKey = useCallback((baseKey: string) => {
        return getRestaurantStorageKey(selectedRestaurant?.id ?? null, baseKey);
    }, [selectedRestaurant?.id]);

    return (
        <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant, isLoading, getStorageKey }}>
            {children}
        </RestaurantContext.Provider>
    );
};

export const useRestaurant = () => {
    const context = useContext(RestaurantContext);
    if (context === undefined) {
        throw new Error('useRestaurant must be used within a RestaurantProvider');
    }
    return context;
};
