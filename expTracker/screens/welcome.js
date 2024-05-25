import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';


const Welcome = () => {
    const navigation = useNavigation();
   
    return (
        <ImageBackground source={require('../assets/images/Bg.png')} style={styles.imageBackground}>
            <View style={styles.container}>
                <View>
                    <Image source={require('../assets/images/LogoWelcome.png')} style={{marginTop:150,width: 380, height: 140}} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        raised
                        title='Categorías'
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        onPress={() => navigation.navigate('Categoria')}
                    />
                    <Button
                        raised
                        title='Transacciones'
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                        onPress={() => navigation.navigate('Categoria')}
                    />
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    txt: {
        textAlign: 'left',
        marginTop: 150,
        fontWeight: '600',
        fontSize: 20,
        fontStyle: 'italic',
        marginBottom:10
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
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
        backgroundColor: '#FFB23E',
        borderColor: 'rgba(135, 97, 27, 0.5)',
        borderWidth:2,
        height: 60,
        width: 150,
    },
    buttonTitle: {
        fontSize: 16,
        color: '#000000',
    },
});

export default Welcome;
