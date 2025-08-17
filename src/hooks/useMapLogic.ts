import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import { PlaceResult, VenueType } from '../types/venue';
import { fetchVenuesWithRadius } from '../utils/venueSearchUtils';
import { DEFAULT_REGION, SEARCH_RADIUS } from '../constants/venueTypes';

interface UseMapLogicProps {
  apiKey: string;
  selectedType: VenueType;
}

export const useMapLogic = ({ apiKey, selectedType }: UseMapLogicProps) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [venues, setVenues] = useState<PlaceResult[]>([]);
  const [currentRadius, setCurrentRadius] = useState(SEARCH_RADIUS.DEFAULT);
  const [selectedVenue, setSelectedVenue] = useState<PlaceResult | null>(null);
  const [showCustomTooltip, setShowCustomTooltip] = useState(false);
  const [alwaysShowTooltips, setAlwaysShowTooltips] = useState(false);
  const [isUpdatingVenues, setIsUpdatingVenues] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const lastSearchRadius = useRef(SEARCH_RADIUS.DEFAULT);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate radius based on map region (zoom level and viewport)
  const calculateRadiusFromRegion = useCallback((region: Region): number => {
    // Convert delta values to approximate radius in meters
    // 1 degree of latitude ≈ 111,000 meters
    // 1 degree of longitude ≈ 111,000 * cos(latitude) meters
    const latMeters = region.latitudeDelta * 111000;
    const lngMeters = region.longitudeDelta * 111000 * Math.cos(region.latitude * Math.PI / 180);
    
    // Use the larger of the two to ensure we cover the visible area
    const visibleRadius = Math.max(latMeters, lngMeters) / 2;
    
    // Add some buffer to ensure we get results beyond the visible area
    const searchRadius = Math.max(visibleRadius * 2.0, 1000);
    
    // Cap the maximum radius to avoid too many results
    const finalRadius = Math.min(searchRadius, SEARCH_RADIUS.MAX);
    
    // Ensure minimum radius to prevent markers from disappearing when zooming in
    return Math.max(Math.round(finalRadius / 1000) * 1000, SEARCH_RADIUS.MIN);
  }, []);

  // Fetch venues with specific radius
  const fetchVenuesWithRadiusCallback = useCallback(async (radius: number) => {
    if (!apiKey || !location || !selectedType) return;

    setIsSearching(true);
    setIsUpdatingVenues(true);
    try {
      const { latitude, longitude } = location.coords;
      const newVenues = await fetchVenuesWithRadius(apiKey, { latitude, longitude }, selectedType, radius);
      
      // Only update venues if we have results, otherwise keep existing ones
      if (newVenues.length > 0) {
        setVenues(newVenues);
      } else {
        console.log('No new venues found, keeping existing ones');
      }
    } catch (e: any) {
      console.error('Failed to fetch venues', e?.message || e);
      // Don't clear venues on network errors, keep existing ones
    } finally {
      setIsSearching(false);
      setIsUpdatingVenues(false);
    }
  }, [apiKey, location, selectedType]);

  // Handle region changes (zoom/pan)
  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
    
    const newRadius = calculateRadiusFromRegion(newRegion);
    setCurrentRadius(newRadius);
    
    // Only trigger new search if radius changed significantly (more than 50%)
    const radiusChange = Math.abs(newRadius - lastSearchRadius.current) / lastSearchRadius.current;
    
    if (radiusChange > 0.5) {
      console.log(`Radius changed from ${lastSearchRadius.current}m to ${newRadius}m`);
      lastSearchRadius.current = newRadius;
      
      // Debounce the search to avoid too many API calls
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        // Trigger venue search with new radius
        if (selectedType && location) {
          fetchVenuesWithRadiusCallback(newRadius);
        }
      }, 500);
    }
  }, [selectedType, location, calculateRadiusFromRegion, fetchVenuesWithRadiusCallback]);

  // Initialize location
  useEffect(() => {
    (async () => {
      try {
        // Check current permission status
        let { status } = await Location.getForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          // Show modal only if permission is not granted
          console.log('Location permission not granted, showing modal');
          setShowLocationModal(true);
          setIsLoading(false);
          return;
        }

        // Permission is granted, get current location
        console.log('Location permission granted, getting current location');
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
        
        const initialRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setRegion(initialRegion);
        
        // Calculate initial radius
        const initialRadius = calculateRadiusFromRegion(initialRegion);
        setCurrentRadius(initialRadius);
        lastSearchRadius.current = initialRadius;
      } catch (error: any) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location: ' + (error.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [calculateRadiusFromRegion]);

  // Handle venue type changes
  useEffect(() => {
    if (selectedType && location) {
      // Clear existing venues when changing venue type to avoid confusion
      setVenues([]);
      fetchVenuesWithRadiusCallback(currentRadius);
    } else {
      setVenues([]);
    }
    
    // Auto-close modal when venue type changes or is cleared
    setShowCustomTooltip(false);
    setSelectedVenue(null);
  }, [selectedType, location, fetchVenuesWithRadiusCallback, currentRadius]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle marker press
  const handleMarkerPress = useCallback((place: PlaceResult) => {
    setSelectedVenue(place);
    setShowCustomTooltip(true);
  }, []);

  // Handle tooltip close
  const handleTooltipClose = useCallback(() => {
    setShowCustomTooltip(false);
    setSelectedVenue(null);
  }, []);

  // Toggle tooltips
  const toggleTooltips = useCallback(() => {
    setAlwaysShowTooltips(!alwaysShowTooltips);
  }, [alwaysShowTooltips]);

  // Handle location permission modal
  const handleRequestLocationPermission = useCallback(async () => {
    setShowLocationModal(false);
    setIsLoading(true);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        // Show a single, clear alert about permission being denied
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to show nearby venues. Please enable location permissions in your device settings.',
          [
            { text: 'OK', style: 'default' },
            { 
              text: 'Open Settings', 
              onPress: async () => {
                try {
                  if (Platform.OS === 'ios') {
                    // Open the app's settings page in iOS Settings
                    await Linking.openURL('app-settings:');
                  } else {
                    // For Android, we can open the app's settings page
                    await Linking.openSettings();
                  }
                } catch (error) {
                  console.error('Failed to open settings:', error);
                  // Fallback: show instructions
                  Alert.alert(
                    'Open Settings',
                    'Go to Settings > Privacy & Security > Location Services > whereto and enable location access.',
                    [{ text: 'OK', style: 'default' }]
                  );
                }
              }
            }
          ]
        );
        setIsLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
      
      const initialRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(initialRegion);
      
      // Calculate initial radius
      const initialRadius = calculateRadiusFromRegion(initialRegion);
      setCurrentRadius(initialRadius);
      lastSearchRadius.current = initialRadius;
    } catch (error: any) {
      console.error('Error getting location:', error);
      setErrorMsg('Error getting location: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [calculateRadiusFromRegion]);

  const handleDismissLocationModal = useCallback(() => {
    setShowLocationModal(false);
    setErrorMsg('Location permission is required to use this app. Please enable location access in your device settings.');
    setIsLoading(false);
    
    // Show a helpful message when user dismisses the modal
    Alert.alert(
      'Location Access Required',
      'This app works best with location access to show nearby venues. You can enable location permissions later in your device settings.',
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

  return {
    // State
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
    showLocationModal,
    
    // Handlers
    handleRegionChangeComplete,
    handleMarkerPress,
    handleTooltipClose,
    toggleTooltips,
    handleRequestLocationPermission,
    handleDismissLocationModal,
  };
};
