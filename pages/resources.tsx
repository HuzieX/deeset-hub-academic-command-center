import Head from 'next/head'
import CBTManager from '../components/CBTManager'

export default function Resources(){
  return (
    <>
      <Head><title>Resource Hub — DeeSET HUB</title></Head>
      <h1 className="text-2xl font-bold mb-4">Resource Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="panel p-4">Past questions, news, and uploads will appear here.</div>
        <CBTManager />
      </div>
    </>
  )
}
