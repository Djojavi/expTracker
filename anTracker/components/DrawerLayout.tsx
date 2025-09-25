import React, { ReactNode, useRef } from 'react';
import { DrawerLayoutAndroid, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import i18n from "../utils/i18n";
import { MenuItem } from './MenuItem';

type DrawerProps = {
    children: ReactNode;
    screenName: string;
};

export const DrawerLayout: React.FC<DrawerProps> = ({ children, screenName }) => {
    const drawer = useRef<DrawerLayoutAndroid>(null);

    const navigationView = () => (
        <View style={[styles.container, styles.navigationContainer]}>
            <MenuItem source={require('../assets/icons/casa.png')} href={'../(tabs)'} text={i18n.t('Menu.Home')} screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/dinero.png')} href={'../(tabs)/transacciones'} text={i18n.t('Home.Transactions')} screenName={screenName}></MenuItem>
            <MenuItem source={require('../assets/icons/income.png')} href={'../(tabs)/ingresos'} text={i18n.t('Menu.Income')} screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/expenses.png')} href={'../(tabs)/gastos'} text={i18n.t('Menu.Expenses')} screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/categoria.png')} href={'../(tabs)/categoria'} text={i18n.t('Home.Categories')} screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/csv.png')} href={'../(tabs)/importExport'} text='CSV' screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/pie-chart.png')} href={'../(tabs)/graficos'} text={i18n.t('Menu.Analytics')} screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/target.png')} href={'../(tabs)/objetivos'} text={i18n.t('Menu.Goals')} screenName={screenName} ></MenuItem>
            <MenuItem source={require('../assets/icons/budget.png')} href={'../(tabs)/presupuestos'} text={i18n.t('Menu.Budgets')} screenName={screenName} ></MenuItem>
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
        paddingVertical: 1,
        paddingHorizontal: 10,
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
