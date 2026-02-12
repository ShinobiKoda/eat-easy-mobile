
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