import React from 'react';
import { View, Text, Button } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Crear categoría"
        onPress={() => navigation.navigate('Categoria')}
      />
    </View>
  );
};

export default Home;
