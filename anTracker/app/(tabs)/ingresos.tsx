import { useCategorias } from '@/hooks/useCategorias';
import { useTransacciones } from '@/hooks/useTransacciones';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Categoria } from './categoria';
import { Transaccion } from './transacciones';

// Pantalla con los ingresos

const Ingreso = () => {
    const { getIngresos } = useTransacciones();
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [ingresos, setIngresos] = useState(0)
    const [transaccionesIngresos, setTransaccionesIngresos] = useState<Transaccion[]>([]);
    const [chartData, setChartData] = useState([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const { getCategorias } = useCategorias();


    useEffect(() => {
        getArrayIngresos();
        initializeCategorias();
    }, []);

    const getArrayIngresos = async () => {
        try {
            const data = await getIngresos();
            setTransaccionesIngresos(data);
            calcularBalance(data);
            //generarDatosParaBarChart(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const filterByDays = (days: number) => {
        /*const now = new Date();

        const newTransaccionesIngresos = transacciones.filter(item => {
            const transaccionFecha = new Date(item.transaccion_anio, item.transaccion_mes - 1, item.transaccion_dia); // Crear objeto Date usando anio, mes y dia
            const diffTime = Math.abs(now - transaccionFecha);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return item.transaccion_tipo === 'Ingreso' && diffDays <= days;
        });

        setTransaccionesIngresos(newTransaccionesIngresos);
        calcularBalance(newTransaccionesIngresos);
        generarDatosParaBarChart(newTransaccionesIngresos);*/
    };


    const calcularBalance = (arrayTransacciones: Transaccion[]) => {
        let nuevoIngresos = 0;
        arrayTransacciones.forEach(item => {
            nuevoIngresos += item.transaccion_monto;
        });
        setIngresos(nuevoIngresos);
    };

    /* const generarDatosParaBarChart = (arrayTransacciones : Transaccion[]) => {
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
     }; */



    function buscarCategoriaPorId(id: number): string {
        const categoria = categorias.find(cat => cat.categoria_id === id);
        return categoria?.categoria_nombre ?? 'Sin categoría';
    }
    const initializeCategorias = async () => {
        try {
            const data = await getCategorias();
            setCategorias(data);

        } catch (error) {
            console.error("Error:", error);
        }
    };
    function segundosATiempo(segundos: number): string {
        const fecha = new Date(segundos);
        return fecha.toLocaleString();
    }

    const Item: React.FC<Transaccion> = ({ transaccion_descripcion, transaccion_nombre, transaccion_monto, transaccion_fecha, categoria_id, transaccion_tipo }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <View style={styles.containerLeft}>
                    <Text style={styles.title}>{transaccion_nombre}</Text>
                    <Text style={styles.description}>{transaccion_descripcion}</Text>
                    <Text style={styles.description}>{segundosATiempo(transaccion_fecha)} </Text>
                </View>
                <View style={styles.containerRight}>
                    <Text >{buscarCategoriaPorId(categoria_id)}</Text>
                    {transaccion_monto ? (
                        <Text style={transaccion_tipo === 'Ingreso' ? styles.montoIngreso : transaccion_tipo === 'Gasto' ? styles.montoGasto : styles.montoDefault}>
                            {transaccion_tipo === 'Ingreso' ? `+$${transaccion_monto.toFixed(2)}` : transaccion_tipo === 'Gasto' ? `-$${transaccion_monto.toFixed(2)}` : `$${transaccion_monto.toFixed(2)}`}
                        </Text>
                    ) : null}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerButtons}>
                    <Link href="/(tabs)">
                        <View >
                            <Image style={{ width: 30, height: 30, marginTop: 35 }} source={require('../../assets/icons/casa.png')}></Image>
                        </View>
                    </Link>

                    <Link href="/(tabs)">
                        <View >
                            <Image style={{ width: 30, height: 30, marginTop: 35 }} source={require('../../assets/icons/categoria.png')}></Image>
                        </View>
                    </Link>

                    <Link href="/(tabs)/transacciones">
                        <View >
                            <Image style={{ width: 30, height: 30, marginTop: 35 }} source={require('../../assets/icons/dinero.png')}></Image>
                        </View>
                    </Link>
                </View>
                <Image source={require('../../assets/images/Logo.png')} style={{ width: 152, height: 40, marginTop: 29 }} />
            </View>

            <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center', paddingHorizontal: 10, paddingBottom: 10 }}>
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
                <Text style={{ fontSize: 30, alignSelf: 'center', color: '#1F7900' }}> + ${ingresos.toFixed(2)}</Text>
            </View>

            <View style={styles.chartContainer}>
                {chartData.length > 0 && (
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
                    renderTooltip={(item: any, index: any) => {
                        return (
                            <View
                                style={{
                                    marginBottom: 5,
                                    marginTop: 50,
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
                )}
            </View>

            <View style={styles.content}>
                <FlatList
                    inverted
                    data={transaccionesIngresos}
                    renderItem={({ item }) => (
                        <Item
                            transaccion_nombre={item.transaccion_nombre}
                            transaccion_descripcion={item.transaccion_descripcion}
                            transaccion_monto={item.transaccion_monto}
                            transaccion_fecha={item.transaccion_fecha}
                            transaccion_metodo={item.transaccion_metodo}
                            transaccion_tipo='Ingreso'
                            categoria_id={item.categoria_id}
                        />
                    )}
                    keyExtractor={(item, index) => item.transaccion_id?.toString() ?? index.toString()}
                    style={styles.flatList}
                />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    chartContainer: {
        borderRadius: 20,
        marginHorizontal: '5%',
        paddingTop: 25,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 5,
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
    headerButtons: {
        flexDirection: 'row',
        gap: 15
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

export default Ingreso;