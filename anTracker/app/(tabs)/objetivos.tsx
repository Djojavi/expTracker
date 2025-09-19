import { DrawerLayout } from '@/components/DrawerLayout';
import { ObjPresupuestoCard } from '@/components/objPresupuestoCard';
import { useObjetivos } from '@/hooks/useCuentas';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { CrearActualizarObjPres } from './crearActualizarObjPres';
export type Cuenta = {
    cuenta_id: number;
    cuenta_nombre: string;
    cuenta_descripcion?: string;
    cuenta_total: number;
    cuenta_actual: number;
    cuenta_progreso: number;
    cuenta_tipo: string;
    se_repite: number;
    cuenta_frecuencia: number;
}

//Pantalla con los objetivos del usuario
const ObjetivosScreen = () => {
    const { getObjetivos } = useObjetivos();
    const [objetivos, setObjetivos] = useState<Cuenta[]>([])
    interface RBSheetRef {
        open: () => void;
        close: () => void;
    }
    const refRBSheet = useRef<RBSheetRef>(null);

    const initializeObjetivos = async () => {
        try {
            const data = await getObjetivos();
            setObjetivos([...data])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        initializeObjetivos()
    }, [])

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -500}
        >

            <DrawerLayout screenName='Objetivos' >
                <RBSheet ref={refRBSheet}
                    height={400}
                    openDuration={300}
                    customStyles={{
                        container: {
                            padding: 15,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }} >
                    <CrearActualizarObjPres onCloseSheet={initializeObjetivos} esObjetivo={true} esCrear={true}></CrearActualizarObjPres>
                </RBSheet>
                
                <View style={styles.container}>

                    <View style={styles.content}>

                        <FlatList
                            data={objetivos}
                            extraData={true}
                            initialNumToRender={5}
                            maxToRenderPerBatch={5}
                            renderItem={({ item }) => (
                                <View>
                                    <ObjPresupuestoCard nombre={item.cuenta_nombre} descripcion={item.cuenta_descripcion ?? ''} actual={item.cuenta_actual} progreso={item.cuenta_progreso} tipo={item.cuenta_tipo} total={item.cuenta_total} seRepite={item.se_repite} frecuencia={item.cuenta_frecuencia} aMostrar='Ingreso' id={item.cuenta_id} onCloseSheet={initializeObjetivos} />
                                </View>
                            )}
                        />
                    </View>
                    <View style={styles.btnContainer}>
                        <Pressable style={styles.button} onPress={() => refRBSheet.current?.open()} >
                            <Text style={styles.icon}>+</Text>
                        </Pressable>
                    </View>

                </View>
            </DrawerLayout>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F7FA',
    },
    flatList: {
        flex: 1,
    },
    content: {
        marginTop: 10,
        backgroundColor: '#E0F7FA',
        borderColor: '#fff',
        flex: 1,
        marginBottom: 45,
        marginHorizontal: 18
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
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
    itemText: {
        flex: 1,
        flexDirection: 'column'
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    total: {
        fontSize: 16,
        color: '#757575',
        marginTop: 5,
    },
    btnContainer: {
        position: "absolute",
        bottom: 60,
        right: 20,
        zIndex: 999,
    },
    button: {
        backgroundColor: "#A37366",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    icon: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
})

export default ObjetivosScreen