import { Transaccion } from "@/app/(tabs)/transacciones"
import { useObjetivos } from "@/hooks/useCuentas"
import { useTransacciones } from "@/hooks/useTransacciones"
import { en, es } from '@/utils/translations'
import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'
import { useEffect, useState } from "react"
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { TransaccionItemComponent } from "./transaccionItem"

type addInCuentasProps = {
    nombreAMostrar: string;
    tipoAMostrar: string;
    idCuenta: number
    saldoPresupuesto: number
    saldoObjetivo: number
}

export const AddInCuentasScreen: React.FC<addInCuentasProps> = ({ tipoAMostrar, idCuenta, nombreAMostrar, saldoPresupuesto, saldoObjetivo }) => {
    let [locale, setLocale] = useState(Localization.getLocales())
    const i18n = new I18n();
    i18n.enableFallback = true;
    i18n.translations = { en, es };
    i18n.locale = locale[0].languageCode ?? 'en';
    const { getIngresosConMonto, getGastosNoPresupuestados } = useTransacciones()
    const { updateSaldo } = useObjetivos()
    const [transacciones, setTransacciones] = useState<Transaccion[]>([])
    const [transaccionesSeleccionadas, setTransaccionesSeleccionadas] = useState<{
        [transaccion_id: number]: { checked: boolean; monto: number; montoTexto: string }
    }>({});


    const handleIniciar = async () => {
        if (tipoAMostrar === "Ingreso") {
            const data = await getIngresosConMonto()
            setTransacciones(data)
        } else if (tipoAMostrar === "Gasto") {
            const data = await getGastosNoPresupuestados()
            setTransacciones(data)
        }
    }

    const toggleSeleccion = (id: number) => {
        setTransaccionesSeleccionadas(prev => ({
            ...prev,
            [id]: { checked: !prev[id]?.checked, monto: prev[id]?.monto ?? 0, montoTexto: prev[id]?.montoTexto ?? '' }
        }));
    };


    const handleMontoChange = (id: number, value: string) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        if (!regex.test(value)) return;

        setTransaccionesSeleccionadas(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                montoTexto: value,
                monto: parseFloat(value) || 0,
            },
        }));
    };

    const handleSubmitPresupuestos = async (id: number, monto?: number) => {
        console.log("Guardar:", { id, monto });
        if (Number(monto) > 0) {
            if (monto !== undefined && saldoObjetivo < Number(monto)) {
                await updateSaldo(idCuenta, id, Number(saldoObjetivo), tipoAMostrar === 'Ingreso' ? true : false).then(async res => {
                    await handleIniciar()
                })
            } else {
                await updateSaldo(idCuenta, id, Number(monto), tipoAMostrar === 'Ingreso' ? true : false).then(async res => {
                    await handleIniciar()
                })
            }
            setTransaccionesSeleccionadas(prev => {
                const { [id]: _, ...rest } = prev;
                return rest
            })
        }
        await handleIniciar()
    };

    const handleSubmit = async (id: number) => {
        const monto = transaccionesSeleccionadas[id]?.monto;
        console.log("Guardar:", { id, monto });
        if (Number(monto) > 0 && saldoObjetivo > Number(monto)) {
            await updateSaldo(idCuenta, id, Number(monto), tipoAMostrar === 'Ingreso' ? true : false).then(res => {
                handleIniciar()
            })
            setTransaccionesSeleccionadas(prev => {
                const { [id]: _, ...rest } = prev;
                return rest
            })
        } else {
            Alert.alert('Error', i18n.t('InvalidNumber'))
        }
        await handleIniciar()
    };


    useEffect(() => {
        handleIniciar();
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}> {i18n.t('SelectTransactions', { nameShow: nombreAMostrar })}</Text>
            <FlatList
                data={transacciones}
                keyExtractor={(item) => item.transaccion_id?.toString() ?? Math.random().toString()}
                renderItem={({ item }) => {
                    const checked = transaccionesSeleccionadas[item.transaccion_id ?? 0]?.checked
                    return (
                        <Pressable
                            onPress={() => toggleSeleccion(item.transaccion_id ?? 0)}
                            style={[
                                styles.card,
                                checked ? styles.cardSelected : null
                            ]}
                        >
                            <View style={styles.row}>
                                <Text style={[styles.checkbox, checked ? styles.checkboxChecked : null]}>
                                    {checked ? "✔" : ""}
                                </Text>
                                <View style={{ flex: 1 }}>
                                    <TransaccionItemComponent
                                        transaccion_nombre={item.transaccion_nombre}
                                        transaccion_descripcion={item.transaccion_descripcion}
                                        transaccion_fecha={item.transaccion_fecha}
                                        transaccion_metodo={item.transaccion_metodo}
                                        transaccion_monto={item.transaccion_monto}
                                        transaccion_tipo={item.transaccion_tipo}
                                        categoria_id={item.categoria_id}
                                    />
                                </View>
                            </View>
                            {transaccionesSeleccionadas[item.transaccion_id ?? 0]?.checked && tipoAMostrar === 'Ingreso' && (
                                <TextInput
                                    placeholder={i18n.t('Transactions.Amount')}
                                    keyboardType="decimal-pad"
                                    value={transaccionesSeleccionadas[item.transaccion_id ?? 0]?.montoTexto ?? ''}
                                    onChangeText={(value) => handleMontoChange(item.transaccion_id ?? 0, value)}
                                    style={{ borderWidth: 1, padding: 6, marginTop: 4, borderRadius: 8 }}
                                    onSubmitEditing={() => [handleSubmit(item.transaccion_id ?? 0)] }
                                />
                            )}
                            {transaccionesSeleccionadas[item.transaccion_id ?? 0]?.checked &&
                                tipoAMostrar === 'Gasto' &&
                                item.transaccion_monto <= saldoPresupuesto && (
                                    <Pressable
                                        onPress={() => handleSubmitPresupuestos(item.transaccion_id ?? 0, item.transaccion_monto)}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 8,
                                            borderRadius: 8,
                                            marginHorizontal: 4,
                                            alignItems: "center",
                                            backgroundColor: '#2195f3a9'
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{saldoPresupuesto} </Text>
                                    </Pressable>
                                )}


                        </Pressable>

                    )
                }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: "700",
        color: "#333",
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardSelected: {
        backgroundColor: "#e6f7ff",
        borderWidth: 1,
        borderColor: "#1890ff",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#999",
        textAlign: "center",
        textAlignVertical: "center",
        marginRight: 12,
        fontWeight: "bold",
        color: "#1890ff",
    },
    checkboxChecked: {
        backgroundColor: "#1890ff",
        color: "#fff",
    },
});
