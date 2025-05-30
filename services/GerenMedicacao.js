import db from '../app/database';

export const iniciarMedicacao = (
    paciente_id, medicamento_id, volume_ml, data_inicio,
    data_fim_estimada, aplicado_por, observacoes, callback
) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO medicacao_aplicada (paciente_id, medicamento_id, volume_ml, 
            data_fim_estimada, aplicado_por, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [paciente_id, medicamento_id, volume_ml, data_inicio, data_fim_estimada, aplicado_por, observacoes],
            (_, result) => {
                console.log('Nova medicação registrada:', result.insertId);
                if (callback) callback(result.insertId);

                insertLog(aplicado_por, 'medicacao_aplicada', result.insertId, 'insercao', 'Nova medicação iniciada');
            },
            (_, error) => {
                console.error('Erro ao iniciar medicação:', error);
                return false;
            }
        );
    });
};

export const finalizarMedicacao = (
    aplicacao_id, data_fim_real, observacoes, funcionario_id
) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE medicacao_aplicada 
            SET data_fim_real = ?, status = 'finalizado', observacoes = ?
            WHERE aplicacao_id = ?`,
            [data_fim_real, observacoes, aplicacao_id],
            (_, result) => {
                console.log('Medicação finalizada:', aplicacao_id);

                insertLog(funcionario_id, 'medicacao_aplicada', aplicacao_id, 'atualizacao', 'Medicação finalizada');
            },
            (_, error) => {
                console.error('Erro ao finalizar medicação:', error);
                return false;
            }
        );
    });
};

export const atualizarStatusMedicacao = (
    aplicacao_id, novo_status, observacoes, funcionario_id
) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE medicacao_aplicada
            SET status = ?, observacoes = ?
            WHERE aplicacao_id = ?`,
            [novo_status, observacoes, aplicacao_id],
            (_, result) => {
                console.log(`Status atualizado para ${novo_status} (aplicação ${aplicacao_id})`);

                insertLog(funcionario_id, 'medicacao_aplicada', aplicacao_id, 'atualizacao', `Status alterado para ${novo_status}`);
            },
            (_, error) => {
                console.error('Erro ao atualizar status:', error);
                return false;
            }
        );
    });
};

