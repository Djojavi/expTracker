import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  start?: number;
  end?: number;  
  current?: number;
  progress: number; 
  height?: number;
  color?: string;
  backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  start,
  current,
  end,
  height = 14,
  color = '#6a5acd',
  backgroundColor = '#e0e0e0',
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View>
      <View style={[styles.container, { height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.progress,
            { backgroundColor: color, width: widthInterpolated },
          ]}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.text}>${start}</Text>
        <Text style={styles.text}>${end}</Text>
      </View>

      <Animated.View
        style={[
          styles.currentWrapper,
          {
            left: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      >
        <Text style={[styles.text]}>{current !== 0 && current !== end ? `$${current}` : ''}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:10,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progress: {
    height: '100%',
    borderRadius: 12,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  currentWrapper: {
    position: 'absolute',
    top: 25,
    transform: [{ translateX: -15 }], 
  },
  text: {
    color: '#7c7c7cff',
    fontSize:12
  },
});

export default ProgressBar;
