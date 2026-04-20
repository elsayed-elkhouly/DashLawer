import React, { useContext, useState } from 'react'
import { BiBriefcase, BiCalendar, BiFolder, BiLogOut } from 'react-icons/bi'
import { FaGavel, FaUserSecret } from 'react-icons/fa'
import Sections from '../sections/Sections'
import { MdGavel } from 'react-icons/md'
import { Authcontext } from '../../Context/AuthContextProvider'
import { useNavigate } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import Sections2 from '../Sections2/Sections2'

const Sidebar2 = ({ onClose, isMobile = false }) => {

  const navigate = useNavigate()
  const { Logout } = useContext(Authcontext)

  function logout() {
    Logout()
    navigate("/login")
    if (onClose) onClose()
  }
 
  return (
    <div
      className="flex flex-col h-full bg-[#061328] text-gray-300 font-sans"
      dir="rtl"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between gap-3 border-b border-gray-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-[#fbbf24] p-2 rounded-3xl text-black shrink-0">
            <MdGavel size={24} />
          </div>

          <div className="min-w-0">
            <h1 className="text-white font-bold leading-tight text-sm md:text-base truncate">
              lexora
            </h1>
            <p className="text-xs text-gray-500">للإدارة القانونية</p>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-300 hover:bg-[#1b2a3d] hover:text-white transition shrink-0"
          >
            <IoClose size={22} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <Sections2 onItemClick={onClose} />
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-[#d97706]/20 text-[#fbbf24] py-3 rounded-xl hover:bg-[#d97706]/30 transition-colors"
        >
          <BiLogOut size={20} />
          <span className="font-bold">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar2