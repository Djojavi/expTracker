import { DrawerLayout } from '@/components/DrawerLayout';
import { useCategorias } from '@/hooks/useCategorias';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTransacciones } from '../../hooks/useTransacciones';
import { Categoria } from './categoria';
import { Transaccion } from './transacciones';
interface RBSheetRef {
    open: () => void;
    close: () => void;
}

export default function ImportExportScreen() {
    const { getTransacciones, deleteTransacciones, addTransaccion, getTransaccionExistente, updateTransaccion } = useTransacciones();
    const [transacciones, setTransacciones] = useState<Transaccion[]>([])
    const { getCategorias } = useCategorias();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [importarOpcion, setImportarOpcion] = useState('');

    const initializeTransacciones = async () => {
        try {
            const data = await getTransacciones();
            setTransacciones(data)
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const initializeCategorias = async () => {
        try {
            const data = await getCategorias();
            setCategorias(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        initializeTransacciones()
        initializeCategorias()
    }, [])

    const exportToCSV = async () => {
        try {

            const csvContent = generateCSV(transacciones);
            const fileUri = `${FileSystem.documentDirectory}antracker_transacciones.csv`;

            await FileSystem.writeAsStringAsync(fileUri, csvContent);
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            Alert.alert('Error', 'Failed to export data');
        }
    };

    const borrarTransacciones = async () => {
        Alert.alert('Se eliminarán todas las transacciones', 'Esta acción no puede ser revertida',
            [{ text: 'Cancelar', style: 'cancel' }, { text: 'OK', onPress: (() => deleteTransacciones()) }]
        )
    }

    const importFromCSV = async (opcion: string) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'text/csv',
                    'text/comma-separated-values',
                    'application/csv',
                    'application/vnd.ms-excel',
                    'text/plain'
                ]
            });

            if (!result.canceled) {
                const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
                const importedData: Transaccion[] = parseCSV(content);
                console.log("data importada", importedData)
                Alert.alert(
                    'Confirm Import',
                    'This will replace all existing data. Continue?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: async () => {
                                try {
                                    if (opcion === 'sobreescribir') {
                                        for (const imported of importedData) {
                                            const existing = await getTransaccionExistente(imported.transaccion_nombre, fechaASegundos(imported.transaccion_fecha.toString()), imported.transaccion_descripcion)

                                            if (existing) {
                                                await updateTransaccion(imported, existing.transaccion_id ?? 0)
                                            } else {
                                                await addTransaccion(imported)
                                            }
                                        }
                                    } else if (opcion === 'duplicar') {
                                        importedData.forEach((transaction: Transaccion) => addTransaccion(transaction));
                                    }
                                    Alert.alert('Success', 'Data imported successfully');
                                } catch (e: any) {
                                    console.log(e)
                                }
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to import data');
        }
    };

    const generateCSV = (data: Transaccion[]) => {
        const headers = 'Fecha,Monto,Nombre,Descripcion,Tipo,Categoria,Metodo\n';
        const rows = data.map(item =>
            `${segundosATiempo(item.transaccion_fecha)},${item.transaccion_monto},${item.transaccion_nombre},${item.transaccion_descripcion},${item.transaccion_tipo},${buscarCategoriaPorId(item.categoria_id)},${item.transaccion_metodo}`
        ).join('\n');
        return headers + rows;
    };
    function segundosATiempo(segundos: number): string {
        const fecha = new Date(segundos);
        const mes = fecha.getMonth() + 1
        const cadenaFecha = mes + "/" + fecha.getDate() + "/" + fecha.getFullYear()
        return cadenaFecha
    }
    function fechaASegundos(fecha: string): number {
        const [mes, dia, anio] = fecha.split("/").map(Number);
        const date = new Date(Date.UTC(anio, mes - 1, dia - 1));
        return date.getTime();
    }
    function buscarCategoriaPorId(id: number): string {
        const categoria = categorias.find(cat => cat.categoria_id === id);
        return categoria?.categoria_nombre ?? 'Sin categoria';
    }

    function buscaCategoriaPorNombre(nombre: string): number {
        const categoria = categorias.find(cat => cat.categoria_nombre === nombre);
        return categoria?.categoria_id ?? 0;
    }

    const parseCSV = (csvContent: any) => {
        const rows = csvContent.trim().split(/\r?\n/).slice(1);
        return rows.filter((row: string) => row.trim()).map((row: { split: (arg0: string) => [any, any, any, any, any, any, any]; }) => {
            const delimiter = csvContent.includes(';') ? ';' : ','
            const [fecha_cadena, transacccion_monto, transaccion_nombre, transaccion_descripcion, transaccion_tipo, categoria_nombre, transaccion_metodo] = row.split(delimiter);
            let categoria_id = buscaCategoriaPorNombre(categoria_nombre)
            let transaccion_fecha = fechaASegundos(fecha_cadena)
            return {
                transaccion_fecha,
                transaccion_monto: parseFloat(transacccion_monto),
                transaccion_nombre,
                transaccion_descripcion,
                transaccion_tipo,
                categoria_id,
                transaccion_metodo
            };
        });
    };


    const refRBSheet = useRef<RBSheetRef>(null);
    const importRefRBSheet = useRef<RBSheetRef>(null);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <DrawerLayout screenName='CSV' >
                <RBSheet
                    ref={refRBSheet}
                    height={400}
                    openDuration={300}
                    customStyles={{
                        container: {
                            padding: 15,
                            justifyContent: 'center',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }}
                >
                    <Text style={{ marginBottom: 8, color: '#db0202ff', fontWeight: 'bold' }}>
                        📄 El archivo CSV debe contener las siguientes columnas (en este orden):
                    </Text>

                    <Text style={{ marginLeft: 10, marginBottom: 4 }}>1. <Text style={{ fontWeight: 'bold' }}>fecha</Text> (formato: YYYY-MM-DD)</Text>
                    <Text style={{ marginLeft: 10, marginBottom: 4 }}>2. <Text style={{ fontWeight: 'bold' }}>monto</Text> (usar punto “.” para decimales, sin símbolos)</Text>
                    <Text style={{ marginLeft: 10, marginBottom: 4 }}>3. <Text style={{ fontWeight: 'bold' }}>nombre</Text> (ej: "Supermercado")</Text>
                    <Text style={{ marginLeft: 10, marginBottom: 4 }}>4. <Text style={{ fontWeight: 'bold' }}>descripcion</Text> (detalle opcional)</Text>
                    <Text style={{ marginLeft: 10, marginBottom: 4 }}>5. <Text style={{ fontWeight: 'bold' }}>tipo</Text> (Ingreso o Gasto)</Text>
                    <Text style={{ marginLeft: 10, marginBottom: 4 }}>6. <Text style={{ fontWeight: 'bold' }}>categoria</Text> (ej: "Alimentos" – debe existir previamente)</Text>
                    <Text style={{ marginLeft: 10, marginBottom: 8 }}>7. <Text style={{ fontWeight: 'bold' }}>metodo</Text> (ej: "Efectivo", "Tarjeta")</Text>

                    <Text style={{ marginTop: 4, fontStyle: 'italic' }}>
                        Ejemplo válido:
                        {"\n"}2025-08-14,200,Venta libro usado,Ingreso extra,Ingreso,Otros,Efectivo
                    </Text>

                </RBSheet>

                <RBSheet ref={importRefRBSheet}
                    height={400}
                    openDuration={300}
                    customStyles={{
                        container: {
                            padding: 15,
                            justifyContent: 'center',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }}>
                    <Text style={styles.title}>¿Cómo deseas importar tus datos?</Text>
                    <Text style={styles.subtitle}>Si existen transacciones ya existentes, deseas...</Text>

                    <TouchableOpacity
                        onPress={() => importFromCSV('sobreescribir')}
                        style={styles.btnOpciones}
                    >
                        <Text style={{ color: '#000000ff', fontWeight: 'bold' }}>Sobreescribirlas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => importFromCSV('duplicar')}
                        style={styles.btnOpciones}
                    >
                        <Text style={{ color: '#000000ff', fontWeight: 'bold' }}>Duplicarlas</Text>
                    </TouchableOpacity>

                </RBSheet>

                <View style={styles.card}>
                    <Text style={styles.title}>Importar transacciones desde CSV</Text>
                    <TouchableOpacity
                        onPress={() => refRBSheet.current?.open()}
                        style={styles.btnInstrucciones}
                    >
                        <Text style={{ color: '#000000ff', fontWeight: 'bold' }}>¿Cómo se debe importar las transacciones?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => importRefRBSheet.current?.open()}
                        style={styles.btn}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Importar</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.card}>
                    <Text style={styles.title}>Exportar transacciones a CSV</Text>
                    <TouchableOpacity
                        onPress={exportToCSV}
                        style={styles.btn}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Exportar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Eliminar todas las Transacciones</Text>
                    <TouchableOpacity
                        onPress={() => borrarTransacciones()}
                        style={styles.btnEliminar}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Eliminar</Text>
                    </TouchableOpacity>
                </View>

            </DrawerLayout>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F7FA',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 15,
        margin: 5,
        marginHorizontal:20
    },
    btn: {
        alignSelf: 'center',
        marginVertical: 20,
        width: 250,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        borderColor: '#A37366',
        borderWidth: 2,
        backgroundColor: '#A37366',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnOpciones: {
        alignSelf: 'center',
        width: 250,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#c9dff8ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    btnInstrucciones: {
        alignSelf: 'center',
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#d6d6d6ff',
        padding: 10
    },
    btnEliminar: {
        alignSelf: 'center',
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#f80606ff',
        padding: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        fontStyle: 'italic'
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    separator: {
        height: 20,
    },
});