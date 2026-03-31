import axios from 'axios'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BiBell, BiCalendar, BiChevronLeft, BiChevronLeftCircle, BiChevronRight, BiDownload, BiFilter, BiMapPin, BiSearch, BiUserPlus } from 'react-icons/bi'
import { BsEye, BsPlusSquare, BsPlusSquareDotted } from 'react-icons/bs'
import { CgLock, CgLockUnlock } from 'react-icons/cg'
import { CiSettings } from 'react-icons/ci'
import { FaMoneyBills, FaUserPlus } from 'react-icons/fa6'
import { FcElectricity } from 'react-icons/fc'
import { FiAlertCircle, FiFileText, FiTrendingUp, FiZap } from 'react-icons/fi'
import { GiJumpingDog } from 'react-icons/gi'
import { IoMdPersonAdd } from 'react-icons/io'
import { IoAlertCircle, IoPaperPlane } from 'react-icons/io5'
import { LuFileCheck } from 'react-icons/lu'
import { MdGavel, MdOutlineElectricBolt } from 'react-icons/md'
import { RiMicAiLine, RiMvAiLine } from 'react-icons/ri'
import Cookies from 'js-cookie';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { Authcontext } from '../../Context/AuthContextProvider'
import { jwtDecode } from "jwt-decode";
const Dashbord = () => {
  const queryClient = useQueryClient();
  const [dataoftkn, setDataoftkn] = useState(null)
  const { token } = useContext(Authcontext);
  const [open, setOpen] = useState(false);
  const notificationRef = useRef(null);
  useEffect(() => {
    if (typeof token === "string" && token.trim() !== "") {
      try {
        const decoded = jwtDecode(token);
        console.log("decoded token:", decoded.id);
        setDataoftkn(decoded);
      } catch (error) {
        console.error("Invalid token", error);
        setDataoftkn(null);
      }
    }
  }, [token]);
  console.log(dataoftkn?.id
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function getTask() {
    return api.get(`/task/notifications`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  const { data: taskLawer, isLoading, error } = useQuery({
    queryKey: ["Tasks"],
    queryFn: getTask,

  });

  console.log(taskLawer
  );

  const navigate = useNavigate()
  const hearingsData = [
    {
      id: 1,
      day: "24",
      month: "أكتوبر",
      title: "قضية شركة العقارات الكبرى تشييد",
      court: "محكمة الاستئناف - القاعة 4",
      time: "10:00 صباحاً",
      tag: "جلسة أولى",
      tagStyle: "text-amber-500 border-amber-500/30 bg-amber-500/5",
    },
    {
      id: 2,
      day: "26",
      month: "أكتوبر",
      title: "نزاع عمالي - مجموعة رايه",
      court: "المحكمة العمالية - القاعة 12",
      time: "11:30 صباحاً",
      tag: "مرافعة ختامية",
      tagStyle: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    },
  ]
  function getData() {
    return api.get("/Dashboard/", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
  }

  const { data } = useQuery({
    queryKey: ["Data"],
    queryFn: getData,
  })

  const priorities = [
    { label: "أولوية عاجلة", count: data?.data?.tasksByPriority?.عاجلة ?? 0 },
    { label: "أولوية عالية", count: data?.data?.tasksByPriority?.عالية ?? 0 },
    { label: "أولوية متوسطة", count: data?.data?.tasksByPriority?.متوسطة ?? 0 },
    { label: "أولوية منخفضة", count: data?.data?.tasksByPriority?.منخفضة ?? 0 },
  ]

  const actions = [
    { label: "إضافة عميل", icon: <BiUserPlus size={24} />, key: 1, path: "" },
    { label: "قضية جديدة", icon: <BsPlusSquare size={24} />, key: 2, path: "/CaseMangemnt/AddNewCase" },
    { label: "الرسائل", icon: <RiMvAiLine size={24} />, key: 3, path: "" },
    { label: "جدولة جلسة", icon: <CgLock size={24} />, key: 4, path: "" },
  ]

  const formatDateISO = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return date.toISOString().split("T")[0]
  }

  const statsCards = [
    {
      title: "المهام المعلقة",
      value: data?.data?.stats?.pendingTasks ?? 0,
      icon: <LuFileCheck className="text-[#C9A14A] w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: "إجمالي الإيرادات",
      value: `$${data?.data?.stats?.totalRevenue ?? 0}`,
      icon: <FaMoneyBills className="text-[#C9A14A] w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: "العملاء النشطون",
      value: data?.data?.stats?.activeClients ?? 0,
      icon: <IoMdPersonAdd className="text-[#C9A14A] w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: "القضايا النشطة",
      value: data?.data?.stats?.activeCases ?? 0,
      icon: <MdGavel className="text-[#C9A14A] w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ]
async function readTask() {
  try {
    const hasUnread = taskLawer?.data?.notifications?.some((item) => !item.isRead);

    if (!hasUnread) return;

    const res = await api.patch(
      "task/notifications/read",
      null,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res);

    queryClient.invalidateQueries({ queryKey: ["Tasks"] });
  } catch (error) {
    console.log(error);
  }
}
useEffect(() => {
  const hasUnread = taskLawer?.data?.notifications?.some((item) => !item.isRead);

  if (open && hasUnread) {
    readTask();
  }
}, [open, taskLawer?.data?.notifications]);
  return (
    <div className="min-h-screen bg-[#0b1120] text-white">
      {/* Header */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-[#0b1120] text-white border-b border-gray-800">
        <div className="flex gap-4 xl:flex-row xl:items-center xl:justify-between">


          {/* Search */}
          {/* <div className="w-full xl:flex-1 xl:max-w-xl xl:mx-6 order-3 xl:order-2">
            <div className="relative group">
              <input
                type="text"
                placeholder="...بحث عن قضية، موكل، أو مستند"
                className="w-full bg-[#151c2c] border border-gray-700 rounded-lg py-2.5 pr-10 pl-4 text-right text-sm focus:outline-none focus:border-gray-500 transition"
              />
              <BiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div> */}
          {/* Page Title */}
          <div className="text-right">
            <h1 className="text-lg sm:text-xl font-bold">لوحة التحكم التنفيذية</h1>
            <p className="text-xs text-gray-400 mt-1">مرحباً بك مجدداً، المحامي  {dataoftkn?.userName}</p>
          </div>
          {/* Profile & Settings */}
          <div className="flex items-center justify-between  gap-4 sm:gap-6 ">
            <div className="flex items-center gap-3"> {dataoftkn?.userName}

              <div className="text-right">
                <p className="text-sm font-bold"></p>
                <p className="text-xs text-gray-400">     {dataoftkn?.role}       </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <CiSettings className="w-5 h-5 cursor-pointer hover:text-white transition" />

              <div ref={notificationRef} className="relative">
                {/* أيقونة الجرس */}
                <div
                  onClick={() => setOpen(!open)}
                  className="relative cursor-pointer"
                >
                  <BiBell className="w-5 h-5 hover:text-white transition" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full border border-[#0b1120]"></span>
                </div>

                {/* صندوق الإشعارات */}
                {open && (
                  <div
                    className="
      absolute
      top-full
      mt-3
      left-0
      w-80
      max-w-[85vw]
      bg-[#0f172a]
      text-white
      rounded-xl
      shadow-xl
      p-4
      z-50
      border border-gray-800
    "
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base">الإشعارات</h3>
                      <span className="text-yellow-400 text-sm">
                        {taskLawer?.data?.notifications?.length || 0} جديد
                      </span>
                    </div>

                    {/* List */}
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {taskLawer?.data?.notifications?.length > 0 ? (
                        taskLawer?.data?.notifications.map((item) => (
                          <div
                            key={item._id}
                            className={`
              p-3 rounded-xl border transition
              ${item.isRead
                                ? "bg-[#111827] border-gray-800"
                                : "bg-[#1a2236] border-yellow-500/30"
                              }
            `}
                          >
                            {/* Title */}
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-white">
                                {item.title || "إشعار"}
                              </p>

                              {!item.isRead && (
                                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                              )}
                            </div>

                            {/* Body */}
                            <p className="text-xs text-gray-300 leading-6 line-clamp-2">
                              {item.body || "لا يوجد محتوى"}
                            </p>

                            {/* Client */}
                            <p className="text-[11px] text-gray-400 mt-2">
                              👤 {item.clientName || "غير معروف"}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-2 text-[11px]">
                              <span className="text-blue-400">
                                {item.type === "task assigned"
                                  ? "تم إسناد مهمة"
                                  : item.type}
                              </span>

                              <span className="text-yellow-400">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString("ar-EG")
                                  : ""}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-sm text-gray-400 py-6">
                          لا توجد إشعارات حالياً
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


        </div>
      </nav>

      {/* Stats Cards */}
      <section className="px-4 sm:px-6 lg:px-8 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 lg:gap-5">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="bg-[#101c2e] rounded-xl p-5 sm:p-6 min-h-37.5 flex flex-col justify-between shadow-lg relative border border-[#C9A14A1A]"
            >


              <div className="absolute top-5 right-5 bg-[#2A2A3D] p-3 rounded-full mb-3">
                {card.icon}
              </div>

              <div className="mt-auto text-right pt-8 sm:pt-10">
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="text-white text-xl sm:text-2xl font-bold mt-1 wrap-break-word">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hearings */}
      <section className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="w-full p-4 sm:p-6 bg-[#101c2e] text-white font-sans rounded-2xl border border-gray-800">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <BiCalendar className="w-5 h-5 text-[#C9A14A]" />
              <h2 className="text-lg sm:text-xl font-bold">جلسات الاستماع القادمة</h2>
            </div>

            <button className="text-[#C9A14A] text-sm hover:underline hover:text-amber-400 transition self-start sm:self-auto">
              عرض الكل
            </button>
          </div>

          <div className="space-y-4">
            {hearingsData.map((hearing) => (
              <div
                key={hearing.id}
                className="p-4 bg-[#101c2e] border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="bg-[#0b1220] border border-amber-500/20 rounded-xl px-4 py-2 text-center min-w-[70px] shrink-0">
                      <span className="block text-xl font-bold text-[#C9A14A]">{hearing.day}</span>
                      <span className="block text-xs text-gray-400">{hearing.month}</span>
                    </div>

                    <div className="text-right min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base mb-1 break-words">
                        {hearing.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <BiMapPin className="w-3 h-3 shrink-0" />
                        <span className="break-words">{hearing.court}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6">
                    <div className="text-right lg:text-left">
                      <p className="text-sm font-bold mb-1">{hearing.time}</p>
                      <span className={`inline-block text-[10px] sm:text-xs px-3 py-1 rounded-full border ${hearing.tagStyle}`}>
                        {hearing.tag}
                      </span>
                    </div>
                    <BiChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actions + Priorities */}
      <section className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-[#101c2e] p-4 sm:p-6 lg:p-8 text-white font-sans rounded-2xl border border-gray-800">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Quick Actions */}
            <div>
              <div className="flex items-center gap-2 mb-6 text-lg sm:text-xl font-bold">
                <span className="text-[#C9A14A]">
                  <MdOutlineElectricBolt />
                </span>
                <h2>الإجراءات السريعة</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 p-4 sm:p-6 bg-[#111c30]/50 rounded-2xl border border-gray-800">
                {actions.map((action) => (
                  <button
                    onClick={() => action.path && navigate(action.path)}
                    key={action.key}
                    className="flex flex-col items-center justify-center gap-3 bg-[#111c30] p-5 sm:p-6 lg:p-8 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all group min-h-[120px]"
                  >
                    <div className="text-[#C9A14A] group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-300 text-center">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priorities */}
            <div>
              <div className="flex items-center gap-2 mb-6 text-lg sm:text-xl font-bold">
                <span className="text-[#C9A14A] text-2xl">!</span>
                <h2>المهام حسب الأولوية</h2>
              </div>

              <div className="space-y-3">
                {priorities.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 bg-[#111c30] p-4 rounded-lg border border-gray-800/50"
                  >
                    <span className="text-gray-300 text-sm sm:text-base">{p.label}</span>
                    <span className="text-[#C9A14A] font-medium text-sm sm:text-base whitespace-nowrap">
                      {p.count} {p.count === 1 ? "مهمة" : "مهام"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Cases */}
      <section className="px-4 sm:px-6 lg:px-8 mt-6 pb-6">
        <div className="bg-[#101c2e] rounded-2xl border border-gray-800/50 overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-800/50">
            <div className="flex items-center gap-2">
              <FiFileText className="text-[#C9A14A]" size={20} />
              <h2 className="text-base sm:text-lg font-bold">آخر القضايا المضافة</h2>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-[#162235] px-4 py-2 rounded-lg text-sm border border-gray-700 hover:bg-gray-700 transition">
                <BiDownload size={16} />
                تصدير
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right">
              <thead className="text-[#C9A14A] text-sm bg-[#0d1525]">
                <tr>
                  <th className="p-4 font-medium">رقم القضية</th>
                  <th className="p-4 font-medium">اسم الموكل</th>
                  <th className="p-4 font-medium">نوع القضية</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">التاريخ</th>
                  <th className="p-4 font-medium">الإجراءات</th>
                </tr>
              </thead>

              <tbody className="text-gray-300 divide-y divide-gray-800/50">
                {data?.data?.recentCases?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="p-4 font-mono whitespace-nowrap">{item.caseNumber || "-"}</td>
                    <td className="p-4 whitespace-nowrap">{item.client?.fullName || "-"}</td>
                    <td className="p-4 whitespace-nowrap">{item.caseType?.name || "-"}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-gray-700">
                        {item.status || "-"}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">{formatDateISO(item.openedAt)}</td>
                    <td className="p-4">
                      <button className="text-[#C9A14A] hover:text-amber-400">
                        <BsEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500 border-t border-gray-800/50">
            <div className="flex gap-2">
              <button className="p-1 bg-[#162235] border border-gray-700 rounded">
                <BiChevronRight size={16} />
              </button>
              <button className="p-1 bg-[#162235] border border-gray-700 rounded">
                <BiChevronLeftCircle size={16} />
              </button>
            </div>
            <span>عرض 3 من أصل 124 قضية</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashbord