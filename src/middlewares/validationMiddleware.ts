import { Request, Response, NextFunction } from 'express'
import { DayOfWeek } from '@/generated/prisma'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export const validateCreateAppointment = (req: Request, res: Response, next: NextFunction): void => {
    const { userId, userName, day, hour } = req.body
    
    if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'ID do usuário é obrigatório e deve ser uma string (UUID).' })
        return
    }

    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
        res.status(400).json({ error: 'Nome do usuário é obrigatório.' })
        return
    }

    if (!Object.values(DayOfWeek).includes(day)) {
        res.status(400).json({ error: `Dia deve ser um valor válido: ${Object.values(DayOfWeek).join(', ')}.` })
        return
    }

    const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    if (typeof hour !== 'string' || !hourRegex.test(hour)) {
        res.status(400).json({ error: 'Hora deve estar no formato HH:mm válido.' })
        return
    }

    next()
}

export const validateUserIdParam = (req: Request, res: Response, next: NextFunction): void => {
    const { userId } = req.params

    if (!userId || typeof userId !== 'string' || !uuidRegex.test(userId)) {
        res.status(400).json({ error: 'ID do usuário inválido na URL.' })
        return
    }

    next()
}

export const validateAppointmentIdParam = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params

    if (!id || typeof id !== 'string' || !uuidRegex.test(id)) {
        res.status(400).json({ error: 'ID do agendamento inválido na URL.' })
        return
    }
    
    next()
}