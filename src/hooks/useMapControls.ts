import { useRef, useCallback } from 'react';
import { Region } from 'react-native-maps';
import MapView from 'react-native-maps';

interface UseMapControlsProps {
  region: Region;
  location: { latitude: number; longitude: number } | null;
}

export const useMapControls = ({ region, location }: UseMapControlsProps) => {
  const mapRef = useRef<MapView>(null);

  // Zoom controls
  const zoomByFactor = useCallback((factor: number) => {
    if (!mapRef.current) return;
    const minDelta = 0.002;
    const maxDelta = 60;
    const newLatitudeDelta = Math.min(Math.max(region.latitudeDelta * factor, minDelta), maxDelta);
    const newLongitudeDelta = Math.min(Math.max(region.longitudeDelta * factor, minDelta), maxDelta);
    mapRef.current.animateToRegion(
      {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: newLatitudeDelta,
        longitudeDelta: newLongitudeDelta,
      },
      250
    );
  }, [region]);

  const zoomIn = useCallback(() => zoomByFactor(0.5), [zoomByFactor]);
  const zoomOut = useCallback(() => zoomByFactor(2), [zoomByFactor]);

  // Function to center map back to user's location
  const centerOnUserLocation = useCallback(() => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000); // 1 second animation
    }
  }, [location]);

  return {
    mapRef,
    zoomIn,
    zoomOut,
    centerOnUserLocation,
  };
};
