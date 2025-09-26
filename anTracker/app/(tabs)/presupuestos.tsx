import { DrawerLayout } from '@/components/DrawerLayout';
import { ObjPresupuestoCard } from '@/components/objPresupuestoCard';
import { NoData } from '@/components/ui/NoData';
import { useObjetivos } from '@/hooks/useCuentas';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import i18n from '../../utils/i18n';
import { CrearActualizarObjPres } from './crearActualizarObjPres';
import { Cuenta } from './objetivos';
//Pantalla con los presupuestos del usuario
const Presupuestos = () => {

    const { getPresupuestos } = useObjetivos();
    const [presupuestos, setPresupuestos] = useState<Cuenta[]>([])
    interface RBSheetRef {
        open: () => void;
        close: () => void;
    }
    const refRBSheet = useRef<RBSheetRef>(null);

    const initializePresupuestos = async () => {
        try {
            const data = await getPresupuestos();
            setPresupuestos([...data]);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        initializePresupuestos()
    }, [])


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -500}
        >
            <DrawerLayout screenName={i18n.t('Menu.Budgets')}>
                <RBSheet ref={refRBSheet}
                    height={525}
                    openDuration={300}
                    customStyles={{
                        container: {
                            padding: 15,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }} >
                    <CrearActualizarObjPres esObjetivo={false} esCrear={true} onCloseSheet={initializePresupuestos}></CrearActualizarObjPres>
                </RBSheet>

                <View style={styles.container}>
                    <View style={styles.content}>
                        {presupuestos.length === 0 &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <NoData message={i18n.t('Menu.Budgets')} />
                                <Pressable style={styles.buttonDos} onPress={() => refRBSheet.current?.open()} >
                                    <Text style={styles.iconDos}>{i18n.t('NoData.AddOne')}</Text>
                                </Pressable>
                            </View>
                        }
                        <FlatList
                            data={presupuestos}
                            renderItem={({ item }) => (
                                <Pressable>
                                    <ObjPresupuestoCard nombre={item.cuenta_nombre} descripcion={item.cuenta_descripcion ?? ''} actual={item.cuenta_actual} progreso={item.cuenta_progreso} tipo={item.cuenta_tipo} total={item.cuenta_total} seRepite={item.se_repite} frecuencia={item.cuenta_frecuencia} aMostrar='Gasto' id={item.cuenta_id} onCloseSheet={initializePresupuestos} />
                                </Pressable>
                            )}
                        />
                    </View>

                </View>
                <View style={styles.btnContainer}>
                    <Pressable style={styles.button} onPress={() => refRBSheet.current?.open()} >
                        <Text style={styles.icon}>+</Text>
                    </Pressable>
                </View>
            </DrawerLayout>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    dias: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 7,
    },
    container: {
        flex: 1,
        backgroundColor: '#E0F7FA',
    },
    circularTextView: {
        width: 10,
        height: 40,
        borderRadius: 50,
        marginLeft: 10,
        marginRight: 15
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

export default Presupuestos