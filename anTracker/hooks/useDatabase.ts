import { useSQLiteContext } from 'expo-sqlite';
export function useDatabase() {
    const db = useSQLiteContext();

    async function setupDatabase() {
        try {
            await db.execAsync('CREATE TABLE IF NOT EXISTS Categorias( categoria_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_nombre TEXT NOT NULL, categoria_descripcion TEXT NOT NULL, categoria_color TEXT NOT NULL); CREATE TABLE IF NOT EXISTS Cuentas (cuenta_id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta_nombre TEXT NOT NULL, cuenta_descripcion TEXT, incluir_balance BOOLEAN);CREATE TABLE IF NOT EXISTS Transacciones (transaccion_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_id INTEGER, transaccion_monto REAL NOT NULL, transaccion_nombre TEXT NOT NULL ,transaccion_metodo TEXT NOT NULL ,transaccion_fecha INTEGER NOT NULL, transaccion_descripcion TEXT,transaccion_tipo TEXT NOT NULL,cuenta_id INTEGER,FOREIGN KEY (categoria_id) REFERENCES Categorias (categoria_id), FOREIGN KEY (cuenta_id) REFERENCES Cuentas (cuenta_id));  ');

            console.log("✅ Tablas inicializadas");
        } catch (error) {
            console.error("❌ Error al inicializar tablas:", error);
        }
    }

    return { setupDatabase };
}

