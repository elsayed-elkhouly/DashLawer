import React from 'react'
import { FaBalanceScale } from 'react-icons/fa'
import { IoLocationOutline, IoPhonePortraitOutline } from 'react-icons/io5'

const Footer = () => {
  
  return (
    <footer className="bg-[#14243a] text-gray-400 py-16 px-6 border-t border-gray-800" dir="rtl">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-[#c5a059]"><FaBalanceScale/></span> هيلبر للمحاماة
        </h3>
        <p>الريادة في الخدمات القانونية في مصر، مع الالتزام التام بالقيم المهنية.</p>
      </div>

      <div className="space-y-4">
        <h4 className=" font-bold text-lg mb-2 text-[#c5a059]">ساعات العمل</h4>
        <div className="flex justify-between"><span>الأحد - الخميس</span><span className="text-white">9:00 ص - 6:00 م</span></div>
        <div className="flex justify-between border-t border-gray-800 pt-2"><span>السبت</span><span className="text-white">10:00 ص - 2:00 م</span></div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[#c5a059] font-bold text-lg mb-2">تواصل معنا</h4>
        <p className='flex items-center gap-3 '><IoLocationOutline className='text-[#c5a059] text-xl' /> البحيرة، كفر الدوار، أمام المحكمة</p>
        <p dir="Rtl" className='flex items-center gap-3'><IoPhonePortraitOutline  className='text-[#c5a059] text-xl'/> 01263849089+</p>
      </div>
    </div>

    <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-800 flex justify-between items-center text-xs">
      <p>© 2024 هيلبر للمحاماة. جميع الحقوق محفوظة.</p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-white">الشروط</a>
        <a href="#" className="hover:text-white">الخصوصية</a>
      </div>
    </div>
  </footer>
  )
}

export default Footer