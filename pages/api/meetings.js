const handler = async (req, res) => {
  if(req.method === 'GET'){
    try{
      // server-side fetch meetings from Supabase if configured
      const supabaseAdmin = require('../../lib/supabaseAdmin')
      const { data, error } = await supabaseAdmin.from('meetings').select('*')
      if(error) return res.status(500).json([])
      return res.status(200).json(data)
    }catch(err){
      return res.status(200).json([])
    }
  }
  if(req.method === 'POST'){
    try{
      const supabaseAdmin = require('../../lib/supabaseAdmin')
      const { title, scheduledAt, platform, meetingLink } = req.body
      const { data, error } = await supabaseAdmin.from('meetings').insert([{ title, scheduledAt, platform, meetingLink }]).select()
      if(error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data[0])
    }catch(e){ return res.status(500).json({ error: 'server' }) }
  }
  res.status(405).end()
}

export default handler
