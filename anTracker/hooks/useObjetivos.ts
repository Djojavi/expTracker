import { Cuenta } from '@/app/(tabs)/objetivos';
import { useSQLiteContext } from 'expo-sqlite';

export function useObjetivos() {

    const db = useSQLiteContext();

    const getObjetivos = async():Promise<Cuenta[]> =>{
        return await db.getAllAsync(`SELECT * FROM Cuenta WHERE cuenta_tipo = 'O' ORDER BY cuenta_nombre ASC`)
    }

    return {getObjetivos}

}

