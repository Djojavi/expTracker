import { Categoria } from '@/app/(tabs)';
import { useSQLiteContext } from 'expo-sqlite';

export function useCategorias() {
    const db = useSQLiteContext();

    const addCategoria = async (categoria: Categoria) => {
        await db.runAsync(
            'INSERT INTO Categorias (categoria_nombre, categoria_color) VALUES (?, ?)',
            [categoria.categoria_nombre, categoria.categoria_color]
        );
    };

    const getCategorias = async (): Promise<Categoria[]> => {
        return await db.getAllAsync<Categoria>('SELECT * FROM Categorias');
    };

    const updateCategoria = async(categoria: Categoria) =>{
        await db.runAsync('UPDATE Categorias SETcategoria_nombre =?, categoria_color=? WHERE categoria_id = ?')
    }

    return { addCategoria, getCategorias, updateCategoria}

}