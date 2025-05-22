import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { createTable, insertLeito, getLeitos } from '../services/leitosService';

interface Leito {
  leito_id: number;
  codigo: string;
  tipo: string;
  ocupado: boolean;
}

export default function App() {
  const [leitos, setLeitos] = useState<Leito[]>([]);

  useEffect(() => {
    createTable();

    // Inserir exemplo só uma vez
    insertLeito("L101", "UTI", "Setor A", false, false, "2025-05-22T10:00:00", "Primeiro leito");

    getLeitos(setLeitos);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Lista de Leitos</Text>
      <FlatList
        data={leitos}
        keyExtractor={item => item.leito_id.toString()}
        renderItem={({ item }) => (
          <Text>{item.codigo} - {item.tipo} - {item.ocupado ? 'Ocupado' : 'Livre'}</Text>
        )}
      />
    </View>
  );
}
