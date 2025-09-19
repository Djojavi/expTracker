import { Cuenta } from '@/app/(tabs)/objetivos';
import { Detalles } from '@/components/detailsObjPresupuesto';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

type TransaccionRow = {
    transaccion_monto: number;
};

export function useObjetivos() {


    const db = useSQLiteContext();

    const crearCuenta = async (cuenta_nombre: string, cuenta_descripcion: string, cuenta_tipo: string, cuenta_total: number) => {
        await db.runAsync('INSERT INTO Cuenta (cuenta_nombre, cuenta_descripcion, cuenta_tipo, cuenta_total, cuenta_actual, cuenta_progreso) VALUES (?,?,?,?,0,0)', [cuenta_nombre, cuenta_descripcion, cuenta_tipo, cuenta_total])
    }

    const getObjetivos = async (): Promise<Cuenta[]> => {
        return await db.getAllAsync(`SELECT * FROM Cuenta WHERE cuenta_tipo = 'O' ORDER BY cuenta_nombre ASC`)
    }

    const getPresupuestos = async (): Promise<Cuenta[]> => {
        return await db.getAllAsync(`SELECT * FROM Cuenta WHERE cuenta_tipo = 'P' ORDER BY cuenta_nombre ASC`)
    }
    const getPresupuestadoBalance = async (): Promise<number> => {
        const result = await db.getAllAsync<{ balance: number }>(
            `SELECT COALESCE(SUM(cuenta_total), 0) AS balance 
         FROM Cuenta 
         WHERE cuenta_tipo = 'P'`
        )
        return result[0].balance ?? 0
    }


    const updateSaldo = async (cuentaId: number, transaccionId: number, monto: number, esAObjetivo: boolean) => {
        await db.execAsync('BEGIN TRANSACTION');
        try {
            const montoTransaccion = await db.getFirstAsync(
                'SELECT transaccion_monto FROM Transacciones WHERE transaccion_id = ?',
                [transaccionId]
            ) as TransaccionRow;
            if (monto <= montoTransaccion.transaccion_monto) {
                if (esAObjetivo) {
                    await db.runAsync('UPDATE Transacciones SET transaccion_monto = transaccion_monto - ? WHERE transaccion_id = ?', [monto, transaccionId])
                    await db.runAsync(
                        'UPDATE Cuenta SET cuenta_actual = cuenta_actual + ? WHERE cuenta_id = ?',
                        [monto, cuentaId]
                    );
                } else {
                    await db.runAsync(
                        'UPDATE Cuenta SET cuenta_actual = cuenta_actual - ? WHERE cuenta_id = ?',
                        [monto, cuentaId]
                    );
                }

                await db.runAsync(
                    'INSERT INTO Transaccion_cuenta (transaccion_id, cuenta_id, tc_monto) VALUES (?, ?, ?)',
                    [transaccionId, cuentaId, monto]
                );

            } else {
                Alert.alert('Error', 'El valor a abonar debe ser mayor al valor disponible en la transacción')
            }
            await db.execAsync('COMMIT');
        } catch (error) {
            await db.execAsync('ROLLBACK');
            throw error;
        }
    };

    const getDetallesCuentas = async (id_cuenta: number): Promise<Detalles[]> => {
        return await db.getAllAsync('SELECT t.transaccion_nombre, t.transaccion_fecha, tc.tc_monto FROM Transacciones t JOIN Transaccion_cuenta tc ON t.transaccion_id = tc.transaccion_id WHERE tc.cuenta_id = ? ORDER BY t.transaccion_fecha DESC', [id_cuenta])
    }

    return { getObjetivos, getPresupuestos, updateSaldo, getDetallesCuentas, crearCuenta, getPresupuestadoBalance}

}

