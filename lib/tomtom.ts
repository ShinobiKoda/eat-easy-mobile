
import { Restaurant, TomTomResponse } from '../types/restaurant';

const TOMTOM_API_KEY = "XDARPUDQwiGaEQpycYJrvQW5OcjJD3NV";

export const fetchNearbyPlaces = async (
  lat: number, 
  lon: number, 
  keyword: string = 'food'
): Promise<Restaurant[]> => {
  
  const radius = 10000; // 10km
  const limit = 20;

  const url = `https://api.tomtom.com/search/2/poiSearch/${keyword}.json?lat=${lat}&lon=${lon}&radius=${radius}&limit=${limit}&key=${TOMTOM_API_KEY}`;

  try {
    const response = await fetch(url);
    const json: TomTomResponse = await response.json();

    if (json.results) {
      return json.results;
    }
    return [];
  } catch (error) {
    console.error("TomTom Service Error:", error);
    throw error; 
  }
};

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string> => {
  const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${TOMTOM_API_KEY}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.addresses && json.addresses.length > 0) {
      const address = json.addresses[0].address;
      // Prefer street name and city, or freeformAddress
      return (
        address.streetName || 
        address.municipality || 
        address.freeformAddress || 
        "Unknown Location"
      );
    }
    return "Unknown Location";
  } catch (error) {
    console.error("TomTom Reverse Geocode Error:", error);
    return "Unknown Location";
  }
};