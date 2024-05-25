// Navigation.js
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import Categoria  from '../screens/categoria'; 
import AddTransaccion from '../screens/AddTransaccion';
import Welcome from '../screens/welcome'


const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Categoria" component={Categoria} />
        <Stack.Screen name="Añadir Transaccion" component={AddTransaccion} />
        <Stack.Screen name="Welcome" component={Welcome} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
