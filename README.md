# WhereTo - Venue Finder

A React Native app that helps you find bars, night clubs, and hookah lounges near your current location using Google Maps Places API.

## Features

- **Real-time Location**: Uses your device's GPS to find your current location
- **Venue Search**: Search for three types of venues:
  - **Bars**: Traditional bars, pubs, and taverns
  - **Night Clubs**: Dance clubs and nightlife venues
  - **Hookah Lounges**: Hookah bars and shisha lounges
- **Interactive Map**: View venues on an interactive Google Map with color-coded markers
- **Venue Details**: See venue names, ratings, and open/closed status
- **Smart Filtering**: Results are filtered to show the most relevant venues for each category

## How to Use

1. **Grant Location Permission**: The app will request permission to access your location
2. **Select Venue Type**: Tap the floating action button (+) to open the venue selector
3. **Choose Category**: Select from Bars, Clubs, or Hookah lounges
4. **View Results**: Venues will appear on the map with color-coded markers:
   - 🟠 Orange: Bars
   - 🟣 Purple: Night Clubs  
   - 🟢 Green: Hookah Lounges
5. **Tap Markers**: Tap on any marker to see venue details including rating and open status

## Technical Details

### Search Implementation
- Uses Google Places API Nearby Search
- Searches within a 3km radius of your location
- Results are ranked by distance for better relevance
- Smart filtering ensures venues match the selected category

### Place Types Used
- **Bars**: `bar`, `pub`, `tavern`
- **Clubs**: `night_club`, `bar`
- **Hookah Lounges**: `bar`, `restaurant` + keyword filtering for "hookah" and "lounge"

### API Requirements
- Google Maps API Key with Places API enabled
- Location permissions on device

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Google Maps API key in environment variables:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm start
   ```

## Dependencies

- React Native Maps
- Expo Location
- Google Maps Places API
- React Native Vector Icons

## Platform Support

- iOS
- Android
- Web (with limitations)
