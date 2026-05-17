import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BasketballPlayer } from '../types/navigation';

// Función para extraer el video ID de diferentes formatos de YouTube
const extractYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]+)$/ // ID directo
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

export default function VideoScreen() {
  const { item: itemString } = useLocalSearchParams();
  const item: BasketballPlayer = JSON.parse(itemString as string);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoUrl = item.videoUrl || '';
  const videoId = extractYoutubeVideoId(videoUrl);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Video del Jugador</Text>
        <Text style={styles.subtitle}>{item.nombre}</Text>
        <Text style={styles.teamText}>{item.equipo} • {item.posicion}</Text>
      </View>

      <View style={styles.videoSection}>
        {videoId ? (
          <>
            <View style={styles.videoWrapper}>
              <YoutubePlayer
                height={220}
                play={false}
                videoId={videoId}
                onReady={() => setIsLoading(false)}
                onError={() => {
                  setError('Error al cargar el video de YouTube');
                  setIsLoading(false);
                }}
                onChangeState={() => {}}
              />
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text style={styles.loadingText}>Cargando video...</Text>
                </View>
              )}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>❌ {error}</Text>
                </View>
              )}
            </View>

            <View style={styles.videoInfo}>
              <Text style={styles.infoTitle}>Descripción</Text>
              <Text style={styles.infoText}>Reproduce el video disponible en YouTube para este jugador.</Text>
              <Text style={styles.infoText} numberOfLines={2}>URL: {videoUrl}</Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>❌ No hay video disponible para este jugador.</Text>
            {videoUrl && (
              <Text style={styles.errorDetails}>URL inválida: {videoUrl}</Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Volver al detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  teamText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  videoSection: {
    flex: 1,
    padding: 20,
  },
  videoWrapper: {
    backgroundColor: '#000000',
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 220,
    marginBottom: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  loadingText: {
    marginTop: 12,
    color: '#ffffff',
    fontSize: 14,
  },
  videoInfo: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#991b1b',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  errorDetails: {
    fontSize: 12,
    color: '#7f1d1d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    padding: 20,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});