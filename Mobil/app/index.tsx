import { router } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../firebaseConfig';
import { BasketballPlayer } from '../types/navigation';

export default function Home() {
  const [items, setItems] = useState<BasketballPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      // Cargar colección de jugadores ordenados por puntos por partido descendente
      const itemsQuery = query(collection(db, 'jugadores'), orderBy('pPP', 'desc'));
      const snapshot = await getDocs(itemsQuery);

      const itemsData: BasketballPlayer[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<BasketballPlayer, 'id'>,
      }));

      setItems(itemsData);
      setLoading(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', `Error al cargar jugadores: ${message}`);
      setLoading(false);
    }
  };

  const handleItemPress = (item: BasketballPlayer) => {
    router.push({
      pathname: '/detail',
      params: { item: JSON.stringify(item) }
    });
  };

  const renderItem = ({ item }: { item: BasketballPlayer }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
    >
      <Text style={styles.itemTitle}>{item.nombre}</Text>
      <View style={styles.playerInfo}>
        <Text style={styles.teamText}>🏀 {item.equipo}</Text>
        <Text style={styles.positionText}>{item.posicion}</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.statText}>📊 {item.pPP} PPP</Text>
        <Text style={styles.statText}>🎯 {item.porcentajeTiros}%</Text>
        <Text style={styles.statText}>📏 {item.altura}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Cargando jugadores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay jugadores registrados</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  teamText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  positionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});