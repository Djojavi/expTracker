import React, { useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

type SearchExpandableProps = {
    onSubmitSearch: (nombre: string) => void;
}

export const SearchExpandable: React.FC<SearchExpandableProps> = ({ onSubmitSearch }) => {
    const [expanded, setExpanded] = useState(false);
    const widthAnim = useRef(new Animated.Value(0)).current;
    const [nombre, setNombre] = useState('');

    const toggleSearch = () => {
        setExpanded(prev => !prev);
        Animated.timing(widthAnim, {
            toValue: expanded ? 0 : 200,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };


    return (
        <View style={styles.container}>
            <Pressable onPress={toggleSearch} style={styles.btn}>
                <Image
                    style={styles.icon}
                    source={require('../assets/icons/search.png')}
                />
            </Pressable>

            <Animated.View style={[styles.inputContainer, { width: widthAnim }]}>
                <TextInput
                    value={nombre}
                    placeholder="Buscar..."
                    style={styles.input}
                    returnKeyType="search"
                    onChangeText={setNombre}           
                    onChange={() => {
                        if (nombre.trim() !== '') {
                            onSubmitSearch(nombre);   
                            setNombre('');             
                        }
                    }}
                />
            </Animated.View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#ffffffff',
        padding: 5,
        borderRadius: 8,
    },
    inputContainer: {
        backgroundColor: '#ecf0f1',
        height: 40,
        marginLeft: 5,
        borderRadius: 8,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
    },
    icon: {
        width: 23,
        height: 23,
        resizeMode: 'contain',
        backgroundColor: '#fff',
    },
});


