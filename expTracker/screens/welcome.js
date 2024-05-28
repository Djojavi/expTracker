import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';


const Welcome = () => {
    const navigation = useNavigation();
   
    return (
            <View style={styles.container}>
                <View style={styles.images}>
                    <Image source={require('../assets/images/LogoWelcome.png')} style={{marginTop:150,width: 380, height: 140}} />
                    <Image source={require('../assets/images/AntWelcome.png')} style={{marginTop:50,width: 210, height: 190}} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title='Categorías'
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        onPress={() => navigation.navigate('Categoria')}
                    />
                    <Button
                        title='Transacciones'
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        onPress={() => navigation.navigate('Categoria')}
                    />
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    images:{
        alignItems:'center'
    },
    txt: {
        textAlign: 'left',
        marginTop: 150,
        fontWeight: '600',
        fontSize: 20,
        fontStyle: 'italic',
        marginBottom:10
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'#E0F7FA'
    },
    buttonContainer: {
        flexDirection: 'column',
        position: 'absolute',
        bottom: 50,
        width: '80%',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        gap: 20,
        justifyContent: 'center',
        marginBottom: 45,
    },
    button: {
        backgroundColor: '#A37366',
        height: 40,
        width: 150,
        borderColor:'#A37366',
        borderRadius:10
    },
    buttonTitle: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});

export default Welcome;
