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
};

export type VenueType = 'bars' | 'clubs' | 'lounge' | null;
