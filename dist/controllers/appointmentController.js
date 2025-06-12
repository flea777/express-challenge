"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointment = exports.listAppointmentByUser = exports.listAllAppointments = exports.createAppointment = void 0;
const app_1 = require("../app");
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const existingUser = yield app_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!existingUser) {
            res.status(404).json({ error: `Usuário com id ${userId} não encontrado no banco de dados` });
            return;
        }
        const newAppointment = yield app_1.prisma.appointment.create({
            data: {
                userId,
                day: req.body.day,
                hour: req.body.hour,
            },
            include: {
                user: true,
            }
        });
        const formattedResponse = {
            appointmentId: newAppointment.id,
            userId: newAppointment.userId,
            userName: newAppointment.user.name,
            day: newAppointment.day,
            hour: newAppointment.hour,
            createdAt: newAppointment.createdAt,
            updatedAt: newAppointment.updatedAt
        };
        res.status(201).json(formattedResponse);
        return;
    }
    catch (error) {
        console.error(`Erro ao criar o agendamento: ${error}`);
        res.status(500).json({ error: 'Erro ao criar o agendamento' });
        return;
    }
});
exports.createAppointment = createAppointment;
const listAllAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield app_1.prisma.appointment.findMany({
            include: {
                user: true
            }
        });
        if (appointments.length === 0) {
            res.status(200).json([]);
            return;
        }
        const formattedAppointments = appointments.map(app => ({
            appointmentId: app.id,
            userId: app.userId,
            userName: app.user.name,
            day: app.day,
            hour: app.hour,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
        }));
        res.status(200).json(formattedAppointments);
        return;
    }
    catch (error) {
        console.error(`Erro ao listar agendamentos: ${error}`);
        res.status(500).json({ error: 'Erro interno no servidor ao listar agendamentos' });
        return;
    }
});
exports.listAllAppointments = listAllAppointments;
const listAppointmentByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const appointments = yield app_1.prisma.appointment.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });
        if (appointments.length === 0) {
            res.status(404).json({ message: `Nenhum agendamento encontrado para o usuário com ID ${userId}.` });
            return;
        }
        const formattedAppointments = appointments.map(app => ({
            appointmentId: app.id,
            userId: app.userId,
            userName: app.user.name,
            day: app.day,
            hour: app.hour,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
        }));
        res.status(200).json(formattedAppointments);
        return;
    }
    catch (error) {
        console.error('Erro ao listar agendamentos por usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao listar agendamentos por usuário.' });
        return;
    }
});
exports.listAppointmentByUser = listAppointmentByUser;
const deleteAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedAppointment = yield app_1.prisma.appointment.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({ message: 'Agendamento deletado com sucesso.', appointment: deletedAppointment });
        return;
    }
    catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: `Agendamento com ID ${id} não encontrado.` });
            return;
        }
        res.status(500).json({ error: 'Erro interno do servidor ao deletar agendamento.' });
        return;
    }
});
exports.deleteAppointment = deleteAppointment;
