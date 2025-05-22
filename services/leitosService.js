import db from '../app/database';

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS leitos (
        leito_id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        tipo TEXT,
        setor TEXT,
        ocupado INTEGER DEFAULT 0,
        manutencao INTEGER DEFAULT 0,
        data_ultima_ocupacao TEXT,
        observacoes TEXT
      );`
    );
  });
};

export const insertLeito = (codigo, tipo, setor, ocupado, manutencao, data_ultima_ocupacao, observacoes) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO leitos (codigo, tipo, setor, ocupado, manutencao, data_ultima_ocupacao, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [codigo, tipo, setor, ocupado ? 1 : 0, manutencao ? 1 : 0, data_ultima_ocupacao, observacoes],
        (_, result) => console.log('Leito inserido com ID:', result.insertId),
        (_, error) => {
          console.error('Erro ao inserir leito:', error);
          return false;
        }
      );
    });
  };
  
  export const getLeitos = (callback) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM leitos`,
        [],
        (_, { rows }) => {
          callback(rows._array); // Retorna array de leitos
        },
        (_, error) => {
          console.error('Erro ao buscar leitos:', error);
          return false;
        }
      );
    });
  };
  