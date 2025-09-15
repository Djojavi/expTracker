import { Cuenta } from '@/app/(tabs)/objetivos';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

type TransaccionRow = {
    transaccion_monto: number;
};

export function useObjetivos() {


    const db = useSQLiteContext();

    const getObjetivos = async (): Promise<Cuenta[]> => {
        return await db.getAllAsync(`SELECT * FROM Cuenta WHERE cuenta_tipo = 'O' ORDER BY cuenta_nombre ASC`)
    }

    const getPresupuestos = async (): Promise<Cuenta[]> => {
        return await db.getAllAsync(`SELECT * FROM Cuenta WHERE cuenta_tipo = 'P' ORDER BY cuenta_nombre ASC`)
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
                    await db.runAsync('UPDATE Transacciones SET transaccion_monto = transaccion_monto + ? WHERE transaccion_id = ?', [monto, transaccionId])
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



    return { getObjetivos, getPresupuestos, updateSaldo }

}

