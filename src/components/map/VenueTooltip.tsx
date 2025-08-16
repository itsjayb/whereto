import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PlaceResult } from '../../types/venue';
import { calculateDistance, estimateTravelTime, formatDistance, getMapsUrl } from '../../utils/distanceUtils';

interface VenueTooltipProps {
  place: PlaceResult;
  onClose: () => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function VenueTooltip({ place, onClose, userLocation }: VenueTooltipProps) {
  // Debug logging
  console.log('VenueTooltip - userLocation:', userLocation);
  console.log('VenueTooltip - place:', place.name, place.geometry.location);

  // Calculate distance and travel time if user location is available
  const distance = userLocation ? calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    place.geometry.location.lat,
    place.geometry.location.lng
  ) : null;

  const travelTime = distance ? estimateTravelTime(distance) : null;
  const formattedDistance = distance ? formatDistance(distance) : null;

  console.log('VenueTooltip - calculated distance:', distance, 'formatted:', formattedDistance, 'time:', travelTime);

  const handleMapsPress = () => {
    console.log('Maps button pressed for:', place.name);
    const mapsUrl = getMapsUrl(place.geometry.location.lat, place.geometry.location.lng);
    console.log('Opening maps URL:', mapsUrl);
    Linking.openURL(mapsUrl);
  };

  return (
    <View style={styles.customTooltip}>
      <View style={styles.tooltipHeader}>
        <Text style={styles.tooltipTitle}>{place.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tooltipContent}>
        {/* Rating */}
        {place.rating && (
          <View style={styles.infoRow}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.infoText}>
              {place.rating} ({place.rating >= 4.0 ? 'Excellent' : place.rating >= 3.0 ? 'Good' : 'Fair'})
            </Text>
          </View>
        )}
        
        {/* Address */}
        {place.vicinity && (
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={14} color="#666" />
            <Text style={styles.infoText}>{place.vicinity}</Text>
          </View>
        )}
        
        {/* Distance and Travel Time - Always show for debugging */}
        <View style={styles.infoRow}>
          <MaterialIcons name="directions-car" size={14} color="#666" />
          <Text style={styles.infoText}>
            {formattedDistance && travelTime 
              ? `${formattedDistance} • ${travelTime}`
              : userLocation 
                ? 'Calculating...' 
                : 'Location not available'
            }
          </Text>
        </View>
        
        {/* Opening Status */}
        {place.opening_hours?.open_now !== undefined && (
          <View style={styles.infoRow}>
            <MaterialIcons 
              name={place.opening_hours.open_now ? "check-circle" : "cancel"} 
              size={14} 
              color={place.opening_hours.open_now ? "#4CAF50" : "#F44336"} 
            />
            <Text style={[styles.infoText, { color: place.opening_hours.open_now ? "#4CAF50" : "#F44336" }]}>
              {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        )}
      </View>

      {/* Maps Link Button - Make it more prominent */}
      <TouchableOpacity onPress={handleMapsPress} style={styles.mapsButton}>
        <MaterialIcons name="directions" size={20} color="white" />
        <Text style={styles.mapsButtonText}>Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  customTooltip: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 280,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
  },
  tooltipContent: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 6,
    color: '#333',
    flex: 1,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#1976D2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapsButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});
