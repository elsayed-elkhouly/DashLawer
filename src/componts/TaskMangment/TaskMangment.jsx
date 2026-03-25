import React, { useState } from 'react'
import {
  HiOutlineClipboardDocumentList,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi2";
const TaskMangment = () => {
  const stats = [
    {
      id: 1,
      title: "إجمالي المهام",
      value: "٦٢",
      icon: <HiOutlineClipboardDocumentList size={18} />,
      iconColor: "text-slate-300",
    },
    {
      id: 2,
      title: "مهام متأخرة",
      value: "٠",
      icon: <HiOutlineExclamationCircle size={18} />,
      iconColor: "text-red-400",
    },
    {
      id: 3,
      title: "مهام قيد التنفيذ",
      value: "١٢",
      icon: <HiOutlineClock size={18} />,
      iconColor: "text-amber-400",
    },
    {
      id: 4,
      title: "المهام المكتملة",
      value: "٤٥",
      icon: <HiOutlineCheckCircle size={18} />,
      iconColor: "text-emerald-400",
    },
  ];
  const data = [
    {
      id: 1,
      title: "مراجعة العقد التجاري",
      client: "السيد",
      type: "قضية رقم ٣٢/٢٠٢٤",
      assigned: "خالد علي",
      priority: "عاجلة",
      date: "25/12/2026",
      status: "قيد التنفيذ",
    },
    {
      id: 2,
      title: "تحضير مذكرة الدفاع",
      client: "محمد كمال",
      type: "نزاع تجاري - استئناف",
      assigned: "السيد",
      priority: "متوسطة",
      date: "25/12/2026",
      status: "مجدولة",
    },
    {
      id: 3,
      title: "جلسة استماع المحكمة",
      client: "حسن سالم",
      type: "قضية أحوال شخصية",
      assigned: "خالد علي",
      priority: "عاجلة",
      date: "25/12/2026",
      status: "متأخرة",
    },
    {
      id: 4,
      title: "تدقيق الوثائق المالية",
      client: "ميدو امام",
      type: "دمج واستحواذ",
      assigned: "محمد كامل",
      priority: "منخفضة",
      date: "25/12/2026",
      status: "مكتملة",
    },
    {
      id: 5,
      title: "استشارة قانونية عاجلة",
      client: "احمد مصطفى",
      type: "استشارة عامة",
      assigned: "ميدو امام",
      priority: "متوسطة",
      date: "25/12/2026",
      status: "قيد التنفيذ",
    },
  ];

  const statusStyle = {
    "قيد التنفيذ": "bg-amber-400/20 text-amber-300",
    مجدولة: "bg-slate-500/20 text-slate-300",
    متأخرة: "bg-red-500/20 text-red-400",
    مكتملة: "bg-emerald-500/20 text-emerald-400",
  };

  const priorityStyle = {
    عاجلة: "bg-red-500/20 text-red-400",
    متوسطة: "bg-amber-400/20 text-amber-300",
    منخفضة: "bg-emerald-500/20 text-emerald-400",
  };
  const [openModal, setOpenModal] = useState(false);
  return (
  
     <>
  {/* header */}
  <div dir="rtl" className="w-full bg-[#081b31] px-4 sm:px-6 lg:px-8 py-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Right Side (Title) */}
      <div className="text-right">
        <h1 className="text-xl sm:text-2xl font-bold text-white">إدارة المهام</h1>
        <p className="mt-1 text-sm text-[#8EA3BF] leading-6">
          عرض وصيانة كافة مهام المكتب القانوني بنظام الجداول
        </p>
      </div>

      {/* Left Side (Button) */}
      <button
        onClick={() => setOpenModal(true)}
        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#D7AE46] px-5 py-2.5 text-sm font-medium text-[#071a2f] transition hover:opacity-90"
      >
        <span className="text-lg">+</span>
        إضافة مهمة جديدة
      </button>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#081b31] border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-white/10 gap-4">
              <div className="text-right">
                <h2 className="text-lg font-bold text-white">إضافة مهمة جديدة</h2>
                <p className="text-xs sm:text-sm text-[#8EA3BF] mt-1">
                  أدخل تفاصيل المهمة وتعيين الفريق
                </p>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="shrink-0 text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4 text-white">
              <div>
                <label className="text-sm text-slate-400">عنوان المهمة</label>
                <input
                  type="text"
                  placeholder="مثلاً: مراجعة العقد..."
                  className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">وصف المهمة</label>
                <textarea
                  rows={3}
                  placeholder="اكتب التفاصيل..."
                  className="mt-2 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4 py-2 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="text-sm text-slate-400">العميل</label>
                  <input
                    type="text"
                    placeholder="اسم العميل"
                    className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">إسناد إلى</label>
                  <input
                    type="text"
                    placeholder="اسم الموظف"
                    className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">إسناد إلى</label>
                  <input
                    type="text"
                    placeholder="اسم الموظف"
                    className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm text-slate-400">الأولوية</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["عاجلة", "متوسطة", "منخفضة"].map((p) => (
                      <button
                        key={p}
                        className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5 hover:bg-amber-400/20"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="flex flex-col">
                  <label className="text-sm text-slate-400 mb-1">
                    الموعد النهائي
                  </label>

                  <input
                    type="date"
                    className="h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-slate-400 mb-1">
                    الموعد النهائي
                  </label>

                  <input
                    type="date"
                    className="h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-white/10">
              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-400 hover:text-white py-2 text-center"
              >
                إلغاء
              </button>

              <button className="bg-[#D7AE46] text-[#071a2f] px-5 py-2.5 rounded-xl font-medium w-full sm:w-auto">
                حفظ المهمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* cards */}
  <div dir="rtl" className="px-4 sm:px-6 lg:px-8 mt-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[...stats].reverse().map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-white/5 bg-[#0d2139] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="text-right min-w-0">
              <p className="text-sm text-[#8EA3BF]">{item.title}</p>
              <h3 className="mt-3 text-2xl sm:text-3xl font-bold leading-none text-white break-words">
                {item.value}
              </h3>
            </div>
            
            <div className={`mt-1 shrink-0 ${item.iconColor}`}>{item.icon}</div>

          </div>
        </div>
      ))}
    </div>
  </div>

  {/* table */}
  <div dir="rtl" className="mt-6 px-4 sm:px-6 lg:px-8 pb-6">
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#081b31]">
      {/* Header */}
      <div className="hidden lg:grid grid-cols-12 bg-white/3 px-4 py-3 text-sm text-[#8EA3BF]">
        <div className="col-span-2">عنوان المهمة</div>
        <div className="col-span-1">الموكل</div>
        <div className="col-span-2">القضية</div>
        <div className="col-span-1">المسؤول</div>
        <div className="col-span-1">الأولوية</div>
        <div className="col-span-2">الموعد النهائي</div>
        <div className="col-span-1">الحالة</div>
        <div className="col-span-2 text-left">الإجراءات</div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-white/5">
        {data.map((task) => (
          <div key={task.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="text-right">
                <p className="text-white font-medium">{task.title}</p>
                <p className="text-xs text-[#8EA3BF] mt-1">{task.type}</p>
              </div>

              <span
                className={`rounded-full px-2 py-1 text-xs whitespace-nowrap ${priorityStyle[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-right">
                <p className="text-[#8EA3BF] text-xs mb-1">الموكل</p>
                <p className="text-white">{task.client}</p>
              </div>

              <div className="text-right">
                <p className="text-[#8EA3BF] text-xs mb-1">المسؤول</p>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-white">{task.assigned}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20 text-xs text-amber-300">
                    {task.assigned[0]}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[#8EA3BF] text-xs mb-1">الموعد النهائي</p>
                <p className="text-white">{task.date}</p>
              </div>

              <div className="text-right">
                <p className="text-[#8EA3BF] text-xs mb-1">الحالة</p>
                <span
                  className={`rounded-full px-2 py-1 text-xs inline-block ${statusStyle[task.status]}`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-start gap-2 text-[#8EA3BF] pt-1">
              <button className="rounded-lg p-2 hover:bg-white/5">
                <HiOutlineEye />
              </button>
              <button className="rounded-lg p-2 hover:bg-white/5">
                <HiOutlinePencil />
              </button>
              <button className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                <HiOutlineTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        {data.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-12 items-center border-t border-white/5 px-4 py-4 text-sm"
          >
            <div className="col-span-2 text-white">{task.title}</div>

            <div className="col-span-1 text-[#8EA3BF]">{task.client}</div>

            <div className="col-span-2 text-[#8EA3BF]">{task.type}</div>

            <div className="col-span-1 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20 text-xs text-amber-300">
                {task.assigned[0]}
              </div>
              {task.assigned}
            </div>

            <div className="col-span-1">
              <span
                className={`rounded-full px-2 py-1 text-xs ${priorityStyle[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>

            <div className="col-span-2 text-[#8EA3BF]">{task.date}</div>

            <div className="col-span-1">
              <span
                className={`rounded-full px-2 py-1 text-xs ${statusStyle[task.status]}`}
              >
                {task.status}
              </span>
            </div>

            <div className="col-span-2 flex justify-start gap-2 text-[#8EA3BF]">
              <button className="rounded-lg p-2 hover:bg-white/5">
                <HiOutlineEye />
              </button>
              <button className="rounded-lg p-2 hover:bg-white/5">
                <HiOutlinePencil />
              </button>
              <button className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                <HiOutlineTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 px-4 py-3 text-sm text-[#8EA3BF]">
        <div className="text-center sm:text-right">عرض 1 إلى 10 من أصل 35 مهمة</div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`h-8 w-8 rounded-full ${
                page === 1
                  ? "bg-amber-400 text-black"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>

    </>
  )
}

export default TaskMangment