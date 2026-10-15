import Head from 'next/head'
import { useEffect, useState } from 'react'
import LiveStreamCard from '../components/LiveStreamCard'

export default function LivePage(){
  const [meetings,setMeetings] = useState<any[]>([])
  useEffect(()=>{
    async function load(){
      try{
        const token = localStorage.getItem('deeset_token')
        const res = await fetch('http://localhost:4000/api/meetings', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if(res.ok){
          const data = await res.json()
          setMeetings(data || [])
          return
        }
      }catch(e){ console.error(e) }
      // fallback to empty
      setMeetings([])
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
