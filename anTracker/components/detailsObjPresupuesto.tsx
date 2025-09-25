import { useObjetivos } from "@/hooks/useCuentas"
import { formatDate } from "@/utils/dateutils"
import { en, es } from '@/utils/translations'
import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'
import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import ProgressBar from "./progressBar"

type detailsProps = {
    tipoAMostrar: string
    porcentaje: number
    nombre: string
    current: number
    idCuenta: number
}
export type Detalles = {
    transaccion_nombre: string
    transaccion_fecha: number
    tc_monto: number
}

export const DetailsObjPresupuestoComponent: React.FC<detailsProps> = ({ tipoAMostrar, porcentaje, nombre, current, idCuenta }) => {
    let [locale, setLocale] = useState(Localization.getLocales())
    const i18n = new I18n();
    i18n.enableFallback = true;
    i18n.translations = { en, es };
    i18n.locale = locale[0].languageCode ?? 'en';
    const { getDetallesCuentas } = useObjetivos()
    const [detalles, setDetalles] = useState<Detalles[]>()

    const handleIniciarDetalles = async () => {
        const data = await getDetallesCuentas(idCuenta)
        setDetalles(data)
        console.log(data)
    }

    useEffect(() => {
        handleIniciarDetalles()
    }, [])

    const entero = porcentaje * 100;

    let colorBarra = '#000';
    let feedbackEmoji = '❔';
    let feedbackMessage = 'Sin datos';

    if (tipoAMostrar === "Ingreso") {
        if (entero < 40) {
            colorBarra = '#646464ff';
            feedbackEmoji = '🔮';
            feedbackMessage = i18n.t('Details.Income40');
        } else if (entero < 70) {
            colorBarra = '#e6cf07ff';
            feedbackEmoji = '🚀';
            feedbackMessage =  i18n.t('Details.Income70');
        } else if (entero < 100) {
            colorBarra = '#6a09b9ff';
            feedbackEmoji = '🎇';
            feedbackMessage =  i18n.t('Details.Income99');
        } else {
            colorBarra = '#4CAF50';
            feedbackEmoji = '🎯';
            feedbackMessage =  i18n.t('Details.Income100');
        }
    } else if (tipoAMostrar === "Gasto") {
        if (-entero < 70) {
            colorBarra = '#4CAF50';
            feedbackEmoji = '💵';
            feedbackMessage =  i18n.t('Details.Expense40');
        } else if (-entero < 40) {
            colorBarra = '#64B5F6';
            feedbackEmoji = '⚖️';
            feedbackMessage = i18n.t('Details.Expense70');
        } else if (-entero < 0) {
            colorBarra = '#e6cf07ff';
            feedbackEmoji = '💨';
            feedbackMessage = i18n.t('Details.Expense99');
        } else {
            colorBarra = '#c01414ff';
            feedbackEmoji = '🔒';
            feedbackMessage = i18n.t('Details.Expense100');
        }
    }

    return (
        <View >
            <View style={styles.card}>
                <View style={{ alignItems: 'center' }} >
                    <Text style={styles.title}>{nombre}</Text>
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.text}>{feedbackEmoji}</Text>
                        <Text style={styles.feedbackText}>{feedbackMessage}</Text>
                    </View>
                </View>
                <ProgressBar progress={tipoAMostrar === 'Ingreso' ? porcentaje : 1 + porcentaje} current={tipoAMostrar === 'Ingreso' ? current : 1 + current} color={colorBarra} />
                {tipoAMostrar === 'Ingreso' &&
                    <Text style={styles.percent}>{(porcentaje * 100).toFixed(2)}%</Text>}
                {tipoAMostrar === 'Gasto' &&
                    <Text style={styles.percent}>{((1 + porcentaje) * 100).toFixed(2)}%</Text>}
            </View>
            <FlatList data={detalles}
                windowSize={5} onEndReached={handleIniciarDetalles}
                onEndReachedThreshold={0.5}
                initialNumToRender={5} maxToRenderPerBatch={5} renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.itemContent}>
                            <View style={styles.containerLeft}>
                                <Text style={styles.title}>{item.transaccion_nombre}</Text>
                                <View>
                                    <Text>{formatDate(item.transaccion_fecha)}</Text>
                                </View>
                            </View>
                            <View style={styles.containerRight}>
                                {tipoAMostrar ? (
                                    <Text
                                        style={
                                            tipoAMostrar === 'Ingreso'
                                                ? styles.montoIngreso
                                                : tipoAMostrar === 'Gasto'
                                                    ? styles.montoGasto
                                                    : styles.montoDefault
                                        }
                                    >
                                        {tipoAMostrar === 'Ingreso'
                                            ? `+$${item.tc_monto.toFixed(2)}`
                                            : tipoAMostrar === 'Gasto'
                                                ? `-$${item.tc_monto.toFixed(2)}`
                                                : `$${item.tc_monto.toFixed(2)}`}
                                    </Text>

                                ) : null}
                            </View>
                        </View>
                    </View>
                )}></FlatList>
        </View>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        marginVertical: 8,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    text: {
        fontSize: 100,
        marginTop: 6,
    },
    percent: {
        textAlign: "right",
        marginTop: 4,
        fontSize: 12,
        color: "#666",
    },
    feedbackContainer: {
        alignItems: "center",
        marginTop: 8,
        padding: 6,
    },
    feedbackText: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
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
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerLeft: {
        justifyContent: 'flex-start',
        width: '60%'
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

});