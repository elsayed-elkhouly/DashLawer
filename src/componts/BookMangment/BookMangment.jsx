import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { HiOutlineCalendar, HiOutlineCheck, HiOutlineCheckCircle, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineEye, HiOutlinePencil, HiOutlineXCircle } from 'react-icons/hi';
import { HiOutlineCalendarDays, HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import Cookies from 'js-cookie';
import api from '../../api/axios';
import {

    HiOutlinePhone,
    HiOutlineEnvelope,

    HiOutlineUser,
    HiOutlineBars3BottomRight,
} from "react-icons/hi2";

const BookMangment = () => {
   
    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("كل الحجوزات");
    const [open, setOpen] = useState(false);
    const [appointDetails, setAppointDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const reservations = [
        {
            id: 1,
            name: "محمد كامل",
            phone: "050XXXXX99",
            email: "user@mail.com",
            service: "قضايا عائلية",
            date: "24 أكتوبر 2023",
            time: "10:30 صباحاً",
            status: "قيد الانتظار",
        },
        {
            id: 2,
            name: "ميدو امام",
            phone: "055XXXXX22",
            email: "Mido@mail.com",
            service: "قضايا عائلية",
            date: "25 أكتوبر 2023",
            time: "01:00 مساءً",
            status: "تم التأكيد",
        },
        {
            id: 3,
            name: "السيد",
            phone: "056XXXXX88",
            email: "Elsayed@mail.com",
            service: "قضايا الأحوال الشخصية",
            date: "26 أكتوبر 2023",
            time: "11:15 صباحاً",
            status: "ملغي",
        },
        {
            id: 4,
            name: "محمد علي",
            phone: "054XXXXX11",
            email: "Hamo@mail.com",
            service: "الاستشارات التجارية",
            date: "27 أكتوبر 2023",
            time: "09:00 مساءً",
            status: "مكتمل",
        },
    ];

    const statusClasses = {
        "CONFIRMED": "bg-emerald-500/20 text-emerald-400",
        "CANCELLED": "bg-red-500/20 text-red-400",
        "COMPLETED": "bg-blue-500/20 text-blue-400",
    };

    const filteredReservations = useMemo(() => {
        return reservations.filter((item) => {
            const matchesSearch =
                item.name.includes(search) ||
                item.phone.includes(search) ||
                item.email.toLowerCase().includes(search.toLowerCase()) ||
                item.service.includes(search);

            const matchesFilter =
                selectedFilter === "كل الحجوزات" || item.status === selectedFilter;

            return matchesSearch && matchesFilter;
        });
    }, [search, selectedFilter]);

    function getAppoint() {
        return api.get("/appointment/?page=1&limit=1");
    }
    const { data } = useQuery({
        queryKey: ["Slots"],
        queryFn: getAppoint,
    });
    console.log(data);
    
    const stats = [
        {
            id: 1,
            title: "  تم الإلغاء",
            value: data?.data?.stats?.cancelled,
            subtitle: "الحجوزات الملغية",
            icon: <HiOutlineXCircle size={18} />,
            color: "text-red-400",
            border: "border-red-500/70",
        },
        {
            id: 2,
            title: "مؤكده",
            value: data?.data?.stats?.confirmed,
            subtitle: "الحجوزات المؤكدة",
            icon: <HiOutlineCheckCircle size={18} />,
            color: "text-emerald-400",
            border: "border-emerald-500/70",
        },
        {
            id: 3,
            title: "  هذا الشهر",
            value: data?.data?.stats?.thisMonth,
            subtitle: "حجوزات اليوم",
            icon: <HiOutlineCalendarDays size={18} />,
            color: "text-blue-400",
            border: "border-blue-500/70",
        },
        {
            id: 4,
            title: "هذا العام",
            value: data?.data?.stats?.thisYear,
            subtitle: "إجمالي الحجوزات",
            icon: <HiOutlineCalendar size={18} />,
            color: "text-amber-400",
            border: "border-amber-500/70",
        },
    ];

    async function getAppointByid(id) {
        try {
            setOpen(true);
            setLoading(true);

            const res = await api.get(`appointment/${id}`, {
                headers: {
                    authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            setAppointDetails(res?.data?.appointment);
            

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
 
    

    // console.log(data?.data?.appointments);
    function formatDateTimeLocal12(isoString) {
        const date = new Date(isoString);

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    }
    async function CancelBook(id) {
        const res = await api.patch(`/appointment/${id}/cancel`, null
        )
        

    }
    return (
        <>
            <div dir="rtl" className="w-full  p-6 text-white">
                <div className="mb-6 text-right">
                    <h1 className="text-3xl font-bold">إدارة الحجوزات</h1>
                    <p className="mt-1 text-sm text-[#8EA3BF]">
                        عرض وإدارة جميع المواعيد التي تم حجزها خلال الموقع
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[...stats].reverse().map((item) => (
                        <div
                            key={item.id}
                            className={`rounded-2xl border ${item.border} bg-[#0d2139] px-6 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)]`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="text-right">
                                    <p className="text-sm text-[#8EA3BF]">{item.title}</p>
                                    <h3 className="mt-2 text-4xl font-extrabold leading-none text-white">
                                        {item.value}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#8EA3BF]">{item.subtitle}</p>
                                </div>
                                <div className={`mt-1 ${item.color}`}>{item.icon}</div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <section>
                <div dir="rtl" className="  p-6 text-white">
                    <div className="mx-auto max-w-7xl">
                        {/* Top Controls */}
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="relative w-full md:max-w-[280px]">
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#0d2139] px-4 text-sm text-white outline-none"
                                >
                                    <option>كل الحجوزات</option>
                                    <option>قيد الانتظار</option>
                                    <option>تم التأكيد</option>
                                    <option>ملغي</option>
                                    <option>مكتمل</option>
                                </select>
                            </div>

                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="بحث باسم العميل أو رقم الهاتف..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0d2139] pr-11 pl-4 text-sm text-white outline-none placeholder:text-[#8EA3BF]"
                                />
                                <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8EA3BF]" size={18} />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#081b31]">
                            <div className="grid grid-cols-12 bg-white/3 px-5 py-4 text-xs text-[#8EA3BF]">
                                <div className="col-span-2">الاسم الكامل</div>
                                <div className="col-span-2">رقم الهاتف</div>
                                <div className="col-span-3">البريد الإلكتروني</div>
                                <div className="col-span-1">نوع الخدمة</div>
                                <div className="col-span-2">التاريخ والوقت</div>
                                <div className="col-span-1">الحالة</div>
                                <div className="col-span-1">الإجراءات</div>
                            </div>

                            {data?.data?.appointments?.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-12 items-center border-t border-white/5 px-5 py-4 text-sm"
                                >
                                    <div className="col-span-2 font-medium text-white">{item.fullName}</div>
                                    <div className="col-span-2 text-[#9BB0C9]">{item.phone}</div>
                                    <div className="col-span-3 text-[#9BB0C9]">{item.email}</div>
                                    <div className="col-span-1 text-[#D6DFEC]">{item.caseType.name}</div>

                                    <div className="col-span-2">
                                        <p className="text-white">{formatDateTimeLocal12(item.slot.startAt)}</p>
                                        <p className="mt-1 text-xs text-[#D7AE46]">{item.time}</p>
                                    </div>

                                    <div className="col-span-1">
                                        <span
                                            className={`inline-flex rounded-full  py-1 text-xs ${statusClasses[item.status]}`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="col-span-1 flex justify-start gap-3 text-[#8EA3BF]">
                                        <button
                                            onClick={() => getAppointByid(item.id)}
                                            className="transition hover:text-white cursor-pointer">
                                            <HiOutlineEye size={14} />
                                        </button>

                                        <button
                                            onClick={() => { CancelBook(item.id) }}
                                            className="transition hover:text-red-400 cursor-pointer">
                                            <HiOutlineXMark size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Footer */}
                            {/* <div className="flex items-center justify-between border-t border-white/5 px-5 py-4">
                                <div className="flex items-center gap-3 text-sm text-[#8EA3BF]">
                                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                                        <HiOutlineChevronRight size={16} />
                                    </button>
                                    <span>1 / 31</span>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                                        <HiOutlineChevronLeft size={16} />
                                    </button>
                                </div>

                                <p className="text-xs text-[#8EA3BF]">
                                    عرض 4 من إجمالي 124 حجز
                                </p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4 sm:px-4 sm:py-6">
                    <div
                        dir="rtl"
                        className="
                relative w-full
                max-w-90 sm:max-w-107.5 md:max-w-120
                max-h-[92vh] overflow-y-auto
                rounded-[20px] border border-[#22304d]
                bg-[#0d1830]
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
            "
                    >
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute cursor-pointer left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            ✕
                        </button>

                        {loading ? (
                            <div className="flex min-h-105 sm:min-h-125 items-center justify-center px-4 text-center text-5xl text-white">
                                <span className="loading loading-infinity loading-xl text-[#C9A14A] "></span>                </div>
                        ) : appointDetails ? (
                            <div className="p-4 sm:p-5 md:p-6 text-white">
                                {/* معلومات العميل */}
                                <div className="mb-6">
                                    <h3 className="mb-4 text-right text-[13px] sm:text-[14px] font-bold text-[#d8a83d]">
                                        معلومات العميل
                                    </h3>

                                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                                        <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-[#3d4b68] bg-[#13203b]">
                                            <HiOutlineUser className="text-[#d8a83d]" size={18} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-[18px] sm:text-[22px] font-bold leading-none text-white ">
                                                {appointDetails?.fullName || "غير متوفر"}
                                            </h2>

                                            <p className="mt-2 text-[12px] sm:text-[14px] text-[#9aa7c2]">
                                                عميل منذ{" "}
                                                {appointDetails?.createdAt
                                                    ? new Date(appointDetails.createdAt).getFullYear()
                                                    : "----"}
                                            </p>

                                            <div className="mt-4 space-y-3 text-[13px] sm:text-[15px] text-[#d7ddee]">

                                                <div className="flex  items-center justify-start gap-2 ">
                                                    <span className="break-all">
                                                        {appointDetails?.phone || "غير متوفر"}
                                                    </span>
                                                    <HiOutlinePhone
                                                        className="shrink-0 text-[#8f9ab4]"
                                                        size={14}
                                                    />
                                                </div>

                                                <div className="flex  items-center justify-start gap-2 ">
                                                    <span className="break-all">
                                                        {appointDetails?.email || "غير متوفر"}
                                                    </span>
                                                    <HiOutlineEnvelope
                                                        className="shrink-0 text-[#8f9ab4]"
                                                        size={14}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5 border-t border-[#1d2944]" />

                                {/* بيانات الموعد */}
                                <div>
                                    <h3 className="mb-4 text-right text-[13px] sm:text-[14px] font-bold text-[#d8a83d]">
                                        بيانات الموعد
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                                        <div className="rounded-2xl  border border-[#24314d] bg-[#101d38] px-4 py-4 text-right min-h-[96px]">
                                            <p className="mb-2 text-[11px] sm:text-[12px] text-[#8f9ab4]">
                                                نوع الخدمة
                                            </p>
                                            <p className="text-[18px] sm:text-[20px] font-bold leading-[1.4] text-white break-words">
                                                {appointDetails?.caseType?.name || "غير متوفر"}
                                            </p>
                                        </div>


                                    </div>

                                    <div className="mt-3 rounded-[16px] border border-[#24314d] bg-[#101d38] px-4 py-4 sm:px-5 text-right">
                                        <div className="mb-2 flex items-center justify-end gap-2">
                                            <HiOutlineCalendarDays
                                                className="shrink-0 text-[#d8a83d]"
                                                size={15}
                                            />
                                            <p className="text-[11px] sm:text-[12px] text-[#8f9ab4]">
                                                التاريخ والوقت
                                            </p>
                                        </div>

                                        <p className="text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-[1.6] text-white break-words">
                                            {appointDetails?.slot?.startAt
                                                ? new Date(appointDetails.slot.startAt).toLocaleString(
                                                    "ar-EG",
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )
                                                : "غير متوفر"}
                                        </p>
                                    </div>

                                    <div className="mt-5 mb-3 flex items-center justify-end gap-2">
                                        <HiOutlineBars3BottomRight
                                            className="shrink-0 text-[#d8a83d]"
                                            size={15}
                                        />
                                        <h4 className="text-[15px] sm:text-[17px] font-bold text-white">
                                            وصف القضية / الموضوع
                                        </h4>
                                    </div>

                                    <div className="rounded-[18px] border border-[#24314d] bg-[#101d38] px-4 py-4 sm:px-5 text-right text-[13px] sm:text-[14px] leading-7 sm:leading-8 text-[#dce3f3] break-words">
                                        {appointDetails?.description || "لا يوجد وصف"}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-[420px] sm:min-h-[500px] items-center justify-center px-4 text-center text-sm text-red-400">
                                لا يوجد بيانات
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    )
}

export default BookMangment