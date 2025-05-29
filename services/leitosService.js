import db from '../app/database';

export const getLeitos = (callback) => {
  db.transaction(tx => {
    tx.executeSql("SELECT * FROM leitos;", [], (_, { rows }) => {
      callback(rows._array);
    });
  });
};

export const insertLeito = (leito) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO leitos (codigo, tipo, setor)
      VALUES (?, ?, ?);`,
      [
        leito.codigo,
        leito.tipo,
        leito.setor
      ]
    );
  });
};