import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

export function ShimmerText() {
  const letters = ['L', 'y', 'r', 'i', 'q'];
  const animations = letters.map(() => useSharedValue(0));

  useEffect(() => {
    const startAnimations = () => {
      animations.forEach((anim, index) => {
        anim.value = withDelay(
          index * 200,
          withRepeat(
            withSequence(
              withTiming(1, { duration: 800 }),
              withTiming(0, { duration: 800 })
            ),
            -1,
            false
          )
        );
      });
    };

    startAnimations();
  }, []);

  return (
    <View className="flex-row">
      {letters.map((letter, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const opacity = interpolate(
            animations[index].value,
            [0, 0.5, 1],
            [0.3, 1, 0.3]
          );
          
          const scale = interpolate(
            animations[index].value,
            [0, 0.5, 1],
            [1, 1.05, 1]
          );

          const rotateZ = interpolate(
            animations[index].value,
            [0, 0.5, 1],
            [0, 5, 0]
          );

          return {
            opacity,
            transform: [
              { scale },
              { rotateZ: `${rotateZ}deg` }
            ],
          };
        });

        return (
          <AnimatedText
            key={index}
            style={[
              {
                fontSize: 80,
                fontWeight: '300',
                color: '#374151',
                textAlign: 'center',
              },
              animatedStyle,
            ]}
          >
            {letter}
          </AnimatedText>
        );
      })}
    </View>
  );
}