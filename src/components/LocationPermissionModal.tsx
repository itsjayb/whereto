import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationPermissionModalProps {
  visible: boolean;
  onRequestPermission: () => void;
  onDismiss: () => void;
}

const { width } = Dimensions.get('window');

export default function LocationPermissionModal({
  visible,
  onRequestPermission,
  onDismiss,
}: LocationPermissionModalProps) {
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialIcons name="location-on" size={32} color="#2196F3" />
            <Text style={styles.title}>Location Access</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Why we need location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why We Need Your Location</Text>
              <Text style={styles.description}>
                To provide you with the most relevant venue recommendations, we need to know where you are. This helps us:
              </Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.benefitText}>Find venues near your current location</Text>
                </View>
                <View style={styles.benefitItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.benefitText}>Show accurate distances and directions</Text>
                </View>
                <View style={styles.benefitItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.benefitText}>Provide real-time venue information</Text>
                </View>
              </View>
            </View>

            {/* Privacy section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Privacy Matters</Text>
              <Text style={styles.description}>
                We want you to know exactly how we handle your location data:
              </Text>
              <View style={styles.privacyList}>
                <View style={styles.privacyItem}>
                  <MaterialIcons name="security" size={20} color="#FF9800" />
                  <Text style={styles.privacyText}>
                    <Text style={styles.bold}>No user accounts:</Text> We don't require login or save personal information
                  </Text>
                </View>
                <View style={styles.privacyItem}>
                  <MaterialIcons name="location-off" size={20} color="#FF9800" />
                  <Text style={styles.privacyText}>
                    <Text style={styles.bold}>No location storage:</Text> We only use coordinates temporarily to find nearby venues
                  </Text>
                </View>
                <View style={styles.privacyItem}>
                  <MaterialIcons name="delete" size={20} color="#FF9800" />
                  <Text style={styles.privacyText}>
                    <Text style={styles.bold}>No tracking:</Text> We don't track your movements or save location history
                  </Text>
                </View>
              </View>
            </View>

            {/* How it works */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              <Text style={styles.description}>
                When you grant location access, we:
              </Text>
              <View style={styles.stepsList}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>Get your current coordinates</Text>
                </View>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>Search for venues in your area</Text>
                </View>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>Display results on the map</Text>
                </View>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <Text style={styles.stepText}>Coordinates are discarded after use</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <Text style={styles.dismissButtonText}>Not Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.permissionButton} onPress={onRequestPermission}>
              <Text style={styles.permissionButtonText}>Allow Location Access</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
    marginBottom: 12,
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
  privacyList: {
    marginTop: 8,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  privacyText: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
  },
  stepsList: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 15,
    color: '#000000',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  dismissButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  permissionButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  permissionButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
