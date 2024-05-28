// Navigation.js
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import Categoria  from '../screens/categoria'; 
import Welcome from '../screens/welcome';
import Transacciones from '../screens/transacciones';


const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Categoria" component={Categoria} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Transacciones" component={Transacciones}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
