import express from 'express'
import { router as appointmentRoutes } from '@/routes/appointmentRoutes'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('API de agendamentos online')
})

app.use('/appointments', appointmentRoutes)

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack)
    res.status(500).send('Erro interno do servidor')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
    console.log(`Acesse http://localhost:${PORT} para usar a API`)
})

export { prisma }