import { useCategorias } from '@/hooks/useCategorias';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';



export type Categoria = {
  categoria_id?: number,
  categoria_nombre: string,
  categoria_descripcion: string,
  categoria_color: string
}
interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const Categoria = () => {
  const { addCategoria, getCategorias } = useCategorias();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  let isMounted = true;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [idActualizar, setIdActualizar] = useState(0);
  const [nombreBorrar, setNombreBorrar] = useState('');
  const refRBSheet = useRef<RBSheetRef>(null);
  const updateCategoriaRBSheet = useRef<RBSheetRef>(null);


  const initializeCategorias = async () => {
    try {
      const data = await getCategorias();
      if (isMounted) {
        setCategorias(data);
        console.log(data)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    initializeCategorias();
    console.log(categorias)
    return () => { isMounted = false };
  }, []);

  const colors = ['#F50C00', '#E70D68', '#FA75AF', '#E75A0D', '#FF961F', '#973E20', '#A18668', '#FFCE0A', '#4B6A10', '#5BDC00', '#25F8EA', '#5C92CC', '#000FB6', '#A168DE'];

  const handleAddCategoria = async () => {
    if (nombre && descripcion && selectedColor !== null) {
      const nuevaCategoria: Categoria = { categoria_nombre: nombre, categoria_descripcion: descripcion, categoria_color: selectedColor }
      console.log(nuevaCategoria)
      try {
        const result = await addCategoria(nuevaCategoria)
        setNombre('');
        setDescripcion('');
        setSelectedColor('');
        refRBSheet.current?.close()
        console.log(result)
        initializeCategorias();
      } catch (e: any) {
        console.log(e);
      }

    }
  };

  const handleUpdateCategoria = (id: number) => {
    console.log(id);
    if (nombre && descripcion && selectedColor !== null) {
      //updateCategoria(id, nombre, descripcion, colors[selectedColor]);
      setNombre('');
      setDescripcion('');
      setSelectedColor('');
      updateCategoriaRBSheet.current?.close();
    }
  };

  const setToNull = () => {
    setNombre("");
    setDescripcion("");
    setSelectedColor('');
  }

  const getCategoria = (id: number) => {
    setIdActualizar(id);

    const selectedCategoria = categorias.find(
      (item: Categoria) => item.categoria_id === id
    );

    if (!selectedCategoria) return;

    setNombreBorrar(selectedCategoria.categoria_nombre);
    setNombre(selectedCategoria.categoria_nombre);
    setDescripcion(selectedCategoria.categoria_descripcion);
    setSelectedColor(selectedCategoria.categoria_color)
  };


  const handleDeleteCategoria = (nombre: string) => {
    Alert.alert('¿Está seguro de eliminar la categoría?', 'Esta acción será permanente', [
      {
        text: 'Cancelar',
        onPress: () => updateCategoriaRBSheet.current?.close(),
        style: 'cancel',
      },
      //{ text: 'Eliminar', onPress: () => [deleteCategoria(nombre), updateCategoriaRBSheet.current?.close()] },
    ]);
  };

  const ordenarCategorias = (array: Categoria[]) => {
    return array.sort((a, b) => a.categoria_nombre.localeCompare(b.categoria_nombre));
  }

  const categoriasOrdenadas = ordenarCategorias(categorias);

  const Item: React.FC<Categoria> = ({ categoria_nombre, categoria_descripcion, categoria_color }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View style={[styles.circularTextView, { backgroundColor: categoria_color }]} />
        <View style={styles.itemText}>
          <Text style={styles.title}>{categoria_nombre}</Text>
          <Text style={styles.description}>{categoria_descripcion}</Text>
        </View>
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
        <View style={styles.headerButtons}>
          <Link href="/(tabs)">
            <View >
              <Image style={{ width: 30, height: 30, marginTop: 35 }} source={require('../../assets/icons/casa.png')}></Image>
            </View>
          </Link>

          <Link href="/(tabs)">
            <View >
              <Image style={{ width: 30, height: 30, marginTop: 35 }} source={require('../../assets/icons/dinero.png')}></Image>
            </View>
          </Link>
        </View>

        <Image source={require('../../assets/images/Logo.png')} style={{ width: 152, height: 40, marginTop: 29 }} />
      </View>

      <RBSheet
        ref={updateCategoriaRBSheet}
        height={480}
        openDuration={300}
        customStyles={{
          container: {
            padding: 2,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >
        <Text style={styles.addCategoria}>Actualizar Categoria</Text>
        <View style={styles.nombreContainer}>
          <TextInput
            style={styles.inputNombre}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Descripcion"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <Text style={styles.text}>Escoge el color para tu categoría!</Text>
        <View style={styles.colorContainer}>
          {colors.map((color, index) => {
            const isActive = selectedColor === color;
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => setSelectedColor(color)}
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
        <TouchableOpacity
          style={styles.addNombreButton}
          onPress={() => handleUpdateCategoria(idActualizar)}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            Listo!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.deleteButton, { marginTop: 5 }]} onPress={() => handleDeleteCategoria(nombreBorrar)}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            Eliminar Categoría
          </Text>
          
        </TouchableOpacity>
      </RBSheet>

      <View style={styles.content}>
        <FlatList
          data={categoriasOrdenadas}
          renderItem={({ item }) => (
            <Pressable
              onLongPress={() => {
                if (!item || item.categoria_id === undefined) return;
                getCategoria(item.categoria_id);
                updateCategoriaRBSheet.current?.open();
              }}
            >
              <Item
                categoria_nombre={item.categoria_nombre}
                categoria_descripcion={item.categoria_descripcion}
                categoria_color={item.categoria_color}
              />
            </Pressable>
          )}
          keyExtractor={(item) => String(item.categoria_id)}
          style={styles.flatList}
        />
      </View>

      <RBSheet
        ref={refRBSheet}
        height={400}
        openDuration={300}
        customStyles={{
          container: {
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >
        <Text style={styles.addCategoria}>Añadir Categoria</Text>
        <View style={styles.nombreContainer}>
          <TextInput
            style={styles.inputNombre}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Descripcion"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <Text style={styles.text}>Escoge el color para tu categoría!</Text>
        <View style={styles.colorContainer}>
          {colors.map((color, index) => {
            const isActive = selectedColor === color;
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => setSelectedColor(color)}
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

        <TouchableOpacity
          style={styles.addNombreButton}
          onPress={() => handleAddCategoria()}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            Listo!
          </Text>
        </TouchableOpacity>
      </RBSheet>


      <TouchableOpacity
        style={styles.changeColor}
        onPress={() => { setToNull(), refRBSheet.current?.open() }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          Nueva categoría
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  circularTextView: {
    width: 10,
    height: 40,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 15
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  changeColor: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    width: 250,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: '#A37366',
    borderWidth: 2,
    backgroundColor: '#A37366',
    marginBottom: 70
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
  headerButtons: {
    flexDirection: 'row',
    gap: 15
  },
  homeButton: {
    width: 50,
    backgroundColor: '#fff',
    borderColor: '#000',
    height: 40,
    marginTop: 30,
    marginLeft: 10,
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
    fontSize: 18
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
    fontSize: 18
  },
  addNombreButton: {
    justifyContent: 'center',
    backgroundColor: '#A37366',
    borderRadius: 20,
    height: 45,
    width: 120,
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
    backgroundColor: '#ff6161',
    padding: 10,
    borderRadius: 20,
    height: 45,
    width: 330,
    opacity: 0.85
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
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