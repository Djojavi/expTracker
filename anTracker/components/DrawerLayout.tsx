import React, { ReactNode, useRef } from 'react';
import { DrawerLayoutAndroid, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MenuItem } from './MenuItem';

type DrawerProps = {
    children: ReactNode;
    screenName: string;
};

export const DrawerLayout: React.FC<DrawerProps> = ({ children, screenName }) => {
    const drawer = useRef<DrawerLayoutAndroid>(null);

    const navigationView = () => (
        <View style={[styles.container, styles.navigationContainer]}>
            <MenuItem source={require('../assets/icons/casa.png')} href={'../(tabs)'} text='Inicio' screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/dinero.png')} href={'../(tabs)/transacciones'} text='Transacciones' screenName={screenName}></MenuItem>
            <MenuItem source={require('../assets/icons/income.png')} href={'../(tabs)/ingresos'} text='Ingresos'screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/expenses.png')} href={'../(tabs)/gastos'} text='Gastos'screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/categoria.png')} href={'../(tabs)/categoria'} text='Categoría'screenName={screenName} ></MenuItem>
        </View>
    );

    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={250}
            drawerPosition="left"
            renderNavigationView={navigationView}
        >
            <View style={styles.header}>

                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => drawer.current?.openDrawer()}>
                        <View >
                            <Image style={{ width: 30, height: 30, marginTop: 35, marginLeft: 18 }} source={require('../assets/icons/menu.png')}></Image>
                        </View>
                    </TouchableOpacity>

                </View>
                <Image source={require('../assets/images/Logo.png')} style={{ width: 152, height: 40, marginTop: 29 }} />
            </View>

            {children}
        </DrawerLayoutAndroid>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 15
    },
    container: {
        flex: 1,
        padding: 16,
        marginTop: 35
    },
    navigationContainer: {
        backgroundColor: '#ecf0f1',
        paddingVertical: 10
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: 'center',
    },
    link: {
        marginVertical: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 15,
        backgroundColor: '#f9f9f9',
        width: '90%',
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        marginRight: 12,
    },
    menuText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
});
