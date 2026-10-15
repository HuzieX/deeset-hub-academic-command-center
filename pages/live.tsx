import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'
import LiveStreamCard from '../components/LiveStreamCard'

export default function LivePage(){
  const [meetings,setMeetings] = (React as any).useState([])
  React.useEffect(()=>{
    async function load(){
      try{
        // try fetch from API; fallback to client supabase table 'meetings' if present
        const res = await fetch('/api/meetings')
        if(res.ok){
          const data = await res.json()
          setMeetings(data || [])
          return
        }
      }catch{}
      // fallback: try supabase client read
      try{
        const { data } = await supabase.from('meetings').select('*')
        setMeetings(data || [])
      }catch{}
    }
    load()
  },[])

  return (
    <>
      <Head><title>Live Classes — DeeSET HUB</title></Head>
      <h1 className="text-2xl font-bold mb-4">Live Classes</h1>
      <div className="space-y-4">
        {meetings.length === 0 && <div className="panel p-4">No scheduled classes yet.</div>}
        {meetings.map((m:any)=> <LiveStreamCard key={m.id} meeting={m} />)}
      </div>
    </>
  )
}
