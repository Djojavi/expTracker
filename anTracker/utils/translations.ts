const en = {
    Home: {
        Transactions: 'Transactions',
        Categories: 'Categories',
    },
    Menu: {
        Home: 'Home',
        Income: 'Income',
        Expenses: 'Expenses',
        Analytics: 'Analytics',
        Goals: 'Goals',
        Budgets: 'Budgets',
    },
    Transactions: {
        Search: 'Search',
        SearchCategory: 'Search by category',
        Months: {
            January: 'Jan',
            February: 'Feb',
            March: 'Mar',
            April: 'Apr',
            May: 'May',
            June: 'June',
            July: 'July',
            August: 'Aug',
            September: 'Sept',
            October: 'Oct',
            November: 'Nov',
            December: 'Dec'
        },
        Balance: 'Balance',
        Budgeted: 'Budgeted',
        aTransaction: 'Add Transaction',
        Name: 'Name',
        Description: 'Description',
        Amount: 'Amount',
        Method: 'Method',
        SelectCategory: 'Select a category!',
        FindCategory: 'Find your categories',
        Done: 'Done!',
        dTransaction: 'Delete Transaction',
        uTransaction: 'Update Transaction'
    },
    Categories: {
        aCategory: 'Add Category',
        uCategory: 'Update Category',
        dCategory: 'Delete Category',
        chooseColor:'Choose a color for your category'
    },
    CSV: {
        ToImport: 'Import transactions from CSV file',
        HowToImport: 'How should I format my CSV file?',
        Import: 'Import',
        HowToImportTitle: 'The CSV file must have the following columns (in the same order)',
        HowToImportInstructions: {
            Step1: '1. date (format: YYYY-MM-DD)',
            Step2: '2. amount (use dot “.” for decimals, no symbols)',
            Step3: '3. name (e.g.: "Supermarket")',
            Step4: '4. description (optional detail)',
            Step5: '5. type (Income or Expense)',
            Step6: '6. category (e.g.: "Food" – must already exist)',
            Step7: '7. method (e.g.: "Cash", "Card")',
            Example: `Valid example:\n2025-08-14,200,Used book sale,Extra income,Income,Others,Cash`
        },
        ImportQuestion: 'How would you like to import your data?',
        ImportDescription: 'If we find transactions that alreasy exist, would you like us to...',
        Overwrite: 'Overwrite them',
        Duplicate: 'Duplicate them',
        ToExport: 'Export transactions to CSV file',
        DeleteInfo: 'Erase all my info',
        Delete: 'Erase',
        DeleteWarningTitle: 'All data will be erased',
        DeleteWarningDesc: `This action can't be undone`,
        Cancel: 'Cancel',
    },
    NoData: {
        NoDataTitle: `There are no %{message} registered!`,
        NoDataDesc: `When you add new ones, they'll show here`,
        AddOne: 'Add One'
    },
    GoalsBudgets: {
        NewGoal: 'New Goal',
        NewBudget: 'New Budget',
        CurrentBalance: 'Your current balance is:'
    }
}

const es = {
    Home: {
        Transactions: 'Transacciones',
        Categories: 'Categorias',
    },
    Menu: {
        Home: 'Inicio',
        Income: 'Ingresos',
        Expenses: 'Gastos',
        Analytics: 'Graficos',
        Goals: 'Metas',
        Budgets: 'Presupuestos',
    },
    Transactions: {
        Search: 'Buscar',
        SearchCategory: 'Buscar por categoría',
        Months: {
            January: 'Ene',
            February: 'Feb',
            March: 'Mar',
            April: 'Abr',
            May: 'May',
            June: 'Jun',
            July: 'Jul',
            August: 'Ago',
            September: 'Sept',
            October: 'Oct',
            November: 'Nov',
            December: 'Dic'
        },
        Balance: 'Balance',
        Budgeted: 'Presupuestado',
        aTransaction: 'Añadir Transacción',
        Name: 'Nombre',
        Description: 'Descripción',
        Amount: 'Monto',
        Method: 'Método',
        SelectCategory: 'Selecciona una categoría!',
        FindCategory: 'Encuentra tus categorías',
        Done: 'Listo!',
        dTransaction: 'Eliminar Transacción',
        uTransaction: 'Actualizar Transacción'
    },
    Categories: {
        aCategory: 'Añadir Categoría',
        uCategory: 'Actualizar Categoría',
        dCategory: 'Eliminar Categoría',
        chooseColor:'Escoge el color para tu categoría'
    },
    CSV: {
        ToImport: 'Importar transacciones desde archivo CSV',
        HowToImport: '¿Cómo debo dar formato a mi archivo CSV?',
        Import: 'Importar',
        HowToImportTitle: 'El archivo CSV debe tener las siguientes columnas (en el mismo orden)',
        HowToImportInstructions: {
            Step1: '1. fecha (formato: YYYY-MM-DD)',
            Step2: '2. monto (usar punto “.” para decimales, sin símbolos)',
            Step3: '3. nombre (ej.: "Supermercado")',
            Step4: '4. descripcion (detalle opcional)',
            Step5: '5. tipo (Ingreso o Gasto)',
            Step6: '6. categoria (ej.: "Alimentos" – debe existir previamente)',
            Step7: '7. metodo (ej.: "Efectivo", "Tarjeta")',
            Example: `Ejemplo válido:\n2025-08-14,200,Venta libro usado,Ingreso extra,Ingreso,Otros,Efectivo`
        },
        ImportQuestion: '¿Cómo deseas importar tus datos?',
        ImportDescription: 'Si encontramos transacciones que ya existen, ¿quieres que...',
        Overwrite: 'Sobrescribirlas',
        Duplicate: 'Duplicarlas',
        ToExport: 'Exportar transacciones a archivo CSV',
        DeleteInfo: 'Borrar toda mi información',
        Delete: 'Borrar',
        DeleteWarningTitle: 'Todos los datos serán eliminados',
        DeleteWarningDesc: `Esta acción no se puede deshacer`,
        Cancel: 'Cancelar',
    },
    NoData: {
        NoDataTitle: `¡No hay %{message} registrados!`,
        NoDataDesc: `Cuando agregues nuevos, aparecerán aquí`,
        AddOne: 'Agregar uno'
    },
    GoalsBudgets: {
        NewGoal: 'Nueva Meta',
        NewBudget: 'Nuevo Presupuesto',
        CurrentBalance: 'Tu saldo actual es:'
    }
}

export { en, es }

