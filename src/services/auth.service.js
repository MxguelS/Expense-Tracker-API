
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const register = async (email, password) => {
const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
    const error = new Error('El email ya está registrado');
    error.statusCode = 409; // Conflict
    throw error;
}


const hashedPassword = await bcrypt.hash(password, 10); // 10 = saltRounds

const user = await prisma.user.create({
    data: { email, password: hashedPassword },
    select: { id: true, email: true, createdAt: true }, // Excluye el password del resultado
});

return user;
};

const login = async (email, password) => {
const user = await prisma.user.findUnique({ where: { email } });


    if (!user) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
    }

const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
    }


const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);

return { token };
};

module.exports = { register, login };