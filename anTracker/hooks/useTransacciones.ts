import { MontoPorCategoria } from '@/app/(tabs)/graficos';
import { Transaccion } from '@/app/(tabs)/transacciones';
import { useSQLiteContext } from 'expo-sqlite';

export function useTransacciones() {
    const db = useSQLiteContext();

    const getBalance = async (): Promise<number> => {
        const result = await db.getAllAsync<{ balance: number }>(
            `SELECT COALESCE(
            (SELECT SUM(transaccion_monto) FROM Transacciones WHERE transaccion_tipo = 'Ingreso'), 0)
        - COALESCE(
            (SELECT SUM(transaccion_monto) FROM Transacciones WHERE transaccion_tipo = 'Gasto'),0)
        - COALESCE(
            (SELECT SUM(cuenta_total)FROM Cuenta WHERE cuenta_progreso < 1 AND cuenta_tipo = 'P'),0) AS balance;
        `);

        return result[0]?.balance ?? 0;
    };

    const getIngresoBalance = async (): Promise<number> => {
        const result = await db.getAllAsync<{ balance: number }>(
            `SELECT COALESCE(SUM(transaccion_monto), 0) AS balance 
         FROM Transacciones 
         WHERE transaccion_tipo = 'Ingreso'`
        )
        return result[0].balance ?? 0
    }

    const getGastoBalance = async (): Promise<number> => {
        const result = await db.getAllAsync<{ balance: number }>(
            `SELECT COALESCE(SUM(transaccion_monto), 0) AS balance 
         FROM Transacciones 
         WHERE transaccion_tipo = 'Gasto'`
        )
        return result[0].balance ?? 0
    }

    const getIngresosGastosPorFecha = async (
        fechaInicio: number,
        fechaFin: number
    ): Promise<{ ingresos: number; gastos: number }> => {
        const result = await db.getAllAsync<{
            ingresos: number;
            gastos: number;
        }>(
            `SELECT 
        COALESCE(SUM(CASE WHEN transaccion_tipo = 'Ingreso' THEN transaccion_monto END), 0) AS ingresos,
        COALESCE(SUM(CASE WHEN transaccion_tipo = 'Gasto' THEN transaccion_monto END), 0) AS gastos
     FROM Transacciones
     WHERE transaccion_fecha BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );

        return {
            ingresos: result[0].ingresos ?? 0,
            gastos: result[0].gastos ?? 0,
        };
    };

    const addTransaccion = async (transaccion: Transaccion) => {
        await db.runAsync(
            'INSERT INTO Transacciones (categoria_id, transaccion_monto, transaccion_nombre, transaccion_metodo, transaccion_fecha, transaccion_descripcion, transaccion_tipo) VALUES (?,?,?,?,?,?,?)', [transaccion.categoria_id, transaccion.transaccion_monto, transaccion.transaccion_nombre, transaccion.transaccion_metodo, transaccion.transaccion_fecha, transaccion.transaccion_descripcion, transaccion.transaccion_tipo]
        )
    }

    const getTransacciones = async (): Promise<Transaccion[]> => {
        return await db.getAllAsync<Transaccion>('SELECT * FROM Transacciones ORDER BY transaccion_fecha DESC')
    }

    const getTransaccionesPorFecha = async (fechaInicio: number, fechaFin: number): Promise<Transaccion[]> => {
        return await db.getAllAsync<Transaccion>('SELECT * FROM Transacciones WHERE transaccion_fecha BETWEEN ? AND ? ORDER BY transaccion_fecha DESC', [fechaInicio, fechaFin])
    }

    const getTransaccion = async (id: number) => {
        return await db.getFirstAsync<Transaccion>('SELECT * FROM Transacciones WHERE transaccion_id = ?', [id])
    }

    const getTransaccionMinimaFecha = async () => {
        return await db.getFirstAsync<Transaccion>('SELECT MIN(transaccion_fecha) FROM Transacciones WHERE transaccion_id = ?')
    }

    const getTransaccionExistente = async (nombre: string, fecha: number, descripcion: string) => {
        return await db.getFirstAsync<Transaccion>('SELECT * FROM Transacciones WHERE transaccion_nombre = ?, transaccion_fecha =?, transaccion_descripcion=?', [nombre, fecha, descripcion])
    }

    const updateTransaccion = async (transaccion: Transaccion, id: number) => {
        return await db.runAsync('UPDATE Transacciones SET categoria_id =?, transaccion_monto=?, transaccion_nombre=?, transaccion_metodo=?, transaccion_descripcion=?, transaccion_tipo=? WHERE transaccion_id=?', [transaccion.categoria_id, transaccion.transaccion_monto, transaccion.transaccion_nombre, transaccion.transaccion_metodo, transaccion.transaccion_descripcion, transaccion.transaccion_tipo, id])
    }

    const deleteTransaccion = async (transaccion_id: number) => {
        return await db.runAsync('DELETE FROM Transacciones WHERE transaccion_id = ?', [transaccion_id])
    }

    const deleteTransacciones = async () => {
        return await db.runAsync('DELETE FROM Transacciones')
    }

    const getIngresos = async (): Promise<Transaccion[]> => {
        return await db.getAllAsync<Transaccion>(`SELECT * FROM Transacciones WHERE transaccion_tipo = 'Ingreso' AND transaccion_monto != 0 ORDER BY transaccion_fecha DESC;`)
    }

    const getIngresosConMonto = async (): Promise<Transaccion[]> => {
        return await db.getAllAsync<Transaccion>(`SELECT * FROM Transacciones WHERE transaccion_tipo = 'Ingreso' ORDER BY transaccion_fecha DESC;`)
    }

    const getIngresosPorFecha = async (fechaInicio: number, fechaFin: number): Promise<Transaccion[]> => {
        return await db.getAllAsync<Transaccion>(`SELECT * FROM Transacciones WHERE transaccion_tipo = 'Ingreso' AND transaccion_fecha BETWEEN ? AND ? ORDER BY transaccion_fecha DESC`, [fechaInicio, fechaFin])
    }

    const getGastos = async (): Promise<Transaccion[]> => {
        return await db.getAllAsync<Transaccion>(`SELECT * FROM Transacciones WHERE transaccion_tipo = 'Gasto' ORDER BY transaccion_fecha DESC;`)
    }

    const getGastosPorFecha = async (fechaInicio: number, fechaFin: number): Promise<Transaccion[]> => {
        return await db.getAllAsync<Transaccion>(`SELECT * FROM Transacciones WHERE transaccion_tipo = 'Gasto' AND transaccion_fecha BETWEEN ? AND ? ORDER BY transaccion_fecha DESC`, [fechaInicio, fechaFin])
    }

    const getGastosNoPresupuestados = async (): Promise<Transaccion[]> => {
        return await db.getAllAsync<Transaccion>(`SELECT * FROM Transacciones WHERE transaccion_tipo = 'Gasto' AND transaccion_id NOT IN (SELECT transaccion_id FROM Transaccion_cuenta)`)
    }


    const getMontosPorCategoria = async (fechaInicio: number, fechaFin: number): Promise<MontoPorCategoria[]> => {
        return await db.getAllAsync('SELECT c.categoria_id, c.categoria_nombre, c.categoria_color,  SUM(t.transaccion_monto) AS total_monto FROM Transacciones t JOIN Categorias c ON t.categoria_id = c.categoria_id WHERE t.transaccion_fecha BETWEEN ? AND ? GROUP BY c.categoria_id, c.categoria_nombre, c.categoria_color ORDER BY total_monto DESC;', [fechaInicio, fechaFin])
    }

    const getMontosIngresosPorCategoria = async (fechaInicio: number, fechaFin: number): Promise<MontoPorCategoria[]> => {
        return await db.getAllAsync(`SELECT c.categoria_id, c.categoria_nombre, c.categoria_color,  SUM(t.transaccion_monto) AS total_monto FROM Transacciones t JOIN Categorias c ON t.categoria_id = c.categoria_id WHERE t.transaccion_tipo= 'Ingreso' AND t.transaccion_fecha BETWEEN ? AND ? GROUP BY c.categoria_id, c.categoria_nombre, c.categoria_color ORDER BY total_monto DESC;`, [fechaInicio, fechaFin])
    }

    const getMontosGastosPorCategoria = async (fechaInicio: number, fechaFin: number): Promise<MontoPorCategoria[]> => {
        return await db.getAllAsync(`SELECT c.categoria_id, c.categoria_nombre, c.categoria_color,  SUM(t.transaccion_monto) AS total_monto FROM Transacciones t JOIN Categorias c ON t.categoria_id = c.categoria_id WHERE  t.transaccion_tipo= 'Gasto' AND t.transaccion_fecha BETWEEN ? AND ? GROUP BY c.categoria_id, c.categoria_nombre, c.categoria_color ORDER BY total_monto DESC;`, [fechaInicio, fechaFin])
    }


    const getTransaccionesByName = async (nombre: string): Promise<Transaccion[]> => {
        const searchTerm = `%${nombre}%`;
        return await db.getAllAsync(
            'SELECT * FROM Transacciones WHERE transaccion_nombre LIKE ? OR transaccion_descripcion LIKE ? ORDER BY transaccion_fecha DESC',
            [searchTerm, searchTerm]
        );
    };

    const getIngresosYGastosByName = async (texto: string): Promise<{ ingBalance: number; gastoBalance: number }> => {
        const searchTerm = `%${texto}%`;
        const result = await db.getAllAsync<{ ingBalance: number; gastoBalance: number; }>(
            `SELECT 
                COALESCE(SUM(CASE WHEN transaccion_tipo = 'Ingreso' THEN transaccion_monto END), 0) AS ingBalance,
                COALESCE(SUM(CASE WHEN transaccion_tipo = 'Gasto' THEN transaccion_monto END), 0) AS gastoBalance
            FROM Transacciones
            WHERE transaccion_nombre LIKE ? OR transaccion_descripcion LIKE ?`,
            [searchTerm, searchTerm]
        );

        return {
            ingBalance: result[0].ingBalance ?? 0,
            gastoBalance: result[0].gastoBalance ?? 0,
        };
    };

    const getTransaccionesByCategoria = async (categoria_id: number): Promise<Transaccion[]> => {
        return await db.getAllAsync('SELECT * FROM Transacciones where categoria_id = ? ORDER BY transaccion_fecha DESC', [categoria_id])
    }

    const getIngresosYGastosByCategoria = async (
        categoria_id: number
    ): Promise<{ ingBalance: number; gastoBalance: number }> => {
        const result = await db.getAllAsync<{
            ingBalance: number;
            gastoBalance: number;
        }>(
            `SELECT 
                COALESCE(SUM(CASE WHEN transaccion_tipo = 'Ingreso' THEN transaccion_monto END), 0) AS ingBalance,
                COALESCE(SUM(CASE WHEN transaccion_tipo = 'Gasto' THEN transaccion_monto END), 0) AS gastoBalance
            FROM Transacciones
            WHERE categoria_id = ?`,
            [categoria_id]
        );

        return {
            ingBalance: result[0].ingBalance ?? 0,
            gastoBalance: result[0].gastoBalance ?? 0,
        };
    };



    return { addTransaccion, getTransacciones, getTransaccion, updateTransaccion, deleteTransaccion, getIngresos, getGastos, deleteTransacciones, getTransaccionExistente, getMontosPorCategoria, getTransaccionesPorFecha, getTransaccionMinimaFecha, getIngresosPorFecha, getIngresosConMonto, getGastosPorFecha, getTransaccionesByName, getTransaccionesByCategoria, getGastosNoPresupuestados, getBalance, getIngresoBalance, getGastoBalance, getIngresosGastosPorFecha, getIngresosYGastosByCategoria,getIngresosYGastosByName, getMontosGastosPorCategoria, getMontosIngresosPorCategoria }
}