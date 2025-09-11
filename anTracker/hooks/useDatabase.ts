import { useSQLiteContext } from 'expo-sqlite';
export function useDatabase() {
    const db = useSQLiteContext();

    async function setupDatabase() {
        try {
            await db.execAsync('CREATE TABLE IF NOT EXISTS Categorias( categoria_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_nombre TEXT NOT NULL, categoria_descripcion TEXT NOT NULL, categoria_color TEXT NOT NULL); CREATE TABLE IF NOT EXISTS Transacciones (transaccion_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_id INTEGER,objetivo_id INTEGER, presupuesto_id INTEGER,transaccion_monto REAL NOT NULL, transaccion_nombre TEXT NOT NULL ,transaccion_metodo TEXT NOT NULL ,transaccion_fecha INTEGER NOT NULL, transaccion_descripcion TEXT,transaccion_tipo TEXT NOT NULL,FOREIGN KEY (categoria_id) REFERENCES Categorias (categoria_id), FOREIGN KEY (objetivo_id) REFERENCES Objetivo (objetivo_id), FOREIGN KEY (presupuesto_id) REFERENCES Presupuesto (presupuesto_id));');
            await db.execAsync('CREATE TABLE IF NOT EXISTS Objetivo(objetivo_id INTEGER PRIMARY KEY AUTOINCREMENT, objetivo_nombre TEXT NOT NULL, objetivo_descripcion TEXT, objetivo_total REAL NOT NULL, objetivo_actual REAL NOT NULL, objetivo_progreso REACT NOT NULL);')
            await db.execAsync('CREATE TABLE IF NOT EXISTS Presupuesto(presupuesto_id INTEGER PRIMARY KEY AUTOINCREMENT, presupuesto_nombre TEXT NOT NULL, presupuesto_descripcion TEXT, presupuesto_total REAL NOT NULL, presupuesto_actual REAL NOT NULL, presupuesto_progreso REACT NOT NULL, se_repite INTEGER NOT NULL DEFAULT 0, presupuesto_frecuencia REAL);')
            console.log("✅ Tablas inicializadas");
        } catch (error) {
            console.error("❌ Error al inicializar tablas:", error);
        }
    }

    return { setupDatabase };
}

