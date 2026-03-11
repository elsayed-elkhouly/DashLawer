import { FileText, Search, User } from 'lucide-react'
import React from 'react'
import { MdOutlinePictureAsPdf } from "react-icons/md";
const DigitalArchive = () => {
  return (
    <>
      <div className="min-h-75 w-full bg-[#0e1a2b] p-8 font-sans" dir="rtl">
        {/* Title Section */}
        <div className="mb-8 text-right">
          <h1 className="text-3xl font-bold text-white">الأرشيف الرقمي</h1>
          <p className="mt-1 text-sm text-gray-400">
            إدارة الوثائق القانونية والملفات السرية للمكتب
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="rounded-2xl border border-gray-800 bg-[#111b27]/50 p-6 backdrop-blur-sm">
          <div className="flex flex-row-reverse items-center gap-3">



            {/* Filter Pills */}
            <button className="whitespace-nowrap rounded-full border border-gray-700 bg-[#1a2634] px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
              نوع الوثيقة
            </button>

            <button className="whitespace-nowrap rounded-full border border-gray-700 bg-[#1a2634] px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
              تاريخ الرفع
            </button>

            <button className="whitespace-nowrap rounded-full border border-gray-700 bg-[#1a2634] px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
              الحالة
            </button>
            {/* Main Search Input */}
            <div className="relative grow">
              <input
                type="text"
                placeholder="البحث عن اسم ملف، رقم قضية، أو موكل..."
                className="w-full rounded-xl border border-gray-700 bg-[#1a2634] py-3 pr-4 pl-12 text-right text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>

          </div>
        </div>
      </div>
      {/* //////////////////// */}
      <div className='flex items-center justify-around mt-5'>
        <div
          className="w-110 rounded-3xl border border-[#FFFFFF14] bg-[#172233] p-6 text-white shadow-xl transition-all hover:border-[#C9A34A]"
          dir="rtl"
        >
          {/* Top Section: Status Dot and PDF Icon */}
          <div className="flex justify-between items-start mb-4">
            <div className="rounded-3xl bg-[#EF44441A] p-3 flex items-center justify-center">
              <MdOutlinePictureAsPdf className="h-8 w-8 text-red-500" />
            </div>
            <div className="h-3 w-3 rounded-full bg-[#C9A34A] shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          </div>

          {/* Content Section */}
          <div className="text-right mb-6">
            <h3 className="text-xl font-bold mb-1">عقد توريد - مجموعة الشايع</h3>
            <p className="text-sm text-gray-500 font-mono tracking-wider">
              رقم القضية: #CASE-2024-001
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gray-800 mb-4" />

          {/* Footer Section */}
          <div className="flex justify-between items-center text-gray-400 text-sm py-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>خالد محمد</span>
            </div>
            <div>
              أمس، 10:30 ص
            </div>
          </div>
        </div>
     
        
      </div>

    </>
  )
}

export default DigitalArchive