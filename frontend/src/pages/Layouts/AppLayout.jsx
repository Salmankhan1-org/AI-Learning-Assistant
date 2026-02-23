import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

const AppLayout = () => {
    // State to toggle the sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
   <div className="h-screen flex flex-col">
    <Header onMenuClick={()=>setSidebarOpen(true)}/>
    <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-gray-100  p-3">
        <Outlet />
        </main>
    </div>
</div>

  )
}

export default AppLayout