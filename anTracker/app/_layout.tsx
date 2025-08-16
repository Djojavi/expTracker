import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useDatabase } from '../hooks/useDatabase';

function DatabaseInitializer() {
  const { setupDatabase } = useDatabase();

  useEffect(() => {
    setupDatabase();
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName='antracker.db'>
      <DatabaseInitializer />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}  />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SQLiteProvider>
  );
}