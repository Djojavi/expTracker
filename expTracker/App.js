import React, { createContext, useState, useEffect } from 'react';
import Navigation from './navigation/Navigation';
import * as SQLite from 'expo-sqlite';
import { ActivityIndicator, View, Alert } from 'react-native';

export const DataContext = createContext(); //Para exportar los arreglos y funciones

//Archivo que funciona como un backend

const db = SQLite.openDatabase('example.db');


const App = () => {
  const [isLoading, setIsLoading] = useState(true); //Imagen del activity mientras se carga
  const [categorias, setCategorias] = useState([]); //array de objetos de categorias
  const [transacciones, setTransacciones] = useState([]); //array de objetos de transacciones
  const [usuario, setUsuario] = useState([]); //Array para ir guardando los valores del Usuario
  const [transaccion, setTransaccion] = useState([]);

  useEffect(() => { //A ejecutarse al abrir la app
    
    db.transaction(tx => { //Creación de la tabla usuario
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Usuario (usuario_nombre TEXT NOT NULL, usuario_password TEXT NOT NULL, usuario_balance REAL NOT NULL, usuario_ingresos REAL NOT NULL, usuario_gastos REAL NOT NULL)',
        [],
        () => console.log('Usuario table created successfully'),
        (txObj, error) => console.log('Error creating Usuario table', error)
      );
    });


   db.transaction(tx => { //Creación de la tabla categorías
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS  Categorias (categoria_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_nombre TEXT NOT NULL, categoria_descripcion TEXT NOT NULL, categoria_color TEXT NOT NULL)',
        [],
        () => console.log('Categorias table created successfully'),
        (txObj, error) => console.log('Error creating Categorias table', error)
      );
    });


    db.transaction(tx => { //Creación de la tabla transacciones
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Transacciones (transaccion_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_id INTEGER, transaccion_nombre TEXT NOT NULL,transaccion_monto REAL NOT NULL, transaccion_anio INTEGER, transaccion_mes INTEGER, transaccion_dia INTEGER, transaccion_hora TEXT, transaccion_descripcion TEXT, transaccion_tipo TEXT NOT NULL, FOREIGN KEY (categoria_id) REFERENCES Categorias (categoria_id))',
        [],
        () => console.log('Transacciones table created successfully'),
        (txObj, error) => console.log('Error creating Transacciones table', error)
      );
    });  
    

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Transacciones', //Llena el arreglo transacciones con los objetos de la base de datos
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

    db.transaction(tx =>{
      tx.executeSql(
        'SELECT * FROM Usuario',
        [],
        (txObj, resultSet) => {
          setUsuario(resultSet.rows._array);
          setIsLoading(false);
        },
        (txObj, error) => {
          console.log('Error fetching data from Usuario', error);
          setIsLoading(false); 
        }
      );
    });

    db.transaction(tx => { //Llena el arreglo categorias con los objetos de la base de datos
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

  const deleteCategoria = (categoria_nombre) => { //Elimina una categoría en base a su nombre
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Categorias WHERE categoria_nombre = ?',
        [categoria_nombre],
        () => {
          setCategorias(prevCategorias => prevCategorias.filter(categoria => categoria.categoria_nombre !== categoria_nombre)); //Llena el arreglo categorias con todo menos la categoría borrada
        },
        (txObj, error) => {
          console.log('Error deleting data from Categorias table', error);
        }
      );
    });
  };

  const addCategoria = (nombre, descripcion, color) => {
    db.transaction(tx => { //añade una nueva categoría
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


  const updateCategoria = (id, nombre, descripcion, color) => {
    db.transaction(tx => { // actualiza una categoría existente
      tx.executeSql(
        'UPDATE Categorias SET categoria_nombre = ?, categoria_descripcion = ?, categoria_color = ? WHERE categoria_id = ?',
        [nombre, descripcion, color, id],
        (txObj, resultSet) => {
          setCategorias(prevCategorias =>
            prevCategorias.map(categoria =>
              categoria.categoria_id === id
                ? { ...categoria, categoria_nombre: nombre, categoria_descripcion: descripcion, categoria_color: color }
                : categoria
            )
          );
        },
        (txObj, error) => {
          console.log('Error updating Categorias table', error);
        }
      );
    });
  };
  
  

  const addTransaccion = (categoria, nombre, monto, anio, mes, dia, hora, descripcion, tipo) => {
  //Añade una nueva transacción
    db.transaction(tx => {
      try {
        tx.executeSql(
          'INSERT INTO Transacciones (categoria_id, transaccion_nombre, transaccion_monto, transaccion_anio, transaccion_mes, transaccion_dia, transaccion_hora, transaccion_descripcion, transaccion_tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [categoria, nombre, parseFloat(monto), anio, mes, dia, hora, descripcion, tipo],
          (txObj, resultSet) => {
            const newTransaccion = {
              transaccion_id: resultSet.insertId,
              categoria_id: categoria,
              transaccion_nombre: nombre,
              transaccion_monto: parseFloat(monto),
              transaccion_anio: anio,
              transaccion_mes: mes,
              transaccion_dia: dia,
              transaccion_hora: hora,
              transaccion_descripcion: descripcion,
              transaccion_tipo: tipo
            };
            setTransacciones(prevTransacciones => [
              ...prevTransacciones,
              newTransaccion
            ]);
            console.log('Updated transacciones state:', newTransaccion);
          },
          (txObj, error) => {
            console.error('Error inserting data into Transacciones table', error);
          }
        );
      } catch (error) {
        console.error('Error executing transaction:', error);
      }
      console.log('Transaction ended');
    }, 
    (error) => {
      console.error('Transaction error:', error);
    }, 
    () => {
      console.log('Transaction success');
    });
  };

  const getTransaccion = (id) => {
    // Obtener una transacción guardada
    db.transaction(tx => {
      try {
        tx.executeSql(
          'SELECT * FROM Transacciones WHERE transaccion_id = ?',
          [id], 
          (txObj, resultSet) => {
            console.log(resultSet.rows._array)
            setTransaccion(resultSet.rows._array);
            setIsLoading(false); 
          },
          (txObj, error) => {
            console.log('Error fetching data from Transaccion table', error);
            setIsLoading(false); 
          }
        );
      } catch (error) {
        console.error('Transaction error:', error);
        setIsLoading(false);
      }
    });
  };
  
  
  if (isLoading) {
    return ( //Cargandose si hay algún error
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <DataContext.Provider value={{ categorias, addCategoria, deleteCategoria, transacciones, addTransaccion, usuario, transaccion, updateCategoria }}>
      <Navigation />
    </DataContext.Provider>
  );
};

export default App;
