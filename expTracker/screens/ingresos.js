import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const Ingreso = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.text}>Aquí van los ingresos</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  textView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

export default Ingreso;
