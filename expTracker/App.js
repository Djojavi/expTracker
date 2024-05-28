import React, { createContext, useState, useEffect } from 'react';
import Navigation from './navigation/Navigation';
import * as SQLite from 'expo-sqlite';
import { ActivityIndicator, View, Alert } from 'react-native';

export const DataContext = createContext();

const db = SQLite.openDatabase('example.db');

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Usuario (usuario_nombre TEXT NOT NULL, usuario_password TEXT NOT NULL, usuario_balance REAL NOT NULL, usuario_ingresos REAL NOT NULL, usuario_gastos REAL NOT NULL)',
        [],
        () => console.log('Usuario table created successfully'),
        (txObj, error) => console.log('Error creating Usuario table', error)
      );
    });

   db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS  Categorias (categoria_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_nombre TEXT NOT NULL, categoria_descripcion TEXT NOT NULL, categoria_color TEXT NOT NULL)',
        [],
        () => console.log('Categorias table created successfully'),
        (txObj, error) => console.log('Error creating Categorias table', error)
      );
    });


    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Transacciones (transaccion_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_id INTEGER, transaccion_monto REAL NOT NULL, transaccion_fecha INTEGER NOT NULL, transaccion_descripcion TEXT, transaccion_tipo TEXT NOT NULL, FOREIGN KEY (categoria_id) REFERENCES Categorias (categoria_id))',
        [],
        () => console.log('Transacciones table created successfully'),
        (txObj, error) => console.log('Error creating Transacciones table', error)
      );
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Transacciones',
        [],
        (txObj, resultSet) => {
          setTransacciones(resultSet.rows._array);
          setIsLoading(false);
        },
        (txObj, error) => {
          console.log('Error fetching data from Transacciones', error);
          setIsLoading(false)
        }
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Categorias',
        [],
        (txObj, resultSet) => {
          setCategorias(resultSet.rows._array);
          setIsLoading(false); 
        },
        (txObj, error) => {
          console.log('Error fetching data from Categorias table', error);
          setIsLoading(false); 
        }
      );
    });
  }, []);

  const deleteCategoria = (categoria_nombre) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Categorias WHERE categoria_nombre = ?',
        [categoria_nombre],
        () => {
          setCategorias(prevCategorias => prevCategorias.filter(categoria => categoria.categoria_nombre !== categoria_nombre));
        },
        (txObj, error) => {
          console.log('Error deleting data from Categorias table', error);
        }
      );
    });
  };

  const addCategoria = (nombre, descripcion, color) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Categorias (categoria_nombre, categoria_descripcion, categoria_color) VALUES (?, ?, ?)',
        [nombre, descripcion, color],
        (txObj, resultSet) => {
          setCategorias(prevCategorias => [
            ...prevCategorias,
            { categoria_id: resultSet.insertId, categoria_nombre: nombre, categoria_descripcion: descripcion, categoria_color: color }
          ]);
        },
        (txObj, error) => {
          console.log('Error inserting data into Categorias table', error);
        }
      );
    });
  };
  

  /*const addTransaccion = (monto, fecha, descripcion, tipo) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Transacciones (categoria_id, transaccion_monto, transaccion_fecha, transaccion_descripcion, transaccion_tipo) VALUES (?, ?)',
        [nombre, descripcion],
        (txObj, resultSet) => {
          setCategorias(prevCategorias => [
            ...prevCategorias,
            { categoria_id: resultSet.insertId, categoria_nombre: nombre, categoria_descripcion: descripcion }
          ]);
        },
        (txObj, error) => {
          console.log('Error inserting data into Categorias table', error);
        }
      );
    });
  };*/

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <DataContext.Provider value={{ categorias, addCategoria, deleteCategoria }}>
      <Navigation />
    </DataContext.Provider>
  );
};

export default App;
