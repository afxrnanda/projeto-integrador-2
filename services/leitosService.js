import db from '../src/database/database';

export const getLeitos = (callback) => {
  db.transaction(tx => {
    tx.executeSql("SELECT * FROM leitos;", [], (_, { rows }) => {
      callback(rows._array);
    });
  });
}

export const insertLeito = (leito, p0, p1, p2, p3, p4, p5) => {
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