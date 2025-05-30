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
