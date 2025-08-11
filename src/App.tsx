import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapComponent from './components/map/MapComponent';
import { useState, useEffect } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { VenueType } from './types/venue';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [selectedVenueType, setSelectedVenueType] = useState<VenueType>(null);

  useEffect(() => {
    setApiKey(GOOGLE_MAPS_API_KEY || '');
  }, []);

  const handleVenueTypeSelect = (type: VenueType) => {
    setSelectedVenueType(type);
    console.log('Selected venue type:', type);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapComponent 
        apiKey={apiKey} 
        selectedType={selectedVenueType} 
        onSelectVenueType={handleVenueTypeSelect}
      />
      <ExpoStatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
