
const {z} = require('zod');

const registerSchema = z.object({
    email: z.string().email({ message:
         'Email inválido' }),
    password: z.string().min(6, { message: 
        'La contraseña debe tener al menos 6 caracteres' }),
});

const loginSchema = z.object({
    email: z.string().email({ message:
         'Email inválido' }),
    password: z.string().min(1,'password requerido' ),
});

module.exports = {
    registerSchema,
    loginSchema
};