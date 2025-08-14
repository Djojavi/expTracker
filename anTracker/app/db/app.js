import { SQLiteProvider } from 'expo-sqlite';

export default function App() {
  return (
    <SQLiteProvider database="userDatabase.db" onInit={async(db) =>{
      await db.execAsync(' CREATE TABLE IF NOT EXISTS Categorias( categoria_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_nombre TEXT NOT NULL, categoria_descripcion TEXT NOT NULL, categoria_color TEXT NOT NULL UNIQUE); CREATE TABLE IF NOT EXISTS Transacciones (transaccion_id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_id INTEGER, transaccion_monto REAL NOT NULL, transaccion_metodo TEXT NOT NULL ,transaccion_fecha INTEGER NOT NULL, transaccion_descripcion TEXT,transaccion_tipo TEXT NOT NULL,FOREIGN KEY (categoria_id) REFERENCES Categorias (categoria_id)); INSERT INTO Categorias (categoria_nombre, categoria_descripcion, categoria_color)VALUES (`Alimentos`, `Gastos relacionados con comida y supermercado`, `#FF5733`),(`Transporte`, `Gastos en transporte público o gasolina`, `#33FF57`); INSERT INTO Transacciones (categoria_id, transaccion_monto, transaccion_metodo, transaccion_fecha, transaccion_descripcion, transaccion_tipo)VALUES(1, 25.50, `Efectivo`, strftime(`%s`,`2025-08-14`), `Compra en supermercado`, `Gasto`),(2, 10.00, `Tarjeta`, strftime(`%s`,`2025-08-14`), `Taxi al trabajo`, `Gasto`);')
    }}
    options={{useNewConnection: false}}
    >

    </SQLiteProvider>
  );
}
