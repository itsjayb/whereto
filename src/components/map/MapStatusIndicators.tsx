import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface MapStatusIndicatorsProps {
  isSearching: boolean;
  isUpdatingVenues: boolean;
  selectedType: string | null;
  venuesCount: number;
  currentRadius: number;
}

export default function MapStatusIndicators({
  isSearching,
  isUpdatingVenues,
  selectedType,
  venuesCount,
  currentRadius
}: MapStatusIndicatorsProps) {
  return (
    <>
      {/* Search indicator */}
      {isSearching && (
        <View style={styles.searchingContainer}>
          <Text style={styles.searchingText}>
            Searching for {selectedType}...
          </Text>
        </View>
      )}
      
      {/* Updating indicator */}
      {isUpdatingVenues && !isSearching && (
        <View style={styles.updatingContainer}>
          <Text style={styles.updatingText}>
            Updating venues...
          </Text>
        </View>
      )}
      
      {/* Results count and radius info */}
      {selectedType && venuesCount > 0 && !isSearching && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            Found {venuesCount} {selectedType} within {(currentRadius / 1000).toFixed(1)}km
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchingContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  searchingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  updatingContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,193,7,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  updatingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(76,175,80,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resultsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
