import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationButtonProps {
  onPress: () => void;
}

export default function LocationButton({ onPress }: LocationButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.myLocationButton}
      onPress={onPress}
      accessibilityLabel="Center on my location"
    >
      <MaterialIcons name="my-location" size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  myLocationButton: {
    backgroundColor: '#2196F3',
    width: 62,
    height: 62,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
