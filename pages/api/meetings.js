const handler = async (req, res) => {
  if(req.method === 'GET'){
    try{
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
      // protect admin creation: require admin token
      const requireAdmin = require('../../lib/requireAdmin')
      const adminCheck = await requireAdmin.requireAdminToken(req, res)
      if(adminCheck && adminCheck.error) return // response handled inside requireAdminToken

      const supabaseAdmin = require('../../lib/supabaseAdmin')
      const { title, scheduledAt, platform, meetingLink } = req.body
      const { data, error } = await supabaseAdmin.from('meetings').insert([{ title, scheduled_at: scheduledAt, platform, meeting_link: meetingLink }]).select()
      if(error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data[0])
    }catch(e){ return res.status(500).json({ error: 'server' }) }
  }
  res.status(405).end()
}

export default handler
