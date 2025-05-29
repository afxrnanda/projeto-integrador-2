import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { createTables } from "./database";
import { getLeitos } from "@/services/leitosService";

const cores = {
  ocupado: "#f44336",
  livre: "#4caf50",
  manutencao: "#ff9800",
  alerta: "#e91e63"
};

type Leito = {
  codigo: string;
  ocupado: number;
  manutencao: number;
  alerta?: string | number;
  paciente_nome?: string;
  tempo_estimado_desocupacao?: string;
  em_medicacao?: boolean;
};

const getCorLeito = (ocupado: number, manutencao: number) => {
  if (manutencao === 1) return cores.manutencao;
  if (ocupado === 1) return cores.ocupado;
  return cores.livre;
};

export default function DashboardScreen() {
  const [leitos, setLeitos] = useState<Leito[]>([]);

  useEffect(() => {
    createTables();
    getLeitos(setLeitos);
  }, []);

  const total = leitos.length;
  const ocupados = leitos.filter(l => l.ocupado === 0).length;
  const manutencao = leitos.filter(l => l.manutencao === 0).length;
  const percentualOcupados = total ? Math.round((ocupados / total) * 100) : 0;

  return (
    <ScrollView style={{ padding: 10 }}>
      <Text style={styles.title}>Estatísticas Gerais</Text>
      <View style={styles.statsRow}>
        <StatCard label="Total Leitos" value={total} />
        <StatCard label="% Ocupados" value={`${percentualOcupados}%`} />
        <StatCard label="Manutenção" value={manutencao} />
      </View>

      <Text style={styles.title}>Leitos</Text>
      {leitos.map((leito: Leito) => (
        <View key={leito.codigo} style={[styles.card, { backgroundColor: getCorLeito(leito.ocupado, leito.manutencao) }]}>
          <Text style={styles.cardText}><Text style={styles.bold}>Leito:</Text> {leito.codigo}</Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>Status:</Text> {leito.ocupado === 0 ? "Livre" : leito.ocupado === 1 ? "Ocupado" : leito.manutencao === 1 ? "Manutenção" : leito.alerta === 1 ? "Alerta" : "Desconhecido"}
          </Text>
          {leito.paciente_nome ? (
            <Text style={styles.cardText}><Text style={styles.bold}>Paciente:</Text> {leito.paciente_nome}</Text>
          ) : null}
          {leito.tempo_estimado_desocupacao ? (
            <Text style={styles.cardText}><Text style={styles.bold}>Desocupação:</Text> {leito.tempo_estimado_desocupacao}</Text>
          ) : null}
          {leito.em_medicacao ? (
            <Text style={styles.cardText}>💉 Em medicação</Text>
          ) : null}
          {leito.alerta ? (
            <Text style={[styles.cardText, { fontStyle: "italic" }]}>⚠️ {leito.alerta}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 12
  },
  statCard: {
    backgroundColor: "#3f51b5",
    padding: 12,
    borderRadius: 10,
    margin: 4,
    flexGrow: 1,
    flexBasis: "45%"
  },
  statLabel: {
    color: "white",
    fontSize: 14
  },
  statValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  card: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6
  },
  cardText: {
    color: "white"
  },
  bold: {
    fontWeight: "bold"
  }
});
