import { PaginationButton } from 'flowbite-react';
import React from 'react'
import { BiCalendar, BiCalendarAlt, BiCalendarCheck, BiChevronDown, BiChevronLeftCircle, BiChevronRight, BiCloudDownload, BiDownload, BiPlus, BiSearch } from 'react-icons/bi'
import { BsEye } from 'react-icons/bs';
import { FiEdit3, FiRotateCcw } from 'react-icons/fi'
import { Eye, Edit3, Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const CaseMange = () => {
  const filterOptions = [
    { label: 'الحالة' },
    { label: 'نوع القضية' },
    { label: 'المحكمة' },
    { label: 'المحامي' },
  ];
  const tabs = [
    { name: 'كل القضايا', count: null, active: true },
    { name: 'النشطة', count: null },
    { name: 'المؤجلة', count: null },
    { name: 'المغلقة', count: null },
    { name: 'المتأخرة', count: 12 },
  ];

  const cases = [
    { id: '#CAS-2024-0412', client: 'شركة تشييد', subClient: 'سجل تجاري: 1010XXXXXX', type: 'نزاع تجاري', court: 'المحكمة الاقتصادية', date: '12 مارس 2024', time: '09:30 صباحاً', status: 'نشطة', statusColor: 'bg-green-500/10 text-green-500' },
    { id: '#CAS-2024-0398', client: 'عبدالعزيز جاويش', subClient: 'هوية: 1092XXXXXX', type: 'جنائي - تزييف', court: 'المحكمة الجزائية', date: 'لم يحدد بعد', time: '', status: 'مؤجلة', statusColor: 'bg-blue-500/10 text-blue-500' },
    { id: '#CAS-2023-1102', client: 'فتحي منصور', subClient: 'مؤسسة مالية', type: 'مطالبات مالية', court: 'محكمة التنفيذ', date: 'منتهية', time: '', status: 'مغلقة', statusColor: 'bg-gray-500/10 text-gray-500' },
  ];
  const ActionButton = ({ icon }) => (
    <button className="p-2 border border-gray-700 rounded-md text-yellow-600 hover:bg-yellow-600 hover:text-white transition-all">
      {icon}
    </button>
  );
  return (
    <>
      <div className="w-full bg-[#0f172a] p-8 flex flex-row-reverse items-center justify-between font-sans" dir="rtl">
        {/* Right Side: Buttons */}
        <div className="flex items-center gap-4">
          

          {/* Export Button */}
          <button className="flex items-center gap-2 border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
            <BiDownload size={18} />
            <span className="text-sm">تصدير PDF / Excel</span>
          </button>

          {/* Add New Case Button */}
          <Link to={"/CaseMangemnt/AddNewCase"}>
          
          <button 
           className="flex items-center cursor-pointer gap-2 bg-[#c5a059] hover:bg-[#b38f4d] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold transition-colors shadow-lg">
            <BiPlus size={20} />
            <span>إضافة قضية جديدة</span>
          </button>
          </Link>
        </div>



        {/* left Side: Title and Subtitle */}
        <div className="text-right">
          <h1 className="text-white text-3xl font-bold mb-2">إدارة القضايا</h1>
          <p className="text-gray-400 text-sm">
            نظرة عامة على جميع القضايا القانونية النشطة والمؤجلة والمغلقة
          </p>
        </div>


      </div>
      <div className="w-full bg-[#0f172a] p-4" dir="rtl">
        <div className="flex flex-wrap items-center gap-3 bg-[#111827]/50 p-4 rounded-xl border border-gray-800">

          {/* Search Input */}
          <div className="relative flex-grow max-w-2xl">
            <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none">
              <BiSearch size={18} className="text-gray-500" />
            </span>
            <input
              type="text"
              className="w-full bg-[#0b0f1a] border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-10 placeholder-gray-500"
              placeholder="البحث برقم القضية، اسم العميل، أو موضوع النزاع..."
            />
          </div>

          {/* Dropdown Filters */}
          {filterOptions.map((filter, index) => (
            <div key={index} className="relative min-w-[140px]">
              <button className="w-full flex items-center justify-between bg-[#0b0f1a] border border-gray-700 text-gray-400 text-sm px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                <BiChevronDown size={16} className="text-gray-500" />
                <span>{filter.label}</span>
              </button>
            </div>
          ))}

          {/* Reset Button */}
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-4 py-2 transition-colors mr-auto">
            <FiRotateCcw size={16} />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>
      {/* name of each tab group should be unique */}
     

    </>
  )
}

export default CaseMange