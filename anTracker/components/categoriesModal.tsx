import { useCategorias } from '@/hooks/useCategorias';
import { en, es } from '@/utils/translations';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';

type CategoriasModalProps = {
    onSubmit: (id: number[]) => void;
}

export const CategoriasModal: React.FC<CategoriasModalProps> = ({ onSubmit }) => {
    let [locale, setLocale] = useState(Localization.getLocales())
    const i18n = new I18n();
    i18n.enableFallback = true;
    i18n.translations = { en, es };
    i18n.locale = locale[0].languageCode ?? 'en';
    const { getCategoriasModal } = useCategorias()
    const [selected, setSelected] = useState(['']);
    const [expanded, setExpanded] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [categorias, setCategorias] = useState([]);

    const initializeCategorias = async () => {
        let data = await getCategoriasModal();
        data.unshift({ "label": "Todas", "value": 0 })
        setCategorias(data)
    }
    useEffect(() => {
        try {
            initializeCategorias()
        } catch (error) {
            console.error(error)
        }
    }, [])

    const toggleSearch = () => {
        if (expanded) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })
            ]).start(() => {
                setExpanded(false);
            });
        } else {
            setExpanded(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const opacityInterpolate = opacityAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    const convertirANumeros = (array: string[]): void => {
        let arr = array
            .filter(item => item !== "" && !isNaN(Number(item)))
            .map(item => Number(item));
        onSubmit(arr)
    };


    return (
        <View style={styles.container}>
            <Pressable onPress={toggleSearch} style={styles.btn}>
                <Image
                    style={styles.icon}
                    source={require('../assets/icons/categoria.png')}
                />
            </Pressable>

            {expanded && (
                <Animated.View
                    style={[
                        styles.dropdownContainer,
                        {
                            opacity: opacityInterpolate,
                            transform: [
                                {
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-20, 0]
                                    })
                                }
                            ]
                        }
                    ]}
                >
                    <MultiSelect
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        search
                        itemTextStyle={styles.itemText}
                        data={categorias}
                        labelField="label"
                        valueField="value"
                        placeholder={i18n.t('SearchByCategory')}
                        searchPlaceholder="Search..."
                        value={selected}
                        itemContainerStyle={styles.itemContainer}
                        onChange={item => {
                            setSelected(item);
                            convertirANumeros(item)
                            console.log(item)
                        }}
                        selectedStyle={styles.selectedStyle}
                        showsVerticalScrollIndicator={true}
                        containerStyle={styles.dropdownListContainer}
                    />
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 3,
        height: 32,
        alignItems: 'center',
        overflow: 'visible',
    },
    dropdownContainer: {
        height: 32,
        overflow: 'scroll',
        borderRadius: 10,
    },
    dropdown: {
        padding: 7,
        height: 30,
        minWidth: 200,
        backgroundColor: '#fff',
        borderRadius: 8
    },
    dropdownListContainer: {
        borderRadius: 10,
        borderWidth: 0,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        backgroundColor: '#fff',
    },
    placeholderStyle: {
        fontSize: 13,
        color: '#666',
    },
    selectedTextStyle: {
        fontSize: 13,
        color: '#333',
    },
    inputSearchStyle: {
        fontSize: 13,
        height: 40,
    },
    selectedStyle: {
        marginLeft: 5,
        borderRadius: 12,
        padding: 0,
        paddingVertical: 2,
        paddingHorizontal: 6,
        backgroundColor: '#f0f0f0',
    },
    itemText: {
        fontSize: 13,
        padding: 8,
        color: '#333',
    },
    itemContainer: {
        borderRadius: 8,
        marginVertical: 2,
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        backgroundColor: '#fff',
        marginRight: 2
    },
    btn: {
        backgroundColor: '#ffffffff',
        padding: 6,
        flexDirection: 'row',
        borderRadius: 8,
        marginRight: 5,
        zIndex: 10,
    },
});