import React, { useContext, useState } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { DataContext } from '../App';
import { Button } from '@rneui/base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Categoria = ({navigation}) => {
  const { categorias, addCategoria, deleteCategoria } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleAddCategoria = () => {
    if (nombre && descripcion) {
      addCategoria(nombre, descripcion);
      setNombre('');
      setDescripcion('');
    }
  };

  const handleDeleteCategoria = (nombre) => {
    deleteCategoria(nombre);
  };

  const Item = ({ title, descripcion }) => (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{descripcion}</Text>
        <Button 
          title='Eliminar' 
          titleStyle={{ color: '#000000', width: 100, height: 40, marginTop: 12 }} 
          buttonStyle={{ height: 39, backgroundColor: '#FFF065' }} 
          onPress={() => handleDeleteCategoria(title)} 
        />
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('../assets/images/BgCategoria.png')} style={styles.imageBackground}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Button 
            title='Inicio' 
            buttonStyle={{ width: 100, backgroundColor: '#AB5C00', borderColor: '#000000', marginTop: 20, marginLeft: 15, marginBottom: 20, height: 40 }} 
            titleStyle={{ color: '#ffffff' }} 
            onPress={() => navigation.navigate('Welcome')} 
          />
        </View>
        
        <FlatList
          data={categorias}
          renderItem={({ item }) => <Item title={item.categoria_nombre} descripcion={item.categoria_descripcion} />}
          keyExtractor={(item) => item.categoria_id.toString()}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripcion"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <Button title="Agregar Categoria" buttonStyle={{ backgroundColor: '#AB5C00'}} onPress={handleAddCategoria} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  input: {
    color: 'black',
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    width: '85%',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    flex: 1,
    padding: 10,
  },
  description: {
    fontSize: 14,
    color: 'black',
    textAlign: 'right',
    marginRight: 10,
    padding: 10,
  },
});

export default Categoria;
