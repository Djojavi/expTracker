import { DrawerLayout } from '@/components/DrawerLayout';
import { ObjPresupuestoCard } from '@/components/objPresupuestoCard';
import { useObjetivos } from '@/hooks/useObjetivos';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

export type Cuenta = {
    cuenta_id: number;
    cuenta_nombre: string;
    cuenta_descripcion?: string;
    cuenta_total: number;
    cuenta_actual: number;
    cuenta_progreso: number;
    cuenta_tipo: string;
}

//Pantalla con los objetivos del usuario
const ObjetivosScreen = () => {
    const { getObjetivos } = useObjetivos();
    const [objetivos, setObjetivos] = useState<Cuenta[]>([])

    const initializeObjetivos = async () => {
        try {
            const data = await getObjetivos();
            setObjetivos(data)
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
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <DrawerLayout screenName='Objetivos' >
                <View style={styles.container}>

                    <View style={styles.content}>

                        <FlatList
                            data={objetivos}
                            renderItem={({ item }) => (
                                <Pressable>
                                    <ObjPresupuestoCard nombre={item.cuenta_nombre} descripcion={item.cuenta_descripcion ?? ''} actual={item.cuenta_actual} progreso={item.cuenta_progreso} tipo={item.cuenta_tipo} total={item.cuenta_total} />
                                </Pressable>
                            )}
                        />
                    </View>

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
})

export default ObjetivosScreen