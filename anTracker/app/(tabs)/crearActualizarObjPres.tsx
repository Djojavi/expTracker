import { useObjetivos } from "@/hooks/useCuentas";
import { useTransacciones } from "@/hooks/useTransacciones";
import * as Localization from 'expo-localization';
import { I18n } from "i18n-js";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { en, es } from '../../utils/translations';
import { Cuenta } from "./objetivos";

type CrearActualizarObjPresProps = {
    esCrear: boolean
    esObjetivo: boolean
    onCloseSheet: () => void;
    id?: number;
}

export const CrearActualizarObjPres: React.FC<CrearActualizarObjPresProps> = ({ esCrear, esObjetivo, onCloseSheet, id }) => {
    let [locale, setLocale] = useState(Localization.getLocales())
    const i18n = new I18n();
    i18n.enableFallback = true;
    i18n.translations = { en, es };
    i18n.locale = locale[0].languageCode ?? 'en';

    const { crearCuenta, getCuenta, updateCuenta } = useObjetivos()
    const { getBalance } = useTransacciones()
    const [cuenta_nombre, setCuenta_nombre] = useState('')
    const [cuenta_descripcion, setCuenta_descripcion] = useState('')
    const [cuenta_monto, setCuenta_monto] = useState('')
    const [balance, setBalance] = useState(0)

    const initializeBalance = async () => {
        const data = await getBalance()
        setBalance(data)
    }

    const loadDataUpdate = async () => {
        if (!esCrear) {
            const cuenta = getCuenta(id ?? 0)
            setCuenta_descripcion((await cuenta).cuenta_descripcion ?? '')
            setCuenta_monto((await cuenta).cuenta_total.toString())
            setCuenta_nombre((await cuenta).cuenta_nombre)
        }
    }

    useEffect(() => {
        initializeBalance()
        loadDataUpdate()
    }, [])


    const handlePress = () => {
        if (!cuenta_nombre || !cuenta_descripcion || !cuenta_monto) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }

        const montoNum = Number(cuenta_monto);

        if (isNaN(montoNum) || montoNum <= 0) {
            Alert.alert("Error", "El monto debe ser un número válido mayor a 0.");
            return;
        }

        if (cuenta_nombre && cuenta_descripcion && cuenta_monto) {
            if (esObjetivo && esCrear) {//crear objetivo
                crearCuenta(cuenta_nombre, cuenta_descripcion, 'O', Number(cuenta_monto))
                Alert.alert('Objetivo creado exitosamente')
            } else if (!esCrear) {//actualizar 
                const cuentaActualizar: Cuenta = {
                    cuenta_nombre: cuenta_nombre,
                    cuenta_descripcion: cuenta_descripcion,
                    cuenta_total: Number(cuenta_monto),
                    cuenta_id: 0,
                    cuenta_actual: 0,
                    cuenta_progreso: 0,
                    cuenta_tipo: "",
                    se_repite: 0,
                    cuenta_frecuencia: 0
                }
                updateCuenta(id ?? 0, cuentaActualizar)
                Alert.alert('Cuenta actualizada exitosamente')
            } else if (!esObjetivo && esCrear) { //crear presupuesto
                if (Number(cuenta_monto) > balance) {
                    Alert.alert('Error', 'Este presupuesto excede tu balance actual!')
                } else {
                    Alert.alert('Presupuesto creado exitosamente')
                    crearCuenta(cuenta_nombre, cuenta_descripcion, 'P', Number(cuenta_monto))
                }
            }
            setToNull()
            onCloseSheet()
        }
    }

    const setToNull = () => {
        setCuenta_descripcion('')
        setCuenta_monto('')
        setCuenta_nombre('')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {esCrear ? i18n.t('Common.New') : i18n.t('Common.Update')}{esObjetivo ? ' ' + i18n.t('Common.Goal') : ' ' + i18n.t('Common.Budget')}
            </Text>

            {!esObjetivo &&
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontStyle: 'italic' }}>{i18n.t('GoalsBudgets.CurrentBalance')} </Text>
                    <Text style={{ fontSize: 24, fontWeight: '500' }}>$ {balance.toFixed(2)} </Text>
                    <View style={{ height: 2, backgroundColor: '#b8b8b8ff', width: '90%', borderRadius: 5 }}></View>
                </View>
            }
            <Text style={styles.labelTitle}>{i18n.t('Transactions.Name')}</Text>
            <TextInput
                style={styles.input}
                value={cuenta_nombre}
                onChangeText={setCuenta_nombre}
            />
            <Text style={styles.labelTitle}>{i18n.t('Transactions.Description')}</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={cuenta_descripcion}
                onChangeText={setCuenta_descripcion}
                multiline
            />
            <Text style={styles.labelTitle}>{i18n.t('Transactions.Amount')}</Text>
            <TextInput
                style={styles.input}
                placeholder={i18n.t('Transactions.Amount')}
                keyboardType="numeric"
                value={cuenta_monto}
                onChangeText={setCuenta_monto}
            />

            <Pressable style={styles.addButton} onPress={() => handlePress()}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>{i18n.t('Transactions.Done')}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        color: '#000',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        fontSize: 16,
    },
    labelTitle: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 8,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    addButton: {
        backgroundColor: '#A37366',
        borderRadius: 20,
        justifyContent: 'center',
        height: 45,
        width: 120,
        paddingHorizontal: 15,
        marginHorizontal: 10,
        alignSelf: 'center'
    },
})
