import Head from 'next/head'
import AdminPanel from '../components/AdminPanel'

export default function Admin(){
  return (
    <>
      <Head><title>Admin Control — DeeSET HUB</title></Head>
      <h1 className="text-2xl font-bold mb-4">Admin Control Panel</h1>
      <AdminPanel />
    </>
  )
}
