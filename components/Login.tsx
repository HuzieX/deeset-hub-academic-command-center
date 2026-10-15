import React, { useState } from 'react'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)

  const handle = async (e:any)=>{
    e.preventDefault();
    setLoading(true)
    try{
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      if(!res.ok) throw new Error('login failed')
      const data = await res.json()
      localStorage.setItem('deeset_token', data.token)
      localStorage.setItem('deeset_user', JSON.stringify(data.user))
      window.location.reload()
    }catch(err){
      alert('Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <form onSubmit={handle} className="flex items-center gap-3">
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-sm" />
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-sm" />
      <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 rounded-md">{loading? 'Signing...':'Sign in'}</button>
    </form>
  )
}
