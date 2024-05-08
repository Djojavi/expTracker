import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import {useState, useEffect} from 'react'

export default function App() {
  const db = SQLite.openDatabase('example.db');
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(undefined);
  const [descripcionActual, setDescripcionActual] = useState(undefined);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Categorias(categoria_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_nombre TEXT NOT NULL, categoria_descripcion TEXT NOT NULL)')
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Transacciones (transaccion_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_id INTEGER, transaccion_monto REAL NOT NULL, transaccion_fecha INTEGER NOT NULL,transaccion_descripcion TEXT, transaccion_tipo TEXT NOT NULL , FOREIGN KEY (categoria_id) REFERENCES Categorias (categoria_id)')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Categorias', null,
        (txObj, resultSet) => setCategorias(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    setIsLoading(false)
  }, []);

  if(isLoading){
    return(
      <View style={styles.container}>
        <Text>Loading database...</Text>
      </View>
    )
  }

  const deleteCategoria = (nombre) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Categorias WHERE categoria_nombre = ?',
        [nombre],
        () => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM Categorias',
              null,
              (txObj, resultSet) => setCategorias(resultSet.rows._array),
              (txObj, error) => console.log(error)
            );
          });
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  const showCategorias = () => {
    return categorias.map((categoria, index) => {
      return (
        <View key={index} style={styles.row}>
          <Button title='eliminar' onPress={() => deleteCategoria(categoria.categoria_nombre)} />
          <Text>{categoria.categoria_nombre}</Text>
          <Text>{categoria.categoria_descripcion}</Text>
        </View>
      )
    });
  };

  

  const addCategoria = () => {
    if (categoriaActual && descripcionActual) {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO Categorias (categoria_nombre, categoria_descripcion) VALUES (?, ?)', [categoriaActual, descripcionActual], () => {
          setCategoriaActual('');
          setDescripcionActual('');
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM Categorias', null,
              (txObj, resultSet) => setCategorias(resultSet.rows._array),
              (txObj, error) => console.log(error)
            );
          });
        },
        (txObj, error) => console.log(error));
      });
    } else {
      alert('Por favor ingrese una categoría y descripción');
    }
  }

  return (
    <View style={styles.container}>
      <Text>Añadir categoria</Text>
      <TextInput value={categoriaActual} placeholder='Categoria' onChangeText={setCategoriaActual} />
      <TextInput value={descripcionActual} placeholder='Descripcion' onChangeText={setDescripcionActual} />

      <Button title='Añadir Categoria' onPress={addCategoria} />
      {showCategorias()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between', 
    margin: 8
  }
});
