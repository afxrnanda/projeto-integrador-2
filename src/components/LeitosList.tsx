import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import db from '../database/database';

type Leito = {
  leito_id: number;
  codigo: string;
  tipo: string;
  setor: string;
  ocupado: number;
  manutencao: number;
  alerta: number;
};

export default function LeitosList() {
  const [leitos, setLeitos] = useState<Leito[]>([]);

  useEffect(() => {
    fetchLeitos();
  }, []);

  const fetchLeitos = () => {
    if (!db) return;

    db.transaction((tx: { executeSql: (arg0: string, arg1: never[], arg2: (_: any, { rows }: { rows: any; }) => void, arg3: (_: any, error: any) => boolean) => void; }) => {
      tx.executeSql(
        'SELECT * FROM leitos',
        [],
        (_, { rows }) => {
          const data: Leito[] = rows._array;
          setLeitos(data);
        },
        (_, error) => {
          console.error('Erro ao buscar leitos:', error);
          return true;
        }
      );
    });
  };

  const statusText = (leito: Leito) => {
    if (leito.alerta) return '⚠️ Alerta';
    if (leito.manutencao) return '🔧 Manutenção';
    if (leito.ocupado) return '⛔ Ocupado';
    return '✅ Livre';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Leitos</Text>
      <FlatList
        data={leitos}
        keyExtractor={item => item.leito_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.leitoBox}>
            <Text style={styles.codigo}>Leito {item.codigo}</Text>
            <Text>Status: {statusText(item)}</Text>
            <Text>Tipo: {item.tipo || 'N/A'}</Text>
            <Text>Setor: {item.setor || 'N/A'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  leitoBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  codigo: { fontWeight: 'bold', fontSize: 16 },
});
