// components/SkeletonPDFList.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function SkeletonPDFList() {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {[...Array(8)].map((_, i) => (
        <View key={i} style={styles.card}>
          <Animated.View style={[styles.icon, { opacity: animatedValue }]} />
          <View style={styles.textContainer}>
            <Animated.View style={[styles.lineShort, { opacity: animatedValue }]} />
            <Animated.View style={[styles.lineLong, { opacity: animatedValue }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, paddingTop: 0 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 11,
    marginBottom: 12,
    shadowOpacity: 0.08,
    elevation: 1,
    gap: 12,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  textContainer: { flex: 1, gap: 6 },
  lineShort: {
    width: '50%',
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  lineLong: {
    width: '90%',
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
});
