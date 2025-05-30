import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Leito } from '../database/database';
import db from '../database/database';

export default function LeitoList() {
  const [leitos, setLeitos] = useState<Leito[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarLeitos = async () => {
    try {
      const leitosCarregados = await db.buscarLeitos();
      setLeitos(leitosCarregados);
    } catch (error) {
      console.error('Erro ao carregar leitos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarLeitos();
    setRefreshing(false);
  };

  useEffect(() => {
    carregarLeitos();
  }, []);

  const renderItem = ({ item }: { item: Leito }) => (
    <View style={styles.leitoItem}>
      <Text style={styles.leitoNumero}>Leito {item.numero}</Text>
      <Text style={styles.leitoInfo}>Setor: {item.setor}</Text>
      <Text style={styles.leitoInfo}>Tipo: {item.tipo}</Text>
      <Text style={[
        styles.leitoStatus,
        { color: item.status === 'disponivel' ? 'green' : item.status === 'ocupado' ? 'red' : 'orange' }
      ]}>
        Status: {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Leitos</Text>
      <FlatList
        data={leitos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || item.numero}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum leito cadastrado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  leitoItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leitoNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  leitoInfo: {
    fontSize: 16,
    marginBottom: 3,
  },
  leitoStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
}); 