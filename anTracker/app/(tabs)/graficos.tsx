import { DrawerLayout } from '@/components/DrawerLayout';
import { PieChartComponent } from '@/components/PieChart';
import { useTransacciones } from '@/hooks/useTransacciones';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
    const [pieData, setPieData] = useState<{ gradientCenterColor: string, color: string; value: number; }[]>([]);
    const ahora = Date.now()
    const siempre = 1577836800000
    const sieteDias = ahora - 7 * 24 * 60 * 60 * 1000;
    const treintaDias = ahora - 30 * 24 * 60 * 60 * 1000;
    const noventaDias = ahora - 90 * 24 * 60 * 60 * 1000;
    const inicioDeAno = new Date(new Date().getFullYear(), 0, 1).getTime();


    useEffect(() => {
        initializeMontosPorCategoria(siempre, ahora);
    }, []);

    const initializeMontosPorCategoria = async (fechaInicio: number, fechaFin: number) => {
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

    function darkenHexColor(hex: string, percent = 10) {
        hex = hex.replace(/^#/, '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        r = Math.max(0, Math.floor(r * (1 - percent / 100)));
        g = Math.max(0, Math.floor(g * (1 - percent / 100)));
        b = Math.max(0, Math.floor(b * (1 - percent / 100)));
        const newHex = "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0");

        return newHex;
    }

    const Item: React.FC<MontoPorCategoria> = ({ categoria_nombre, categoria_color, total_monto }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <View style={styles.itemContent}>
                    <View style={[styles.circularTextView, { backgroundColor: categoria_color }]} />
                    <Text style={styles.title}>{categoria_nombre}</Text>
                </View>
                    <Text style={styles.total}>{total_monto}$</Text>
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
                            <Pressable onPress={() => initializeMontosPorCategoria(sieteDias, ahora)}>
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

                            <Pressable onPress={() => initializeMontosPorCategoria(siempre, ahora)}>
                                <View style={styles.dias}>
                                    <Text> Siempre </Text>
                                </View>
                            </Pressable>

                        </ScrollView>
                    </View>
                    <View
                        style={{
                            marginHorizontal: 20,
                            padding: 2,
                            borderRadius: 20,
                            backgroundColor: '#ffffffff',
                        }}>

                        <PieChartComponent pieData={pieData} montosPorCategoria={montosPorCategoria}></PieChartComponent>
                    </View>

                        <View style={styles.content}>
                            <FlatList data={montosPorCategoria} renderItem={({ item }) => (
                                <Item total_monto={item.total_monto} categoria_nombre={item.categoria_nombre} categoria_color={item.categoria_color} categoria_id={item.categoria_id}></Item>
                            )}
                                keyExtractor={(item, index) => item.categoria_id?.toString() ?? index.toString()}
                                style={styles.flatList}>

                            </FlatList>
                        </View>

                </View>
            </DrawerLayout>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    dias: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 7,
    },
    container: {
        flex: 1,
        backgroundColor: '#E0F7FA',
    },
    circularTextView: {
        width: 10,
        height: 40,
        borderRadius: 50,
        marginLeft: 10,
        marginRight: 15
    },
    flatList: {
        flex: 1,
    },
    content: {
        marginTop:10,
        backgroundColor:'#E0F7FA',
        borderColor:'#fff',
        flex: 1,
        marginBottom: 45,
        marginHorizontal:18
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
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
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        flex: 1,
        flexDirection:'column'
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold', 
    },
    total: {
        fontSize: 16,
        color: '#757575',
        marginTop: 5,
    },
});

export default Graficos;