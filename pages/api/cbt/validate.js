const handler = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end()
  try{
    const { code } = req.body
    const supabaseAdmin = require('../../../lib/supabaseAdmin')
    const { data, error } = await supabaseAdmin.from('cbt_codes').select('*').eq('code', code).limit(1)
    if(error) return res.status(500).json({ valid:false })
    if(!data || data.length === 0) return res.status(200).json({ valid:false })
    if(data[0].used) return res.status(200).json({ valid:false })
    // mark used
    await supabaseAdmin.from('cbt_codes').update({ used:true, used_at: new Date().toISOString() }).eq('id', data[0].id)
    return res.status(200).json({ valid:true })
  }catch(e){ return res.status(500).json({ valid:false }) }
}
export default handler
