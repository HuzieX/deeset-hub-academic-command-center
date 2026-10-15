const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function seed(){
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mastadee01@gmail.com'
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MastaDee'
  const ADMIN_NAME = process.env.ADMIN_NAME || 'MastaDee'

  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
  if(existing){
    console.log('Admin already exists')
    return process.exit(0)
  }
  const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10)
  await prisma.user.create({ data: { email: ADMIN_EMAIL, name: ADMIN_NAME, passwordHash: hash, role: 'admin', paymentStatus: 'paid_premium' } })
  console.log('Seeded admin user:', ADMIN_EMAIL)
  process.exit(0)
}

seed().catch(e=>{ console.error(e); process.exit(1) })
