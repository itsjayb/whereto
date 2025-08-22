export type PlaceResult = {
  place_id: string;
  name: string;
  geometry: { location: { lat: number; lng: number } };
  vicinity?: string;
  rating?: number;
  types?: string[];
  business_status?: string;
  opening_hours?: {
    open_now?: boolean;
  };
  // Best Time API data
  bestTimeData?: {
    liveBusyness?: number;
    forecastedBusyness?: number;
    isLiveDataAvailable: boolean;
    timeRange?: {
      start: string;
      end: string;
    };
    venueInfo?: {
      rating?: number;
      reviews?: number;
      priceLevel?: number;
      dwellTimeAvg?: number;
      openStatus?: string;
    };
  };
};

export type VenueType = 'bars' | 'clubs' | 'lounge' | null;
