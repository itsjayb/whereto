import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MapControlsProps {
  alwaysShowTooltips: boolean;
  onToggleTooltips: () => void;
}

export default function MapControls({ 
  alwaysShowTooltips, 
  onToggleTooltips 
}: MapControlsProps) {
  return (
    <TouchableOpacity 
      style={styles.tooltipToggleButton}
      onPress={onToggleTooltips}
      accessibilityLabel={alwaysShowTooltips ? "Hide tooltips" : "Show tooltips"}
    >
      <MaterialIcons 
        name={alwaysShowTooltips ? "visibility" : "visibility-off"} 
        size={20} 
        color="white" 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tooltipToggleButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#FF6B6B',
    width: 50,
    height: 50,
    borderRadius: 25,
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
