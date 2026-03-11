import React, { useContext, useState } from 'react'
import { BiBriefcase, BiCalendar, BiFolder, BiLogOut } from 'react-icons/bi'
import { FaGavel, FaUserSecret } from 'react-icons/fa'
import Sections from '../sections/Sections'
import { MdGavel } from 'react-icons/md'
import { Authcontext } from '../../Context/AuthContextProvider'
import { useNavigate } from 'react-router-dom'



const SideBar = () => {
  const {  Logout, setting } = useContext(Authcontext)
  const navigate = useNavigate()
  function logout(){
    Logout(),
    navigate("/login")
      }
      
  return (
    <>
 <div className="flex flex-col h-screen bg-[#101c2e] text-gray-300 font-sans overflow-hidden" dir="rtl">

  {/* Logo Section */}
  <div className="p-4 flex items-center gap-3 border-b border-gray-800">
    <div className="bg-[#fbbf24] p-2 rounded-3xl text-black">
      <MdGavel size={24} />
    </div>
    <div>
      <h1 className="text-white font-bold leading-tight"> {setting?.Settings?.officeName}</h1>
      <p className="text-xs text-gray-500">للإدارة القانونية</p>
    </div>
  </div>

  {/* Navigation Links */}
  <nav className="flex-1 px-4 mt-4 space-y-2 overflow-auto">
    <Sections />
  </nav>

  {/* Logout Button ثابت تحت الصفحة */}
  <div className="p-4">
    <button 
      onClick={logout} 
      className="w-full flex items-center justify-center gap-2 bg-[#d97706]/20 text-[#fbbf24] py-3 rounded-xl hover:bg-[#d97706]/30 transition-colors"
    >
      <BiLogOut size={20} />
      <span className="font-bold">تسجيل الخروج</span>
    </button>
  </div>

</div>
    </>
  )
}

export default SideBar