import { Platform } from 'react-native';

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

// Estimate travel time based on distance and mode of transportation
export const estimateTravelTime = (distanceKm: number, mode: 'walking' | 'driving' | 'transit' = 'driving'): string => {
  
  let speedKmH: number;
  
  switch (mode) {
    case 'walking':
      speedKmH = 5; // Average walking speed
      break;
    case 'driving':
      speedKmH = 30; // Average city driving speed (accounting for traffic)
      break;
    case 'transit':
      speedKmH = 20; // Average public transit speed
      break;
    default:
      speedKmH = 30;
  }
  
  const timeHours = distanceKm / speedKmH;
  const timeMinutes = Math.round(timeHours * 60);
  
  let result: string;
  if (timeMinutes < 1) {
    result = '< 1 min';
  } else if (timeMinutes < 60) {
    result = `${timeMinutes} min`;
  } else {
    const hours = Math.floor(timeMinutes / 60);
    const minutes = timeMinutes % 60;
    result = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  
  return result;
};

// Format distance for display
export const formatDistance = (distanceKm: number): string => {
  
  let result: string;
  if (distanceKm < 1) {
    result = `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    result = `${distanceKm.toFixed(1)}km`;
  } else {
    result = `${Math.round(distanceKm)}km`;
  }
  
  return result;
};

// Generate platform-appropriate maps URL for directions
export const getMapsUrl = (destinationLat: number, destinationLng: number): string => {
  if (Platform.OS === 'ios') {
    // Use Apple Maps on iOS
    const url = `http://maps.apple.com/?daddr=${destinationLat},${destinationLng}&dirflg=d`;
    return url;
  } else {
    // Use Google Maps on Android and other platforms
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;
    return url;
  }
};

// Keep the old function name for backward compatibility
export const getGoogleMapsUrl = getMapsUrl;

// Test the distance calculation with known coordinates
// New York City to Los Angeles (should be ~4000km)
const testDistance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
