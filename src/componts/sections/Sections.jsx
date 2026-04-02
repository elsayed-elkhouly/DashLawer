import React from 'react'
import { AiOutlineTeam } from 'react-icons/ai'
import { CiCalendar, CiLogout } from 'react-icons/ci'
import { FaRegFileAlt, FaTasks } from 'react-icons/fa'
import { Fa42Group, FaPeopleGroup } from 'react-icons/fa6'
import { IoMdBook } from 'react-icons/io'
import { IoCalendarOutline, IoSettingsOutline } from 'react-icons/io5'
import { MdDashboard, MdEventAvailable, MdOutlineDashboard } from 'react-icons/md'
import { PiBag, PiFolderSimpleUser } from 'react-icons/pi'
import { TbFileInvoice } from 'react-icons/tb'
import { Link, Links, NavLink } from 'react-router-dom'
import { GiReceiveMoney } from "react-icons/gi";
const Sections = ({ onItemClick }) => {
  const menuItems = [
    { to: "/", icon: MdOutlineDashboard , label: "لوحة التحكم" },
    { to: "/CaseMangemnt", icon: PiBag, label: "إدارة القضايا" },
    { to: "/TeamMember", icon: AiOutlineTeam, label: "أعضاء الفريق" },
    { to: "/Bills", icon: TbFileInvoice, label: "الفواتير" },
    { to: "/Calender", icon: IoCalendarOutline, label: "التقويم" },
    { to: "/DigitalArchive", icon: PiFolderSimpleUser, label: "الأرشيف الرقمي" },
    { to: "/Clients", icon: FaPeopleGroup, label: "إدارة العملاء" },
    { to: "/TaskMangment", icon: FaTasks , label: "إدارة المهام" },
    { to: "/BookMangment", icon: MdEventAvailable  , label: "إدارة الحجوزات" },
    { to: "/PyrollMangment", icon: GiReceiveMoney, label: "ادارة الرواتب" },
    { to: "/Setting", icon: IoSettingsOutline, label: "الإعدادات" },
  ]

  return (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onItemClick}
            className="block"
          >
            {({ isActive }) => (
              <div
                className={`
                  w-full flex items-center gap-3 sm:gap-4
                  px-3 sm:px-4 py-3
                  rounded-xl cursor-pointer group
                  transition-all duration-200
                  text-base sm:text-lg
                  ${
                    isActive
                      ? "border-r-4 border-[#C9A14A] bg-gradient-to-l from-[#C9A14A]/25 to-transparent text-white shadow-sm"
                      : "text-gray-300 hover:bg-gradient-to-l hover:from-[#C9A14A]/20 hover:to-transparent hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`
                    text-[20px] sm:text-[22px] shrink-0 transition-colors
                    ${
                      isActive
                        ? "text-[#C9A14A]"
                        : "text-gray-400 group-hover:text-[#C9A14A]"
                    }
                  `}
                />

                <span
                  className={`
                    text-sm sm:text-[15px] font-medium transition-colors
                    ${
                      isActive
                        ? "text-[#C9A14A]"
                        : "text-gray-300 group-hover:text-[#C9A14A]"
                    }
                  `}
                >
                  {item.label}
                </span>
              </div>
            )}
          </NavLink>
        )
      })}
    </div>
  )
}

export default Sections