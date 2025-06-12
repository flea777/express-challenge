"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAppointmentIdParam = exports.validateUserIdParam = exports.validateCreateAppointment = void 0;
const prisma_1 = require("@/generated/prisma");
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const validateCreateAppointment = (req, res, next) => {
    const { userId, userName, day, hour } = req.body;
    if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'ID do usuário é obrigatório e deve ser uma string (UUID).' });
        return;
    }
    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
        res.status(400).json({ error: 'Nome do usuário é obrigatório.' });
        return;
    }
    if (!Object.values(prisma_1.DayOfWeek).includes(day)) {
        res.status(400).json({ error: `Dia deve ser um valor válido: ${Object.values(prisma_1.DayOfWeek).join(', ')}.` });
        return;
    }
    const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (typeof hour !== 'string' || !hourRegex.test(hour)) {
        res.status(400).json({ error: 'Hora deve estar no formato HH:mm válido.' });
        return;
    }
    next();
};
exports.validateCreateAppointment = validateCreateAppointment;
const validateUserIdParam = (req, res, next) => {
    const { userId } = req.params;
    if (!userId || typeof userId !== 'string' || !uuidRegex.test(userId)) {
        res.status(400).json({ error: 'ID do usuário inválido na URL.' });
        return;
    }
    next();
};
exports.validateUserIdParam = validateUserIdParam;
const validateAppointmentIdParam = (req, res, next) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string' || !uuidRegex.test(id)) {
        res.status(400).json({ error: 'ID do agendamento inválido na URL.' });
        return;
    }
    next();
};
exports.validateAppointmentIdParam = validateAppointmentIdParam;
