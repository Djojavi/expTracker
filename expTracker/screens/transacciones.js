import React, { useContext, useRef, useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback, Pressable, Alert } from 'react-native';
import { DataContext } from '../App';
import { Button } from '@rneui/base';
import RBSheet from 'react-native-raw-bottom-sheet';

//Pantalla con las transacciones

const RadioButton = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={[{
        height: 22,
        width: 22,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#A37366',
        alignItems: 'center',
        justifyContent: 'center',
      }, props.style]}>
        {
          props.selected ?
            <View style={{
              height: 14,
              width: 14,
              borderRadius: 10,
              backgroundColor: '#A37366',
            }} />
            : null
        }
      </View>
    </TouchableWithoutFeedback>
  );
};

const Transacciones = ({ navigation }) => {
  const { transacciones, addTransaccion, categorias, transaccion, deleteTransaccion, updateTransaccion } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');
  const [balance, setBalance] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [transaccionesFiltradas, setTransaccionesFiltradas] = useState([]);
  const [idActualizar, setIdActualizar] = useState(0);


  const refRBSheet = useRef();
  const updateRefRBSheet = useRef();

  useEffect(() => {
    calcularBalance(transacciones);
    setTransaccionesFiltradas(transacciones);
  }, [transacciones]);

  useEffect(() => {
    if (transaccion.length > 0) {
      const { transaccion_nombre, transaccion_descripcion, transaccion_monto, transaccion_tipo, categoria_id } = transaccion[0];
      setNombre(transaccion_nombre);
      setDescripcion(transaccion_descripcion);
      setMonto(transaccion_monto.toString());
      setTipo(transaccion_tipo);
      setCategoria(categoria_id);
    }
  }, [transaccion]);

  useEffect(() => {
    if (idActualizar !== 0) {
      getTransaccion(idActualizar);
    }
  }, [idActualizar]);

  const handleLongPress = (id) => {
    setIdActualizar(id);  
    getTransaccion(id);   
    updateRefRBSheet.current.open(); 
};
  

  const setToNull = () => {
      setNombre(null);
      setDescripcion(null);
      setMonto(null);
      setTipo(null);
      setCategoria(null);
  }

  const getTransaccion = (id) => {
    const selectedTransaccion = transacciones.find(item => item.transaccion_id === id);
    if (selectedTransaccion) {
      setNombre(selectedTransaccion.transaccion_nombre);
      setDescripcion(selectedTransaccion.transaccion_descripcion);
      setMonto(selectedTransaccion.transaccion_monto.toString());
      setTipo(selectedTransaccion.transaccion_tipo);
      setCategoria(selectedTransaccion.categoria_id);
      
    } else{
      console.log('aaaa')
    }
  };

  const calcularBalance = (arrayTransacciones) => {
    let nuevoBalance = 0, nuevoIngresos = 0, nuevoGastos = 0;
  
    arrayTransacciones.forEach(item => {
      const monto = parseFloat(item.transaccion_monto); // Convertir a número
      if (!isNaN(monto)) { // Asegúrate de que sea un número válido
        if (item.transaccion_tipo === 'Ingreso') {
          nuevoBalance += monto;
          nuevoIngresos += monto;
        } else if (item.transaccion_tipo === 'Gasto') {
          nuevoBalance -= monto;
          nuevoGastos -= monto;
        }
      }
    });
  
    if (nuevoGastos !== 0) {
      nuevoGastos = nuevoGastos * -1;
    }
  
    setBalance(nuevoBalance);
    setIngresos(nuevoIngresos);
    setGastos(nuevoGastos);
  };
  

  const handleUpdateTransaccion = (id) => {
    console.log('Current state values:', { nombre, descripcion, monto, tipo, categoria });
    if (nombre && descripcion && monto > 0 && tipo && categoria) {
      const mes = new Date().getMonth() + 1;
      const anio = new Date().getFullYear();
      const dia = new Date().getDate();
      let hora = new Date().getHours();
      let minutos = new Date().getMinutes();
      if(minutos <10){
        minutos = "0"+minutos;
      }
      if(hora < 10){
        hora = "0"+hora;
      }
      const horaActual = hora + ":" + minutos;
      updateTransaccion(id, nombre, descripcion,categoria, tipo, monto);
      setNombre('');
      setDescripcion('');
      setMonto('');
      setFecha('');
      setCategoria('');
      setTipo('');
      refRBSheet.current.close();
    } else {
      Alert.alert('Error', 'El monto debe ser mayor a 0!', [
      {text: 'Entendido', onPress: () => console.log('OK Pressed')},
    ]);
    }
  }

  const handleDeleteTransaccion = (id) =>{
    Alert.alert('¿Está seguro de eliminar la transacción?', 'Esta acción será permanente', [
      {  
        text: 'Cancelar',  
        onPress: () => updateRefRBSheet.current.close(),  
        style: 'cancel',  
    },  
      {text: 'Eliminar', onPress: () => [deleteTransaccion(id), updateRefRBSheet.current.close()]},
    ]);
  }

  const handleAddTransaccion = () => {
    console.log('handleAddTransaccion called');
    console.log('Current state values:', { nombre, descripcion, monto, tipo, categoria });
    if (nombre && descripcion && monto > 0 && tipo && categoria) {
      const mes = new Date().getMonth() + 1;
      const anio = new Date().getFullYear();
      const dia = new Date().getDate();
      let hora = new Date().getHours();
      let minutos = new Date().getMinutes();
      if(minutos <10){
        minutos = "0"+minutos;
      }
      if(hora < 10){
        hora = "0"+hora;
      }
      const horaActual = hora + ":" + minutos;
      addTransaccion(categoria, nombre, monto, anio, mes, dia, horaActual, descripcion, tipo);
      setNombre('');
      setDescripcion('');
      setMonto('');
      setFecha('');
      setCategoria('');
      setTipo('');
      refRBSheet.current.close();
    } else {
      Alert.alert('Error', 'El monto debe ser mayor a 0!', [
      {text: 'Entendido', onPress: () => console.log('OK Pressed')},
    ]);
    }
  };

  const ordenarCategorias = (array) => {
    return array.sort((a, b) => a.categoria_nombre.localeCompare(b.categoria_nombre));
  }
  const categoriasOrdenadas = ordenarCategorias(categorias);

  const getCategoriaNombre = (array, idCategoria) => {
    const filtrado = array.find(item => item.categoria_id === idCategoria);
    return filtrado ? filtrado.categoria_nombre : '';
  }

  const filterByDays = (days) => {
    const now = new Date();
  
    const newTransacciones = transacciones.filter(item => {
      const transaccionFecha = new Date(item.transaccion_anio, item.transaccion_mes - 1, item.transaccion_dia); // Crear objeto Date usando anio, mes y dia
      const diffTime = Math.abs(now - transaccionFecha);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return  diffDays <= days;
    });
    
    setTransaccionesFiltradas(newTransacciones);
    calcularBalance(newTransacciones);
  };

  const Item = ({ nombre, descripcion, monto, anio, mes, dia, hora, categoriaNombre, tipo }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View style={styles.containerLeft}>
          <Text style={styles.title}>{nombre}</Text>
          <Text style={styles.description}>{descripcion}</Text>
          <Text style={styles.description}>{anio}-{mes}-{dia} {hora} </Text>
        </View>
        <View style={styles.containerRight}>
          <Text style={styles.category}>{categoriaNombre}</Text>
          {monto ? (
            <Text style={tipo === 'Ingreso' ? styles.montoIngreso : tipo === 'Gasto' ? styles.montoGasto : styles.montoDefault}>
              {tipo === 'Ingreso' ? `+$${parseFloat(monto).toFixed(2)}` : tipo === 'Gasto' ? `-$${parseFloat(monto).toFixed(2)}` : `$${parseFloat(monto).toFixed(2)}`}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <Button
          icon={<Image source={require('../assets/icons/casa.png')} style={{ width: 25, height: 25 }} />}
          buttonStyle={styles.homeButton}
          onPress={() => navigation.navigate('Welcome')}
        />
        <Button
          icon={<Image source={require('../assets/icons/categoria.png')} style={{ width: 25, height: 25 }} />}
          buttonStyle={[styles.homeButton, { marginRight: 110 }]}
          onPress={() => navigation.navigate('Categoria')}
        />
        <Image source={require('../assets/images/Logo.png')} style={{ width: 152, height: 40, marginTop: 29 }} />
      </View>

      <RBSheet
        ref={refRBSheet}
        onOpen={() => setToNull()}
        height={600}
        openDuration={300}
        customStyles={{
          container: {
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >

        <Text style={styles.addTransaccion}>Añadir Transacción</Text>
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButtonRow}>
            <RadioButton
              selected={tipo === 'Ingreso'}
              onPress={() => setTipo('Ingreso')}
              style={styles.radioButton}
            />
            <Text style={styles.radioText}>Ingreso</Text>
          </View>
          <View style={styles.radioButtonRow}>
            <RadioButton
              selected={tipo === 'Gasto'}
              onPress={() => setTipo('Gasto')}
              style={styles.radioButton}
            />
            <Text style={styles.radioText}>Gasto</Text>
          </View>
        </View>
        <View style={styles.nombreContainer}>
          <TextInput
            style={styles.inputNombre}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <Text style={styles.signoDolar}>$</Text>
          <TextInput
            style={styles.inputMonto}
            placeholder='Monto'
            keyboardType='numeric'
            value={monto}
            onChangeText={setMonto}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <Text style={styles.catText}>Selecciona una categoría!</Text>
        <FlatList
          data={categoriasOrdenadas}
          removeClippedSubviews={true}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => setCategoria(item.categoria_id)}>
              <View style={[styles.item, categoria === item.categoria_id && styles.selectedItem]}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.circularTextView, { backgroundColor: item.categoria_color }]} />
                  <Text style={styles.itemText}>{item.categoria_nombre}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <Button
          buttonStyle={styles.addNombreButton}
          onPress={handleAddTransaccion}
          titleStyle={{ color: '#fff' }}
          title="Listo!"
        />
      </RBSheet>

      <RBSheet
        ref={updateRefRBSheet}
        height={600}
        openDuration={200}
        customStyles={{
          container: {
            padding:  15,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >
        <Text style={styles.addTransaccion}>Actualizar Transacción</Text>
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButtonRow}>
            <RadioButton
              selected={tipo === 'Ingreso'}
              onPress={() => setTipo('Ingreso')}
              style={styles.radioButton}
            />
            <Text style={styles.radioText}>Ingreso</Text>
          </View>
          <View style={styles.radioButtonRow}>
            <RadioButton
              selected={tipo === 'Gasto'}
              onPress={() => setTipo('Gasto')}
              style={styles.radioButton}
            />
            <Text style={styles.radioText}>Gasto</Text>
          </View>
        </View>
        <View style={styles.nombreContainer}>
          <TextInput
            style={styles.inputNombre}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <Text style={styles.signoDolar}>$</Text>
          <TextInput
            style={styles.inputMonto}
            placeholder='Monto'
            keyboardType='numeric'
            value={monto}
            onChangeText={setMonto}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <Text style={styles.catText}>Selecciona una categoría!</Text>
        <FlatList
          data={categoriasOrdenadas}
          removeClippedSubviews={true}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => setCategoria(item.categoria_id)}>
              <View style={[styles.item, categoria === item.categoria_id && styles.selectedItem]}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.circularTextView, { backgroundColor: item.categoria_color }]} />
                  <Text style={styles.itemText}>{item.categoria_nombre}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <Button
          buttonStyle={styles.addNombreButton}
          onPress={() => handleUpdateTransaccion(idActualizar)}
          titleStyle={{ color: '#fff' }}
          title="Listo!"
        />

<Button
         title="    Eliminar Categoría  "
          icon={
            <Image
              source={require('../assets/icons/delete.png')}
              style={{ width: 18, height: 18, opacity: 0.8 }}
            />
          }
          buttonStyle={[styles.deleteButton , { marginVertical: 8 }]}
          titleStyle={{ color: '#fff' }}
          onPress={() => handleDeleteTransaccion(idActualizar)}
        />
      </RBSheet>

      <View style={{flexDirection:'row', gap: 5, justifyContent:'center', paddingHorizontal: 10, paddingBottom:10}}>
        <Pressable onPress={() => filterByDays(7)}>
          <View style={styles.dias}>
            <Text> 7 días </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => filterByDays(30)}>
        <View style={styles.dias}>
            <Text> 30 días </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => filterByDays(90)}>
        <View style={styles.dias}>
            <Text> 90 días </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => filterByDays(365)}>
        <View style={styles.dias}>
            <Text> Este año </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => filterByDays(100000)}>
        <View style={styles.dias}>
            <Text> Siempre </Text>
          </View>
        </Pressable>

      </View>

      <View style={styles.conatinerEstadisticas}>
        <Text style={{ fontSize: 30, alignSelf: 'center'}}>$ {parseFloat(balance).toFixed(2)}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Pressable onPress={() => navigation.navigate('Ingreso')}>
        <View style={styles.ingresos}>
          <Text style={styles.balanceIngreso}>+ ${parseFloat(ingresos).toFixed(2)} </Text>
        </View>
        </Pressable>


        <Pressable onPress={() => navigation.navigate('Gasto')}> 
        <View style={styles.gastos}>
          <Text style={styles.balanceGastos}>- ${parseFloat(gastos).toFixed(2)}</Text>
        </View>
        </Pressable>
      </View>

      <Button
        title='Añadir nueva transacción'
        buttonStyle={styles.changeColor}
        onPress={() => refRBSheet.current.open()}
      />
      <View style={styles.content}>
        <FlatList
          inverted
          data={transaccionesFiltradas}
          
          renderItem={({ item }) => (
            <Pressable onLongPress={() => {handleLongPress(item.transaccion_id)}}>
            <Item
              nombre={item.transaccion_nombre}
              descripcion={item.transaccion_descripcion}
              monto={item.transaccion_monto}
              anio ={item.transaccion_anio}
              mes ={item.transaccion_mes}
              dia ={item.transaccion_dia}
              hora ={item.transaccion_hora}
              tipo={item.transaccion_tipo}
              categoriaNombre={getCategoriaNombre(categorias, item.categoria_id)}

            />
            </Pressable>
          )}
          keyExtractor={(item) => item.transaccion_id.toString()}
          style={styles.flatList}
        />
      </View>


    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  ingresos:{
    backgroundColor: '#fff', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    marginHorizontal: 5, 
    padding: 9, 
    paddingHorizontal: 30, 
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dias: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 7,
  },
  gastos:{
    backgroundColor: '#fff',
  flexDirection: 'column',
  justifyContent: 'center',
  marginHorizontal: 5,
  padding: 9,
  paddingHorizontal: 35,
  borderRadius: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
  conatinerEstadisticas: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 15,
    padding: 12 ,
    paddingHorizontal: 45,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom:10
  },
  balanceGastos: {
    color: '#BF0000',
    fontSize: 24,
    padding:3,
  },
  balanceIngreso: {
    padding:3,
    color: '#1F7900',
    fontSize: 24,
  },
  containerLeft: {
    justifyContent: 'flex-start',
  },
  containerRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  montoIngreso: {
    fontSize: 18,
    color: '#1F7900'
  },
  montoGasto: {
    fontSize: 18,
    color: '#BF0000'
  },
  montoDefault: {
    color: '#fefefe',
    backgroundColor: '#BF0000'
  },
  catText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  inputMonto: {
    fontSize: 18,
    marginRight: 35,
    marginTop: 1
  },
  signoDolar: {
    fontSize: 25,
    fontWeight: '400',
    marginRight: 10
  },
  circularTextView: {
    width: 10,
    height: 30,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 15
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  changeColor: {
    alignSelf: 'center',
    marginVertical: 20,
    width: 250,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: '#A37366',
    borderWidth: 2,
    backgroundColor: '#A37366',
  },
  deleteButton: { 
    backgroundColor: '#ff6161',
    borderRadius: 8,
    padding: 10,
    borderRadius: 20,
    height: 45,
    width:330,
    opacity: 0.85
  },
  addTransaccion: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  homeButton: {
    width: 50,
    backgroundColor: '#fff',
    borderColor: '#000',
    height: 40,
    marginTop: 30,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flatList: {
    flex: 1,
  },
  inputContainer: {
    padding: 15,
    paddingHorizontal: 45,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  nombreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  inputNombre: {
    color: '#000',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    flex: 1,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginRight: 10,
    fontSize: 18
  },
  input: {
    color: '#000',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    fontSize: 18
  },
  addNombreButton: {
    backgroundColor: '#A37366',
    borderRadius: 20,
    height: 45,
    width: 120,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#A37366',
    width: 320,
    marginTop: 10,
    borderRadius: 8,
  },
  item: {
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    marginHorizontal: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedItem: {
    backgroundColor: '#D3AEA2',
  },
  itemText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000'
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '100%',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '90%',
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioButton: {
    marginHorizontal: 6,
  },
  radioText: {
    fontSize: 18,
  },
});

export default Transacciones;