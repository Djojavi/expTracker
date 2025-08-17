import { Categoria } from '@/app/(tabs)/categoria';
import { useSQLiteContext } from 'expo-sqlite';

export function useCategorias() {
    const db = useSQLiteContext();

    const addCategoria = async (categoria: Categoria) => {
        await db.runAsync(
            'INSERT INTO Categorias (categoria_nombre, categoria_descripcion, categoria_color) VALUES (?, ?, ?)',
            [categoria.categoria_nombre, categoria.categoria_descripcion ,categoria.categoria_color]
        );
    };

    const getCategorias = async (): Promise<Categoria[]> => {
        return await db.getAllAsync<Categoria>('SELECT * FROM Categorias');
    };

    const updateCategoria = async(categoria: Categoria) =>{
        await db.runAsync('UPDATE Categorias SET categoria_nombre =?, categoria_color=?, categoria_descripcion=? WHERE categoria_id = ?', [categoria.categoria_nombre,categoria.categoria_color,categoria.categoria_descripcion,categoria.categoria_id??null])
    }

    return { addCategoria, getCategorias, updateCategoria}

}