import { Stack } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

function CustomHeader() {
  const goToHome = () => {
    router.replace('/');
  };

  const goToVideos = () => {
    router.push('/videos');
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.headerButton} onPress={goToHome}>
        <Text style={styles.headerButtonText}>🏠 Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.headerButton} onPress={goToVideos}>
        <Text style={styles.headerButtonText}>🎥 Videos</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Inicio',
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          title: 'Detalle',
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="video"
        options={{
          title: 'Video',
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="videos"
        options={{
          title: 'Videos',
          header: () => <CustomHeader />,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 50, // Para iOS
  },
  headerButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
