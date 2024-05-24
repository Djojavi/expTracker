// Navigation.js
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import Categoria  from '../screens/categoria'; 
import AddTransaccion from '../screens/AddTransaccion'


const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Categoria">
        <Stack.Screen name="Categoria" component={Categoria} />
        <Stack.Screen name="Añadir Transaccion" component={AddTransaccion} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
