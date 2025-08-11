import React from 'react';
import { Marker } from 'react-native-maps';
import { PlaceResult } from './VenueTooltip';

interface VenueMarkersProps {
  venues: PlaceResult[];
  alwaysShowTooltips: boolean;
  onMarkerPress: (place: PlaceResult) => void;
}

export default function VenueMarkers({ 
  venues, 
  alwaysShowTooltips, 
  onMarkerPress 
}: VenueMarkersProps) {
  const getMarkerColor = (place: PlaceResult) => {
    if (!place.rating) return '#FF6B6B'; // Default red for places without rating
    
    // Color based on rating:
    // High rating (4.0-5.0): Red
    // Mid rating (2.5-3.9): Yellow  
    // Low rating (0.0-2.4): Blue
    if (place.rating >= 4.0) {
      return '#FF0000'; // Red for high rating
    } else if (place.rating >= 2.5) {
      return '#FFD700'; // Yellow for mid rating
    } else {
      return '#0000FF'; // Blue for low rating
    }
  };

  const getMarkerTitle = (place: PlaceResult) => {
    let title = place.name;
    if (place.rating) {
      title += ` (${place.rating}⭐)`;
    }
    if (place.opening_hours?.open_now !== undefined) {
      title += place.opening_hours.open_now ? ' - Open' : ' - Closed';
    }
    return title;
  };

  return (
    <>
      {venues.map((place) => (
        <Marker
          key={place.place_id}
          coordinate={{
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          }}
          title={alwaysShowTooltips ? getMarkerTitle(place) : undefined}
          description={alwaysShowTooltips ? (place.vicinity || undefined) : undefined}
          pinColor={getMarkerColor(place)}
          onPress={() => onMarkerPress(place)}
        />
      ))}
    </>
  );
}
