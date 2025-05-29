import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('hospital.db');

export const createTables = () => {
  db.transaction(tx => {
    // Funcionários
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS funcionarios (
        funcionario_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cargo TEXT,
        registro_profissional TEXT,
        email TEXT UNIQUE,
        senha_hash TEXT NOT NULL,
        telefone TEXT,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Leitos
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS leitos (
        leito_id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        tipo TEXT,
        setor TEXT,
        ocupado INTEGER DEFAULT 0,
        manutencao INTEGER DEFAULT 0,
        alerta INTEGER DEFAULT 0,
        data_ultima_ocupacao TEXT,
        observacoes TEXT
      );
    `);

    // Pacientes
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS pacientes (
        paciente_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data_nascimento TEXT,
        sexo TEXT,
        documento TEXT UNIQUE,
        leito_id INTEGER,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leito_id) REFERENCES leitos(leito_id)
      );
    `);

    // Medicamentos
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS medicamentos (
        medicamento_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        concentracao TEXT,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Medicação Aplicada
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS medicacao_aplicada (
        aplicacao_id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER,
        medicamento_id INTEGER,
        volume_ml REAL,
        data_inicio TEXT NOT NULL,
        data_fim_estimada TEXT,
        data_fim_real TEXT,
        aplicado_por INTEGER,
        status TEXT DEFAULT 'em andamento',
        observacoes TEXT,
        FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
        FOREIGN KEY (medicamento_id) REFERENCES medicamentos(medicamento_id),
        FOREIGN KEY (aplicado_por) REFERENCES funcionarios(funcionario_id)
      );
    `);

    // Logs de Alterações
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS logs_alteracoes (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        funcionario_id INTEGER,
        tabela_afetada TEXT,
        id_registro INTEGER,
        tipo_acao TEXT,
        descricao TEXT,
        data_log TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (funcionario_id) REFERENCES funcionarios(funcionario_id)
      );
    `);

    // Sensores IoT
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS sensores (
        sensor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo_serial TEXT UNIQUE NOT NULL,
        tipo TEXT,
        status TEXT DEFAULT 'ativo',
        bateria_percentual INTEGER,
        ultima_comunicacao TEXT,
        leito_id INTEGER,
        instalado_em TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leito_id) REFERENCES leitos(leito_id)
      );
    `);

    // Manutenções Programadas
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS manutencoes_programadas (
        manutencao_id INTEGER PRIMARY KEY AUTOINCREMENT,
        leito_id INTEGER,
        motivo TEXT,
        observacoes TEXT,
        agendada_para TEXT NOT NULL,
        realizada_em TEXT,
        status TEXT DEFAULT 'pendente',
        registrada_por INTEGER,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leito_id) REFERENCES leitos(leito_id),
        FOREIGN KEY (registrada_por) REFERENCES funcionarios(funcionario_id)
      );
    `);
  }, error => {
    console.error('Erro ao criar as tabelas:', error);
  }, () => {
    console.log('Tabelas criadas com sucesso');
  });
};

export default db;
