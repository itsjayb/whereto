import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { VenueType } from '../types/venue';
import { VENUE_OPTIONS } from '../constants/venueTypes';

interface VenueTypeSelectorProps {
  onSelectVenueType: (type: VenueType) => void;
  selectedType: VenueType;
}

const VenueTypeSelector: React.FC<VenueTypeSelectorProps> = ({ onSelectVenueType, selectedType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const optionAnimationStyle = (index: number) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -70 * (index + 1)],
    });

    const opacity = animation.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 1, 1],
    });

    return {
      transform: [{ translateY }],
      opacity,
    };
  };

  const renderOption = (
    venueOption: typeof VENUE_OPTIONS[0],
    index: number
  ) => (
    <Animated.View
      key={venueOption.type}
      style={[styles.option, optionAnimationStyle(index)]}
    >
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedType === venueOption.type && styles.selectedButton
        ]}
        onPress={() => {
          // If already selected, deselect it (set to null)
          // If not selected, select it
          const newSelection = selectedType === venueOption.type ? null : venueOption.type;
          onSelectVenueType(newSelection);
          toggleMenu();
        }}
      >
        <MaterialIcons name={venueOption.icon} size={20} color="white" />
        <Animated.Text style={[styles.optionLabel, { opacity: animation }]}>
          {venueOption.label}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const getSelectedVenueOption = () => {
    return VENUE_OPTIONS.find(option => option.type === selectedType);
  };

  return (
    <View style={styles.container}>
      {VENUE_OPTIONS.map((option, index) => renderOption(option, VENUE_OPTIONS.length - 1 - index))}
      
      {!isExpanded && selectedType && (
        <Animated.View style={[styles.option, { transform: [{ translateY: -70 }] }]}> 
          <TouchableOpacity
            style={[styles.optionButton, styles.selectedButton]}
            onPress={() => {
              // Deselect when tapping the selected option
              onSelectVenueType(null);
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={getSelectedVenueOption()?.icon || 'local-bar'} 
              size={20} 
              color="white" 
            />
            <Text style={styles.optionLabel}>
              {getSelectedVenueOption()?.label || selectedType}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <MaterialIcons
          name={isExpanded ? 'close' : 'menu'}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  fab: {
    backgroundColor: '#2196F3',
    width: 62,
    height: 62,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  option: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
  },
  optionButton: {
    backgroundColor: '#1976D2',
    width: 62,
    height: 62,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#81C784',
  },
});

export default VenueTypeSelector;
