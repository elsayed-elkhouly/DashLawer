import React from 'react'
import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineUserAdd,
} from "react-icons/hi";
import {
  FiSearch,
  FiCalendar,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
const ClientMangment = () => {

  function getAllOffice() {
    return api.get("/super-admin/getAllOffices")
  }

  const { data } = useQuery({
    queryKey: ["Offices"],
    queryFn: getAllOffice
  })
  console.log(data?.data?.offices);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const stats = [
    {
      id: 1,
      title: "إجمالي العملاء",
      value: "12,450",
      changeColor: "text-emerald-400",
      icon: <HiOutlineUsers size={28} />,
      iconColor: "text-[#d8a63c]",
      status: null,
      align: "right",
    },
    {
      id: 2,
      title: "العملاء الجدد هذا الشهر",
      value: "1,200",
      changeColor: "text-emerald-400",
      icon: <HiOutlineUserAdd size={28} />,
      iconColor: "text-[#d8a63c]",
      status: null,
      align: "right",
    },
    {
      id: 3,
      title: "العملاء النشطين",
      value: "8,640",
      change: null,
      changeColor: "",
      icon: <HiOutlineShieldCheck size={28} />,
      iconColor: "text-[#d8a63c]",
      status: "نشط",
      statusColor: "text-[#d8a63c]",
      align: "right",
    },
    {
      id: 4,
      title: "العملاء غير المشتركين",
      value: "2,610",
      change: null,
      changeColor: "",
      icon: <HiOutlineUserGroup size={28} />,
      iconColor: "text-[#d8a63c]",
      status: "غير نشط",
      statusColor: "text-slate-500",
      align: "right",
    },
  ];
  const clients = [
    {
      id: 1,
      name: "احمد محمد",
      email: "ahmed.f@example.com",
      phone: "0122938384",
      plan: "الاحترافية",
      subscriptionStatus: "نشط",
      registeredAt: "12 أكتوبر 2023",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: 2,
      name: "ميدو امام",
      email: "mido.q@mail.sa",
      phone: "0122938384",
      plan: "لا يوجد",
      subscriptionStatus: "لم يشترك",
      registeredAt: "15 أكتوبر 2023",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: 3,
      name: "محمد علي",
      email: "m.amoudi@biz.com",
      phone: "0122938384",
      plan: "الأساسية",
      subscriptionStatus: "منتهي",
      registeredAt: "20 سبتمبر 2023",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80",
    },
  ];

  


 

  const statusClasses2 = {
    active: "bg-[#123c2b] text-[#63d39b]",
    cancelled: "bg-[#4a1616] text-[#ff8e8e]",
    suspended: "bg-[#4a1616] text-[#ff8e8e]",
    expired: "bg-[#4a1616] text-[#ff8e8e]",
    pending: "border border-[#b9973d]/30 bg-[#b9973d]/10 text-[#f2be42]",
  };

  return (
    <>
      <div dir="rtl" className="  px-6 py-10 md:px-10">
        <div className="mx-auto max-w-400">
          <div className="mb-10 text-right">
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">
              إدارة العملاء
            </h1>
            <p className="mt-3 text-lg text-white/75">
              عرض ومتابعة جميع العملاء المسجلين من الموقع
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] border border-white/5 bg-[linear-gradient(90deg,#132740_0%,#11253f_100%)] px-7 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="text-right">
                    {item.change ? (
                      <div
                        className={`flex items-center justify-end gap-1 text-lg font-bold ${item.changeColor}`}
                      >
                        <span>{item.change}</span>
                        <span>↗</span>
                      </div>
                    ) : (
                      <div
                        className={`flex items-center justify-end gap-1 text-lg font-medium ${item.statusColor}`}
                      >
                        <span>{item.status}</span>
                        <span>⊙</span>
                      </div>
                    )}
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2b3540]/70">
                    <span className={item.iconColor}>{item.icon}</span>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="mb-2 text-[17px] font-semibold text-white/95 md:text-[18px]">
                    {item.title}
                  </h3>
                  <div className="text-[34px] font-extrabold leading-none text-white md:text-[38px]">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div dir="rtl" className=" p-4 md:p-5">
        <div className="overflow-hidden rounded-[18px] border border-white/5 bg-[linear-gradient(180deg,#12233d_0%,#101f36_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
          <div className="px-5 pt-4 md:px-6 md:pt-4">
            <div className="mb-4 flex flex-col-reverse gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-130">
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الإيميل أو رقم الهاتف..."
                  className="h-9.5 w-full rounded-xl border border-white/5 bg-[#1b2b43] pr-10 pl-4 text-[11px] text-white/85 placeholder:text-white/25 outline-none transition focus:border-white/10"
                />
                <FiSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[14px] text-white/25" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex h-9 min-w-21.5 items-center justify-center gap-1.5 rounded-xl bg-[#1b2b43] px-3 text-[11px] font-medium text-white/65 transition hover:bg-[#243752]">
                  <FiCalendar className="text-[13px]" />
                  <span>التاريخ</span>
                </button>

                <button className="flex h-9 min-w-24 items-center justify-center rounded-xl bg-[#1b2b43] px-3 text-[11px] font-medium text-white/65 transition hover:bg-[#243752]">
                  حالة الاشتراك
                </button>

                <button className="flex h-9 min-w-20.5 items-center justify-center rounded-xl bg-[#1b2b43] px-3 text-[11px] font-medium text-white/65 transition hover:bg-[#243752]">
                  كل الباقات
                </button>
              </div>


            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-245">
              <div className="grid grid-cols-7 border-b border-white/5 px-5 py-3 text-[11px] font-bold text-white/90 md:px-6">
                <div className="text-right">الاسم</div>
                <div className="text-right">الإيميل</div>
                <div className="text-right">رقم الهاتف</div>
                <div className="text-right">الباقة</div>
                <div className="text-right">حالة الاشتراك</div>
                <div className="text-right">تاريخ التسجيل</div>
                <div className="text-right">الإجراءات</div>
              </div>

              <div>
                {data?.data?.offices?.map((client) => (
                  <div
                    key={client.id}
                    className="grid grid-cols-7 items-center border-b border-white/5 px-5 py-4 transition hover:bg-white/2 md:px-6"
                  >
                    <div className="flex items-center justify-start gap-3">

                      <span className="text-[12px] font-semibold text-white/95">
                        {client.name}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#d4deed]">
                      {client.email}
                    </div>

                    <div className="text-[11px] text-[#d4deed]">
                      {client.phone}
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-4 py-1.5 bgre text-xs font-bold border border-white/10 bg-white/5 text-white/90
                          }`}
                      >
                        {client.subscription?.planSlug}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${statusClasses2[client.subscription.status]
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusClasses2[client.subscription.status]
                            }`}
                        />
                        {client.subscription?.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-white/80">
                      {formatDate(client.subscription?.startDate)}              
                            </div>

                    <div className="  text-white/60">
                     <Link to={`/ClientMangment/OfficeProfile/${client._id}`} >
                      <button className="transition hover:text-white cursor-pointer">
                        <FiEye size={14} />
                      </button>
                     </Link>
                      {/* <button className="transition hover:text-white cursor-pointer">
                        <FiEdit2 size={13} />
                      </button> */}
                      {/* <button className="transition hover:text-[#ff7b7b] cursor-pointer">
                        <FiTrash2 size={13} />
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>)
}

export default ClientMangment