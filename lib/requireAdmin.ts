import { supabase } from '../../lib/supabaseClient'

export async function requireAdminToken(req, res){
  const auth = req.headers.authorization || ''
  const token = auth.split(' ')[1]
  if(!token) return res.status(401).json({ error: 'Missing authorization token' })
  try{
    const { data, error } = await supabase.auth.getUser(token)
    if(error || !data?.user) return res.status(401).json({ error: 'Invalid token' })
    const user = data.user
    const role = (user.user_metadata && user.user_metadata.role) || (user.user_metadata?.role)
    if(role !== 'admin') return res.status(403).json({ error: 'Admin role required' })
    return user
  }catch(e){
    return res.status(500).json({ error: 'Auth verification failed' })
  }
}
