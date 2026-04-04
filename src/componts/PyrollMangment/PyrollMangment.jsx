import React from 'react'
import {
  HiOutlineUserGroup,
  HiOutlineArrowTrendingDown,
  HiOutlineWallet,
  HiOutlineEye,
} from "react-icons/hi2";
function PyrollMangment() {
  const data = [
    {
      name: "محمد كمال",
      role: "محامي أول",
      base: 25000,
      bonus: 4500,
      advance: 0,
      deduction: 500,
      net: 29000,
    },
    {
      name: "السيد",
      role: "محامي جنائي",
      base: 18000,
      bonus: 2000,
      advance: 1500,
      deduction: 0,
      net: 18500,
    },
    {
      name: "ميدو",
      role: "مساعد إداري",
      base: 8500,
      bonus: 1000,
      advance: 0,
      deduction: 200,
      net: 9300,
    },
    {
      name: "مصطفى",
      role: "مستشار قانوني",
      base: 21000,
      bonus: 3200,
      advance: 0,
      deduction: 1200,
      net: 23000,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#071a2f] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#8EA3BF] hover:bg-white/5">
              PDF تنزيل
            </button>

            <button className="rounded-xl bg-[#D7AE46] px-5 py-2 text-sm font-bold text-[#071a2f]">
              + إضافة عملية مالية
            </button>
          </div>

          <div className="text-right">
            <h1 className="text-3xl font-bold">إدارة الرواتب</h1>
            <p className="text-sm text-[#8EA3BF]">
              إدارة رواتب الموظفين والمكافآت والخصومات الخاصة بهم
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-2xl bg-[#0d2139] p-5">
            <div className="text-green-400">
              <HiOutlineUserGroup size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm text-[#8EA3BF]">عدد الموظفين</p>
              <h3 className="text-xl font-bold">124</h3>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#0d2139] p-5">
            <div className="text-red-400">
              <HiOutlineArrowTrendingDown size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm text-[#8EA3BF]">إجمالي الخصومات</p>
              <h3 className="text-xl font-bold">12,400</h3>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#0d2139] p-5">
            <div className="text-emerald-400">
              <HiOutlineWallet size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm text-[#8EA3BF]">إجمالي الرواتب</p>
              <h3 className="text-xl font-bold">450,000</h3>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-[#081b31] p-5">
          <div className="mb-4 text-right">
            <h3 className="text-lg font-bold">كشف رواتب الموظفين - مايو 2026</h3>
          </div>

          {/* Header */}
          <div className="grid grid-cols-9 text-xs text-[#8EA3BF] px-4 py-3 border-b border-white/5">
            <div>اسم الموظف</div>
            <div>المسمى الوظيفي</div>
            <div>الراتب الأساسي</div>
            <div>البدلات</div>
            <div>السلف</div>
            <div>الخصومات</div>
            <div>صافي الراتب</div>
            <div className="text-left">إجراءات</div>
          </div>

          {/* Rows */}
          {data.map((emp, i) => (
            <div
              key={i}
              className="grid grid-cols-9 items-center px-4 py-4 border-b border-white/5 text-sm"
            >
              <div className="font-medium">{emp.name}</div>
              <div className="text-[#8EA3BF]">{emp.role}</div>

              <div>{emp.base.toLocaleString()}</div>
              <div className="text-green-400">{emp.bonus.toLocaleString()}</div>
              <div className="text-[#8EA3BF]">{emp.advance}</div>
              <div className="text-red-400">{emp.deduction}</div>

              <div className="text-amber-400 font-bold">
                {emp.net.toLocaleString()}
              </div>

              <div className="flex justify-start">
                <button className="text-[#8EA3BF] hover:text-white">
                  <HiOutlineEye />
                </button>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 text-sm text-[#8EA3BF]">
            <div>عرض 4 من أصل 50 موظف</div>

            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-white/5">السابق</button>
              <button className="px-3 py-1 rounded-lg bg-white/5">التالي</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PyrollMangment