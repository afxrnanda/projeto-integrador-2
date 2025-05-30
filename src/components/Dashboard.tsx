import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Leito = {
  codigo: string;
  status: 'livre' | 'ocupado' | 'manutencao' | 'alerta';
  paciente?: string;
  tempoEstimado?: string;
};

const dadosExemplo: Leito[] = [
  { codigo: 'A1', status: 'ocupado', paciente: 'João', tempoEstimado: '20 min' },
  { codigo: 'A2', status: 'livre' },
  { codigo: 'A3', status: 'manutencao' },
  { codigo: 'A4', status: 'alerta', paciente: 'Maria' },
];

const cores = {
  livre: '#4CAF50',
  ocupado: '#FF5722',
  manutencao: '#9E9E9E',
  alerta: '#FFC107',
};

export default function Dashboard() {
  return (
    <View>
      <Text style={styles.titulo}>Dashboard de Leitos</Text>
      {dadosExemplo.map((leito, i) => (
        <View key={i} style={[styles.leito, { backgroundColor: cores[leito.status] }]}>
          <Text>Leito {leito.codigo}</Text>
          <Text>Status: {leito.status}</Text>
          {leito.paciente && <Text>Paciente: {leito.paciente}</Text>}
          {leito.tempoEstimado && <Text>Desocupa em: {leito.tempoEstimado}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  leito: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
});
