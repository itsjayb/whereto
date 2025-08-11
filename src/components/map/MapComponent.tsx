import React from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, StatusBar as RNStatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { VenueType } from '../../types/venue';

// Import custom hooks
import { useMapLogic } from '../../hooks/useMapLogic';
import { useMapControls } from '../../hooks/useMapControls';

// Import components
import ZoomControls from './ZoomControls';
import LocationButton from './LocationButton';
import MapControls from './MapControls';
import VenueTooltip from './VenueTooltip';
import MapStatusIndicators from './MapStatusIndicators';
import VenueMarkers from './VenueMarkers';
import TopTicker from '../TopTicker';
import VenueTypeSelector from '../VenueTypeSelector';

interface MapComponentProps {
  apiKey: string;
  selectedType: VenueType;
  onSelectVenueType: (type: VenueType) => void;
}

export default function MapComponent({ apiKey, selectedType, onSelectVenueType }: MapComponentProps) {
  // Use custom hooks for logic and controls
  const {
    location,
    errorMsg,
    isLoading,
    isSearching,
    region,
    venues,
    currentRadius,
    selectedVenue,
    showCustomTooltip,
    alwaysShowTooltips,
    isUpdatingVenues,
    handleRegionChangeComplete,
    handleMarkerPress,
    handleTooltipClose,
    toggleTooltips,
  } = useMapLogic({ apiKey, selectedType });

  const { mapRef, zoomIn, zoomOut, centerOnUserLocation } = useMapControls({
    region,
    location: location ? location.coords : null,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        // Required on web to load Google Maps JS API
        {...(Platform.OS === 'web' ? ({ googleMapsApiKey: apiKey } as any) : {})}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        showsBuildings={true}
        showsIndoors={true}
      >
        {/* User location marker */}
        {/* {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
            pinColor="#2196F3"
          />
        )} */}

        {/* Venue markers */}
        <VenueMarkers
          venues={venues}
          alwaysShowTooltips={alwaysShowTooltips}
          onMarkerPress={handleMarkerPress}
        />
      </MapView>

      {/* Top Ticker */}
      {/* <View
        style={[
          styles.tickerWrapper,
          {
            top: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + 56 : 56,
            left: 16,
            right: 16,
          },
        ]}
        pointerEvents="none"
      >
        <TopTicker
          showGreeting={true}
          backgroundColor="#2196F3"
          height={48}
          textStyle={{ color: 'white' }}
        />
      </View> */}

      {/* Status indicators */}
      <MapStatusIndicators
        isSearching={isSearching}
        isUpdatingVenues={isUpdatingVenues}
        selectedType={selectedType}
        venuesCount={venues.length}
        currentRadius={currentRadius}
      />

      {/* Custom tooltip */}
      {showCustomTooltip && selectedVenue && (
        <View style={styles.customTooltipContainer}>
          <VenueTooltip
            place={selectedVenue}
            onClose={handleTooltipClose}
          />
        </View>
      )}

      {/* Map controls */}
      {/* <MapControls
        alwaysShowTooltips={alwaysShowTooltips}
        onToggleTooltips={toggleTooltips}
      /> */}

      {/* Venue Type Selector */}

      <View style={styles.mapControlsContainer}>
        {/* Zoom controls */}
        <View style={styles.zoomControlsContainer}>
          <ZoomControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
          />
        </View>

        {/* Right side controls */}
        <View style={styles.rightControlsContainer}>
          <VenueTypeSelector
            onSelectVenueType={onSelectVenueType}
            selectedType={selectedType}
          />

          {/* Location button */}
          {location && (
            <LocationButton onPress={centerOnUserLocation} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  customTooltipContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  tickerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  mapControlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  zoomControlsContainer: {
    // Zoom controls will handle their own positioning
  },
  rightControlsContainer: {
    alignItems: 'flex-end',
    gap: 10,
  },
  venueTypeSelectorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    top: -100,
  },
});
