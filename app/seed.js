import { insertLeito } from "./database";

export const seedDatabase = () => {
  insertLeito({
    codigo: "A101",
    status: "ocupado",
    paciente_nome: "João Silva",
    tempo_estimado_desocupacao: "20min",
    em_medicacao: true,
    alerta: null
  });

  insertLeito({
    codigo: "A102",
    status: "livre",
    paciente_nome: "",
    tempo_estimado_desocupacao: "",
    em_medicacao: false,
    alerta: null
  });

  insertLeito({
    codigo: "A103",
    status: "manutencao",
    paciente_nome: "",
    tempo_estimado_desocupacao: "",
    em_medicacao: false,
    alerta: "Leito em manutenção"
  });
};
