import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../SideBar/SideBar'
import { Authcontext } from '../../Context/AuthContextProvider'

const Layout = () => {
 const {token} = useContext(Authcontext)
  return (
    <>
       <div className="flex min-h-screen">
      
      {/* المحتوى */}
      <div className={`${token ? "w-[82%]" : "w-full"} bg-[#0e1a2b]`}>
        <Outlet />
      </div>

      {/* الـ Sidebar يظهر بس لو في توكن */}
      {token && (
        <div className="w-[18%] bg-[#101c2e] min-h-screen">
          <SideBar />
        </div>
      )}

    </div>
    
    </>
  )
}

export default Layout