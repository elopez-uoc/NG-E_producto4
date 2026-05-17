import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { initializeNotifications, registerForPushNotificationsAsync } from './notifications';

function CustomHeader() {
  const goToHome = () => {
    router.replace('/');
  };

  const goToVideos = () => {
    router.push('/videos');
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerButton} onPress={goToHome}>
          <Text style={styles.headerButtonText}>🏠 Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton} onPress={goToVideos}>
          <Text style={styles.headerButtonText}>🎥 Videos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const setupNotifications = async () => {
      initializeNotifications();

      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          console.log('Push token registrado:', token);
          const db = getFirestore();
          // Usamos setDoc con el token como ID para evitar duplicados en la base de datos
          await setDoc(doc(db, 'fcm_tokens', token), {
            token,
            createdAt: serverTimestamp(),
            deviceId: Device.deviceName || 'unknown',
          }, { merge: true });
        }
      } catch (error: unknown) {
        console.error('Error al registrar notificaciones push:', error);
      }
    };

    setupNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      const playerId = data?.playerId ? String(data.playerId) : undefined;

      // Navegar al detalle del jugador
      if (playerId) {
        router.push({
          pathname: '/detail',
          params: { playerId }
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
  headerWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    // Ajuste para empujar el header debajo de la barra de estado (Notch/Status Bar)
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 44,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
