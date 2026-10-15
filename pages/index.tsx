import Head from 'next/head'
import DashboardGrid from '../components/DashboardGrid'
import KanbanBoard from '../components/KanbanBoard'

export default function Page(){
  return (
    <>
      <Head><title>DeeSET HUB — Dashboard</title></Head>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <DashboardGrid />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Tasks (Kanban)</h2>
        <KanbanBoard />
      </div>
    </>
  )
}
