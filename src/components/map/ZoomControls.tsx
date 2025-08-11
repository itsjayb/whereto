import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Region } from 'react-native-maps';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function ZoomControls({ onZoomIn, onZoomOut }: ZoomControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.zoomInButton}
        onPress={onZoomIn}
        accessibilityLabel="Zoom in"
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.zoomOutButton}
        onPress={onZoomOut}
        accessibilityLabel="Zoom out"
      >
        <MaterialIcons name="remove" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  zoomInButton: {
    backgroundColor: '#2196F3',
    width: 62,
    height: 62,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomOutButton: {
    backgroundColor: '#2196F3',
    width: 62,
    height: 62,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
