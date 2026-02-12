
export interface Restaurant {
  id: string;
  poi: {
    name: string;
    phone?: string;
    categories: string[];
    url?: string;
  };
  address: {
    freeformAddress: string;
  };
  dist: number; // Distance in meters
}

export interface TomTomResponse {
  results: Restaurant[];
}