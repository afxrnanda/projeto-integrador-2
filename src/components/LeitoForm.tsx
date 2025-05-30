import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db, { Leito } from '../database/database';

export default function LeitoForm() {
  const [leito, setLeito] = useState<Partial<Leito>>({
    numero: '',
    setor: '',
    status: 'disponivel',
    tipo: 'enfermaria'
  });

  const handleSubmit = async () => {
    if (!leito.numero || !leito.setor || !leito.status || !leito.tipo) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      await db.inserirLeito(leito as Leito);
      alert('Leito adicionado com sucesso!');
      // Limpar o formulário
      setLeito({
        numero: '',
        setor: '',
        status: 'disponivel',
        tipo: 'enfermaria'
      });
    } catch (error) {
      alert('Erro ao adicionar leito: ' + error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Leito</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Número do Leito"
        value={leito.numero}
        onChangeText={(text) => setLeito({ ...leito, numero: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Setor"
        value={leito.setor}
        onChangeText={(text) => setLeito({ ...leito, setor: text })}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Status:</Text>
        <Picker
          selectedValue={leito.status}
          onValueChange={(value: Leito['status']) => setLeito({ ...leito, status: value })}
          style={styles.picker}
        >
          <Picker.Item label="Disponível" value="disponivel" />
          <Picker.Item label="Ocupado" value="ocupado" />
          <Picker.Item label="Em Manutenção" value="manutencao" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Tipo:</Text>
        <Picker
          selectedValue={leito.tipo}
          onValueChange={(value: Leito['tipo']) => setLeito({ ...leito, tipo: value })}
          style={styles.picker}
        >
          <Picker.Item label="Enfermaria" value="enfermaria" />
          <Picker.Item label="UTI" value="uti" />
          <Picker.Item label="Isolamento" value="isolamento" />
        </Picker>
      </View>

      <Button title="Adicionar Leito" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
}); 