# Map Components

This directory contains a modular map component system that follows separation of concerns principles. The original large `MapComponent.tsx` file (744 lines) has been refactored into smaller, focused components and utilities.

## Architecture Overview

### Components

- **`MapComponent.tsx`** (174 lines) - Main composition component that orchestrates all sub-components
- **`ZoomControls.tsx`** - Handles map zoom in/out functionality
- **`LocationButton.tsx`** - Handles centering map back to user's location
- **`MapControls.tsx`** - Handles tooltip toggle and other UI controls
- **`VenueTooltip.tsx`** - Displays detailed venue information in a custom tooltip
- **`MapStatusIndicators.tsx`** - Shows search status, updating indicators, and results count
- **`VenueMarkers.tsx`** - Renders venue markers on the map with color coding

### Custom Hooks

- **`useMapLogic.ts`** - Contains all business logic, state management, and API calls
- **`useMapControls.ts`** - Handles map control functions (zoom, location centering)

### Utilities

- **`venueSearchUtils.ts`** - Contains venue search logic, filtering, and API utilities

### Types

- **`PlaceResult`** - TypeScript interface for venue data structure

## Benefits of This Refactoring

### 1. **Separation of Concerns**
- Each component has a single responsibility
- Business logic is separated from UI components
- API utilities are isolated from component logic

### 2. **Maintainability**
- Smaller files are easier to understand and modify
- Changes to one feature don't affect others
- Clear boundaries between different functionalities

### 3. **Reusability**
- Components can be reused in different contexts
- Hooks can be shared across different map implementations
- Utilities can be used by other parts of the application

### 4. **Testability**
- Each component can be tested in isolation
- Business logic in hooks can be unit tested
- Utilities can be tested independently

### 5. **Performance**
- Components can be optimized individually
- Unnecessary re-renders can be prevented with proper memoization
- Code splitting becomes easier

## Usage

```tsx
import { MapComponent } from './components/map';

// Use the main component
<MapComponent apiKey={apiKey} selectedType="bars" />

// Or import individual components for custom implementations
import { ZoomControls, LocationButton, useMapLogic } from './components/map';
```

## File Size Comparison

| File | Lines | Purpose |
|------|-------|---------|
| Original MapComponent.tsx | 744 | Everything in one file |
| New MapComponent.tsx | 174 | Main composition component |
| useMapLogic.ts | 209 | Business logic and state |
| venueSearchUtils.ts | 112 | API utilities |
| VenueTooltip.tsx | 125 | Tooltip UI component |
| MapStatusIndicators.tsx | 95 | Status indicators |
| VenueMarkers.tsx | 61 | Marker rendering |
| useMapControls.ts | 53 | Map control functions |
| ZoomControls.tsx | 67 | Zoom UI controls |
| MapControls.tsx | 50 | General map controls |
| LocationButton.tsx | 42 | Location button |
| **Total** | **1,048** | **Modular, maintainable code** |

## Future Improvements

1. **Add unit tests** for each component and hook
2. **Implement error boundaries** for better error handling
3. **Add performance optimizations** with React.memo and useMemo
4. **Create storybook stories** for component documentation
5. **Add accessibility improvements** for better screen reader support
