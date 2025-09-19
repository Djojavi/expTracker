import { useObjetivos } from "@/hooks/useCuentas"
import { useTransacciones } from "@/hooks/useTransacciones"
import { useEffect, useState } from "react"
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

type CrearActualizarObjPresProps = {
    esCrear: boolean
    esObjetivo: boolean
    onCloseSheet: () => void;
}

export const CrearActualizarObjPres: React.FC<CrearActualizarObjPresProps> = ({ esCrear, esObjetivo, onCloseSheet }) => {
    const { crearCuenta } = useObjetivos()
    const { getBalance } = useTransacciones()
    const [cuenta_nombre, setCuenta_nombre] = useState('')
    const [cuenta_descripcion, setCuenta_descripcion] = useState('')
    const [cuenta_monto, setCuenta_monto] = useState('')
    const [balance, setBalance] = useState(0)

    const initializeBalance = async () => {
        const data = await getBalance()
        setBalance(data)
    }

    useEffect(() => {
        initializeBalance()
    }, [])

    const handleAdd = () => {
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
            if (esObjetivo) {
                crearCuenta(cuenta_nombre, cuenta_descripcion, 'O', Number(cuenta_monto))
                Alert.alert('Objetivo creado exitosamente')
            } else {
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
                {esCrear ? 'Nuevo' : 'Actualizar'}{esObjetivo ? ' Objetivo' : ' Presupuesto'}
            </Text>

            {!esObjetivo &&
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontStyle: 'italic' }}>Tu saldo actual es:</Text>
                    <Text style={{ fontSize: 24, fontWeight: '500' }}>{balance} </Text>
                    <View style={{height:2, backgroundColor:'#b8b8b8ff', width:'90%', borderRadius:5}}></View>
                </View>
            }

            <TextInput
                style={styles.input}
                value={cuenta_nombre}
                onChangeText={setCuenta_nombre}
                placeholder="Nombre"
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                value={cuenta_descripcion}
                onChangeText={setCuenta_descripcion}
                placeholder="Descripción"
                multiline
            />

            <TextInput
                style={styles.input}
                placeholder="Monto"
                keyboardType="numeric"
                value={cuenta_monto}
                onChangeText={setCuenta_monto}
            />

            <Pressable style={styles.addButton} onPress={() => handleAdd()}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Listo!</Text>
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
