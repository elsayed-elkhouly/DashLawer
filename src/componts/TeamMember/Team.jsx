import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeftRight, ChevronDown, ChevronLeft, ChevronRight, Download, Edit2, Eye, PlusCircle, RotateCcw, Search, Trash2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Team = () => {

  const formatEgyptDate = (dateString) => {
  if (!dateString) return "—";
  
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "تاريخ غير صالح";

  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
  
 


  function getUSers() {
    return axios.get("https://lawersystem-production.up.railway.app/users", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,

      }
    })
  }
  const { data ,isLoading} = useQuery({
    queryKey: ["Users"],
    queryFn: getUSers
  })
 
// console.log(data);

  return (

    <>
      <div className="w-full bg-[#0e1a2b] p-6 mt-5 flex flex-col md:flex-row-reverse items-center justify-between gap-4 font-sans" dir="rtl">
        {/* Left Side: Buttons */}
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-[#C59D4A] text-[#C59D4A] rounded-3xl hover:bg-[#C59D4A] hover:text-white transition-all duration-300">
            <Download size={18} />
            <span className="text-sm font-medium">تصدير PDF / Excel</span>
          </button>

          {/* Add Member Button */}
          <Link to={"/AddMember"}>
            <button className="flex items-center gap-2 px-7 py-3 bg-[#C59D4A] text-white rounded-2xl hover:bg-[#b08b3e] transition-all duration-300 shadow-lg shadow-[#C59D4A]/20">
              <PlusCircle size={18} />
              <span className="text-sm font-medium">إضافة عضو جديد</span>
            </button>
          </Link>
        </div>


        {/* Right Side: Title and Subtitle */}
        <div className="text-right">
          <h1 className="text-white text-3xl font-bold mb-1 ">أعضاء الفريق</h1>
          <p className="text-gray-400 text-sm">
            إدارة الصلاحيات والوصول للموظفين والمستشارين القانونيين
          </p>
        </div>



      </div>
      <section>
        <div className="w-[97%]  mx-auto bg-[#101c2e] py-8 px-5 rounded-xl border border-gray-800/50 " dir="rtl">
          <div className="flex flex-wrap items-end gap-4">

            {/* Search Input */}
            <div className="flex-1 min-w-[250px]">
              <label className="block text-gray-400 text-sm mb-2 mr-1">البحث</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث بالاسم، البريد، أو التخصص..."
                  className="w-full bg-[#16253a] border border-gray-700 text-white rounded-lg py-2.5 pr-10 pl-4 focus:outline-none focus:border-[#C59D4A] transition-colors"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            {/* Account Type Dropdown */}
            <div className="w-48">
              <label className="block text-gray-400 text-sm mb-2 mr-1">نوع الحساب</label>
              <div className="relative">
                <select className="w-full bg-[#16253a] border border-gray-700 text-white rounded-lg py-2.5 pr-4 pl-10 appearance-none focus:outline-none focus:border-[#C59D4A]">
                  <option>الكل</option>
                  <option>موظف</option>
                  <option>مستشار</option>
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="w-40">
              <label className="block text-gray-400 text-sm mb-2 mr-1">الحالة</label>
              <div className="relative">
                <select className="w-full bg-[#16253a] border border-gray-700 text-white rounded-lg py-2.5 pr-4 pl-10 appearance-none focus:outline-none focus:border-[#C59D4A]">
                  <option>الكل</option>
                  <option>نشط</option>
                  <option>غير نشط</option>
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Search Button */}
            <button className="bg-[#C59D4A] hover:bg-[#b08b3e] text-white font-bold py-2.5 px-10 rounded-lg transition-colors shadow-lg shadow-[#C59D4A]/10">
              بحث
            </button>

            {/* Reset Button */}
            <button type='reset' className="flex items-center gap-2 text-gray-400 hover:text-white py-2.5 px-2 transition-colors">
              <RotateCcw size={16} />
              <span className="text-sm">إعادة ضبط</span>
            </button>

          </div>
        </div>
      </section>
      <section>
        <div className="w-[97%] mx-auto mt-5 bg-[#101c2e] rounded-xl border border-gray-800 overflow-hidden mb-10" dir="rtl">
          {isLoading? <div className='flex items-center justify-center h-[300px]'><span className="loading loading-infinity w-28 text-[#d3a63f] text-center"></span></div>:<table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-800">
                <th className="p-4 font-medium">العضو</th>
                <th className="p-4 font-medium">البريد الإلكتروني</th>
                <th className="p-4 font-medium">رقم الجوال</th>
                <th className="p-4 font-medium text-center">نوع الحساب</th>
                <th className="p-4 font-medium text-center">الحالة</th>
                <th className="p-4 font-medium text-center">تاريخ الإضافة</th>
                <th className="p-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {data?.data?.users.map((member) => (
                <tr key={member.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                  {/* Member Info */}
                  <td className="p-4 flex items-center gap-3">
                    <img src={member.ProfilePhoto?.url} alt="" className="w-10 h-10 rounded-full border border-gray-700" />
                    <div>
                      <div className="text-white font-bold text-sm">{member.name}</div>
                      <div className="text-gray-500 text-xs">{member.role}</div>
                    </div>
                  </td>

                  <td className="p-4 text-sm">{member.email}</td>
                  <td className="p-4 text-sm font-mono">{member.phone}</td>

                  {/* Account Type Badge */}
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs border ${member.role === 'ADMIN' ? 'border-[#C59D4A] text-[#C59D4A]' : 'border-gray-700 text-gray-400'
                      } bg-gray-800/30`}>
                      {member.role
}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${member.status === 'نشط' ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                      <span className={`text-xs ${member.status === 'نشط' ? 'text-emerald-500' : 'text-gray-500'}`}>{member.status}</span>
                    </div>
                  </td>

                  <td className="p-4 text-center text-sm text-gray-500">{formatEgyptDate(member?.createdAt)}</td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-full border border-gray-700 text-gray-400 hover:text-[#C59D4A] hover:border-[#C59D4A]"><Eye size={16} /></button>
                      <button className="p-1.5 rounded-full border border-gray-700 text-gray-400 hover:text-[#C59D4A] hover:border-[#C59D4A]"><Edit2 size={16} /></button>
                      <button className="p-1.5 rounded-full border border-gray-700 text-gray-400 hover:text-[#C59D4A] hover:border-[#C59D4A]"><ArrowLeftRight size={16} /></button>
                      <button className="p-1.5 rounded-full border border-gray-700 text-red-500 hover:bg-red-500/10"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
}

          {/* Pagination Footer */}
          {/* <div className="p-4 flex items-center justify-between border-t border-gray-800 text-sm">
            <div className="text-gray-500">
              عرض <span className="text-white">1</span> إلى <span className="text-white">10</span> من أصل <span className="text-white">235</span> عضو
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-800 text-gray-400"><ChevronRight size={18} /></button>
              <button className="w-8 h-8 rounded-lg bg-[#C59D4A] text-[#0B121D] font-bold">1</button>
              <button className="w-8 h-8 rounded-lg border border-gray-800 text-gray-400">2</button>
              <button className="w-8 h-8 rounded-lg border border-gray-800 text-gray-400">3</button>
              <span className="text-gray-600 px-1">...</span>
              <button className="w-8 h-8 rounded-lg border border-gray-800 text-gray-400">24</button>
              <button className="p-2 rounded-lg border border-gray-800 text-gray-400"><ChevronLeft size={18} /></button>
            </div>
          </div> */}
        </div>
      </section>
    </>
  )
}

export default Team