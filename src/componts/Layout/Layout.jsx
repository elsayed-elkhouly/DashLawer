import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../SideBar/SideBar'
import { Authcontext } from '../../Context/AuthContextProvider'

const Layout = () => {
  const { token } = useContext(Authcontext)
  return (
    <>
      <div className="flex h-screen overflow-hidden">

        <main
          className={`${token ? "w-[82%]" : "w-full"} bg-[#0e1a2b] h-screen overflow-y-auto`}
        >
          <Outlet />
        </main>


        {token && (
          <aside className="w-[18%] bg-[#101c2e] h-screen sticky top-0 shrink-0">
            <SideBar />
          </aside>
        )}


      </div>

    </>
  )
}

export default Layout