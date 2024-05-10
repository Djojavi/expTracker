import React from 'react';
import { View, Text } from 'react-native';
import {Button} from '@rneui/themed'

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
      buttonStyle={{
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
      }}
        title="Crear categoría"
        onPress={() => navigation.navigate('Categoria')}
      />
    </View>
  );
};

export default Home;
