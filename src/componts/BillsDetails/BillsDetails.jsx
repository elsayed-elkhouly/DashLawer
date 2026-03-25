import React from 'react'
import { HiOutlineXMark } from 'react-icons/hi2';

const BillsDetails = () => {
    const items = [
      { name: "أتعاب المحاماة", desc: "المرحلة الابتدائية - قضية تجارية", amount: 15000 },
      { name: "رسوم إدارية", desc: "تجهيز ملفات الترجمة والتوثيق", amount: 1200 },
      { name: "رسوم المحكمة", desc: "سداد رسوم", amount: 5000 },
    ];
  return (
    <>


    <div dir="rtl" className="min-h-screen bg-[#061529] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-6xl rounded-3xl bg-[#081b31] border border-white/10 shadow-2xl p-6 md:p-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <button className="text-slate-400 hover:text-white">
            <HiOutlineXMark size={22} />
          </button>

          <div className="text-left">
            <h2 className="text-xl font-bold">تفاصيل الفاتورة</h2>
            <p className="text-sm text-slate-400">#INV-8842-2024</p>
          </div>

          <span className="px-4 py-1 rounded-full bg-amber-400/20 text-amber-300 text-sm">
            مدفوعة
          </span>
        </div>

        {/* Top Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">

          {/* Client */}
          <div className="bg-[#0a2038] border border-white/10 rounded-2xl p-4">
            <p className="text-sm text-amber-400 mb-3">بيانات العميل</p>
            <h3 className="font-medium mb-1">شركة المجد للاستثمار</h3>
            <p className="text-sm text-slate-400">+966 50 123 4567</p>
            <p className="text-sm text-slate-400">contact@al-majd.sa</p>
          </div>

          {/* Service */}
          <div className="bg-[#0a2038] border border-white/10 rounded-2xl p-4">
            <p className="text-sm text-amber-400 mb-3">تفاصيل الخدمة</p>
            <p className="text-sm text-slate-400">نوع الخدمة</p>
            <p className="mb-2">قضية</p>

            <p className="text-sm text-slate-400">رقم القضية</p>
            <p className="mb-2">2024/99128</p>

            <p className="text-sm text-slate-400">المحامي المسؤول</p>
            <p>أحمد الشهري</p>
          </div>

          {/* Invoice Info */}
          <div className="bg-[#0a2038] border border-white/10 rounded-2xl p-4">
            <p className="text-sm text-amber-400 mb-3">بيانات الفاتورة</p>
            <p className="text-sm text-slate-400">تاريخ الفاتورة</p>
            <p className="mb-2">12 أكتوبر 2023</p>

            <p className="text-sm text-slate-400">تاريخ الاستحقاق</p>
            <p className="mb-2">20 أكتوبر 2023</p>

            <p className="text-sm text-slate-400">طريقة الدفع</p>
            <p>تحويل بنكي</p>
          </div>
        </div>

        {/* Table */}
        <div className="border border-white/10 rounded-2xl overflow-hidden mb-6">
          <div className="grid grid-cols-3 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <div>البند</div>
            <div>الوصف</div>
            <div className="text-left">المبلغ</div>
          </div>

          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-3 px-4 py-4 border-t border-white/5 text-sm">
              <div>{item.name}</div>
              <div className="text-slate-400">{item.desc}</div>
              <div className="text-left">{item.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Summary */}
          <div className="bg-[#0a2038] border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-slate-400">المجموع الفرعي</span>
              <span>16,700</span>
            </div>

            <div className="flex justify-between mb-2 text-sm text-red-400">
              <span>الخصم (%5)</span>
              <span>- 835</span>
            </div>

            <div className="flex justify-between mb-3 text-sm text-slate-400">
              <span>ضريبة القيمة المضافة (%15)</span>
              <span>2,379</span>
            </div>

            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold">الإجمالي النهائي</span>
              <span className="text-xl font-bold text-amber-400">18,244</span>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#0a2038] border border-white/10 rounded-2xl p-5">
            <p className="text-sm text-slate-400 mb-3">ملاحظات</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              تم تسوية الدفعة الأولى وفقاً لاتفاقية الجدولة الموقعة مسبقاً.
            </p>
          </div>

        </div>
      </div>
    </div>


    
    </>
  )
}

export default BillsDetails