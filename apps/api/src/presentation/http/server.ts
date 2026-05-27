import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes are registered here as each module is implemented
// import { authRouter } from './routes/auth'
// import { analyticsRouter } from './routes/analytics'
// app.use('/auth', authRouter)
// app.use('/dashboard', analyticsRouter)

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

export { app, prisma }
