import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('hospital.db');

export default db;
