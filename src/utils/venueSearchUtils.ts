import { PlaceResult } from '../types/venue';

// Define place types for better search results
export const getPlaceTypes = (selectedType: 'bars' | 'clubs' | 'lounge' | null) => {
  switch (selectedType) {
    case 'bars':
      return ['bar', 'pub', 'tavern'];
    case 'clubs':
      return ['night_club', 'bar']; // night_club is the official type for clubs
    case 'lounge':
      return ['bar', 'restaurant']; // hookah lounges often fall under these categories
    default:
      return [];
  }
};

// Get keywords for better search results
export const getKeywords = (selectedType: 'bars' | 'clubs' | 'lounge' | null) => {
  switch (selectedType) {
    case 'bars':
      return 'bar pub tavern';
    case 'clubs':
      return 'nightclub club dance';
    case 'lounge':
      return 'hookah lounge shisha';
    default:
      return '';
  }
};

// Filter results based on selected type for better accuracy
export const filterVenuesByType = (results: PlaceResult[], selectedType: 'bars' | 'clubs' | 'lounge' | null) => {
  return results.filter(place => {
    if (!place.types) return true;
    
    switch (selectedType) {
      case 'bars':
        return place.types.some(type => 
          ['bar', 'pub', 'tavern', 'establishment'].includes(type)
        );
      case 'clubs':
        return place.types.some(type => 
          ['night_club', 'bar', 'establishment'].includes(type)
        );
      case 'lounge':
        return place.types.some(type => 
          ['bar', 'restaurant', 'establishment'].includes(type)
        ) || place.name.toLowerCase().includes('hookah') || 
             place.name.toLowerCase().includes('lounge');
      default:
        return true;
    }
  });
};

// Fetch venues with specific radius
export const fetchVenuesWithRadius = async (
  apiKey: string,
  location: { latitude: number; longitude: number },
  selectedType: 'bars' | 'clubs' | 'lounge' | null,
  radius: number
): Promise<PlaceResult[]> => {
  if (!apiKey || !location || !selectedType) return [];

  try {
    const { latitude, longitude } = location;
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    // Get place types and keywords for better search
    const placeTypes = getPlaceTypes(selectedType);
    const keywords = getKeywords(selectedType);

    // Build search parameters
    const params = [
      `location=${latitude},${longitude}`,
      `radius=${radius}`, // Dynamic radius
      `type=${placeTypes}`,
      keywords ? `keyword=${encodeURIComponent(keywords)}` : '',
      `key=${apiKey}`,
    ]
      .filter(Boolean)
      .join('&');

    const url = `${baseUrl}?${params}`;

    
    const res = await fetch(url);
    const data = await res.json();


    if (data.status === 'OK') {
      const results: PlaceResult[] = Array.isArray(data.results) ? data.results : [];
      
      // Filter results based on selected type for better accuracy
      const filteredResults = filterVenuesByType(results, selectedType);

      // Limit to 20 results
      return filteredResults.slice(0, 20);
    } else if (data.status === 'ZERO_RESULTS') {
      return [];
    } else {
      console.warn('Places API error:', data.status, data.error_message);
      return [];
    }
  } catch (e: any) {
    console.error('Failed to fetch venues', e?.message || e);
    return [];
  }
};
