import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PlaceResult } from '../../types/venue';

interface VenueTooltipProps {
  place: PlaceResult;
  onClose: () => void;
}

export default function VenueTooltip({ place, onClose }: VenueTooltipProps) {
  return (
    <View style={styles.customTooltip}>
      <View style={styles.tooltipHeader}>
        <Text style={styles.tooltipTitle}>{place.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tooltipContent}>
        {place.rating && (
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>
              {place.rating} ({place.rating >= 4.0 ? 'Excellent' : place.rating >= 3.0 ? 'Good' : 'Fair'})
            </Text>
          </View>
        )}
        
        {place.opening_hours?.open_now !== undefined && (
          <View style={styles.statusContainer}>
            <MaterialIcons 
              name={place.opening_hours.open_now ? "check-circle" : "cancel"} 
              size={14} 
              color={place.opening_hours.open_now ? "#4CAF50" : "#F44336"} 
            />
            <Text style={[styles.statusText, { color: place.opening_hours.open_now ? "#4CAF50" : "#F44336" }]}>
              {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        )}
        
        {place.vicinity && (
          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={14} color="#666" />
            <Text style={styles.addressText}>{place.vicinity}</Text>
          </View>
        )}
      </View>
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  addressText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },
});
