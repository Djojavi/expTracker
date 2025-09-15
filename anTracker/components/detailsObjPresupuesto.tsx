import { StyleSheet, Text, View } from "react-native"
import ProgressBar from "./progressBar"

type detailsProps = {
    tipoAMostrar: string
    porcentaje: number
    nombre: string
    current: number
}
export const DetailsObjPresupuestoComponent: React.FC<detailsProps> = ({ tipoAMostrar, porcentaje, nombre, current }) => {

    
    const entero = porcentaje * 100;

    let colorBarra = '#000';
    let feedbackEmoji = '❔';
    let feedbackMessage = 'Sin datos';

    if (tipoAMostrar === "Ingreso") {
        if (entero < 40) {
            colorBarra = '#646464ff';
            feedbackEmoji = '🔮';
            feedbackMessage = 'Tu objetivo recién empieza';
        } else if (entero < 70) {
            colorBarra = '#e6cf07ff';
            feedbackEmoji = '🚀';
            feedbackMessage = '¡Vas por buen camino, sigue así!';
        } else if (entero < 100) {
            colorBarra = '#6a09b9ff';
            feedbackEmoji = '🎇';
            feedbackMessage = '¡Recta final, ahí vamos!';
        } else {
            colorBarra = '#4CAF50';
            feedbackEmoji = '🎉';
            feedbackMessage = '¡Lo has logrado, felicidades!';
        }
    } else if (tipoAMostrar === "Gasto") {
        if (entero > 70) {
            colorBarra = '#4CAF50';
            feedbackEmoji = '💵';
            feedbackMessage = 'Presupuesto casi lleno ¡Vas por buen camino!';
        } else if (entero > 40) {
            colorBarra = '#64B5F6';
            feedbackEmoji = '⚖️';
            feedbackMessage = 'Presupuesto controlado';
        } else if (entero > 0) {
            colorBarra = '#e6cf07ff';
            feedbackEmoji = '💨';
            feedbackMessage = '¡Casi agotado! Gasta con precaución';
        } else {
            colorBarra = '#c01414ff';
            feedbackEmoji = '🔒';
            feedbackMessage = 'Presupuesto superado';
        }
    }

    return (
        <View style={styles.card}>
            <View style={{ alignItems: 'center' }} >
                <Text style={styles.title}>{nombre}</Text>
                <View style={styles.feedbackContainer}>
                    <Text style={styles.text}>{feedbackEmoji}</Text>
                    <Text style={styles.feedbackText}>{feedbackMessage}</Text>
                </View>
            </View>
            <ProgressBar progress={tipoAMostrar === 'Ingreso'? porcentaje : 1-porcentaje} current={current} color={colorBarra} />
            <Text style={styles.percent}>{(porcentaje * 100).toFixed(2)}%</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    text: {
        fontSize: 100,
        marginTop: 6,
    },
    percent: {
        textAlign: "right",
        marginTop: 4,
        fontSize: 12,
        color: "#666",
    },
    feedbackContainer: {
        alignItems: "center",
        marginTop: 8,
        padding: 6,
    },
    feedbackText: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
});