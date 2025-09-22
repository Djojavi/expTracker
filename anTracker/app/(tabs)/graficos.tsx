import { DatePickers } from '@/components/DatePickers';
import { DrawerLayout } from '@/components/DrawerLayout';
import { PieChartComponent } from '@/components/PieChart';
import { CustomCheckbox } from '@/components/ui/CheckBox';
import { NoData } from '@/components/ui/NoData';
import { useTransacciones } from '@/hooks/useTransacciones';
import { darkenHexColor } from '@/utils/colorUtils';
import { en, es } from '@/utils/translations';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

// Pantalla con los graficos de las categorias
export type MontoPorCategoria = {
    categoria_id: number,
    categoria_nombre: string,
    categoria_color: string,
    total_monto: number
}

const Graficos = () => {
    let [locale, setLocale] = useState(Localization.getLocales())
    const i18n = new I18n();
    i18n.enableFallback = true;
    i18n.translations = { en, es };
    i18n.locale = locale[0].languageCode ?? 'en';
    const { getMontosPorCategoria, getMontosGastosPorCategoria, getMontosIngresosPorCategoria } = useTransacciones();
    const [montosPorCategoria, setMontosPorCategoria] = useState<MontoPorCategoria[]>([]);
    const [pieData, setPieData] = useState<{ gradientCenterColor: string, color: string; value: number; }[]>([]);
    const [rango, setRango] = useState<{ inicio: number; fin: number } | null>({ inicio: 1704067200000, fin: Date.now() });
    const [isFiltroIngresos, setIsFiltroIngresos] = useState(false);
    const [isFiltroGastos, setIsFiltroGastos] = useState(false);

    const handleSeleccionFechas = async (inicio: number, fin: number) => {
        setRango({ inicio, fin });
        try {
            const data = await getMontosPorCategoria(inicio, fin);
            setMontosPorCategoria(data);
            getPieData(data)
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleFiltroCategorias = async (tipo: string) => {
        let newFiltroIngresos = isFiltroIngresos;
        let newFiltroGastos = isFiltroGastos;

        if (tipo === 'Ingresos') {
            newFiltroIngresos = true;
        } else if (tipo === 'Gastos') {
            newFiltroGastos = true;
        } else if (tipo === 'Ingresosno') {
            newFiltroIngresos = false;
        } else if (tipo === 'Gastosno') {
            newFiltroGastos = false;
        }
        setIsFiltroIngresos(newFiltroIngresos);
        setIsFiltroGastos(newFiltroGastos);

        if (newFiltroGastos && !newFiltroIngresos) {
            const data = await getMontosGastosPorCategoria(rango?.inicio ?? 0, rango?.fin ?? 0);
            setMontosPorCategoria(data);
            getPieData(data);
        } else if (!newFiltroGastos && newFiltroIngresos) {
            const data = await getMontosIngresosPorCategoria(rango?.inicio ?? 0, rango?.fin ?? 0);
            setMontosPorCategoria(data);
            getPieData(data);
        } else {
            initializeMontosPorCategoria(rango?.inicio ?? 0, rango?.fin ?? 0);
        }
    };


    useEffect(() => {
        initializeMontosPorCategoria(0, new Date().getTime());
    }, []);

    const initializeMontosPorCategoria = async (fechaInicio: number, fechaFin: number) => {
        try {
            const data = await getMontosPorCategoria(fechaInicio, fechaFin);
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

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>

                            <DatePickers onSeleccionar={handleSeleccionFechas} />

                        </View>
                    </View>
                    <View
                        style={{
                            marginHorizontal: 20,
                            padding: 2,
                            borderRadius: 20,
                            backgroundColor: '#ffffffff',
                        }}>

                        <PieChartComponent pieData={pieData} montosPorCategoria={montosPorCategoria}></PieChartComponent>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <CustomCheckbox text={i18n.t('Menu.Income')} onSelected={handleFiltroCategorias} />
                            <CustomCheckbox text={i18n.t('Menu.Expenses')} onSelected={handleFiltroCategorias} />
                        </View>
                    </View>

                    <View style={styles.content}>
                        {montosPorCategoria.length === 0 &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <NoData message={i18n.t('Home.Transactions')} />
                            </View>
                        }
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
        marginTop: 10,
        backgroundColor: '#E0F7FA',
        borderColor: '#fff',
        flex: 1,
        marginBottom: 45,
        marginHorizontal: 18
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
        flexDirection: 'column'
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