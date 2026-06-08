import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaBalanceScale } from 'react-icons/fa'
import { IoLocationOutline, IoPhonePortraitOutline } from 'react-icons/io5'
import api from '../../api/axios'

const Footer = () => {
  const [settings, setSettings] = useState(null);
  async function getData() {
    try {
      const res = await api.get(
        "/SettingsService/"
      );
      setSettings(res?.data?.Settings)
    } catch (error) {
    }
  }

  useEffect(() => {
    getData()


  }, [])

  // console.log(settings?.officeName);
function formatTime(time) {
  const [hour, minute] = time.split(":");
  let h = parseInt(hour);

  const period = h >= 12 ? "م" : "ص";

  h = h % 12 || 12;

  return `${h}:${minute} ${period}`;
}


  return (
    <footer className="bg-[#071A33] text-gray-400 py-16 px-6 border-t border-gray-800" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-[#c5a059]"><FaBalanceScale /></span> {settings?.officeName}
          </h3>
          <p>الريادة في الخدمات القانونية في مصر، مع الالتزام التام بالقيم المهنية.</p>
        </div>

        <div className="space-y-4">
          <h4 className=" font-bold text-lg mb-2 text-[#c5a059]">ساعات العمل</h4>
          {settings?.workHours?.map((item, index) => (
            <div key={index} className="flex justify-between border-t border-gray-800 pt-2">
              <span>{item.days.join(" - ")}</span>
              <span className="text-white">
                {formatTime(item.from)} - {formatTime(item.to)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="text-[#c5a059] font-bold text-lg mb-2">تواصل معنا</h4>
          <p className='flex items-center gap-3 '><IoLocationOutline className='text-[#c5a059] text-xl' />  {settings?.addressDetail} </p>
          <p dir="Rtl" className='flex items-center gap-3'><IoPhonePortraitOutline className='text-[#c5a059] text-xl' /> {settings?.phone} +</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-800 flex justify-between items-center text-xs">
        <p>© 2026  Lexora. جميع الحقوق محفوظة.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">الشروط</a>
          <a href="#" className="hover:text-white">الخصوصية</a>
        </div>
      </div>
    </footer>
  );


}

export default Footer