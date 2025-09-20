import { useSQLiteContext } from 'expo-sqlite';
export function useDatabase() {
    const db = useSQLiteContext();

    async function setupDatabase() {
        try {
            await db.execAsync('CREATE TABLE IF NOT EXISTS Categorias( categoria_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_nombre TEXT NOT NULL, categoria_descripcion TEXT, categoria_color TEXT NOT NULL); CREATE TABLE IF NOT EXISTS Transacciones (transaccion_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_id INTEGER,transaccion_monto REAL NOT NULL, transaccion_nombre TEXT NOT NULL ,transaccion_metodo TEXT NOT NULL ,transaccion_fecha INTEGER NOT NULL, transaccion_descripcion TEXT,transaccion_tipo TEXT NOT NULL,FOREIGN KEY (categoria_id) REFERENCES Categorias (categoria_id));');
            await db.execAsync(`CREATE TABLE IF NOT EXISTS Cuenta(cuenta_id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta_nombre TEXT NOT NULL, cuenta_descripcion TEXT, cuenta_tipo CHAR(1) NOT NULL CHECK (cuenta_tipo = 'O' OR cuenta_tipo = 'P') , cuenta_total REAL NOT NULL, cuenta_actual REAL NOT NULL, cuenta_progreso REAL NOT NULL, se_repite INTEGER  DEFAULT 0, cuenta_frecuencia REAL);`)//se_repite y frecuencia están en standby, se debería insertar la fecha de ingreso también
            await db.execAsync('CREATE TABLE IF NOT EXISTS Transaccion_cuenta(transaccion_id REAL NOT NULL, cuenta_id REAL NOT NULL, tc_monto REAL NOT NULL,FOREIGN KEY (transaccion_id) REFERENCES Transacciones (transaccion_id),FOREIGN KEY (cuenta_id) REFERENCES Cuenta (cuenta_id))')
            await db.execAsync('CREATE TRIGGER IF NOT EXISTS actualizar_progreso AFTER UPDATE OF cuenta_actual ON Cuenta FOR EACH ROW BEGIN  UPDATE Cuenta SET cuenta_progreso = NEW.cuenta_actual / NEW.cuenta_total WHERE cuenta_id = NEW.cuenta_id; END;')
            console.log("✅ Tablas inicializadas");
        } catch (error) {
            console.error("❌ Error al inicializar tablas:", error);
        }
    }

    return { setupDatabase };
}

