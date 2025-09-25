import { CategoriasModal } from '@/components/categoriesModal';
import { DatePickers } from '@/components/DatePickers';
import { DrawerLayout } from '@/components/DrawerLayout';
import { SearchExpandable } from '@/components/searchBar';
import { TransaccionItemComponent } from '@/components/transaccionItem';
import { NoData } from '@/components/ui/NoData';
import { useCategorias } from '@/hooks/useCategorias';
import { useObjetivos } from '@/hooks/useCuentas';
import { useTransacciones } from '@/hooks/useTransacciones';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import RBSheet from 'react-native-raw-bottom-sheet';
import i18n from '../../utils/i18n';
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
    const { addTransaccion, getTransacciones, getTransaccion, updateTransaccion, deleteTransaccion, getTransaccionesPorFecha, getTransaccionesByName, getTransaccionesByCategoria, getIngresoBalance, getGastoBalance, getBalance, getIngresosGastosPorFecha, getIngresosYGastosByCategoria, getIngresosYGastosByName } = useTransacciones();
    const { getPresupuestadoBalance } = useObjetivos();
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
    const [presupuestado, setPresupuestado] = useState(0);
    const [gastos, setGastos] = useState(0);
    const [transaccionesFiltradas, setTransaccionesFiltradas] = useState<Transaccion[]>([]);
    const [idActualizar, setIdActualizar] = useState(0);
    const [idBorrar, setIdBorrar] = useState(0);
    const [rango, setRango] = useState<{ inicio: number; fin: number } | null>(null);

    const handleSeleccionFechas = async (inicio: number, fin: number) => {
        setRango({ inicio, fin });
        try {
            const data = await getTransaccionesPorFecha(inicio, fin);
            const { ingresos, gastos } = await getIngresosGastosPorFecha(inicio, fin)
            setIngresos(ingresos)
            setGastos(gastos)
            setBalance(ingresos - gastos)
            setPresupuestado(0)
            if (isMounted) {
                setTransacciones(data);
                setTransaccionesFiltradas(data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const buscarPorCategorias = async (ids: number[]) => {
        try {
            const resultados = await Promise.all(ids.map(id => getTransaccionesByCategoria(id)))
            const results = await Promise.all(ids.map(id => getIngresosYGastosByCategoria(id)));
            const total = results.reduce(
                (acc, curr) => {
                    acc.ingresos += curr.ingBalance;
                    acc.gastos += curr.gastoBalance;
                    return acc;
                },
                { ingresos: 0, gastos: 0 }
            );
            setIngresos(total.ingresos)
            setGastos(total.gastos)
            setBalance(total.ingresos - total.gastos)
            setPresupuestado(0)

            const todasTransacciones = resultados.flat()
            setTransacciones(todasTransacciones)
            setTransaccionesFiltradas(todasTransacciones)
            //calcularBalance()
            if (ids.includes(0) || ids.length === 0) {
                initializeTransacciones();
            }
        } catch (error) {
            console.error(error)
        }
    }


    const handleSubmitNombre = async (nombre: string) => {
        try {
            const data = await getTransaccionesByName(nombre);
            const results = await getIngresosYGastosByName(nombre);
            setIngresos(results.ingBalance)
            setGastos(results.gastoBalance)
            setBalance(results.ingBalance - results.gastoBalance)
            setPresupuestado(0)
            setTransacciones(data)
            setTransaccionesFiltradas(data)
            //calcularBalance()
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
            calcularBalance()
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        initializeCategorias();
        initializeTransacciones();
        calcularBalance();
        return () => { isMounted = false };
    }, []);

    useEffect(() => {
        calcularBalance();
    }, [])


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
                initializeTransacciones();
            } catch (e: any) {
                console.log(e)
            }

        } else {
            Alert.alert('Error','', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
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
                initializeTransacciones();
            } catch (e: any) {
                console.log(e)
            }

        } else {
            Alert.alert('Error', '', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    }

    const calcularBalance = async () => {
        const ingresoData = await getIngresoBalance()
        let gastoData = await getGastoBalance()
        const presupuestadoData = await getPresupuestadoBalance()
        const balanceData = await getBalance()


        setBalance(balanceData);
        setIngresos(ingresoData);
        setGastos(gastoData);
        setPresupuestado(presupuestadoData);
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
            Alert.alert('Error', i18n.t('Transactions.errorDelete'), [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        } else {
            updateRefRBSheet.current?.close()
            Alert.alert('Ok', i18n.t('Transactions.successDelete'), [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
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

    const [isFocus, setIsFocus] = useState(true);


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -500}
        >
            <DrawerLayout screenName={i18n.t('Home.Transactions')} >
                <RBSheet
                    ref={refRBSheet}
                    onOpen={() => setToNull()}
                    height={500}
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
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <Text style={styles.addTransaccion}>{i18n.t('Transactions.aTransaction')} </Text>
                        <View style={styles.radioButtonContainer}>
                            <View style={styles.radioButtonRow}>
                                <RadioButton
                                    selected={tipo === 'Ingreso'}
                                    onPress={() => setTipo('Ingreso')}
                                    style={styles.radioButton}
                                />
                                <Text style={styles.radioText}> {i18n.t('Menu.Income')} </Text>
                            </View>
                            <View style={styles.radioButtonRow}>
                                <RadioButton
                                    selected={tipo === 'Gasto'}
                                    onPress={() => setTipo('Gasto')}
                                    style={styles.radioButton}
                                />
                                <Text style={styles.radioText}>{i18n.t('Menu.Expenses')}</Text>
                            </View>
                        </View>
                        <View style={styles.nombreContainer}>
                            <TextInput
                                style={styles.inputNombre}
                                placeholder={i18n.t('Transactions.Name')}
                                value={nombre}
                                onChangeText={setNombre}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.signoDolar}>$</Text>
                                <TextInput
                                    style={styles.inputMonto}
                                    placeholder={i18n.t('Transactions.Amount')}
                                    keyboardType='numeric'
                                    value={monto}
                                    onChangeText={setMonto}
                                />
                            </View>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder={i18n.t('Transactions.Description')}
                            value={descripcion}
                            onChangeText={setDescripcion}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={i18n.t('Transactions.Method')}
                            value={metodo}
                            onChangeText={setMetodo}
                        />
                        <Text style={styles.catText}>{i18n.t('Transactions.SelectCategory')}</Text>
                        <View >
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'black', width: '100%' }]}
                                data={categorias}
                                labelField="categoria_nombre"
                                valueField="categoria_id"
                                placeholder={i18n.t('Transactions.FindCategory')}
                                value={categoria}
                                onChange={item => setCategoria(item.categoria_id)}
                                renderItem={(item) => (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                                        <View style={[styles.circle, { backgroundColor: item.categoria_color }]} />
                                        <Text style={{ marginLeft: 8 }}>{item.categoria_nombre}</Text>
                                    </View>
                                )}
                            />
                            <View
                                style={[
                                    styles.circleDown,
                                    { backgroundColor: categorias.find(c => c.categoria_id === Number(categoria))?.categoria_color }
                                ]}
                            />
                        </View>
                        <TouchableOpacity style={styles.addNombreButton} onPress={() => handleAddTransaccion()}>
                            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                                {i18n.t('Transactions.Done')}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </RBSheet>

                <RBSheet
                    ref={updateRefRBSheet}
                    height={500}
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.addTransaccion}>{i18n.t('Transactions.uTransaction')}</Text>
                        <View style={styles.radioButtonContainer}>
                            <View style={styles.radioButtonRow}>
                                <RadioButton
                                    selected={tipo === 'Ingreso'}
                                    onPress={() => setTipo('Ingreso')}
                                    style={styles.radioButton}
                                />
                                <Text style={styles.radioText}>{i18n.t('Menu.Income')}</Text>
                            </View>
                            <View style={styles.radioButtonRow}>
                                <RadioButton
                                    selected={tipo === 'Gasto'}
                                    onPress={() => setTipo('Gasto')}
                                    style={styles.radioButton}
                                />
                                <Text style={styles.radioText}>{i18n.t('Menu.Expenses')}</Text>
                            </View>
                        </View>
                        <View style={styles.nombreContainer}>
                            <TextInput
                                style={styles.inputNombre}
                                placeholder={i18n.t('Transactions.Name')}
                                value={nombre}
                                onChangeText={setNombre}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.signoDolar}>$</Text>
                                <TextInput
                                    style={styles.inputMonto}
                                    placeholder={i18n.t('Transactions.Amount')}
                                    keyboardType='numeric'
                                    value={monto}
                                    onChangeText={setMonto}
                                />
                            </View>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder={i18n.t('Transactions.Description')}
                            value={descripcion}
                            onChangeText={setDescripcion}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={i18n.t('Transactions.Method')}
                            value={metodo}
                            onChangeText={setMetodo}
                        />
                        <View >

                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                                data={categorias}
                                labelField="categoria_nombre"
                                valueField="categoria_id"
                                value={Number(categoria)}
                                onChange={item => setCategoria(item.categoria_id)}
                                renderItem={(item) => (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                                        <View style={[styles.circle, { backgroundColor: item.categoria_color }]} />
                                        <Text style={{ marginLeft: 8 }}>{item.categoria_nombre}</Text>
                                    </View>
                                )}
                            />
                            <View
                                style={[
                                    styles.circleDown,
                                    { backgroundColor: categorias.find(c => c.categoria_id === Number(categoria))?.categoria_color }
                                ]}
                            />
                        </View>
                        <TouchableOpacity style={styles.addNombreButton} onPress={() => handleUpdateTransaccion(idActualizar)}>
                            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                                {i18n.t('Transactions.Done')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.deleteButton, { marginTop: 5 }]} onPress={() => handleDeleteTransaccion(idBorrar)}
                        >
                            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                                {i18n.t('Transactions.dTransaction')}
                            </Text>

                        </TouchableOpacity>

                    </ScrollView>
                </RBSheet>
                <View style={{ justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 13 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <SearchExpandable onSubmitSearch={handleSubmitNombre} />
                            <CategoriasModal onSubmit={buscarPorCategorias} />
                            <DatePickers onSeleccionar={handleSeleccionFechas} />
                        </ScrollView>
                    </View>

                    <View style={{ alignItems: 'center', padding: 5 }}>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                width: '95%',
                                paddingVertical: 15,
                                borderRadius: 16,
                                elevation: 4,
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowRadius: 6,
                                marginBottom: 5,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 14, color: '#666' }}>{i18n.t('Transactions.Balance')}</Text>
                            <Text
                                style={{ fontSize: 32, fontWeight: 'bold', color: '#333' }}
                                adjustsFontSizeToFit
                                numberOfLines={1}
                            >
                                $ {balance.toFixed(2)}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                gap: 5,
                                width: '85%',
                            }}
                        >
                            <Link href={'/(tabs)/ingresos'} style={{ flex: 1 }}>
                                <View style={styles.card}>
                                    <Text style={styles.label1}>{i18n.t('Menu.Income')}</Text>
                                    <Text
                                        style={[styles.amount, { color: '#1F7900' }]}
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                    >
                                        + ${ingresos.toFixed(2)}
                                    </Text>
                                </View>
                            </Link>
                            <View style={styles.card}>
                                <Text style={styles.label1}>{i18n.t('Transactions.Budgeted')}</Text>
                                <Text
                                    style={[styles.amount, { color: '#120079' }]}
                                    adjustsFontSizeToFit
                                    numberOfLines={1}
                                >
                                    ${presupuestado === 0 ? '--' : presupuestado.toFixed(2)}
                                </Text>
                            </View>
                            <Link href={'/(tabs)/gastos'} style={{ flex: 1 }}>
                                <View style={styles.card}>
                                    <Text style={styles.label1}>{i18n.t('Menu.Expenses')}</Text>
                                    <Text
                                        style={[styles.amount, { color: '#BF0000' }]}
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                    >
                                        - ${gastos.toFixed(2)}
                                    </Text>
                                </View>
                            </Link>
                        </View>
                    </View>

                    {transaccionesFiltradas.length === 0 &&
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <NoData message='transacciones' />
                        </View>
                    }
                    <TouchableOpacity style={[styles.changeColor, { alignItems: 'center', justifyContent: 'center' }]} onPress={() => refRBSheet.current?.open()}>
                        <Text style={{ color: 'white' }}>{i18n.t('Transactions.aTransaction')}</Text>
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 6,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        alignItems: 'center',
    },
    label1: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    amount: {
        fontSize: 18,
        fontWeight: '600',
    },

    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    circle: {
        width: 10,
        height: 20,
        borderRadius: '25%',
    },
    circleDown: {
        width: '100%',
        height: 3,
        marginTop: 0,
        marginBottom: 15,
    },
    placeholderStyle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedTextStyle: {
        fontSize: 16,
    },

    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
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
        paddingHorizontal: 5,
        paddingBottom: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 5,
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
        color: '#000',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        fontSize: 16,
    },
    signoDolar: {
        fontSize: 25,
        fontWeight: '400',
        marginRight: 10,
        top: 12
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
        marginVertical: 5,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
    },
    inputNombre: {
        color: '#000',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        fontSize: 16,
        width: '60%'
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
    addNombreButton: {
        backgroundColor: '#A37366',
        borderRadius: 20,
        justifyContent: 'center',
        height: 45,
        width: 120,
        paddingHorizontal: 15,
        marginHorizontal: 10,
        alignSelf: 'center'
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