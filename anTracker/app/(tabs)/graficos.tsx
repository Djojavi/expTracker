import { DrawerLayout } from '@/components/DrawerLayout';
import { useCategorias } from '@/hooks/useCategorias';
import { useTransacciones } from '@/hooks/useTransacciones';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Categoria } from './categoria';
import { Transaccion } from './transacciones';

// Pantalla con los graficos de las categorias
export type MontoPorCategoria = {
    categoria_id: number,
    categoria_nombre: string,
    categoria_color: string,
    total_monto: number
}

const Graficos = () => {
    const { getMontosPorCategoria } = useTransacciones();
    const [montosPorCategoria, setMontosPorCategoria] = useState<MontoPorCategoria[]>([]);
    const [montosFiltrados, setMontosFiltrados] = useState<MontoPorCategoria[]>([]);
    const [gastos, setGastos] = useState(0)
    const [transaccionesGastos, setTransaccionesGastos] = useState<Transaccion[]>([]);
    const [pieData, setPieData] = useState<{ gradientCenterColor: string, color: string; value: number; }[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const { getCategorias } = useCategorias();
    const ahora = Date.now()
    const siempre = 1577836800000
    const sieteDias = ahora - 7 * 24 * 60 * 60 * 1000;
    const treintaDias = ahora - 30 * 24 * 60 * 60 * 1000;
    const noventaDias = ahora - 90 * 24 * 60 * 60 * 1000;
    const inicioDeAno = new Date(new Date().getFullYear(), 0, 1).getTime();


    useEffect(() => {
        initializeMontosPorCategoria(siempre, ahora);
    }, []);

    const initializeMontosPorCategoria = async (fechaInicio:number, fechaFin:number) => {
        try {
            const data = await getMontosPorCategoria(fechaInicio, fechaFin);
            console.log(data)
            setMontosPorCategoria(data)
            getPieData(data)
        } catch (e: any) {
            console.error(e)
        }
    }

    const getPieData = (data: MontoPorCategoria[]) => {
        const dataPie = data.map(element => ({
            value: element.total_monto,
            color: element.categoria_color,
            gradientCenterColor: darkenHexColor(element.categoria_color)
        }))
        setPieData(dataPie);
    }

    function darkenHexColor(hex: string, amount = 20) {
        hex = hex.replace(/^#/, '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        r = Math.max(0, r - amount);
        g = Math.max(0, g - amount);
        b = Math.max(0, b - amount);

        const newHex = "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0");

        return newHex;
    }

    const renderDot = (color: string) => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };

    const renderLegendComponent = () => {
        return (
            <>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 10,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 120,
                            marginRight: 20,
                        }}>
                        {renderDot('#006DFF')}
                        <Text style={{ color: 'white' }}>Excellent: 47%</Text>
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                        {renderDot('#8F80F3')}
                        <Text style={{ color: 'white' }}>Okay: 16%</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 120,
                            marginRight: 20,
                        }}>
                        {renderDot('#3BE9DE')}
                        <Text style={{ color: 'white' }}>Good: 40%</Text>
                    </View>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                        {renderDot('#FF7F97')}
                        <Text style={{ color: 'white' }}>Poor: 3%</Text>
                    </View>
                </View>
            </>
        );
    };


    const filterByDays = async (fechaInicio: number, fechaFin: number) => {
        try {
            const data = await getMontosPorCategoria(fechaInicio, fechaFin)
            setMontosFiltrados(data)
            getPieData(montosFiltrados)
        } catch (e: any) {
            console.error(e)
        }
    };

    const Item: React.FC<Transaccion> = ({ transaccion_descripcion, transaccion_nombre, transaccion_monto, transaccion_fecha, categoria_id, transaccion_tipo }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <View style={styles.containerLeft}>
                    <Text style={styles.title}>{transaccion_nombre}</Text>
                    <Text style={styles.description}>{transaccion_descripcion}</Text>
                    <Text style={styles.description}> </Text>
                </View>
                <View style={styles.containerRight}>
                    <Text ></Text>
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
            <DrawerLayout screenName='Graficos' >
                <View style={styles.container}>
                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 5, paddingHorizontal: 10, overflow: 'scroll', marginBottom: 15 }}>
                            <Pressable onPress={() => initializeMontosPorCategoria(sieteDias,ahora)}>
                                <View style={styles.dias}>
                                    <Text> 7 días </Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => initializeMontosPorCategoria(treintaDias, ahora)}>
                                <View style={styles.dias}>
                                    <Text> 30 días </Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => initializeMontosPorCategoria(noventaDias, ahora)}>
                                <View style={styles.dias}>
                                    <Text> 90 días </Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => initializeMontosPorCategoria(inicioDeAno, ahora)}>
                                <View style={styles.dias}>
                                    <Text> Este año </Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => initializeMontosPorCategoria(siempre,  ahora)}>
                                <View style={styles.dias}>
                                    <Text> Siempre </Text>
                                </View>
                            </Pressable>

                        </ScrollView>
                    </View>
                    <View
      style={{
        margin: 20,
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#232B5D',
      }}>
      <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
        Performance
      </Text>
      <View style={{padding: 20, alignItems: 'center'}}>
        {pieData.length > 0 && (
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={'#232B5D'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                  47%
                </Text>
                <Text style={{fontSize: 14, color: 'white'}}>Excellent</Text>
              </View>
            );
          }}
        />)}
      </View>
      {renderLegendComponent()}
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
        color: '#BF0000',
        fontSize: 18,
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

export default Graficos;