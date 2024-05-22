// Navigation.js
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import Categoria from '../screens/categoria'; 


const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Categoria">
        <Stack.Screen name="Categoria" component={Categoria} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
