import { DrawerLayout } from '@/components/DrawerLayout';
import { NoData } from '@/components/ui/NoData';
import { useCategorias } from '@/hooks/useCategorias';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import i18n from '../../utils/i18n';


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

  const { addCategoria, getCategorias, updateCategoria, deleteCategoria } = useCategorias();
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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    initializeCategorias();
    return () => { isMounted = false };
  }, []);

const colors = ['#FF6B6B','#F94144','#FFB5C2','#FF9E80','#FFBE0B','#FFF3B0','#FFD6A5','#A3F7BF','#55A630','#C1FBA4','#B9FBC0','#D0F4DE','#E2ECE9','#90E0EF','#0077B6','#A0C4FF','#BBD6FF','#D9F0FF','#C77DFF','#E0AAFF','#7209B7','#E4C1F9','#FAD2E1','#FDE2E4','#FFC8DD'];

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
        initializeCategorias();
      } catch (e: any) {
        console.log(e);
      }

    }
  };

  const handleUpdateCategoria = (id: number) => {
    const categoriaActualizar: Categoria = { categoria_id: id, categoria_nombre: nombre, categoria_descripcion: descripcion, categoria_color: selectedColor }
    if (nombre && descripcion && selectedColor) {
      updateCategoria(categoriaActualizar);
      setNombre('');
      setDescripcion('');
      setSelectedColor('');
      initializeCategorias();
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
      { text: 'Eliminar', onPress: () => [deleteCategoria(nombre), updateCategoriaRBSheet.current?.close(), initializeCategorias()] },
    ]);
  };


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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -500}
    >
      <DrawerLayout screenName={i18n.t('Home.Categories')} >
        <RBSheet
          ref={updateCategoriaRBSheet}
          height={380}
          openDuration={300}
          customStyles={{
            container: {
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }
          }}
        >
          <Text style={styles.addCategoria}>{i18n.t('Categories.uCategory')} </Text>
          <TextInput
            style={styles.inputNombre}
            placeholder={i18n.t('Transactions.Name')}
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder={i18n.t('Transactions.Description')}
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <Text style={styles.text}>{i18n.t('Categories.chooseColor')}</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
          </ScrollView>
          <TouchableOpacity
            style={styles.addNombreButton}
            onPress={() => handleUpdateCategoria(idActualizar)}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
              {i18n.t('Transactions.Done')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.deleteButton, { marginTop: 5 }]} onPress={() => handleDeleteCategoria(nombreBorrar)}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
              {i18n.t('Categories.dCategory')}
            </Text>

          </TouchableOpacity>
        </RBSheet>

        <View style={styles.content}>
          {categorias.length === 0 &&
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <NoData message={i18n.t('Home.Categories')} />
              <Pressable style={styles.buttonDos} onPress={() => refRBSheet.current?.open()} >
                <Text style={styles.iconDos}>{i18n.t('NoData.AddOne')}</Text>
              </Pressable>
            </View>
          }
          <FlatList
            data={categorias}
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
          height={340}
          openDuration={300}
          customStyles={{
            container: {
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }
          }}
        >
          <Text style={styles.addCategoria}>{i18n.t('Categories.aCategory')}</Text>
          <TextInput
            style={styles.inputNombre}
            placeholder={i18n.t('Transactions.Name')}
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder={i18n.t('Transactions.Description')}
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <Text style={styles.text}>{i18n.t('Categories.chooseColor')}</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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

          </ScrollView>

          <TouchableOpacity
            style={styles.addNombreButton}
            onPress={() => handleAddCategoria()}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
              {i18n.t('Transactions.Done')}
            </Text>
          </TouchableOpacity>
        </RBSheet>


        <TouchableOpacity
          style={styles.changeColor}
          onPress={() => { setToNull(), refRBSheet.current?.open() }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            {i18n.t('Categories.aCategory')}
          </Text>
        </TouchableOpacity>
      </DrawerLayout>
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
    padding: 8,
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
  inputNombre: {
    color: '#000',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    width: '90%'
  },
  input: {
    color: '#000',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    width: '90%'
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
});

export default Categoria;