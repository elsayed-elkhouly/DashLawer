import React from 'react'
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

const Dashbord = () => {
  const hearingsData = [
    {
      id: 1,
      day: "24",
      month: "أكتوبر",
      title: "قضية شركة العقارات الكبرى تشييد",
      court: "محكمة الاستئناف - القاعة 4",
      time: "10:00 صباحاً",
      tag: "جلسة أولى",
      tagStyle: "text-amber-500 border-amber-500/30 bg-amber-500/5"
    },
    {
      id: 2,
      day: "26",
      month: "أكتوبر",
      title: "نزاع عمالي - مجموعة رايه",
      court: "المحكمة العمالية - القاعة 12",
      time: "11:30 صباحاً",
      tag: "مرافعة ختامية",
      tagStyle: "text-blue-400 border-blue-400/30 bg-blue-400/5"
    }
  ];
  const tasks = [
    { id: 1, label: "أولوية حرجة", count: "2 مهام", color: "text-amber-500" },
    { id: 2, label: "أولوية عالية", count: "4 مهام", color: "text-amber-500" },
    { id: 3, label: "أولوية متوسطة", count: "1 مهمة", color: "text-amber-500" },
    { id: 4, label: "أولوية منخفضة", count: "2 مهام", color: "text-amber-500" },
  ];

  // Static Data for Quick Actions

  const priorities = [
    { label: 'أولوية حرجة', count: 2, color: 'text-amber-500' },
    { label: 'أولوية عالية', count: 4, color: 'text-amber-500' },
    { label: 'أولوية متوسطة', count: 1, color: 'text-amber-500' },
    { label: 'أولوية منخفضة', count: 2, color: 'text-amber-500' },
  ];

  const actions = [
    { label: 'إضافة عميل', icon: <BiUserPlus size={24} />, key: 1 },
    { label: 'قضية جديدة', icon: <BsPlusSquare size={24} />, key: 2 },
    { label: 'الرسائل', icon: <RiMvAiLine size={24} />, key: 3 },
    { label: 'جدولة جلسة', icon: <CgLock size={24} />, key: 4 },
  ];
  const priorities2 = [
    { label: 'أولوية حرجة', count: 2 },
    { label: 'أولوية عالية', count: 4 },
    { label: 'أولوية متوسطة', count: 1 },
    { label: 'أولوية منخفضة', count: 2 },
  ];

  // Data for "Latest Added Cases" Table
  const cases = [
    { id: '#CAS-8832', client: 'شركة الأمل للاستثمار', type: 'تجاري - نزاع عقود', status: 'نشطة', date: '2025/10/12' },
    { id: '#CAS-8741', client: 'أحمد مصطفى', type: 'أحوال شخصية - إرث', status: 'بانتظار مستندات', date: '2025/10/10' },
    { id: '#CAS-8692', client: 'مستشفى النور التخصصي', type: 'قانون إداري - تراخيص', status: 'متوقفة', date: '2025/10/08' },
  ];
  return (
    <>
      <nav className="flex items-center justify-between w-full h-18 px-8 bg-[#0b1120] text-white border-b border-gray-800">

        {/* 1. Profile & Settings (Left Side) */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="w-10 h-10 rounded-full border border-yellow-500"
            />
            <div className="text-right">
              <p className="text-sm font-bold">أحمد مصطفى</p>
              <p className="text-xs text-gray-400">شريك إداري</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <CiSettings className="w-5 h-5 cursor-pointer hover:text-white transition" />
            <div className="relative">
              <BiBell className="w-5 h-5 cursor-pointer hover:text-white transition" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full border border-[#0b1120]"></span>
            </div>
          </div>
        </div>

        {/* 2. Search Bar (Middle) */}
        <div className="flex-1 max-w-xl mx-10">
          <div className="relative group">
            <input
              type="text"
              placeholder="...بحث عن قضية، موكل، أو مستند"
              className="w-full bg-[#151c2c] border border-gray-700 rounded-lg py-2 pr-10 pl-4 text-right text-sm focus:outline-none focus:border-gray-500 transition"
            />
            <BiSearch className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* 3. Page Title (Right Side) */}
        <div className="text-right">
          <h1 className="text-xl font-bold">لوحة التحكم التنفيذية</h1>
          <p className="text-xs text-gray-400">مرحباً بك مجدداً، المحامي أحمد</p>
        </div>

      </nav>

      <section>
        <div className='flex items-center justify-center gap-5 px-5 mt-5'>
          <div className=" bg-[#101c2e] rounded-xl p-6 w-92.5 flex flex-col justify-between shadow-lg relative border border-[#C9A14A1A]">
            {/* النسبة */}
            <div className="flex items-center text-[#C9A14A] font-semibold text-sm mb-4">
              <FiTrendingUp className="mr-1" />
              +12%
            </div>

            {/* الأيقونة الرئيسية */}
            <div className="absolute top-6 right-6 bg-[#2A2A3D] p-3 rounded-full mt-5">
              <LuFileCheck className="text-[#C9A14A] w-6 h-6" />
            </div>

            {/* النص والعدد */}
            <div className="mt-auto text-right pt-10 ">
              <p className="text-gray-400 text-sm"> المهام المعلقة</p>
              <p className="text-white text-2xl font-bold">42</p>
            </div>
          </div>
          <div className="bg-[#101c2e] rounded-xl p-6 w-92.5 flex flex-col justify-between shadow-lg relative border border-[#C9A14A1A]">
            {/* النسبة */}
            <div className="flex items-center text-[#C9A14A] font-semibold text-sm mb-4">
              <FiTrendingUp className="mr-1" />
              +12%
            </div>

            {/* الأيقونة الرئيسية */}
            <div className="absolute top-6 right-6 bg-[#2A2A3D] p-3 rounded-full mt-5">
              <FaMoneyBills className="text-[#C9A14A] w-6 h-6" />
            </div>

            {/* النص والعدد */}
            <div className="mt-auto text-right pt-10 ">
              <p className="text-gray-400 text-sm"> إجمالي الإيرادات</p>
              <p className="text-white text-2xl font-bold">$1.2M</p>
            </div>
          </div>
          <div className="bg-[#101c2e] rounded-xl p-6 w-92.5 flex flex-col justify-between shadow-lg relative border border-[#C9A14A1A]">
            {/* النسبة */}
            <div className="flex items-center text-[#C9A14A] font-semibold text-sm mb-4">
              <FiTrendingUp className="mr-1" />
              +12%
            </div>

            {/* الأيقونة الرئيسية */}
            <div className="absolute top-6 right-6 bg-[#2A2A3D] p-3 rounded-full mt-5">
              <IoMdPersonAdd className="text-[#C9A14A] w-6 h-6" />
            </div>

            {/* النص والعدد */}
            <div className="mt-auto text-right pt-10 ">
              <p className="text-gray-400 text-sm">العملاء النشطون</p>
              <p className="text-white text-2xl font-bold">89</p>
            </div>
          </div>
          <div className="bg-[#101c2e] rounded-xl p-6 w-92.5 flex flex-col justify-between shadow-lg relative border border-[#C9A14A1A]">
            {/* النسبة */}
            <div className="flex items-center text-[#C9A14A] font-semibold text-sm mb-4">
              <FiTrendingUp className="mr-1" />
              +12%
            </div>

            {/* الأيقونة الرئيسية */}
            <div className="absolute top-6 right-6 bg-[#2A2A3D] p-3 rounded-full mt-5">
              <MdGavel className="text-[#C9A14A] w-6 h-6" />
            </div>

            {/* النص والعدد */}
            <div className="mt-auto text-right pt-10 ">
              <p className="text-gray-400 text-sm">القضايا النشطة</p>
              <p className="text-white text-2xl font-bold">124</p>
            </div>
          </div>

        </div>
      </section>
      <div className="w-full p-6 bg-[#101c2e] text-white font-sans" dir="rtl">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BiCalendar className="w-5 h-5 text-[#C9A14A]" />
            <h2 className="text-xl font-bold">جلسات الاستماع القادمة</h2>
          </div>
          <button className="text-[#C9A14A] text-sm hover:underline hover:text-amber-400 transition">
            عرض الكل
          </button>
        </div>

        {/* List of Static Items */}
        <div className="space-y-4">
          {hearingsData.map((hearing) => (
            <div
              key={hearing.id}
              className="flex items-center justify-between p-4 bg-[#101c2e] border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors cursor-pointer group"
            >
              {/* Right: Date Marker */}
              <div className="flex items-center gap-4">
                <div className="bg-[#0b1220] border border-amber-500/20 rounded-xl px-4 py-2 text-center min-w-17.5">
                  <span className="block text-xl font-bold text-[#C9A14A]">{hearing.day}</span>
                  <span className="block text-xs text-gray-400">{hearing.month}</span>
                </div>

                {/* Center: Case Info */}
                <div className="text-right">
                  <h3 className="font-semibold text-sm mb-1">{hearing.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <BiMapPin className="w-3 h-3" />
                    <span>{hearing.court}</span>
                  </div>
                </div>
              </div>

              {/* Left: Time and Tag */}
              <div className="flex items-center gap-6">
                <div className="text-left">
                  <p className="text-sm font-bold mb-1">{hearing.time}</p>
                  <span className={`text-[10px] px-3 py-0.5 rounded-full border ${hearing.tagStyle}`}>
                    {hearing.tag}
                  </span>
                </div>
                <BiChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div dir="rtl" className=" bg-[#101c2e] p-8 text-white font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-30 max-w-6xl mx-auto">

          {/* Section: Quick Actions */}
          <div>
            <div className="flex items-center gap-2 mb-6 text-xl font-bold">
              <span className="text-[#C9A14A]"><MdOutlineElectricBolt/></span>
              <h2>الإجراءات السريعة</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 bg-[#111c30]/50 rounded-2xl border border-gray-800">
              {actions.map((action) => (
                <button
                  key={action.key}
                  className="flex flex-col items-center justify-center gap-3 bg-[#111c30] p-8 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all group"
                >
                  <div className="text-[#C9A14A] group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <span className="text-sm text-gray-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Section: Tasks by Priority */}
          <div>
            <div className="flex items-center gap-2 mb-6 text-xl font-bold">
              <span className="text-[#C9A14A] text-2xl">!</span>
              <h2>المهام حسب الأولوية</h2>
            </div>
            <div className="space-y-3">
              {priorities.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-[#111c30] p-4 rounded-lg border border-gray-800/50">
                  <span className="text-gray-300">{p.label}</span>
                  <span className={` text-[#C9A14A] font-medium`}>
                    {p.count} {p.count === 1 ? 'مهمة' : 'مهام'}
                  </span>
                </div>
              ))}
            </div>
          </div>



        </div>
      </div>
      <div dir="rtl" className="min-h-screen bg-[#101c2e] p-6 text-white font-sans">
      
    
      {/* BOTTOM SECTION: Latest Added Cases Table */}
      <section className="bg-[##101c2e] rounded-2xl border border-gray-800/50 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-800/50">
          <div className="flex items-center gap-2">
            <FiFileText className="text-[#C9A14A]" size={20} />
            <h2 className="text-lg font-bold">آخر القضايا المضافة</h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#162235] px-4 py-2 rounded-lg text-sm border border-gray-700 hover:bg-gray-700 transition">
              <BiFilter size={16} /> تصفية
            </button>
            <button className="flex items-center gap-2 bg-[#162235] px-4 py-2 rounded-lg text-sm border border-gray-700 hover:bg-gray-700 transition">
              <BiDownload size={16} /> تصدير
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
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
              {cases.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono">{item.id}</td>
                  <td className="p-4">{item.client}</td>
                  <td className="p-4">{item.type}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs `}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">{item.date}</td>
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

        {/* Table Footer / Pagination */}
        <div className="p-4 flex justify-between items-center text-xs text-gray-500 border-t border-gray-800/50">
          <div className="flex gap-2">
             <button className="p-1 bg-[#162235] border border-gray-700 rounded"><BiChevronRight size={16}/></button>
             <button className="p-1 bg-[#162235] border border-gray-700 rounded"><BiChevronLeftCircle size={16}/></button>
          </div>
          <span>عرض 3 من أصل 124 قضية</span>
        </div>
      </section>
    </div>

    </>
  )
}

export default Dashbord