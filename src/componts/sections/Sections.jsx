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
import { Link, Links } from 'react-router-dom'

const Sections = () => {
    return (
        <>
            <Link to={"/"}>
            <button className={` text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all  group
                focus:border-r-2 border-amber-300
                focus:from-0% focus:to-[#bfa04cab]
                focus:bg-linear-to-l
                  hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] 
                hover:text-white
              `}
            >
                <MdDashboard className=' group-hover:text-[#C9A14A] group-focus:text-[#C9A14A] ' />
                <span className="text-sm font-medium group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]">لوحة التحكم</span>
            </button>        
            </Link>

            <Link to={"/CaseMangemnt"}>
            <button className={`text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all  group
                focus:border-r-2 border-amber-300
                focus:from-0% focus:to-[#bfa04cab]
                focus:bg-linear-to-l
                  hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] 
                hover:text-white
              `}
            >
                <PiBag className=' group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]' />
                <span className="text-sm font-medium group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]">إدارة القضايا</span>
            </button>        
            </Link>
            <Link to={"/TeamMember"}>
            <button className={`text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all  group
                focus:border-r-2 border-amber-300
                focus:from-0% focus:to-[#bfa04cab]
                focus:bg-linear-to-l
                  hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] 
                hover:text-white
              `}
            >
                <AiOutlineTeam  className=' group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]' />
                <span className="text-sm font-medium group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]">أعضاء الفريق</span>
            </button>        
            </Link>
            <Link to={"/Bills"}>
            <button className={`text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all  group
                focus:border-r-2 border-amber-300
                focus:from-0% focus:to-[#bfa04cab]
                focus:bg-linear-to-l
                  hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] 
                hover:text-white
              `}
            >
                <TbFileInvoice  className=' group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]' />
                <span className="text-sm font-medium group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]"> الفواتير</span>
            </button>        
            </Link>
            <Link to={"/Calender"}>
            <button className={`text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all  group
                focus:border-r-2 border-amber-300
                focus:from-0% focus:to-[#bfa04cab]
                focus:bg-linear-to-l
                  hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] 
                hover:text-white
              `}
            >
                <IoCalendarOutline  className=' group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]' />
                <span className="text-sm font-medium group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]"> التقويم</span>
            </button>        
            </Link>
            <Link to={"/DigitalArchive"}>
            <button className={`text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all  group
                focus:border-r-2 border-amber-300
                focus:from-0% focus:to-[#bfa04cab]
                focus:bg-linear-to-l
                  hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] 
                hover:text-white
              `}
            >
                <PiFolderSimpleUser className=' group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]' />
                <span className="text-sm font-medium group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]"> الأرشيف الرقمي</span>
            </button>        
            </Link>
            <Link to={"/Clients"}>
            <button className={`text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all  group
                focus:border-r-2 border-amber-300
                focus:from-0% focus:to-[#bfa04cab]
                focus:bg-linear-to-l
                  hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] 
                hover:text-white
              `}
            >
                <FaPeopleGroup className=' group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]' />
                <span className="text-sm font-medium group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]"> ادارة العملاء</span>
            </button>        
            </Link>
            <Link to={"/Setting"}>
            <button className={`text-2xl w-full flex items-center gap-4 px-4 py-3 my-2 cursor-pointer rounded-lg transition-all  group
                focus:border-r-2 border-amber-300
                focus:from-0% focus:to-[#bfa04cab]
                focus:bg-linear-to-l
                  hover:bg-linear-to-l hover:from-0% hover:to-[#bfa04cab] 
                hover:text-white
              `}
            >
                <IoSettingsOutline className=' group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]' />
                <span className="text-sm font-medium group-hover:text-[#C9A14A] group-focus:text-[#C9A14A]"> الاعدادات</span>
            </button>        
            </Link>
     
        </>
    )
}

export default Sections