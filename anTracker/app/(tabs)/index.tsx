import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//Pantalla de bienvenida

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.images}>
        <Image source={require('../../assets/images/LogoWelcome.png')} style={{ marginTop: 150, width: 320, height: 115 }} />
        <Image source={require('../../assets/images/AntWelcome.png')} style={{ marginTop: 50, width: 210, height: 190 }} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonTransacciones}>
          <Text style={styles.buttonTitle}>Transacciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonTitle}>Categorias</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonTransacciones: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A37366',
    height: 40,
    width: 200,
    borderColor: '#A37366',
    borderRadius: 10
  },
  images: {
    alignItems: 'center'
  },
  txt: {
    textAlign: 'left',
    marginTop: 150,
    fontWeight: '600',
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E0F7FA'
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A37366',
    height: 40,
    width: 150,
    borderColor: '#A37366',
    borderRadius: 10
  },
  buttonTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default Welcome;