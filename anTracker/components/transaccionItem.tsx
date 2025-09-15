import { useCategorias } from "@/hooks/useCategorias"
import { formatDate } from "@/utils/dateutils"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

type TransaccionItemProps = {
    transaccion_descripcion: string
    transaccion_nombre: string,
    transaccion_monto: number
    transaccion_metodo: string
    transaccion_fecha: number
    categoria_id: number
    transaccion_tipo: string
}

export const TransaccionItemComponent: React.FC<TransaccionItemProps> = ({ transaccion_descripcion, transaccion_nombre, transaccion_monto, transaccion_fecha, categoria_id, transaccion_tipo, transaccion_metodo }) => {
    const { getCategoriaById } = useCategorias()
    const [catName, setCatName] = useState('')

    useEffect(() => {
        const handleCategoriaById = async () => {
            try {
                let nombre = await getCategoriaById(categoria_id)
                setCatName(nombre.categoria_nombre)
            } catch (error) {
                console.error(error)
            }
        }
        handleCategoriaById()
    }, [categoria_id])
    return (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <View style={styles.containerLeft}>
                    <Text style={styles.title}>{transaccion_nombre}</Text>
                    <View>
                        <Text style={styles.description}>{transaccion_descripcion}</Text>
                        <Text>{formatDate(transaccion_fecha)}</Text>
                    </View>
                </View>
                <View style={styles.containerRight}>
                    <Text >{catName}</Text>
                    {transaccion_monto ? (
                        <Text
                            style={
                                transaccion_tipo === 'Ingreso'
                                    ? styles.montoIngreso
                                    : transaccion_tipo === 'Gasto'
                                        ? styles.montoGasto
                                        : styles.montoDefault
                            }
                        >
                            {transaccion_tipo === 'Ingreso'
                                ? `+$${transaccion_monto.toFixed(2)}`
                                : transaccion_tipo === 'Gasto'
                                    ? `-$${transaccion_monto.toFixed(2)}`
                                    : `$${transaccion_monto.toFixed(2)}`}
                        </Text>

                    ) : null}
                    <Text style={styles.description} >{transaccion_metodo}</Text>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        width:'60%'
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
})