
const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const register = async (req, res, next) => {
    try {
        const { email, password } = registerSchema.parse(req.body);

        const user = await authService.register(email, password);
        res.status(201).json({ success: true, data: user });
    } catch (error) {

        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, 
                error: error.issues[0].message,
                });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const result = await authService.login(email, password);

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false,
                error: error.issues[0].message,
                });
        }
        next(error);
    }
};

module.exports = { register, login };