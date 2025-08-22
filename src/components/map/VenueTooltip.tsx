import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PlaceResult } from '../../types/venue';
import { calculateDistance, estimateTravelTime, formatDistance, getMapsUrl } from '../../utils/distanceUtils';

// Helper functions for busyness display
const getBusynessColor = (busyness: number): string => {
  if (busyness <= 20) return '#4CAF50'; // Green - Not busy
  if (busyness <= 40) return '#8BC34A'; // Light green - Somewhat busy
  if (busyness <= 60) return '#FFC107'; // Yellow - Moderately busy
  if (busyness <= 80) return '#FF9800'; // Orange - Busy
  return '#F44336'; // Red - Very busy
};

const getBusynessLabel = (busyness: number): string => {
  if (busyness <= 20) return 'Not Busy';
  if (busyness <= 40) return 'Somewhat Busy';
  if (busyness <= 60) return 'Moderately Busy';
  if (busyness <= 80) return 'Busy';
  return 'Very Busy';
};

interface VenueTooltipProps {
  place: PlaceResult;
  onClose: () => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function VenueTooltip({ place, onClose, userLocation }: VenueTooltipProps) {

  // Calculate distance and travel time if user location is available
  const distance = userLocation ? calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    place.geometry.location.lat,
    place.geometry.location.lng
  ) : null;

  const travelTime = distance ? estimateTravelTime(distance) : null;
  const formattedDistance = distance ? formatDistance(distance) : null;

  const handleMapsPress = () => {
    const mapsUrl = getMapsUrl(place.geometry.location.lat, place.geometry.location.lng);
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
        <View style={styles.mainInfoContainer}>
          {/* Left side - Basic venue info */}
          <View style={styles.leftInfo}>
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
            
            {/* Distance and Travel Time */}
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
          
          {/* Right side - Additional venue info from Best Time */}
          {place.bestTimeData?.venueInfo && (
            <View style={styles.rightInfo}>
              {place.bestTimeData.venueInfo.reviews && (
                <View style={styles.rightInfoRow}>
                  <MaterialIcons name="rate-review" size={14} color="#666" />
                  <Text style={styles.rightInfoText}>
                    {place.bestTimeData.venueInfo.reviews} reviews
                  </Text>
                </View>
              )}
              
              {place.bestTimeData.venueInfo.priceLevel && (
                <View style={styles.rightInfoRow}>
                  <MaterialIcons name="attach-money" size={14} color="#666" />
                  <Text style={styles.rightInfoText}>
                    Price: {'$'.repeat(place.bestTimeData.venueInfo.priceLevel)}
                  </Text>
                </View>
              )}
              
              {place.bestTimeData.venueInfo.dwellTimeAvg && (
                <View style={styles.rightInfoRow}>
                  <MaterialIcons name="access-time" size={14} color="#666" />
                  <Text style={styles.rightInfoText}>
                    Avg. stay: {Math.round(place.bestTimeData.venueInfo.dwellTimeAvg)} min
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* Best Time Data - Busyness Information */}
        {place.bestTimeData && (
          <>
            {/* Busyness Level */}
            <View style={styles.infoRow}>
              <MaterialIcons name="people" size={14} color="#FF6B35" />
              <Text style={styles.infoText}>
                {place.bestTimeData.isLiveDataAvailable 
                  ? `Live: ${place.bestTimeData.liveBusyness}/100 busy`
                  : `Forecast: ${place.bestTimeData.forecastedBusyness}/100 busy`
                }
                {place.bestTimeData.timeRange && (
                  <Text style={styles.timeRangeText}>
                    {' '}({place.bestTimeData.timeRange.start}-{place.bestTimeData.timeRange.end})
                  </Text>
                )}
              </Text>
            </View>
            
            {/* Busyness Indicator */}
            <View style={styles.busynessContainer}>
              <View style={styles.busynessBar}>
                <View 
                  style={[
                    styles.busynessFill, 
                    { 
                      width: `${place.bestTimeData.isLiveDataAvailable 
                        ? (place.bestTimeData.liveBusyness || 0)
                        : (place.bestTimeData.forecastedBusyness || 0)
                      }%`,
                      backgroundColor: getBusynessColor(
                        place.bestTimeData.isLiveDataAvailable 
                          ? (place.bestTimeData.liveBusyness || 0)
                          : (place.bestTimeData.forecastedBusyness || 0)
                      )
                    }
                  ]} 
                />
              </View>
              <Text style={styles.busynessLabel}>
                {getBusynessLabel(
                  place.bestTimeData.isLiveDataAvailable 
                    ? (place.bestTimeData.liveBusyness || 0)
                    : (place.bestTimeData.forecastedBusyness || 0)
                )}
              </Text>
            </View>
          </>
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
  timeRangeText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  busynessContainer: {
    marginVertical: 8,
  },
  busynessBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  busynessFill: {
    height: '100%',
    borderRadius: 4,
  },
  busynessLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  mainInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    flex: 1,
    marginRight: 16,
  },
  rightInfo: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  rightInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'flex-end',
  },
  rightInfoText: {
    fontSize: 12,
    marginLeft: 6,
    color: '#333',
    textAlign: 'right',
  },
});
