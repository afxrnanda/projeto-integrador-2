export const insertLog = (
    funcionario_id, tabela_afetada, id_registro, tipo_acao, descricao
) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO logs_alteracoes (funcionario_id, tabela_afetada, id_registro,
            tipo_acao, descricao) 
            VALES (?, ?, ?, ?, ?)`,
            [funcionario_id, tabela_afetada, id_registro,tipo_acao, descricao],
            (_, result) => {
                console.log('Log registrado:', result.insertId);
            },
            (_, error) => {
                console.error('Erro ao registrar log:', error);
                return false;
            }
        );
    });
};

export const getLogs = (filtros = {}, callback) => {
    let query = `SELECT * FROM logs_alteracoes WHERE 1=1`;
    let params = [];

    if (filtros.funcionario_id) {
        query += ` AND funcionario_id = ?`;
        params.push(filtros.funcionario_id);
    }
    if (filtros.tabela_afetada) {
        query += `AND tabela_afetada = ?`;
        params.push(filtros.tabela_afetada);
    }
    if (filtros.id_registro) {
        query += ` AND id_registro = ?`;
        params.push(filtros.id_registro);
    }

    query += ` ORDER BY data_log DESC`;

    db.transaction(tx => {
        tx.executeSql(
            query,
            params,
            (_, { rows }) => {
                callback(rows._array);
            },
            (_, error) => {
                console.error('Erro ao buscar logs:', error);
                return false;
            }
        );
    });
};