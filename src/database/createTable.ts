import db from './database';
import { Platform } from 'react-native';

export const createTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS funcionarios (...);`,
    `CREATE TABLE IF NOT EXISTS leitos (...);`,
    `CREATE TABLE IF NOT EXISTS pacientes (...);`,
    `CREATE TABLE IF NOT EXISTS medicamentos (...);`,
    `CREATE TABLE IF NOT EXISTS medicacao_aplicada (...);`,
    `CREATE TABLE IF NOT EXISTS logs_alteracoes (...);`,
    `CREATE TABLE IF NOT EXISTS sensores (...);`,
    `CREATE TABLE IF NOT EXISTS manutencoes_programadas (...);`,
  ];

  if (Platform.OS === 'web') {
    queries.forEach(q => db.run(q));
  } else {
    db.transaction((tx: { executeSql: (arg0: string) => void; }) => {
      queries.forEach(q => tx.executeSql(q));
    });
  }
};
