import React from 'react'
import { AiOutlineTeam } from 'react-icons/ai'
import { CiCalendar, CiLogout } from 'react-icons/ci'
import { FaRegFileAlt } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
import { IoMdBook } from 'react-icons/io'
import { IoCalendarOutline, IoSettingsOutline } from 'react-icons/io5'
import { MdDashboard } from 'react-icons/md'
import { PiBag, PiFolderSimpleUser } from 'react-icons/pi'
import { TbFileInvoice } from 'react-icons/tb'
import { Link, Links, NavLink } from 'react-router-dom'

const Sections = () => {
  const menuItems = [
  { to: "/", icon: MdDashboard, label: "لوحة التحكم" },
  { to: "/CaseMangemnt", icon: PiBag, label: "إدارة القضايا" },
  { to: "/TeamMember", icon: AiOutlineTeam, label: "أعضاء الفريق" },
  { to: "/Bills", icon: TbFileInvoice, label: "الفواتير" },
  { to: "/Calender", icon: IoCalendarOutline, label: "التقويم" },
  { to: "/DigitalArchive", icon: PiFolderSimpleUser, label: "الأرشيف الرقمي" },
  { to: "/Clients", icon: FaPeopleGroup, label: "ادارة العملاء" },
  { to: "/Setting", icon: IoSettingsOutline, label: "الاعدادات" },
]
    return (
         <>
      {menuItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink key={item.to} to={item.to} end={item.to === "/"}>
            {({ isActive }) => (
              <div
                className={`text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all group
                  ${
                    isActive
                      ? "border-r-2 border-amber-300 bg-linear-to-l from-0% to-[#bfa04cab] text-white"
                      : "hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`${
                    isActive
                      ? "text-[#C9A14A]"
                      : "group-hover:text-[#C9A14A]"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-[#C9A14A]"
                      : "group-hover:text-[#C9A14A]"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            )}
          </NavLink>
        )
      })}
    </>
    )
}

export default Sections