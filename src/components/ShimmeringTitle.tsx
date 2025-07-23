import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

export function ShimmeringTitle() {
  const shimmer = useSharedValue(0);
  const float = useSharedValue(0);

  useEffect(() => {
    // Shimmer animation
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Floating animation
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sine) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sine) })
      ),
      -1,
      false
    );
  }, []);

  const letters = ['L', 'Y', 'R', 'I', 'Q'];

  return (
    <View className="flex-row items-center justify-center">
      {letters.map((letter, index) => {
        const letterShimmer = useSharedValue(0);
        
        useEffect(() => {
          letterShimmer.value = withRepeat(
            withSequence(
              withTiming(0, { duration: index * 200 }),
              withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
              withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
              withTiming(0, { duration: (letters.length - index) * 200 })
            ),
            -1,
            false
          );
        }, [index]);

        const animatedStyle = useAnimatedStyle(() => {
          const shimmerOpacity = interpolate(
            letterShimmer.value,
            [0, 0.5, 1],
            [0.7, 1, 0.7]
          );

          const floatY = interpolate(
            float.value,
            [0, 1],
            [0, -8]
          );

          const scale = interpolate(
            letterShimmer.value,
            [0, 0.5, 1],
            [1, 1.05, 1]
          );

          return {
            opacity: shimmerOpacity,
            transform: [
              { translateY: floatY + Math.sin(index * 0.5) * 2 },
              { scale: scale }
            ],
          };
        });

        const textShadowStyle = useAnimatedStyle(() => {
          const shadowIntensity = interpolate(
            shimmer.value,
            [0, 0.5, 1],
            [0.3, 0.8, 0.3]
          );

          return {
            textShadowColor: `rgba(255, 255, 255, ${shadowIntensity})`,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 20,
          };
        });

        return (
          <AnimatedText
            key={index}
            style={[
              animatedStyle,
              textShadowStyle,
              {
                fontSize: 80,
                fontWeight: '300',
                color: '#C0C0C0', // Silver base color
                letterSpacing: 8,
                marginHorizontal: 4,
                textAlign: 'center',
                // Metallic gradient effect simulation
                textShadowColor: 'rgba(255, 255, 255, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              }
            ]}
          >
            {letter}
          </AnimatedText>
        );
      })}
    </View>
  );
}