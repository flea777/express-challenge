import { Router } from 'express'
import {
  createAppointment,
  listAllAppointments,
  listAppointmentByUser, 
  deleteAppointment 
} from '@/controllers/appointmentController'

import {
  validateAppointmentIdParam,
  validateCreateAppointment, 
  validateUserIdParam
} from '@/middlewares/validationMiddleware'

export const router = Router()

router.post('/', validateCreateAppointment, createAppointment)

router.get('/', listAllAppointments)

router.get('/user/:userId', validateUserIdParam, listAppointmentByUser)

router.delete('/:id', validateAppointmentIdParam, deleteAppointment)