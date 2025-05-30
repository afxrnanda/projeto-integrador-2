import React from 'react';
import { View } from 'react-native';
import Dashboard from './components/Dashboard';
import { useDatabase } from './hooks/useDatabase';
import LeitosList from './components/LeitosList';

export default function App() {
  useDatabase();

  return (
    <View>
      <LeitosList />
    </View>
  );
}
