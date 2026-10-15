const handler = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end()
  try{
    // require admin
    const requireAdmin = require('../../../lib/requireAdmin')
    const adminCheck = await requireAdmin.requireAdminToken(req, res)
    if(adminCheck && adminCheck.error) return // response handled

    const supabaseAdmin = require('../../../lib/supabaseAdmin')
    const code = `CBT-${Math.random().toString(36).slice(2,8).toUpperCase()}`
    const { data, error } = await supabaseAdmin.from('cbt_codes').insert([{ code, used: false }]).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ code: data[0].code })
  }catch(e){ return res.status(500).json({ error: 'server' }) }
}
export default handler
