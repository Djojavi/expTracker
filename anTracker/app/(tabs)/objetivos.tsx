import { DrawerLayout } from '@/components/DrawerLayout';
import { ObjPresupuestoCard } from '@/components/objPresupuestoCard';
import { NoData } from '@/components/ui/NoData';
import { useObjetivos } from '@/hooks/useCuentas';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import i18n from '../../utils/i18n';
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
    const { getObjetivos, getCuenta } = useObjetivos();
    const [objetivos, setObjetivos] = useState<Cuenta[]>([])
    interface RBSheetRef {
        open: () => void;
        close: () => void;
    }
    const refRBSheet = useRef<RBSheetRef>(null);
    const updateRefRBSheet = useRef<RBSheetRef>(null);
    const [id, setId] = useState(0)

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

            <DrawerLayout screenName={i18n.t('Menu.Goals')} >
                <RBSheet ref={refRBSheet}
                    height={450}
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

                <RBSheet ref={updateRefRBSheet}
                    height={450}
                    openDuration={300}
                    customStyles={{
                        container: {
                            padding: 15,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }} >
                    <CrearActualizarObjPres onCloseSheet={initializeObjetivos} esObjetivo={true} esCrear={false} id={id}></CrearActualizarObjPres>
                </RBSheet>
                

                <View style={styles.container}>

                    <View style={styles.content}>
                        {objetivos.length === 0 &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <NoData message={i18n.t('Menu.Goals')} />
                                <Pressable style={styles.buttonDos} onPress={() => refRBSheet.current?.open()} >
                                    <Text style={styles.iconDos}> {i18n.t('NoData.AddOne')} </Text>
                                </Pressable>
                            </View>
                        }

                        <FlatList
                            data={objetivos}
                            extraData={true}
                            initialNumToRender={5}
                            maxToRenderPerBatch={5}
                            renderItem={({ item }) => (
                                <Pressable onLongPress={() => { updateRefRBSheet.current?.open(); setId(item.cuenta_id); }}>
                                    <View>
                                        <ObjPresupuestoCard nombre={item.cuenta_nombre} descripcion={item.cuenta_descripcion ?? ''} actual={item.cuenta_actual} progreso={item.cuenta_progreso} tipo={item.cuenta_tipo} total={item.cuenta_total} seRepite={item.se_repite} frecuencia={item.cuenta_frecuencia} aMostrar='Ingreso' id={item.cuenta_id} onCloseSheet={initializeObjetivos} />
                                    </View>
                                </Pressable>
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
    buttonDos: {
        backgroundColor: "#A37366",
        width: 170,
        height: 50,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    iconDos: {
        color: "#fff",
        fontSize: 19,
        fontWeight: "bold",
    },
})

export default ObjetivosScreen