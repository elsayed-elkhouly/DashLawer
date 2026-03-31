import React, { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../SideBar/SideBar'
import { Authcontext } from '../../Context/AuthContextProvider'
import { HiOutlineMenuAlt3 } from "react-icons/hi"
const Layout = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false)
  const { token } = useContext(Authcontext)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0e1a2b]" dir="rtl">
      {/* Main Content */}
      
      {/* Desktop Sidebar */}
      {token && (
        <aside className="hidden lg:block w-[18%] min-w-65 max-w-[320px] h-screen sticky top-0 shrink-0 bg-[#101c2e] border-l border-gray-800">
          <SideBar />
        </aside>
      )}

      {/* Mobile Overlay */}
      {token && sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      {token && (
        <div
          className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-[#101c2e] z-50 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SideBar onClose={() => setSidebarOpen(false)} isMobile />
        </div>
      )}
      <main className="flex-1 h-screen overflow-y-auto bg-[radial-gradient(circle_at_top,#0d2847_0%,#07192e_45%,#05111f_100%)] relative">
        {/* Mobile Top Bar */}
        {token && (
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#101c2e] border-b border-gray-800">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-[#1a2a40] text-white hover:bg-[#223550] transition"
            >
              <HiOutlineMenuAlt3 size={24} />
            </button>

            <h2 className="text-white font-bold text-sm">لوحة التحكم</h2>
          </div>
        )}

        <div className="h-full">
          <Outlet />
        </div>
      </main>

    </div>
  )
}

export default Layout