import { useEffect } from 'react';
import { createTables } from '../database/createTables';

export const useDatabase = () => {
  useEffect(() => {
    createTables();
  }, []);
};
