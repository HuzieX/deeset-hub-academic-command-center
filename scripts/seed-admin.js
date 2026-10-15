const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if(!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY){ console.error('Missing SUPABASE env for seed script'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const bcrypt = require('bcryptjs')

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mastadee01@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MastaDee'
const ADMIN_NAME = process.env.ADMIN_NAME || 'MastaDee'

async function run(){
  console.log('Seeding admin user...')
  // Create or update a row in 'users' table if exists, else try auth API
  try{
    // Try supabase auth admin createUser
    if(supabase.auth && supabase.auth.admin && typeof supabase.auth.admin.createUser === 'function'){
      console.log('Using auth.admin.createUser')
      // attempt to create; if exists, update metadata
      const res = await supabase.auth.admin.upsertUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        user_metadata: { name: ADMIN_NAME, role: 'admin', paymentStatus: 'paid_premium' }
      })
      console.log('Upsert result:', res)
    }else{
      // fallback: insert into a 'deeset_users' table
      const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10)
      const { data, error } = await supabase.from('deeset_users').upsert({ email: ADMIN_EMAIL, name: ADMIN_NAME, password_hash: hash, role: 'admin', payment_status: 'paid_premium' })
      if(error) console.error('Upsert error:', error)
      else console.log('Upserted in deeset_users')
    }
  }catch(err){
    console.error('Seed failed', err)
  }
}

run().then(()=> process.exit(0)).catch(()=> process.exit(1))
