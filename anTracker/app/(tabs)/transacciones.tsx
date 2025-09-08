import { CategoriasModal } from '@/components/categoriesModal';
import { DatePickers } from '@/components/DatePickers';
import { DrawerLayout } from '@/components/DrawerLayout';
import { SearchExpandable } from '@/components/searchBar';
import { TransaccionItemComponent } from '@/components/transaccionItem';
import { useCategorias } from '@/hooks/useCategorias';
import { useTransacciones } from '@/hooks/useTransacciones';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Categoria } from './categoria';

//Pantalla con las transacciones

export type Transaccion = {
    transaccion_id?: number,
    categoria_id: number,
    transaccion_nombre: string,
    transaccion_monto: number,
    transaccion_metodo: string,
    transaccion_fecha: number,
    transaccion_descripcion: string,
    transaccion_tipo: string
}


interface RBSheetRef {
    open: () => void;
    close: () => void;
}

const RadioButton = (props: any) => {
    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={[{
                height: 22,
                width: 22,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#A37366',
                alignItems: 'center',
                justifyContent: 'center',
            }, props.style]}>
                {
                    props.selected ?
                        <View style={{
                            height: 14,
                            width: 14,
                            borderRadius: 10,
                            backgroundColor: '#A37366',
                        }} />
                        : null
                }
            </View>
        </TouchableWithoutFeedback>
    );
};



const Transacciones = () => {
    const { getCategorias } = useCategorias();
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    let isMounted = true;
    const { addTransaccion, getTransacciones, getTransaccion, updateTransaccion, deleteTransaccion, getTransaccionesPorFecha, getTransaccionesByName, getTransaccionesByCategoria } = useTransacciones();
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [tipo, setTipo] = useState('');
    const [fecha, setFecha] = useState('');
    const [metodo, setMetodo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [balance, setBalance] = useState(0);
    const [ingresos, setIngresos] = useState(0);
    const [gastos, setGastos] = useState(0);
    const [transaccionesFiltradas, setTransaccionesFiltradas] = useState<Transaccion[]>([]);
    const [idActualizar, setIdActualizar] = useState(0);
    const [idBorrar, setIdBorrar] = useState(0);
    const [rango, setRango] = useState<{ inicio: number; fin: number } | null>(null);

    const handleSeleccionFechas = async (inicio: number, fin: number) => {
        setRango({ inicio, fin });
        try {
            const data = await getTransaccionesPorFecha(inicio, fin);
            if (isMounted) {
                setTransacciones(data);
                setTransaccionesFiltradas(data);
            }
            calcularBalance(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSubmitNombre = async (nombre: string) => {
        try {
            const data = await getTransaccionesByName(nombre);
            setTransacciones(data)
            setTransaccionesFiltradas(data)
            calcularBalance(data)
        } catch (error) {
            console.error(error)
        }
    }

    const initializeCategorias = async () => {
        try {
            const data = await getCategorias();
            if (isMounted) {
                setCategorias(data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const initializeTransacciones = async () => {
        try {
            const data = await getTransacciones();
            if (isMounted) {
                setTransacciones(data);
                setTransaccionesFiltradas(data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        initializeCategorias();
        initializeTransacciones();
        calcularBalance(transacciones);
        return () => { isMounted = false };
    }, []);

    useEffect(() => {
        if (transacciones) {
            calcularBalance(transacciones);
        }
    }, [transacciones]);


    const refRBSheet = useRef<RBSheetRef>(null);
    const updateRefRBSheet = useRef<RBSheetRef>(null);

    const handleAddTransaccion = async () => {
        console.log('Current state values:', { nombre, descripcion, monto, tipo, categoria, metodo });
        if (nombre && descripcion && monto && tipo && categoria && metodo) {
            const fechaNumero = Date.now();
            const nuevaTransaccion: Transaccion = { categoria_id: Number(categoria), transaccion_monto: Number(monto), transaccion_nombre: nombre, transaccion_metodo: metodo, transaccion_fecha: fechaNumero, transaccion_descripcion: descripcion, transaccion_tipo: tipo }
            try {
                const result = await addTransaccion(nuevaTransaccion)
                setNombre('');
                setDescripcion('');
                setMonto('');
                setFecha('');
                setCategoria('');
                setTipo('');
                refRBSheet.current?.close();
            } catch (e: any) {
                console.log(e)
            }

        } else {
            Alert.alert('Error', 'El monto debe ser mayor a 0!', [
                { text: 'Entendido', onPress: () => console.log('OK Pressed') },
            ]);
        }
    }

    const handleUpdateTransaccion = async (transaccion_id: number) => {
        console.log('handleAddTransaccion called');
        console.log('Current state values:', { nombre, descripcion, monto, tipo, categoria, metodo });
        if (nombre && descripcion && monto && tipo && categoria && metodo) {
            const fechaNumero = Date.now();
            const actualizadaTransaccion: Transaccion = { categoria_id: Number(categoria), transaccion_monto: Number(monto), transaccion_nombre: nombre, transaccion_metodo: metodo, transaccion_fecha: fechaNumero, transaccion_descripcion: descripcion, transaccion_tipo: tipo }
            try {
                const result = await updateTransaccion(actualizadaTransaccion, transaccion_id)
                setNombre('');
                setDescripcion('');
                setMonto('');
                setFecha('');
                setCategoria('');
                setTipo('');
                updateRefRBSheet.current?.close();
            } catch (e: any) {
                console.log(e)
            }

        } else {
            Alert.alert('Error', 'El monto debe ser mayor a 0!', [
                { text: 'Entendido', onPress: () => console.log('OK Pressed') },
            ]);
        }
    }

    const calcularBalance = (arrayTransacciones: Transaccion[]) => {
        let nuevoBalance = 0, nuevoIngresos = 0, nuevoGastos = 0;
        arrayTransacciones.forEach(item => {
            const monto = item.transaccion_monto;
            if (!isNaN(monto)) {
                if (item.transaccion_tipo === 'Ingreso') {
                    nuevoBalance += monto;
                    nuevoIngresos += monto;
                } else if (item.transaccion_tipo === 'Gasto') {
                    nuevoBalance -= monto;
                    nuevoGastos -= monto;
                }
            }
        });

        if (nuevoGastos !== 0) {
            nuevoGastos = nuevoGastos * -1;
        }

        setBalance(nuevoBalance);
        setIngresos(nuevoIngresos);
        setGastos(nuevoGastos);
    };

    const handleLongPress = (id: number) => {
        setIdActualizar(id);
        setIdBorrar(id);
        getTransaccionVista(id);
        updateRefRBSheet.current?.open();
    };

    const getTransaccionVista = async (id: number) => {
        const transaccionEncontrada = await getTransaccion(id);
        if (transaccionEncontrada) {
            setNombre(transaccionEncontrada.transaccion_nombre);
            setDescripcion(transaccionEncontrada.transaccion_descripcion);
            setMonto(transaccionEncontrada.transaccion_monto.toString());
            setTipo(transaccionEncontrada.transaccion_tipo);
            setCategoria(transaccionEncontrada.categoria_id.toString());
            setMetodo(transaccionEncontrada.transaccion_metodo)
        } else {
            console.log('problema al encontrar la transaccion')
        }
    };

    const handleDeleteTransaccion = async (id: number) => {
        const resultado = await deleteTransaccion(id);
        if (!resultado) {
            Alert.alert('Error', 'No se eliminó correctamente, intente de nuevo', [
                { text: 'Entendido', onPress: () => console.log('OK Pressed') },
            ]);
        } else {
            updateRefRBSheet.current?.close()
            Alert.alert('Éxito', 'Se ha eliminado correctamente la transacción', [
                { text: 'Entendido', onPress: () => console.log('OK Pressed') },
            ]);
        }
        initializeTransacciones();
    }
    const setToNull = () => {
        setNombre('');
        setDescripcion('');
        setMonto('');
        setTipo('');
        setCategoria('');
        setMetodo('');
    }

    const buscarPorCategorias = async(id:number[]) =>{
        console.log("ID", id)
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -500}
        >
            <DrawerLayout screenName='Transacciones' >
                <RBSheet
                    ref={refRBSheet}
                    onOpen={() => setToNull()}
                    height={600}
                    openDuration={300}
                    customStyles={{
                        container: {
                            padding: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }}
                >
                    <Text style={styles.addTransaccion}>Añadir Transacción</Text>
                    <View style={styles.radioButtonContainer}>
                        <View style={styles.radioButtonRow}>
                            <RadioButton
                                selected={tipo === 'Ingreso'}
                                onPress={() => setTipo('Ingreso')}
                                style={styles.radioButton}
                            />
                            <Text style={styles.radioText}>Ingreso</Text>
                        </View>
                        <View style={styles.radioButtonRow}>
                            <RadioButton
                                selected={tipo === 'Gasto'}
                                onPress={() => setTipo('Gasto')}
                                style={styles.radioButton}
                            />
                            <Text style={styles.radioText}>Gasto</Text>
                        </View>
                    </View>
                    <View style={styles.nombreContainer}>
                        <TextInput
                            style={styles.inputNombre}
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        <Text style={styles.signoDolar}>$</Text>
                        <TextInput
                            style={styles.inputMonto}
                            placeholder='Monto'
                            keyboardType='numeric'
                            value={monto}
                            onChangeText={setMonto}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Método eg. efectivo, transferencia"
                        value={metodo}
                        onChangeText={setMetodo}
                    />
                    <Text style={styles.catText}>Selecciona una categoría!</Text>
                    <FlatList
                        data={categorias}
                        removeClippedSubviews={true}
                        renderItem={({ item }) => (
                            <TouchableWithoutFeedback onPress={() => setCategoria(item.categoria_id?.toString() ?? ' ')}>
                                <View style={[styles.item, Number(categoria) === item.categoria_id && styles.selectedItem]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={[styles.circularTextView, { backgroundColor: item.categoria_color }]} />
                                        <Text style={styles.itemText}>{item.categoria_nombre}</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <TouchableOpacity style={styles.addNombreButton} onPress={() => handleAddTransaccion()}>
                        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                            Listo!
                        </Text>
                    </TouchableOpacity>
                </RBSheet>

                <RBSheet
                    ref={updateRefRBSheet}
                    height={600}
                    openDuration={200}
                    customStyles={{
                        container: {
                            padding: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }}
                >
                    <Text style={styles.addTransaccion}>Actualizar Transacción</Text>
                    <View style={styles.radioButtonContainer}>
                        <View style={styles.radioButtonRow}>
                            <RadioButton
                                selected={tipo === 'Ingreso'}
                                onPress={() => setTipo('Ingreso')}
                                style={styles.radioButton}
                            />
                            <Text style={styles.radioText}>Ingreso</Text>
                        </View>
                        <View style={styles.radioButtonRow}>
                            <RadioButton
                                selected={tipo === 'Gasto'}
                                onPress={() => setTipo('Gasto')}
                                style={styles.radioButton}
                            />
                            <Text style={styles.radioText}>Gasto</Text>
                        </View>
                    </View>
                    <View style={styles.nombreContainer}>
                        <TextInput
                            style={styles.inputNombre}
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        <Text style={styles.signoDolar}>$</Text>
                        <TextInput
                            style={styles.inputMonto}
                            placeholder='Monto'
                            keyboardType='numeric'
                            value={monto}
                            onChangeText={setMonto}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Método"
                        value={metodo}
                        onChangeText={setMetodo}
                    />
                    <Text style={styles.catText}>Selecciona una categoría!</Text>
                    <FlatList
                        data={categorias}
                        removeClippedSubviews={true}
                        renderItem={({ item }) => (
                            <TouchableWithoutFeedback onPress={() => setCategoria(item.categoria_id?.toString() ?? '')}>
                                <View style={[styles.item, Number(categoria) === item.categoria_id && styles.selectedItem]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={[styles.circularTextView, { backgroundColor: item.categoria_color }]} />
                                        <Text style={styles.itemText}>{item.categoria_nombre}</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <TouchableOpacity style={styles.addNombreButton} onPress={() => handleUpdateTransaccion(idActualizar)}>
                        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                            Listo!
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.deleteButton, { marginTop: 5 }]} onPress={() => handleDeleteTransaccion(idBorrar)}
                    >
                        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                            Eliminar Transacción
                        </Text>

                    </TouchableOpacity>


                </RBSheet>
                <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <SearchExpandable onSubmitSearch={handleSubmitNombre} />
                            <CategoriasModal onSubmit={buscarPorCategorias} />
                            <DatePickers onSeleccionar={handleSeleccionFechas} />
                        </ScrollView>
                    </View>

                    <View style={styles.conatinerEstadisticas}>
                        <Text style={{ fontSize: 30, alignSelf: 'center' }}>$ {balance.toFixed(2)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Link href={'/(tabs)/ingresos'}>
                            <View style={styles.ingresos}>
                                <Text style={styles.balanceIngreso}>+ ${ingresos.toFixed(2)} </Text>
                            </View>
                        </Link>

                        <Link href={'/(tabs)/gastos'}>
                            <View style={styles.gastos}>
                                <Text style={styles.balanceGastos}>- ${gastos.toFixed(2)}</Text>
                            </View>
                        </Link>
                    </View>



                    <TouchableOpacity style={[styles.changeColor, { alignItems: 'center', justifyContent: 'center' }]} onPress={() => refRBSheet.current?.open()}>
                        <Text style={{ color: 'white' }}>Añadir transacción</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <FlatList
                        data={transaccionesFiltradas}
                        renderItem={({ item }) => (
                            <Pressable onLongPress={() => { handleLongPress(item.transaccion_id ? item.transaccion_id : 0) }}>
                                <TransaccionItemComponent
                                    transaccion_nombre={item.transaccion_nombre}
                                    transaccion_descripcion={item.transaccion_descripcion}
                                    transaccion_monto={item.transaccion_monto}
                                    transaccion_fecha={item.transaccion_fecha}
                                    transaccion_metodo={item.transaccion_metodo}
                                    transaccion_tipo={item.transaccion_tipo}
                                    categoria_id={item.categoria_id}
                                />
                            </Pressable>
                        )}
                        keyExtractor={(item, index) => item.transaccion_id?.toString() ?? index.toString()}
                        style={styles.flatList}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={true}
                    />
                </View>

            </DrawerLayout>


        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    ingresos: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 5,
        padding: 9,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dias: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 7,
    },
    gastos: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 5,
        padding: 9,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    conatinerEstadisticas: {
        backgroundColor: '#fff',
        flexDirection: 'column',
        marginHorizontal: 19,
        marginRight: 25,
        padding: 12,
        paddingHorizontal: 55,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 5
    },
    balanceGastos: {
        color: '#BF0000',
        fontSize: 24,
        padding: 3,
    },
    balanceIngreso: {
        padding: 3,
        color: '#1F7900',
        fontSize: 24,
    },
    containerLeft: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flexWrap: 'wrap',
        width: '60%',
    },
    containerRight: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    montoIngreso: {
        fontSize: 18,
        color: '#1F7900'
    },
    montoGasto: {
        fontSize: 18,
        color: '#BF0000'
    },
    montoDefault: {
        color: '#fefefe',
        backgroundColor: '#BF0000'
    },
    catText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    inputMonto: {
        fontSize: 18,
        marginRight: 35,
        marginTop: 1
    },
    signoDolar: {
        fontSize: 25,
        fontWeight: '400',
        marginRight: 10
    },
    circularTextView: {
        width: 10,
        height: 30,
        borderRadius: 50,
        marginLeft: 10,
        marginRight: 15
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    changeColor: {
        alignSelf: 'center',
        marginVertical: 10,
        width: 250,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        borderColor: '#A37366',
        borderWidth: 2,
        backgroundColor: '#A37366',
    },
    deleteButton: {
        backgroundColor: '#ff6161',
        borderRadius: 8,
        padding: 10,
        height: 45,
        width: 330,
        opacity: 0.85
    },
    addTransaccion: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    container: {
        flex: 1,
        backgroundColor: '#E0F7FA',
    },
    homeButton: {
        width: 50,
        backgroundColor: '#fff',
        borderColor: '#000',
        height: 40,
        marginTop: 30,
        marginLeft: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
        marginBottom: 45
    },
    flatList: {
        flex: 1,
    },
    inputContainer: {
        padding: 15,
        paddingHorizontal: 45,
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    nombreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
    },
    inputNombre: {
        color: '#000',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        flex: 1,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        marginRight: 10,
        fontSize: 18
    },
    input: {
        color: '#000',
        padding: 10,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        width: '100%',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        fontSize: 18
    },
    addNombreButton: {
        backgroundColor: '#A37366',
        borderRadius: 20,
        justifyContent: 'center',
        height: 45,
        width: 120,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    addButton: {
        backgroundColor: '#A37366',
        width: 320,
        marginTop: 10,
        borderRadius: 8,
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
    selectedItem: {
        backgroundColor: '#D3AEA2',
    },
    itemText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000'
    },
    description: {
        fontSize: 14,
        color: '#757575',
        marginTop: 5,
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        justifyContent: 'space-around',
        marginVertical: 10,
        width: '100%',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
        width: '90%',
    },
    radioButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    radioButton: {
        marginHorizontal: 6,
    },
    radioText: {
        fontSize: 18,
    },
});

export default Transacciones;