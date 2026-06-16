
const {z} = require('zod');

const validCategories = ['Comestibles', 'Ocio',
    'Electronica', 'Utilidades', 'Ropa', 'Salud', 'Otros'
]
const validFilters = ['last_week','last_month',
    'last_3_months','custom'
]

const createExpenseSchema = z.object({
    amount: z.number().positive('El monto debe ser un número positivo'),
    category: z.enum(validCategories, { message: 'Categoría inválida' }),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
    })

const updateExpenseSchema = createExpenseSchema.partial();

const filterExpenseSchema = z.object({
    filter: z.enum(validFilters).optional(),
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