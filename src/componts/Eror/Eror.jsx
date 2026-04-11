import React from 'react'
import { HiOutlineArrowRight, HiOutlineSquares2X2, HiOutlineExclamationCircle } from "react-icons/hi2";
import { PiPathBold } from "react-icons/pi";
const Eror = () => {
  return (
    <div
      className="min-h-screen bg-[#04152b] px-4 py-10 text-white"
      dir="rtl"
    >
      <div className="mx-auto flex min-h-[90vh] max-w-7xl items-center justify-center">
        <div className="w-full max-w-md text-center">
          {/* icon */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#d4aa45] shadow-[0_20px_40px_rgba(212,170,69,0.18)]">
            <PiPathBold className="text-[42px] text-[#07162d]" />
          </div>

          {/* 404 */}
          <h1 className="text-[92px] font-extrabold leading-none tracking-tight text-[#d4aa45] md:text-[110px]">
            404
          </h1>

          {/* title */}
          <h2 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
            الصفحة غير موجودة
          </h2>

          {/* description */}
          <p className="mx-auto mt-4 max-w-sm text-base leading-8 text-[#9aacc4]">
            عذرًا، الصفحة التي تحاول الوصول إليها غير متوفرة أو ربما تم حذفها.
          </p>

 

          {/* help box */}
          <div className="mx-auto mt-8 flex h-12 max-w-[460px] items-center justify-center gap-2 rounded-full border border-[#13294a] bg-[#091b35] px-5 text-xs text-[#7f93ad]">
            <HiOutlineExclamationCircle className="text-sm text-[#d4aa45]" />
            إذا استمرت المشكلة، يرجى التواصل مع مسؤول النظام
          </div>
        </div>
      </div>
    </div>
  )
}

export default Eror