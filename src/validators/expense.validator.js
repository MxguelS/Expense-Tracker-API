
const {z} = require('zod');

const Valid_categories = ['Comestibles', 'Ocio',
    'Electronica', 'Utilidades', 'Ropa', 'Salud', 'Otros'
]
const Valid_filtres = ['last_week','last_month',
    'last_3_months','custom'
]

const createExpenseSchema = z.object({
    amount: z.number().positive('El monto debe ser un número positivo'),
    category: z.enum(valid_categories, { message: 'Categoría inválida' }),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
    })

const updateExpenseSchema = createExpenseSchema.partial();

const filterExpenseSchema = z.object({
    filter: z.enum(valid_filtres).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
}).refine(
    (data) => {
        if (data.filter === 'custom') {
            return data.startDate && data.endDate;
        }
        return true;
    },
    { message: 'Para filtro custom, startDate y endDate son requeridos' }
);

module.exports = {
    createExpenseSchema,
    updateExpenseSchema,
    filterExpenseSchema
};