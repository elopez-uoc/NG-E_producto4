import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export function initializeNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web') {
    console.log('Notificaciones push omitidas en entorno web.');
    return null;
  }

  if (!Device.isDevice) {
    Alert.alert(
      'Notificaciones push',
      'Las notificaciones push solo funcionan en un dispositivo físico.'
    );
    return null;
  }
  const existingStatus = await Notifications.getPermissionsAsync();
  // Newer versions return a boolean 'granted' instead of a 'status' string
  let finalGranted = Boolean((existingStatus as any).granted ?? ((existingStatus as any).status === 'granted'));

  if (!finalGranted) {
    const requestStatus = await Notifications.requestPermissionsAsync();
    finalGranted = Boolean((requestStatus as any).granted ?? ((requestStatus as any).status === 'granted'));
  }

  if (!finalGranted) {
    Alert.alert(
      'Permisos denegados',
      'No se otorgaron permisos para recibir notificaciones push.'
    );
    return null;
  }

  // Se recomienda pasar el projectId obtenido de la configuración de Expo
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? 
                    Constants.easConfig?.projectId;

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });
  const token = tokenData.data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
