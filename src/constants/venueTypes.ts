import { MaterialIcons } from '@expo/vector-icons';
import { VenueType } from '../types/venue';

export const VENUE_OPTIONS = [
  { type: 'lounge' as VenueType, icon: 'weekend' as keyof typeof MaterialIcons.glyphMap, label: 'Hookah' },
  { type: 'clubs' as VenueType, icon: 'music-note' as keyof typeof MaterialIcons.glyphMap, label: 'Clubs' },
  { type: 'bars' as VenueType, icon: 'local-bar' as keyof typeof MaterialIcons.glyphMap, label: 'Bars' },
] as const;

export const DEFAULT_REGION = {
  latitude: 30.267222,
  longitude: -97.739722,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const SEARCH_RADIUS = {
  MIN: 2000, // 2km minimum
  MAX: 50000, // 50km max
  DEFAULT: 7500, // 7.5km default
};
