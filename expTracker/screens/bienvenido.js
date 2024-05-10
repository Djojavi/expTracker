import React from 'react';
import { View, Text, TextInput } from 'react-native';
import {Button} from '@rneui/themed'
import * as SQLite from 'expo-sqlite'

const Welcome = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Bienvenido</Text>
      <TextInput value='usuario_nombre' placeholder='Ingresa tu nombre'></TextInput>
    </View>
  );
};

export default Welcome;
