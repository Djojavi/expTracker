import { Transaccion } from '@/app/(tabs)/transacciones';
import { useSQLiteContext } from 'expo-sqlite';

export function useTransacciones(){
    const db = useSQLiteContext();

    const addTransaccion = async (transaccion: Transaccion)=>{
        await db.runAsync(
            'INSERT INTO Transacciones (categoria_id, transaccion_monto, transaccion_nombre, transaccion_metodo, transaccion_fecha, transaccion_descripcion, transaccion_tipo) VALUES (?,?,?,?,?,?,?)',[transaccion.categoria_id, transaccion.transaccion_monto, transaccion.transaccion_nombre, transaccion.transaccion_metodo, transaccion.transaccion_fecha, transaccion.transaccion_descripcion, transaccion.transaccion_tipo]
        )
    }

    const getTransacciones = async(): Promise <Transaccion[]> =>{
        return await db.getAllAsync<Transaccion>('SELECT * FROM Transacciones')
    }

    return { addTransaccion, getTransacciones }
}