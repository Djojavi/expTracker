import { DrawerLayout } from '@/components/DrawerLayout';
import { useCategorias } from '@/hooks/useCategorias';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTransacciones } from '../../hooks/useTransacciones';
import { Categoria } from './categoria';
import { Transaccion } from './transacciones';

export default function ImportExportScreen() {
    const { getTransacciones, addTransaccion } = useTransacciones();
    const [transacciones, setTransacciones] = useState<Transaccion[]>([])
    const { getCategorias } = useCategorias();
    const [categorias, setCategorias] = useState<Categoria[]>([]);

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

    const importFromCSV = async () => {
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
                const importedData = parseCSV(content);
                console.log("data importada",importedData)
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
                            onPress: () => {
                                try {
                                    importedData.forEach((transaction: Transaccion) => addTransaccion(transaction));
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
        const date = new Date(Date.UTC(anio, mes - 1, dia));
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

    return (
        <DrawerLayout screenName='CSV' >
            <View style={styles.container}>
                <Text style={styles.title}>Import/Export Data</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={exportToCSV}
                    >
                        <Text>Exportar</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity
                        onPress={importFromCSV}
                    >
                        <Text>Importar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </DrawerLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    separator: {
        height: 20,
    },
});