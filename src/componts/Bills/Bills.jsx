import React, { useState } from 'react'
import {
  HiOutlinePlusCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { Link } from 'react-router-dom';

const Bills = () => {

  const [search, setSearch] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [dateRange, setDateRange] = useState("01/01/2024 - 31/01/2024");
  return (
    <>   
    <div className="w-full bg-[#04152b] px-5 py-6 text-white md:px-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="text-right">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              إدارة الفواتير
            </h1>
            <p className="mt-2 text-sm text-[#7f93ad]">
              نظرة شاملة على جميع العمليات المالية والمطالبات.
            </p>
          </div>

          <Link to={"/Bills/AddNewFees"}>
          <button
            type="button"
            className="inline-flex h-12 items-center gap-2 self-start rounded-2xl bg-[#d4aa45] px-5 text-sm font-bold text-[#08162b] shadow-[0_14px_30px_rgba(212,170,69,0.24)] transition hover:opacity-95"
          >
            <HiOutlinePlusCircle className="text-lg" />
            فاتورة جديدة
          </button>         
          </Link>
        </div>

        <div className="rounded-3xl border border-[#112543] bg-[#07182f] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            {/* search */}
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6f86a6]">
                <HiOutlineMagnifyingGlass size={18} />
              </span>
              <input
                dir="rtl"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث عن عميل، رقم فاتورة..."
                className="h-12 w-full rounded-2xl border border-[#132949] bg-[#091b35] pr-11 pl-4 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4aa45]/70 focus:ring-2 focus:ring-[#d4aa45]/20"
              />
            </div>

            {/* case number */}
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#6f86a6]">
                <HiOutlineChevronDown size={18} />
              </span>
              <select
                dir="rtl"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-[#132949] bg-[#091b35] px-4 pl-10 text-right text-sm text-white outline-none transition focus:border-[#d4aa45]/70 focus:ring-2 focus:ring-[#d4aa45]/20"
              >
                <option value="">رقم القضية</option>
                <option value="case-1">CASE-001</option>
                <option value="case-2">CASE-002</option>
                <option value="case-3">CASE-003</option>
              </select>
            </div>

            {/* service type */}
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#6f86a6]">
                <HiOutlineChevronDown size={18} />
              </span>
              <select
                dir="rtl"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-[#132949] bg-[#091b35] px-4 pl-10 text-right text-sm text-white outline-none transition focus:border-[#d4aa45]/70 focus:ring-2 focus:ring-[#d4aa45]/20"
              >
                <option value="">نوع الخدمة</option>
                <option value="consulting">استشارة قانونية</option>
                <option value="litigation">قضية</option>
                <option value="contract">عقد</option>
              </select>
            </div>

            {/* date range */}
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6f86a6]">
                <HiOutlineCalendarDays size={18} />
              </span>
              <input
                dir="ltr"
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-12 w-full rounded-2xl border border-[#132949] bg-[#091b35] pr-11 pl-4 text-sm text-[#dbe7f5] outline-none transition focus:border-[#d4aa45]/70 focus:ring-2 focus:ring-[#d4aa45]/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </>
  )
}

export default Bills