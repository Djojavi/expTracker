import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { AddInCuentasScreen } from "./addTransaccionesInCuentas";
import { DetailsObjPresupuestoComponent } from "./detailsObjPresupuesto";
import ProgressBar from "./progressBar";

type ObjPresupuestoProps = {
  descripcion: string;
  nombre: string;
  total: number;
  actual: number;
  progreso: number;
  seRepite?: number;
  frecuencia?: number;
  tipo: string;
  aMostrar: string;
  id: number;
  onCloseSheet: () => void;
};

export const ObjPresupuestoCard: React.FC<ObjPresupuestoProps> = ({
  descripcion,
  nombre,
  total,
  actual,
  progreso,
  seRepite,
  frecuencia,
  tipo, aMostrar, id, onCloseSheet
}) => {
  interface RBSheetRef {
    open: () => void;
    close: () => void;
  }
  const refRBSheet = useRef<RBSheetRef>(null);
  const detailsRefRBSheet = useRef<RBSheetRef>(null);
  return (
    <View >
      <RBSheet
        ref={refRBSheet}
        height={500}
        openDuration={300}
        onClose={onCloseSheet}
        customStyles={{
          container: {
            padding: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >
        <AddInCuentasScreen 
          tipoAMostrar={aMostrar} idCuenta={id} nombreAMostrar={nombre} saldoPresupuesto={actual} saldoObjetivo={total-actual}  />
      </RBSheet>

      <RBSheet
        ref={detailsRefRBSheet}
        height={650}
        openDuration={300}
        onClose={onCloseSheet}
        customStyles={{
          container: {
            padding: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >
        <DetailsObjPresupuestoComponent 
          tipoAMostrar={aMostrar} porcentaje={progreso} nombre={nombre} current={actual} />
      </RBSheet>


      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.left}>
            <Text style={styles.title}>{nombre}</Text>
            {descripcion ? (
              <Text style={styles.description}>{descripcion}</Text>
            ) : null}
          </View>
          <View style={styles.right}>
            <Text style={{fontSize:11, fontStyle:'italic', color:'#646464ff'}}>{tipo === "O" ? "Has ahorrado el" : "Te queda el"}</Text>
            <Text
              style={[
                styles.percentage,
                { color: tipo === "O" ? "#4caf50" : "#2196f3" },
              ]}
            >
              {Math.round(progreso * 100)}%
            </Text>
          </View>
        </View>

        <View style={styles.progressWrapper}>
          <ProgressBar
            progress={tipo=="O" ? progreso: 1-progreso}
            color={tipo === "O" ? "#4caf50" : "#2196f3"}
            backgroundColor="#f0f0f0"
            start={0}
            end={total}
            current={actual}
            height={14}
          />
        </View>

        {seRepite !== 0 && frecuencia ? (
          <Text style={styles.repeatText}>
            🔁 Se repite cada {frecuencia} semana{frecuencia > 1 ? "s" : ""}
          </Text>
        ) : null}

        <View style={styles.buttonRow}>
          <Pressable onPress={() => detailsRefRBSheet.current?.open()} style={[styles.button, { backgroundColor: '#A37366' }]}>
            <Text style={styles.buttonText}>Detalles</Text>
          </Pressable>
          <Pressable onPress={() => refRBSheet.current?.open()} style={[styles.button, { backgroundColor: tipo === 'O' ? "#4caf50" : "#2196f3" }]}>
            <Text style={styles.buttonText}>Añadir</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 3,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  left: {
    flex: 1,
    paddingRight: 10,
  },
  right: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  percentage: {
    fontSize: 25,
    fontWeight: "700",
  },
  progressWrapper: {
    marginTop: 6,
    marginBottom: 4,
  },
  repeatText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
