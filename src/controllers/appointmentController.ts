import { Request, Response } from 'express'
import { prisma } from '../app'
import { Appointment, DayOfWeek, User, Prisma } from '../generated/prisma'

type AppointmentWithUser = Prisma.AppointmentGetPayload<{
    include: { user: true }
}>

interface CreateAppointment {
    userId: string
    userName: string
    day: DayOfWeek
    hour: string
}

interface FormattedAppointment {
    appointmentId: string
    userId: string
    userName: string
    day: DayOfWeek
    hour: string
    createdAt: Date
    updatedAt: Date
}

export const createAppointment = async (req: Request<{}, {}, CreateAppointment>, res: Response): Promise<void> => {
    const { userId } = req.body

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!existingUser) {
            res.status(404).json({ error: `Usuário com id ${userId} não encontrado no banco de dados`})
            return 
        }

        const newAppointment: AppointmentWithUser = await prisma.appointment.create({
            data: {
                userId,
                day: req.body.day, 
                hour: req.body.hour,
            },
            include: {
                user: true,
            }
        })

        const formattedResponse: FormattedAppointment = {
            appointmentId: newAppointment.id,
            userId: newAppointment.userId,
            userName: newAppointment.user.name,
            day: newAppointment.day,
            hour: newAppointment.hour,
            createdAt: newAppointment.createdAt,
            updatedAt: newAppointment.updatedAt
        }

        res.status(201).json(formattedResponse)
        return 

    } catch (error) {
        console.error(`Erro ao criar o agendamento: ${error}`)
        res.status(500).json({ error: 'Erro ao criar o agendamento'})
        return 
    }
}

export const listAllAppointments = async (req: Request, res: Response): Promise<void> => {
    try {
        const appointments: AppointmentWithUser[] = await prisma.appointment.findMany({
            include: {
                user: true
            }
        })

        if (appointments.length === 0) {
            res.status(200).json([])
            return
        }

        const formattedAppointments: FormattedAppointment[] = appointments.map(app => ({
            appointmentId: app.id,
            userId: app.userId,
            userName: app.user.name,
            day: app.day,
            hour: app.hour,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
        }))

        res.status(200).json(formattedAppointments)
        return

    } catch (error) {
        console.error(`Erro ao listar agendamentos: ${error}`)
        res.status(500).json({ error: 'Erro interno no servidor ao listar agendamentos' })
        return
    }
}

export const listAppointmentByUser = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    const { userId } = req.params

    try {
        const appointments: AppointmentWithUser[] = await prisma.appointment.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        })

        if (appointments.length === 0) {
            res.status(404).json({ message: `Nenhum agendamento encontrado para o usuário com ID ${userId}.` })
            return
        }

        const formattedAppointments: FormattedAppointment[] = appointments.map(app => ({
            appointmentId: app.id,
            userId: app.userId,
            userName: app.user.name,
            day: app.day,
            hour: app.hour,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
        }))

        res.status(200).json(formattedAppointments)
        return
    } catch (error) {
        console.error('Erro ao listar agendamentos por usuário:', error)
        res.status(500).json({ error: 'Erro interno do servidor ao listar agendamentos por usuário.' })
        return
    }
}

export const deleteAppointment = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params

    try {
        const deletedAppointment = await prisma.appointment.delete({
            where: {
                id: id,
            },
        })

        res.status(200).json({ message: 'Agendamento deletado com sucesso.', appointment: deletedAppointment })
        return

    } catch (error: any) {
        console.error('Erro ao deletar agendamento:', error)

        if (error.code === 'P2025') {
            res.status(404).json({ error: `Agendamento com ID ${id} não encontrado.` })
            return
        }

        res.status(500).json({ error: 'Erro interno do servidor ao deletar agendamento.' })
        return
    }
}