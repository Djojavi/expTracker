import React, { useContext, useRef, useState } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback } from 'react-native';
import { DataContext } from '../App';
import { Button } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';

const Categoria = ({ navigation }) => {
  const { categorias, addCategoria, deleteCategoria } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const refRBSheet = useRef();

  const colors = ['#F50C00', '#E70D68', '#FA75AF', '#E75A0D', '#FF961F', '#973E20', '#A18668', '#FFCE0A', '#4B6A10', '#5BDC00', '#25F8EA', '#5C92CC', '#000FB6', '#A168DE'];

  const handleAddCategoria = () => {
    if (nombre && descripcion && selectedColor !== null) {
      addCategoria(nombre, descripcion, colors[selectedColor]);
      setNombre('');
      setDescripcion('');
      setSelectedColor(null);
      refRBSheet.current.close();
    }
  };

  const handleDeleteCategoria = (nombre) => {
    deleteCategoria(nombre);
  };

  const Item = ({ title, descripcion, color }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View style={styles.itemText}>
          <View style={[styles.circularTextView, { backgroundColor: color }]} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{descripcion}</Text>
        </View>
        <Button
          icon={
            <Image
              source={require('../assets/icons/delete.png')}
              style={{ width: 18, height: 18, opacity: 0.8 }}
            />
          }
          buttonStyle={styles.deleteButton}
          onPress={() => handleDeleteCategoria(title)}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <Button
          title="Inicio"
          buttonStyle={styles.homeButton}
          titleStyle={styles.homeButtonText}
          onPress={() => navigation.navigate('Welcome')}
        />
        <Image source={require('../assets/images/Logo.png')} style={{ width: 152, height: 40, marginTop: 29 }} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={categorias}
          renderItem={({ item }) => (
            <Item
              title={item.categoria_nombre}
              descripcion={item.categoria_descripcion}
              color={item.categoria_color}
            />
          )}
          keyExtractor={(item) => item.categoria_id.toString()}
          style={styles.flatList}
        />
      </View>

      <RBSheet
        ref={refRBSheet}
        height={200}
        openDuration={300}
        customStyles={{
          container: {
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >
        <Text style={styles.addCategoria}>Escoge el color para tu categoría!</Text>
        <View style={styles.colorContainer}>
          {colors.map((color, index) => {
            const isActive = selectedColor === index;
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => setSelectedColor(index)}
              >
                <View
                  style={[
                    styles.circle,
                    isActive && { borderColor: color },
                  ]}
                >
                  <View
                    style={[styles.circleInside, { backgroundColor: color }]}
                  />
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </RBSheet>

      <LinearGradient colors={['#F8F8F8', '#F8F8F8', '#D9D7D7']} style={styles.inputContainer}>
        <Text style={styles.addCategoria}>Añadir Categoria</Text>
        <View style={styles.nombreContainer}>
          <TextInput
            style={styles.inputNombre}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <Button 
            buttonStyle={[styles.changeColor, { backgroundColor: colors[selectedColor] }]}
            onPress={() => refRBSheet.current.open()}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Descripcion"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <Button
          buttonStyle={styles.addNombreButton}
          onPress={handleAddCategoria}
          titleStyle={{ color: '#fff' }}
          title="Añadir"
        />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  circularTextView: {
    width: 75,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  changeColor: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
    borderRadius: 99,
    borderColor: '#000000',
    borderWidth: 2
  },
  profile: {
    marginTop: 20,
    alignSelf: 'center',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginBottom: 24,
    shadowColor: '#6B4E71',
    shadowOpacity: 0.1,
    elevation: 1,
    backgroundColor: '#000000'
  },
  addCategoria: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  homeButton: {
    width: 100,
    backgroundColor: '#A37366',
    borderColor: '#000',
    height: 40,
    marginTop: 30,
    marginLeft: 10,
    borderRadius: 10,
  },
  homeButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flatList: {
    flex: 1,
  },
  inputContainer: {
    padding: 15,
    paddingHorizontal: 45,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  nombreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  inputNombre: {
    color: '#000',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    flex: 1,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginRight: 10,
  },
  input: {
    color: '#000',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  addNombreButton: {
    backgroundColor: '#A37366',
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#A37366',
    width: 320,
    marginTop: 10,
    borderRadius: 8,
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
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap:'wrap-reverse',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '100%',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  circleInside: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default Categoria;
