import { DatePickers } from '@/components/DatePickers';
import { DrawerLayout } from '@/components/DrawerLayout';
import { useCategorias } from '@/hooks/useCategorias';
import { useTransacciones } from '@/hooks/useTransacciones';
import { datosBarChart, formatDate } from '@/utils/dateutils';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Categoria } from './categoria';
import { Transaccion } from './transacciones';

// Pantalla con los ingresos

const Ingreso = () => {
    const { getIngresos, getIngresosPorFecha } = useTransacciones();
    const [transaccionesFiltradas, setTransaccionesFiltradas] = useState<Transaccion[]>([]);
    const [ingresos, setIngresos] = useState(0)
    const [transaccionesIngresos, setTransaccionesIngresos] = useState<Transaccion[]>([]);
    const [chartData, setChartData] = useState<{ label: string; value: number; }[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const { getCategorias } = useCategorias();
    const [rango, setRango] = useState<{ inicio: number; fin: number } | null>(null);

    const handleSeleccionFechas = async (inicio: number, fin: number) => {
        setRango({ inicio, fin });
        try {
            const data = await getIngresosPorFecha(inicio, fin);
            setTransaccionesIngresos(data);
            setTransaccionesFiltradas(data);
            datosBarChart(data)
            calcularBalance(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };


    useEffect(() => {
        getArrayIngresos();
        initializeCategorias();
    }, []);

    const getArrayIngresos = async () => {
        try {
            const data = await getIngresos();
            setTransaccionesIngresos(data);
            setTransaccionesFiltradas(data);
            calcularBalance(data);
            datosBarChart(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const calcularBalance = (arrayTransacciones: Transaccion[]) => {
        let nuevoIngresos = 0;
        arrayTransacciones.forEach(item => {
            nuevoIngresos += item.transaccion_monto;
        });
        setIngresos(nuevoIngresos);
    };

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


    const Item: React.FC<Transaccion> = ({ transaccion_descripcion, transaccion_nombre, transaccion_monto, transaccion_fecha, categoria_id, transaccion_tipo }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <View style={styles.containerLeft}>
                    <Text style={styles.title}>{transaccion_nombre}</Text>
                    <Text style={styles.description}>{transaccion_descripcion}</Text>
                    <Text style={styles.description}>{formatDate(transaccion_fecha)} </Text>
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <DrawerLayout screenName='Ingresos' >
                <View style={styles.container}>

                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>

                            <DatePickers onSeleccionar={handleSeleccionFechas} />

                        </View>

                        <View style={styles.conatinerEstadisticas}>
                            <Text style={{ fontSize: 30, alignSelf: 'center', color: '#1F7900' }}> + ${ingresos.toFixed(2)}</Text>
                        </View>

                        <View style={styles.chartContainer}>
                            {chartData.length > 0 && (
                                <BarChart
                                    overflowTop={25}
                                    height={175}
                                    width={225}
                                    yAxisThickness={1}
                                    xAxisThickness={1}
                                    data={chartData}
                                    barWidth={30}
                                    barBorderRadius={5}
                                    frontColor="#A37366"
                                    isAnimated
                                    spacing={35}
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
                    </View>

                    <View style={styles.content}>
                        <FlatList
                            data={transaccionesFiltradas}
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
            </DrawerLayout>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingBottom: 15
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
        padding: 8,
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
        marginBottom: 45
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