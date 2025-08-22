import React from 'react';
import { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { PlaceResult } from '../../types/venue';

interface UserMarkersProps {
  selectedVenue: PlaceResult | null;
  showUsers: boolean;
}

interface UserPosition {
  id: string;
  latitude: number;
  longitude: number;
}

export default function UserMarkers({ selectedVenue, showUsers }: UserMarkersProps) {
  // Generate user positions around the selected venue based on busyness
  const generateUserPositions = (venue: PlaceResult): UserPosition[] => {
    if (!venue.bestTimeData) return [];
    
    const busyness = venue.bestTimeData.isLiveDataAvailable 
      ? (venue.bestTimeData.liveBusyness || 0)
      : (venue.bestTimeData.forecastedBusyness || 0);
    
    // Scale the number of users based on busyness (0-100)
    // For 100% busy, show around 15-25 users
    // For 50% busy, show around 8-12 users
    const maxUsers = Math.max(3, Math.floor(busyness / 6));
    const userCount = Math.min(maxUsers, 25); // Cap at 25 users max
    
    const users: UserPosition[] = [];
    const venueLat = venue.geometry.location.lat;
    const venueLng = venue.geometry.location.lng;
    
    // Use a much smaller radius to keep users within the business area
    // 0.0001 degrees ≈ 11 meters, which is more realistic for a business interior
    const baseRadius = 0.0001; // Much smaller base radius
    const busynessMultiplier = 0.5 + (busyness / 200); // 0.5x to 1x based on busyness
    const radius = baseRadius * busynessMultiplier;
    
    for (let i = 0; i < userCount; i++) {
      // Use a more concentrated distribution (square root for more central clustering)
      const randomFactor = Math.sqrt(Math.random());
      const distance = randomFactor * radius;
      
      // Generate random angle
      const angle = Math.random() * 2 * Math.PI;
      
      // Convert polar coordinates to lat/lng
      const latOffset = distance * Math.cos(angle);
      const lngOffset = distance * Math.sin(angle);
      
      users.push({
        id: `user-${venue.place_id}-${i}`,
        latitude: venueLat + latOffset,
        longitude: venueLng + lngOffset,
      });
    }
    
    return users;
  };

  if (!showUsers || !selectedVenue) {
    return null;
  }

  const userPositions = generateUserPositions(selectedVenue);

  return (
    <>
      {userPositions.map((user) => (
        <Marker
          key={user.id}
          coordinate={{
            latitude: user.latitude,
            longitude: user.longitude,
          }}
          title="User"
          description="Someone at this venue"
        >
          <View style={styles.userCircle} />
        </Marker>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  userCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
