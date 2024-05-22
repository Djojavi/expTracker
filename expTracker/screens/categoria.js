import React, { useContext, useState } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList } from 'react-native';
import { DataContext } from '../App';
import { Button } from '@rneui/base';

const Categoria = () => {
  const {categorias, addCategoria, deleteCategoria } = useContext(DataContext);
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
        <Button title='Eliminar' onPress={() => handleDeleteCategoria(title)}/>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      <FlatList
        data={categorias}
        renderItem={({ item }) => <Item title={item.categoria_nombre} descripcion={item.categoria_descripcion} />}
        keyExtractor={(item) => item.categoria_id.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Categoria"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripcion"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <Button title="Agregar Categoria"  color="#000000" onPress={handleAddCategoria} />
    </View>
  );
};

const styles = StyleSheet.create({
  input:{
    color:'black',
    padding: 10,
    borderColor:'black'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    flex: 1, 
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'right',
    marginRight: 100
  },
});

export default Categoria;
