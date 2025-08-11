import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { 
  Animated, 
  Easing, 
  LayoutChangeEvent, 
  StyleProp, 
  StyleSheet, 
  Text, 
  TextStyle, 
  View, 
  ViewStyle 
} from 'react-native';

interface TopTickerProps {
  text?: string;
  pixelsPerSecond?: number;
  height?: number;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  showGreeting?: boolean;
}

const TopTicker: React.FC<TopTickerProps> = ({
  text,
  pixelsPerSecond = 60,
  height = 36,
  backgroundColor = '#2196F3',
  containerStyle,
  textStyle,
  showGreeting = true,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: 'wb-sunny', emoji: '🌅' };
    if (hour < 17) return { text: 'Good Afternoon', icon: 'wb-sunny', emoji: '☀️' };
    if (hour < 21) return { text: 'Good Evening', icon: 'nights-stay', emoji: '🌆' };
    return { text: 'Good Night', icon: 'nights-stay', emoji: '🌙' };
  };

  const greeting = getGreeting();
  const displayText = showGreeting ? `${greeting.emoji} ${greeting.text}! Welcome to WhereTo! 🎉` : text;

  const startAnimation = useCallback(() => {
    if (containerWidth === 0 || textWidth === 0) return;

    translateX.stopAnimation();

    const distance = containerWidth + textWidth;
    const durationMs = Math.max(200, Math.round((distance / pixelsPerSecond) * 1000));

    translateX.setValue(containerWidth);

    Animated.loop(
      Animated.timing(translateX, {
        toValue: -textWidth,
        duration: durationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [containerWidth, textWidth, pixelsPerSecond, translateX]);

  useEffect(() => {
    startAnimation();
    // Restart on unmount to cleanup
    return () => {
      translateX.stopAnimation();
    };
  }, [startAnimation, translateX]);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width !== containerWidth) setContainerWidth(width);
  }, [containerWidth]);

  const onTextLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width !== textWidth) setTextWidth(width);
  }, [textWidth]);

  const containerCombinedStyle = useMemo(() => [
    styles.container,
    { height, backgroundColor },
    containerStyle,
  ], [height, backgroundColor, containerStyle]);

  return (
    <View pointerEvents="box-none" style={containerCombinedStyle} onLayout={onContainerLayout}>
      <Animated.View style={[styles.scroller, { transform: [{ translateX }] }]}> 
        <Text onLayout={onTextLayout} style={[styles.text, textStyle]} numberOfLines={1}>
          {displayText}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 28,
  },
  scroller: {
    position: 'absolute',
    left: 0,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default TopTicker;


