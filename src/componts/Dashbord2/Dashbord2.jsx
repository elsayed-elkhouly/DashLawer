import React from 'react'
import {
  FiUsers,
  FiUserPlus,
  FiDollarSign,
  FiActivity,
  FiTrendingUp,
  FiFilter,
} from "react-icons/fi";
import {
  FiBarChart2,
  FiAward,
} from "react-icons/fi";
import { FaEye, FaEdit, FaCopy } from "react-icons/fa";

import api from '../../api/axios';
import { useQuery } from '@tanstack/react-query';
const Dashbord2 = () => {
  function getDashbord() {
    return api.get("https://api.helperlawyer.online//super-admin/dashboard")
  }

  const { data } = useQuery({
    queryKey: ["Dashbord"],
    queryFn: getDashbord
  })
  console.log(data?.data?.stats);

  const stats = [
    {
      title: "المكاتب النشطة ",
      value: data?.data?.stats?.activeOffices,
      change: "12%+",
      icon: <FiUsers size={20} />,
    },
    {
      title: " المكاتب الموقوفة",
      value: data?.data?.stats?.suspendedOffices,
      change: "8%+",
      icon: <FiUserPlus size={20} />,
    },
    {
      title: "   إجمالي المكاتب",
      value: data?.data?.stats?.totalOffices,
      change: "15%+",
      icon: <FiDollarSign size={20} />,
    },
    {
      title: " إجمالي الإيرادات",
      value: data?.data?.stats?.totalRevenue,
      change: "5%+",
      icon: <FiActivity size={20} />,
    },
    {
      title: "المكاسب النشطة",
      value: data?.data?.stats?.activeOffices,
      change: "5%+",
      icon: <FiActivity size={20} />,
    },
    {
      title: " إجمالي المستخدمين",
      value: data?.data?.stats?.totalUsers
      ,
      change: "5%+",
      icon: <FiActivity size={20} />,
    },
    {
      title: " المكاتب المنتهية صلاحيتها",
      value: data?.data?.stats?.expiredOffices,
      change: "5%+",
      icon: <FiActivity size={20} />,
    },
  ];
  const topPlans = [
    {
      title: "الباقة الاحترافية",
      value: "4,120",
      percent: 50,
      featured: true,
    },
    {
      title: "الباقة الأساسية",
      value: "2,850",
      percent: 35,
      featured: false,
    },
    {
      title: "باقة المؤسسات",
      value: "1,270",
      percent: 15,
      featured: false,
    },
  ];

  const chartData = [
    { label: "يونيو", value: 400 },
    { label: "مايو", value: 480 },
    { label: "أبريل", value: 605, active: true, prev: 550 },
    { label: "مارس", value: 300 },
    { label: "فبراير", value: 550 },
    { label: "يناير", value: 480 },
  ];



  const planClasses = {
    "الباقة الاحترافية": "bg-[#4c4330] text-[#e6c15a]",
    "الباقة الأساسية": "bg-[#324254] text-[#d6e0ec]",
    "باقة المؤسسات": "bg-[#3f4a45] text-[#d6ba60]",
  };

  const maxValue = 700;




  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };



  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const mappedRecentOffices =
    data?.data?.recentOffices?.map((office) => ({
      email: office.email,
      id: office.id,
      name: office.name,
      initials: office.name?.slice(0, 2)?.toUpperCase() || "--",
      plan: office.planName,
      price: `${office.amountPaid} `,
      date: new Date(office.joinedAt).toLocaleDateString("en-CA"),
      status: office.status,
      statusType: office.status,
      subdomain: office.subdomain

    })) || [];

  const planClasses2 = {
    "الباقة الأساسية": "border border-white/10 bg-white/5 text-white/90",
    "باقة المؤسسات": "border border-[#b9973d]/30 bg-[#b9973d]/10 text-[#f2be42]",
    " الباقة الاحترافية": "border border-white/10 bg-white/5 text-white/85",
  };

  const statusClasses2 = {
    active: "bg-[#123c2b] text-[#63d39b]",
    cancelled: "bg-[#4a1616] text-[#ff8e8e]",
    suspended: "bg-[#4a1616] text-[#ff8e8e]",
    expired: "bg-[#4a1616] text-[#ff8e8e]",
    pending: "border border-[#b9973d]/30 bg-[#b9973d]/10 text-[#f2be42]",
  };


  const formatDate2 = (date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getRemainingDays = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "منتهية";
    if (diffDays === 1) return "متبقي يوم واحد";
    return `متبقي ${diffDays} أيام`;
  };

  const normalizePlanName = (planSlug = "") => {
    return planSlug.replaceAll("_", " ");
  };

  const getDotRing = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) return "ring-2 ring-red-400/40";
    if (diffDays <= 7) return "ring-2 ring-yellow-400/40";
    return "ring-2 ring-green-400/40";
  };

  const mappedExpiringSoon =
    data?.data?.expiringSoon?.map((row) => ({
      id: row.id,
      office: row.name,
      email: row.email,
      subdomain: row.subdomain,
      expiry: formatDate2(row.endDate),
      remaining: getRemainingDays(row.endDate),
      package: normalizePlanName(row.planSlug),
      dotRing: getDotRing(row.endDate),
    })) || [];
  return (
    <>
      <section
        dir="rtl"
        className=" bg-[#061a33] text-white px-6 py-10 "
      >
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              لوحة تحليلات التسويق
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b2444] px-4 py-3 text-sm text-white/90 hover:bg-[#102c50] transition">
                <FiFilter className="text-yellow-400" />
                جميع الفئات
              </button>

              <button className="rounded-xl bg-[#0b2444] px-5 py-3 text-sm text-white/80 hover:bg-[#102c50] transition">
                آخر 90 يوم
              </button>

              <button className="rounded-xl border border-yellow-500/30 bg-[#132844] px-5 py-3 text-sm font-medium text-yellow-400 shadow-[0_0_0_1px_rgba(234,179,8,0.08)]">
                آخر 30 يوم
              </button>
            </div>
          </div>

          {/* Cards */}
          <div
            className="
        grid gap-5
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-4
      "
          >
            {stats.map((item, index) => (
              <div
                key={index}
                className="w-full rounded-2xl bg-[#102743] px-5 py-6 shadow-lg shadow-black/10 ring-1 ring-white/5 hover:scale-[1.02] transition"
              >
                <div className="flex items-start justify-between">
                  <div className="text-right">
                    <p className="mb-2 text-sm text-white/60">
                      {item.title}
                    </p>
                    <h3 className="text-3xl font-bold tracking-tight text-white">
                      {item.value}
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1b314d] text-yellow-400">
                    {item.icon}
                  </div>
                </div>


              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        dir="rtl"
        className="w-full bg-[#081a33] p-4 text-white md:p-6"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-[22px] border border-white/4 bg-[linear-gradient(180deg,#10233f_0%,#0e213c_100%)] px-8 pb-7 pt-8 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
            <div className="mb-8 flex items-start justify-between">
              <h2 className="text-[22px] font-extrabold leading-[1.8] tracking-tight text-white/95 md:text-[24px]">
                نمو الاشتراكات
              </h2>

              <div className="flex items-center rounded-xl bg-[#091b31] p-1">
                <button className="rounded-lg bg-[#e2b84b] px-4 py-2 text-xs font-bold text-[#081a33] shadow-sm">
                  شهري
                </button>
                <button className="rounded-lg px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/5">
                  أسبوعي
                </button>
                <button className="rounded-lg px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/5">
                  يومي
                </button>
              </div>
            </div>

            <div className="relative h-[340px] w-full">
              <div className="absolute inset-0">
                {[600, 400, 200, 0].map((tick, index) => (
                  <div
                    key={tick}
                    className={`absolute left-0 right-0 border-t border-white/14 ${index === 0 ? "" : ""
                      }`}
                    style={{ top: `${index * 24 + 22}%` }}
                  >
                    <span className="absolute -left-6 -translate-y-1/2 text-[13px] font-medium text-white/65">
                      {tick}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 top-0 flex items-end justify-between gap-4 pl-10">
                {chartData.map((item) => {
                  const height = Math.max((item.value / maxValue) * 235, 48);
                  return (
                    <div
                      key={item.label}
                      className="relative flex h-full flex-1 flex-col items-center justify-end"
                    >
                      {item.active && (
                        <div className="absolute bottom-[240px] z-20 rounded-[12px] border border-white/10 bg-[#334760]/95 px-4 py-3 text-center shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                          <div className="mb-2 text-[12px] text-white/65">أبريل 2024</div>
                          <div className="flex items-end gap-6 text-xs">
                            <div>
                              <div className="mb-1 text-white/50">السابق</div>
                              <div className="text-[13px] font-bold text-white/85">{item.prev}</div>
                            </div>
                            <div>
                              <div className="mb-1 text-white/50">الحالي</div>
                              <div className="text-[13px] font-bold text-[#e2b84b]">{item.value}</div>
                            </div>
                          </div>
                          <div className="absolute left-1/2 top-full h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/10 bg-[#334760]" />
                        </div>
                      )}

                      <div className="relative flex h-65 w-full items-end justify-center">
                        <div
                          className={`w-full rounded-t-2xl border bg-[#1a2d49]/95 ${item.active ? "border-[#e2b84b]" : "border-[#c79e33]"
                            }`}
                          style={{ height: `${height}px` }}
                        />
                      </div>

                      <span className="mt-6 text-[13px] text-white/78">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#10233f] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
            <div className="mb-8 flex items-start justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight">أكثر الباقات مبيعًا</h2>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c304c] text-[#e2b84b]">
                <FiBarChart2 size={18} />
              </div>
            </div>

            <div className="space-y-7">
              {topPlans.map((plan) => (
                <div key={plan.title}>
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div className="text-right">
                      <div className="text-sm text-white/90">{plan.title}</div>
                      {plan.featured && (
                        <span className="mt-2 inline-flex rounded-md bg-[#e2b84b]/15 px-2 py-1 text-[10px] font-bold text-[#e2b84b]">
                          الأكثر طلبًا
                        </span>
                      )}
                    </div>

                    <div className="text-left">
                      <div className="text-2xl font-extrabold leading-none text-[#e2b84b]">
                        {plan.value}
                      </div>
                      <div className="mt-1 text-xs text-white/45">{plan.percent}% من المبيعات</div>
                    </div>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#07182d]">
                    <div
                      className={`h-full rounded-full ${plan.featured ? "bg-[#e2b84b]" : "bg-[#263c58]"
                        }`}
                      style={{ width: `${plan.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] px-4 py-4">
              <div className="text-sm text-white/70">
                تحقق الباقة الاحترافية أعلى دخل لكل مستخدم بقيمة <span className="font-bold text-[#e2b84b]">%622</span>
              </div>
              <FiAward className="shrink-0 text-[#e2b84b]" size={18} />
            </div>
          </div>
        </div>
      </section>

      <div
        className="  px-4 py-10 text-white md:px-10"
      >
        <div className="overflow-hidden rounded-[20px] px-10 border border-white/5 bg-[linear-gradient(90deg,#132740_0%,#11253f_100%)] shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between  border-white/6 py-8">
            <h2 className="text-[20px] font-extrabold text-white/95 md:text-[22px] ">
              أحدث الاشتراكات
            </h2>
            <button className="text-sm font-medium text-[#e2b84b] transition hover:text-[#f0cc67]">
              عرض الكل ←
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl mb-5 bg-[#102743]  shadow-[0_10px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/5">
            {/* Header */}
            <div className="hidden  lg:grid lg:grid-cols-[1fr_2fr_1.5fr_1fr_1fr_1fr_1fr] bg-[#0d2037] px-8 py-5 text-sm font-semibold text-white/85">
              <div className="text-right">اسم العميل</div>
              <div className="text-right">البريد الإلكتروني</div>
              <div className="text-right">SUBDOMAIN</div>
              <div className="text-right">الباقة</div>
              <div className="text-right">السعر</div>
              <div className="text-right">التاريخ</div>
              <div className="text-right">الحالة</div>
            </div>

            {/* Body */}
            <div>
              {mappedRecentOffices.map((item, index) => (
                <div
                  key={item.id || `${item.name}-${index}`}
                  className="
          border-t border-white/5 px-5 py-5
          lg:grid lg:grid-cols-[1fr_2fr_1.5fr_1fr_1fr_1fr_1fr] lg:items-center lg:px-8
        "
                >
                  {/* Mobile / Tablet */}
                  <div className="space-y-4 lg:hidden">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="mb-1 text-xs text-white/50">اسم العميل</p>
                        <span className="text-sm font-medium text-white/92">
                          {item.name}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${statusClasses2[item.statusType]}`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current opacity-90" />
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-white/50">البريد الإلكتروني</p>
                        <span className="block truncate text-sm font-medium text-white/92">
                          {item.email}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-white/50">SUBDOMAIN</p>
                        <span className="block truncate text-sm font-medium text-white/92">
                          {item.subdomain}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-white/50">الباقة</p>
                        <span
                          className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold ${planClasses2[item.plan]}`}
                        >
                          {item.plan}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-white/50">السعر</p>
                        <span className="text-[15px] font-bold text-[#cedaeb]">
                          {item.price}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-white/50">التاريخ</p>
                        <span className="text-[15px] text-white/82">{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden lg:block">
                    <span className="text-sm font-medium text-white/92">{item.name}</span>
                  </div>

                  <div className="hidden min-w-0 lg:block">
                    <span className="block truncate text-sm font-medium text-white/92">
                      {item.email}
                    </span>
                  </div>

                  <div className="hidden min-w-0 lg:block">
                    <span className="block truncate text-sm font-medium text-white/92">
                      {item.subdomain}
                    </span>
                  </div>

                  <div className="hidden lg:block">
                    <span
                      className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold ${planClasses2[item.plan]}`}
                    >
                      {item.plan}
                    </span>
                  </div>

                  <div className="hidden text-[15px] font-bold text-[#cedaeb] lg:block">
                    {item.price}
                  </div>

                  <div className="hidden text-[15px] text-white/82 lg:block">
                    {item.date}
                  </div>

                  <div className="hidden lg:block">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${statusClasses2[item.statusType]}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-90" />
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div
        dir="rtl"
        className="min-h-screen  px-4 py-10 text-white md:px-10"
      >
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-white/10 bg-[#10233f] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between border-b border-white/5 px-8 py-7">
            <h1 className="text-3xl font-bold tracking-tight">انتهاء الاشتراكات</h1>
            <h4 className="text-3xl font-bold tracking-tight">  </h4>
            <button className="text-sm font-medium text-yellow-300 transition hover:text-yellow-200">
              عرض الكل ←
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-275 text-right">
              <thead>
                <tr className="border-b border-white/5 text-sm text-slate-300">
                  <th className="px-8 py-5 font-medium">اسم المكتب</th>
                  <th className="px-6 py-5 font-medium">البريد الإلكتروني</th>
                  <th className="px-6 py-5 font-medium">SUBDOMAIN</th>
                  <th className="px-6 py-5 font-medium">تاريخ الانتهاء</th>
                  <th className="px-6 py-5 font-medium">الباقة</th>
                  <th className="px-8 py-5 font-medium">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {mappedExpiringSoon.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 transition hover:bg-white/2"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-lg font-medium text-white">
                            {row.office}
                          </div>
                        </div>


                      </div>
                    </td>

                    <td className="px-6 py-6 text-lg text-slate-300">{row.email}</td>

                    <td className="px-6 py-6">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-[#091427] px-4 py-2 text-sm text-slate-200 shadow-inner shadow-black/20">
                        <FaCopy className="text-xs text-slate-400" />
                        <span>{row.subdomain}</span>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="text-2xl font-medium text-white">{row.expiry}</div>
                      <div className="mt-1 text-sm text-yellow-300">{row.remaining}</div>
                    </td>

                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex rounded-full border px-4 py-2 text-sm ${row.package === "الباقة المؤسسية"
                          ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                          : "border-slate-400/20 bg-slate-400/10 text-slate-200"
                          }`}
                      >
                        {row.package}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 text-slate-300">
                        <button className="transition hover:text-white">
                          <FaEye size={18} />
                        </button>
                        <button className="transition hover:text-white">
                          <FaEdit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </>)
}

export default Dashbord2