# AnTracker

**AnTracker** es una aplicación móvil diseñada para ayudarte a llevar un control detallado de tus finanzas personales, enfocándose en el registro de los pequeños gastos diarios.

## Funcionalidades

- **Registro de transacciones:**  
  Permite registrar ingresos y gastos de manera sencilla.

- **Categorías:**  
  Cada transacción puede asignarse a una categoría específica para facilitar el análisis.

- **Búsqueda avanzada:**  
  Busca transacciones por fechas, por categorías o por texto que incluya el nombre o la descripción.

- **Gráficos de barras:**  
  Visualiza la evolución de tus ingresos y gastos a lo largo del tiempo, con opción de filtrar por fechas.

- **Gráfico de pastel:**  
  Analiza en qué categorías has gastado más, también filtrable por rangos de fechas.

- **Objetivos y presupuestos:**  
  Establece metas financieras y presupuestos para mantener tus finanzas bajo control.  
  La app brinda retroalimentación dinámica según qué tan cerca estés de alcanzar tus objetivos.

- **Importar y exportar CSV:**  
  Gestiona tus datos con facilidad importando o exportando tus transacciones en formato CSV.

- **Privacidad total:**  
  Funciona 100% offline, usando SQLite como base de datos local. Ninguna información se almacena en la nube.

## Tecnologías

- **React Native** con **Expo SDK 53**  
- **SQLite** para almacenamiento local  
- Componentes modernos y responsive adaptados a dispositivos móviles

## Uso

1. **Registrar transacciones:** Ingresa tus ingresos y gastos con detalle (nombre, descripción, monto, categoría).  
2. **Filtrar y buscar:** Encuentra cualquier transacción usando fecha, categoría o texto.  
3. **Visualizar gráficos:** Consulta el uso de tu dinero a través de gráficos de barras y de pastel.  
4. **Gestionar objetivos y presupuestos:** Define metas y revisa tu progreso en tiempo real.  
5. **Importar/exportar datos:** Mantén tu historial seguro o compártelo fácilmente mediante CSV.

## Instalación

```bash
# Clonar el repositorio
git clone 

# Instalar dependencias
cd gastos-hormiga-app
npm install

# Iniciar la aplicación
npx expo start
