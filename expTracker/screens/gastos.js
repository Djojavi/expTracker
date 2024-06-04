import React, { useContext, useRef, useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback, Pressable, } from 'react-native';
import { DataContext } from '../App';
import { Button } from '@rneui/base';
import {BarChart} from 'react-native-gifted-charts'


//Pantalla con los gastos

const Gasto = ({ navigation }) => {
  const { transacciones, categorias } = useContext(DataContext);
  const [gastos, setGastos] = useState(0);
  const [transaccionesGastos, setTransaccionesGastos] = useState([]);

  useEffect(() => {
    calcularBalance(transacciones);
    getArrayGastos(transacciones);
  }, [transacciones]);


  const getArrayGastos = (arrayTransacciones) =>{
    let arrayGastos = [];
    arrayTransacciones.forEach(item => {
      if(item.transaccion_tipo === 'Gasto'){
        arrayGastos.push(item);
      }
    })
    setTransaccionesGastos(arrayGastos);
  }

  const calcularBalance = (arrayTransacciones) => {
    let  nuevoGastos = 0;
    arrayTransacciones.forEach(item => {
      if (item.transaccion_tipo === 'Gasto') {
        nuevoGastos -= item.transaccion_monto;
      } 
    });
    
    setGastos(nuevoGastos);
  };
  const getCategoriaNombre = (array, idCategoria) => {
    const filtrado = array.find(item => item.categoria_id === idCategoria);
    return filtrado ? filtrado.categoria_nombre : '';
  }

  const transformedData = transaccionesGastos.map(item => ({
    value: item.transaccion_monto,
    label: item.transaccion_fecha
  }));


  const Item = ({ nombre, descripcion, monto, fecha, categoriaNombre, tipo }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View style={styles.containerLeft}>
          <Text style={styles.title}>{nombre}</Text>
          <Text style={styles.description}>{descripcion}</Text>
          <Text style={styles.description}>{fecha}</Text>
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
          buttonStyle={[styles.homeButton]}
          onPress={() => navigation.navigate('Categoria')}
        />
        <Button
          icon={<Image source={require('../assets/icons/dinero.png')} style={{ width: 25, height: 25 }} />}
          buttonStyle={[styles.homeButton, { marginRight: 50 }]}
          onPress={() => navigation.navigate('Transacciones')}
        />
        <Image source={require('../assets/images/Logo.png')} style={{ width: 152, height: 40, marginTop: 29 }} />
      </View>



      <View style={styles.conatinerEstadisticas}>
        <Text style={styles.description}>Gastos:</Text>
        <Text style={{ fontSize: 35, alignSelf: 'center'}}>$ {parseFloat(gastos).toFixed(2)}</Text>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          data={transformedData}
          barWidth={30}
          barBorderRadius={5}
          frontColor="#6a5acd"
        />
      </View>


      <View style={styles.content}>
        <FlatList
          inverted
          data={transaccionesGastos}
          renderItem={({ item }) => (
            <Item
              nombre={item.transaccion_nombre}
              descripcion={item.transaccion_descripcion}
              monto={item.transaccion_monto}
              fecha={item.transaccion_fecha}
              tipo={item.transaccion_tipo}
              categoriaNombre={getCategoriaNombre(categorias, item.categoria_id)}

            />
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
    padding: 15, 
    paddingHorizontal: 35, 
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gastos:{
    backgroundColor: '#fff',
  flexDirection: 'column',
  justifyContent: 'center',
  marginHorizontal: 5,
  padding: 15,
  paddingHorizontal: 45,
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
    padding: 8,
    paddingHorizontal: 40,
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
  },
  balanceIngreso: {
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
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
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

export default Gasto;
