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

    useEffect(()=>{
        initializeTransacciones()
        initializeCategorias()
    },[])

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
                type: 'text/csv'
            });

            if (!result.canceled) {
                const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
                const importedData = parseCSV(content);

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
                                importedData.forEach((transaction: Transaccion) => addTransaccion(transaction));
                                Alert.alert('Success', 'Data imported successfully');
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
        const cadenaFecha = mes +"/"+fecha.getDate()+"/"+fecha.getFullYear()
        return cadenaFecha
    }
    function buscarCategoriaPorId(id: number): string {
        const categoria = categorias.find(cat => cat.categoria_id === id);
        return categoria?.categoria_nombre ?? 'Sin categoria';
    }

    const parseCSV = (csvContent: any) => {
        const rows = csvContent.split('\n').slice(1); // Skip headers
        return rows.filter((row: string) => row.trim()).map((row: { split: (arg0: string) => [any, any, any, any]; }) => {
            const [date, amount, category, description] = row.split(',');
            return {
                date,
                amount: parseFloat(amount),
                category,
                description
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