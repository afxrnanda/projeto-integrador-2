import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

interface Leito {
  id?: number;
  numero: string;
  setor: string;
  status: 'disponivel' | 'ocupado' | 'manutencao';
  tipo: 'enfermaria' | 'uti' | 'isolamento';
}

interface Database {
  transaction: (callback: (tx: any) => void) => void;
  exec: (sql: string) => void;
  run: (sql: string, params?: any[]) => void;
  inserirLeito: (leito: Leito) => Promise<void>;
  buscarLeitos: () => Promise<Leito[]>;
}

let db: Database = {
  transaction: () => {
    throw new Error('Database not initialized');
  },
  exec: () => {
    throw new Error('Database not initialized');
  },
  run: () => {
    throw new Error('Database not initialized');
  },
  inserirLeito: async () => {
    throw new Error('Database not initialized');
  },
  buscarLeitos: async () => {
    throw new Error('Database not initialized');
  }
};

if (Platform.OS === 'web') {
  // Web: usando localStorage
  db = {
    transaction: (callback) => {
      callback({
        executeSql: (sql: string, params: any[] = [], success: any, error: any) => {
          try {
            // Não implementado para web
            success && success();
          } catch (e) {
            error && error(e);
          }
        }
      });
    },
    exec: () => {
      // Não implementado para web
    },
    run: () => {
      // Não implementado para web
    },
    inserirLeito: async (leito: Leito) => {
      try {
        // Buscar leitos existentes
        const leitosJson = localStorage.getItem('leitos');
        const leitos: Leito[] = leitosJson ? JSON.parse(leitosJson) : [];
        
        // Gerar novo ID
        const novoId = leitos.length > 0 ? Math.max(...leitos.map(l => l.id || 0)) + 1 : 1;
        
        // Adicionar novo leito
        const novoLeito = { ...leito, id: novoId };
        leitos.push(novoLeito);
        
        // Salvar no localStorage
        localStorage.setItem('leitos', JSON.stringify(leitos));
      } catch (error) {
        console.error('Erro ao inserir leito:', error);
        throw error;
      }
    },
    buscarLeitos: async () => {
      try {
        const leitosJson = localStorage.getItem('leitos');
        return leitosJson ? JSON.parse(leitosJson) : [];
      } catch (error) {
        console.error('Erro ao buscar leitos:', error);
        return [];
      }
    }
  };
} else {
  // Mobile: usando expo-sqlite
  const sqliteDb = SQLite.openDatabaseSync('hospital.db');
  db = {
    transaction: (callback) => {
      sqliteDb.execAsync('BEGIN TRANSACTION;');
      try {
        callback({
          executeSql: (sql: string, params: any[] = [], success: any, error: any) => {
            try {
              sqliteDb.execAsync(sql);
              success && success();
            } catch (e) {
              error && error(e);
            }
          }
        });
        sqliteDb.execAsync('COMMIT;');
      } catch (e) {
        sqliteDb.execAsync('ROLLBACK;');
        throw e;
      }
    },
    exec: (sql) => {
      sqliteDb.execAsync(sql);
    },
    run: (sql, params = []) => {
      sqliteDb.execAsync(sql);
    },
    inserirLeito: async (leito: Leito) => {
      const sql = `
        CREATE TABLE IF NOT EXISTS leitos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          numero TEXT NOT NULL,
          setor TEXT NOT NULL,
          status TEXT NOT NULL,
          tipo TEXT NOT NULL
        );
      `;
      await sqliteDb.execAsync(sql);

      const insertSql = `
        INSERT INTO leitos (numero, setor, status, tipo)
        VALUES ('${leito.numero}', '${leito.setor}', '${leito.status}', '${leito.tipo}');
      `;
      await sqliteDb.execAsync(insertSql);
    },
    buscarLeitos: async () => {
      const sql = `
        SELECT * FROM leitos;
      `;
      const result = await sqliteDb.execAsync(sql);
      
      // Verifica se o resultado é um array e tem elementos
      if (Array.isArray(result) && result.length > 0) {
        return result.map((row: any) => ({
          id: row.id,
          numero: row.numero,
          setor: row.setor,
          status: row.status,
          tipo: row.tipo
        }));
      }
      
      return [];
    }
  };
}

export default db;
export type { Leito };
