
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const getDateRange = (filter,startDate,endDate) => {
    const now = new Date();
    switch (filter) {
        case 'last_week': {
            const start = new Date(now);
            start.setDate(now.getDate() - 7);
            return { gte: start, lte: now };
        }
        case 'last_month': {
            const start = new Date(now);
            start.setMonth(now.getMonth() - 1);
            return { gte: start, lte: now };
        }
        case 'last_3_months': {
            const start = new Date(now);
            start.setMonth(now.getMonth() - 3);
            return { gte: start, lte: now };
        }
        case 'custom': {
            return { gte: new Date(startDate), lte: new Date
                (endDate) };
        }
        default:
            return undefined;
    }
};

const getExpenses = async (userId, filter, startDate, endDate) => { 
        const dateRange = getDateRange(filter, startDate, endDate);

        return prisma.expense.findMany({
            where: {
                userId,
                ...(dateRange && { date: dateRange }),
            },
            orderBy: { date: 'desc' },
        });
}

const createExpense = async (userId,data) => {
    return prisma.expense.create({
        data: {
            ...data,
            userId,
        },
    });
};

const updateExpense = async (userId, expenseId, data) => {
    const expense = await prisma.expense.findUnique({
        where: { id: expenseId }});

        if (!expense){
            const error = new Error('Gasto no encontrado');
            error.statusCode = 404;
            throw error;
        }
        if (expense.userId !== userId) {
            const error = new Error('No tienes permisos para actualizar este gasto');
            error.statusCode = 403;
            throw error;
        }

        return prisma.expense.update({
            where: { id: expenseId },
            data,
        });
};

const deleteExpense = async (userId, expenseId) => {
    const expense = await prisma.expense.findUnique({ 
    where: { id: expenseId } });
    
    if (!expense) {
        const error = new Error('Gasto no encontrado');
        error.statusCode = 404;
        throw error;
    }

    if (expense.userId !== userId) {
        const error = new Error('No tienes permisos para eliminar este gasto');
        error.statusCode = 403;
        throw error;
    }

    return prisma.expense.delete({ where: { id: expenseId } });
};

module.exports = {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
};

