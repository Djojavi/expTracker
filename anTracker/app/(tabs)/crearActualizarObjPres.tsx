import { useObjetivos } from "@/hooks/useCuentas"
import { useState } from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"

type CrearActualizarObjPresProps = {
    esCrear: boolean
    esObjetivo: boolean
}

export const CrearActualizarObjPres: React.FC<CrearActualizarObjPresProps> = ({ esCrear, esObjetivo }) => {
    const {crearCuenta} = useObjetivos()
    const [cuenta_nombre, setCuenta_nombre] = useState('')
    const [cuenta_descripcion, setCuenta_descripcion] = useState('')
    const [cuenta_monto, setCuenta_monto] = useState('') 

    const handleAdd = () =>{
        if(cuenta_nombre && cuenta_descripcion && cuenta_monto){
            if(esObjetivo){
                crearCuenta(cuenta_nombre,cuenta_descripcion,'O',Number(cuenta_monto))
            }else{
                crearCuenta(cuenta_nombre,cuenta_descripcion,'P',Number(cuenta_monto))
            }
            setToNull()
        }

    }
    const setToNull = () =>{
        setCuenta_descripcion('')
        setCuenta_monto('')
        setCuenta_nombre('')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {esCrear ? 'Nuevo' : 'Actualizar'}{esObjetivo ? ' Objetivo' : ' Presupuesto'}
            </Text>

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
