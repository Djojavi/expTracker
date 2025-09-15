import { StyleSheet, Text, View } from "react-native"
import ProgressBar from "./progressBar"

type detailsProps = {
    tipoAMostrar: string
    porcentaje: number
    nombre: string
}
export const DetailsObjPresupuestoComponent: React.FC<detailsProps> = ({ tipoAMostrar, porcentaje, nombre }) => {
    const renderContenido = () => {
        const entero = porcentaje * 100
        if (tipoAMostrar === "Ingreso") {
            if (entero < 40) {
                return (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.text}>🔮</Text>
                        <Text style={styles.feedbackText}>
                            Tu objetivo recién empieza
                        </Text>
                    </View>)
            } else if (entero < 70) {
                return (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.text}>🚀</Text>
                        <Text style={styles.feedbackText}>
                            ¡Vas por buen camino, sigue así!
                        </Text>
                    </View>)
            } else if(entero < 100){
                return (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.text}>🎇</Text>
                        <Text style={styles.feedbackText}>
                            ¡Recta final, ahí vamos!
                        </Text>
                    </View>)
            }else {
                return (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.text}>🎉</Text>
                        <Text style={styles.feedbackText}>
                            ¡Lo has logrado, felicidades!
                        </Text>
                    </View>)
            }
        }

        if (tipoAMostrar === "Gasto") {
            if (entero > 70) {
                return (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.text}>💵</Text>
                        <Text style={styles.feedbackText}>
                            Presupuesto casi lleno ¡Vas por buen camino!
                        </Text>
                    </View>)
            } else if (entero > 40) {
                return (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.text}>⚖️</Text>
                        <Text style={styles.feedbackText}>
                            Presupuesto controlado
                        </Text>
                    </View>)
            } else if (entero > 0) {
                return (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.text}>💨</Text>
                        <Text style={styles.feedbackText}>
                            ¡Casi agotado! Gasta con precaución
                        </Text>
                    </View>)
            }
            else {
                return <Text style={styles.text}>🔒 Presupuesto superado</Text>;
            }
        }

        return <Text style={styles.text}>Sin datos</Text>;
    };

    return (
        <View style={styles.card}>
            <View style={{ alignItems: 'center' }} >
                <Text style={styles.title}>
                    {nombre}
                </Text>
                {renderContenido()}
            </View>
            <ProgressBar progress={porcentaje} color={tipoAMostrar === "Ingreso" ? "#4CAF50" : "#FF5722"} />
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