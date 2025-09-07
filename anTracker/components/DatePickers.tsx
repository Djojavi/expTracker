import { useTransacciones } from "@/hooks/useTransacciones";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { formatDate } from "../utils/dateutils";

type DatePickerProps = {
    onSeleccionar: (inicio: number, fin: number) => void;
};

export const DatePickers: React.FC<DatePickerProps> = ({ onSeleccionar }) => {
    const { getTransaccionMinimaFecha } = useTransacciones()
    const [inicio, setInicio] = useState(new Date());
    const [fin, setFin] = useState(new Date());
    const [openInicio, setOpenInicio] = useState(false);
    const [openFin, setOpenFin] = useState(false);
    const [primeraFecha, setPrimeraFecha] = useState(0)

    const getPrimeraFecha = async () => {
        const primera = await getTransaccionMinimaFecha()
        setPrimeraFecha(primera?.transaccion_fecha ?? 0)
    }

    useEffect(() => {
        getPrimeraFecha()
    }, [])

    const handleSiempre = () => {
        setFin(new Date())
        onSeleccionar(primeraFecha, fin.getTime())
    }
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: '#fff', paddingHorizontal: 3, height: 31, borderRadius: 5, elevation: 1, }}>
                <Pressable onPress={() => handleSiempre()}>
                    <Image
                        style={styles.icon}
                        source={require('../assets/icons/calendar.png')}
                    />
                </Pressable>
            </View>

            <Pressable onPress={() => setOpenInicio(true)}>
                <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{formatDate(inicio.getTime())}</Text>
                </View>
            </Pressable>
            <DatePicker
                maximumDate={fin}
                minimumDate={new Date(primeraFecha)}
                modal
                mode="date"
                open={openInicio}
                date={inicio}
                onConfirm={(d) => {
                    setOpenInicio(false);
                    setInicio(d);
                    onSeleccionar(d.getTime(), fin.getTime());
                }}
                onCancel={() => setOpenInicio(false)}
            />

            <Pressable onPress={() => setOpenFin(true)}>
                <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{formatDate(fin.getTime())}</Text>
                </View>
            </Pressable>
            <DatePicker
                minimumDate={inicio}
                maximumDate={new Date()}
                modal
                mode="date"
                open={openFin}
                date={fin}
                onConfirm={(d) => {
                    setOpenFin(false);
                    setFin(d);
                    onSeleccionar(inicio.getTime(), d.getTime());
                }}
                onCancel={() => setOpenFin(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 5,
        marginHorizontal: 5,
    },
    dateBox: {
        backgroundColor: "#fff",
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        minWidth: 90,
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
    },
    dateText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },
    icon: {
        width: 23,
        height: 23,
        resizeMode: 'contain',
        marginTop: 5,
        backgroundColor: '#fff',
    },
});
