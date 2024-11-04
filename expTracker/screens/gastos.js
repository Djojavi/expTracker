import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { DataContext } from '../App';
import { Button } from '@rneui/base';
import { BarChart } from 'react-native-gifted-charts';

// Pantalla con los gastos

const Gastos = ({ navigation }) => {
  const { transacciones, categorias } = useContext(DataContext);
  const [gastos, setGastos] = useState(0);
  const [transaccionesGastos , setTransaccionesGastos] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    calcularBalance(transacciones);
    getArrayGastos(transacciones);
  }, [transacciones]);

  const getArrayGastos = (arrayTransacciones) => {
    let arrayGastos = [];
    arrayTransacciones.forEach(item => {
      if (item.transaccion_tipo === 'Gasto') {
        arrayGastos.push(item);
      }
    });
    setTransaccionesGastos(arrayGastos);
    generarDatosParaBarChart(arrayGastos);
  };

  const filterByDays = (days) => {
    const now = new Date();
  
    const newTransaccionesGastos = transacciones.filter(item => {
      const transaccionFecha = new Date(item.transaccion_anio, item.transaccion_mes - 1, item.transaccion_dia); // Crear objeto Date usando anio, mes y dia
      const diffTime = Math.abs(now - transaccionFecha);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return item.transaccion_tipo === 'Gasto' && diffDays <= days;
    });
    
    setTransaccionesGastos(newTransaccionesGastos);
    calcularBalance(newTransaccionesGastos);
    generarDatosParaBarChart(newTransaccionesGastos);
  };
  

  const calcularBalance = (arrayTransacciones) => {
    let nuevoGastos = 0;
    arrayTransacciones.forEach(item => {
      if (item.transaccion_tipo === 'Gasto') {
        nuevoGastos += item.transaccion_monto;
      }
    });
    setGastos(nuevoGastos);
  };

  const generarDatosParaBarChart = (arrayTransacciones) => {
    const groupedData = arrayTransacciones.reduce((acc, item) => {
      const fecha = `${item.transaccion_anio}-${String(item.transaccion_mes).padStart(2, '0')}-${String(item.transaccion_dia).padStart(2, '0')}`;
      const etiqueta = `${item.transaccion_dia}-${item.transaccion_mes}`;
      if (!acc[fecha]) {
        acc[fecha] = { monto: 0, etiqueta };
      }
      acc[fecha].monto += item.transaccion_monto;
      return acc;
    }, {});
  
    const chartDataArray = Object.keys(groupedData)
      .sort((a, b) => b.localeCompare(a))  
      .map(fecha => ({
        label: groupedData[fecha].etiqueta,
        value: groupedData[fecha].monto
      }));
  
    setChartData(chartDataArray);
  };
  
  
  
  const getCategoriaNombre = (array, idCategoria) => {
    const filtrado = array.find(item => item.categoria_id === idCategoria);
    return filtrado ? filtrado.categoria_nombre : '';
  };

  const Item = ({ nombre, descripcion, monto, fecha, categoriaNombre, tipo, hora }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View style={styles.containerLeft}>
          <Text style={styles.title}>{nombre}</Text>
          <Text style={styles.description}>{descripcion}</Text>
          <Text style={styles.description}>{fecha} {hora} </Text>
        </View>
        <View style={styles.containerRight}>
          <Text style={styles.category}>{categoriaNombre}</Text>
          {monto ? (
            <Text style={tipo === 'Gasto' ? styles.montoGasto : tipo === 'Ingreso' ? styles.montoIngreso : styles.montoDefault}>
              {tipo === 'Gasto' ? `- $${parseFloat(monto).toFixed(2)}` : tipo === 'Ingreso' ? `-$${parseFloat(monto).toFixed(2)}` : `$${parseFloat(monto).toFixed(2)}`}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
        <Text style={{ fontSize: 30, alignSelf: 'center', color:'#BF0000'}}> - ${parseFloat(gastos).toFixed(2)}</Text>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          overflowTop={20}
          width={275}
          height={175}
          yAxisThickness={1}
          xAxisThickness={1}
          data={chartData}
          barWidth={30}
          barBorderRadius={5}
          frontColor="#A37366"
          isAnimated
          noOfSections={4}
          renderTooltip={(item, index) => {
            return (
              <View
                style={{
                  marginBottom:5,
                  marginTop:50,
                  marginLeft: -6,
                  backgroundColor: '#D3AEA2 ',
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}>
                <Text>${item.value}</Text>
              </View>
            );
          }}
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
              hora = {item.transaccion_hora}
              fecha={`${item.transaccion_anio}-${item.transaccion_mes}-${item.transaccion_dia}`}
              tipo={item.transaccion_tipo}
              categoriaNombre={getCategoriaNombre(categorias, item.categoria_id)}
            />
          )}
          keyExtractor={(item) => item.transaccion_id.toString()}
          style={styles.flatList}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  chartContainer:{
    borderRadius:20,
    marginHorizontal:'5%',
    paddingTop:25,
    padding:10,
    backgroundColor:'#fff',
    marginBottom:5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dias: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 7,
  },
  ingresos: {
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
  gastos: {
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
    marginBottom: 10,
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
    color: '#1F7900',
  },
  montoGasto: {
    fontSize: 18,
    color: '#BF0000',
  },
  montoDefault: {
    color: '#fefefe',
    backgroundColor: '#BF0000',
  },
  catText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputMonto: {
    fontSize: 18,
    marginRight: 35,
    marginTop: 1,
  },
  signoDolar: {
    fontSize: 25,
    fontWeight: '400',
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
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
  nombreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
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
    width: '100%',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
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
  }
});

export default Gastos;
