import Link from 'next/link'
import { useState } from 'react'
import { Menu, Home, Video, BookOpen, ClipboardList, Database, Settings, LogIn } from 'lucide-react'

export default function Sidebar(){
  const [collapsed,setCollapsed] = useState(false)
  return (
    <aside className={`p-4 ${collapsed? 'w-20':'w-72'} bg-slate-950 border-r border-slate-900 min-h-screen`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className={`text-white font-bold ${collapsed? 'text-xs':'text-lg'}`}>DeeSET HUB</div>
          {!collapsed && <div className="text-xs text-slate-400">Academic Command Center</div>}
        </div>
        <button aria-label="toggle sidebar" onClick={()=>setCollapsed(!collapsed)} className="p-2 rounded-md hover:bg-slate-800"><Menu size={18}/></button>
      </div>
      <nav className="space-y-1">
        <NavItem href="/" icon={<Home size={16}/>} label="Dashboard" collapsed={collapsed} />
        <NavItem href="/live" icon={<Video size={16}/>} label="Live Classes" collapsed={collapsed} />
        <NavItem href="/courses" icon={<BookOpen size={16}/>} label="Courses" collapsed={collapsed} />
        <NavItem href="/assignments" icon={<ClipboardList size={16}/>} label="Assignments" collapsed={collapsed} />
        <NavItem href="/resources" icon={<Database size={16}/>} label="Resource Hub" collapsed={collapsed} />
        <NavItem href="/admin" icon={<Settings size={16}/>} label="Admin Control" collapsed={collapsed} />
      </nav>
      <div className="mt-6 text-xs text-slate-500">Keyboard: Tab to navigate · Enter to open</div>
    </aside>
  )
}

function NavItem({href,icon,label,collapsed}:{href:string; icon:React.ReactNode; label:string; collapsed:boolean}){
  return (
    <Link href={href} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600">
      <div className="text-slate-300">{icon}</div>
      {!collapsed && <div className="flex-1 text-left">{label}</div>}
    </Link>
  )
}
