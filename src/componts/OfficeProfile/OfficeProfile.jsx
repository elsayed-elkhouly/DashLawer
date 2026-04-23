import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { FiInfo, FiCreditCard, FiCopy } from "react-icons/fi";
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { FiBarChart2, FiFolder } from "react-icons/fi";


const OfficeProfile = () => {
    const { id } = useParams()

    function getOffice() {
        return api.get(`/super-admin/getOffice/${id}`)
    }

    const { data } = useQuery({
        queryKey: ["Office"],
        queryFn: getOffice
    })
    console.log(data?.data);
    const OfficeData = data?.data?.office || []

    const formatDate = (date) => {
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
        return `متبقي ${diffDays} يوم`;
    };
    const usersUsed = data?.data?.usersCount;
    const usersLimit = OfficeData?.features?.["users.max"];
    // const usersLimit = OfficeData?.features?.["storage.max"];
    const usersPercent =  data?.data?.usersCount;

    const storageUsed = OfficeData?.storageUsedBytes;
    const storageLimit = OfficeData?.features?.["storage.max"];
    const storagePercent = OfficeData?.storageUsedBytes;

    const filesCount = 154;
    return (
        <>
            <div
                dir="rtl"
                className="flex items-start justify-between rounded-[20px] bg-transparent px-6 py-6"
            >
                <div className="text-right">
                    <h1 className="text-[28px] font-extrabold leading-none text-white">
                        إدارة العملاء
                    </h1>
                    <p className="mt-3 text-[14px] font-medium text-white/70">
                        ادارة تفاصيل المكتب والاشتراك السحابي
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-lg border border-[#5a2430] bg-transparent px-5 py-2 text-[12px] font-medium text-[#d35b6c] transition hover:bg-[#5a2430]/10">
                        <FiTrash2 size={13} />
                        حذف
                    </button>

                    <button className="rounded-lg border border-white/10 bg-[#18263b] px-5 py-2 text-[12px] font-medium text-white/80 transition hover:bg-[#22324a]">
                        إيقاف المكتب
                    </button>

                    <button className="rounded-lg bg-[#d5aa43] px-5 py-2 text-[12px] font-bold text-[#1d2430] transition hover:bg-[#e4b84e]">
                        تعديل الاشتراك
                    </button>
                </div>
            </div>
            <div dir="rtl" className="min-h-screen  p-6 md:p-8">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2.15fr_1.05fr]">
                    {/* right card */}
                    <div className="rounded-[30px] border border-white/5 bg-[linear-gradient(90deg,#132740_0%,#11253f_100%)] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                        <div className="mb-10 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <FiInfo className="text-[22px] text-[#d9ab45]" />
                                <h2 className="text-[18px] font-extrabold md:text-[20px]">
                                    المعلومات الأساسية
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                            <div className="text-right">
                                <p className="mb-2 text-[14px] text-white/40">اسم المكتب</p>
                                <h3 className="text-[18px] font-semibold text-white leading-relaxed">
                                    {OfficeData.name}
                                </h3>
                            </div>

                            <div className="text-right">
                                <p className="mb-2 text-[14px] text-white/40">البريد الإلكتروني</p>
                                <h3 className="text-[18px] font-medium text-white">
                                    {OfficeData.email}              </h3>
                            </div>

                            <div className="text-right">
                                <p className="mb-2 text-[14px] text-white/40">رقم الهاتف</p>
                                <h3 className="text-[18px] font-medium text-white">
                                    {OfficeData.phone}              </h3>
                            </div>

                            <div className="text-right">
                                <p className="mb-2 text-[14px] text-white/40">تاريخ الإنشاء</p>
                                <h3 className="text-[16px] font-medium text-white/90">
                                    {OfficeData.createdAt}              </h3>
                            </div>
                        </div>

                        <div className="mt-12">
                            <p className="mb-3 text-[14px] text-white/40">SUBDOMAIN</p>

                            <div className="flex items-center justify-between rounded-[18px] border border-white/5 bg-[rgba(255,255,255,0.02)] px-5 py-5">
                                <div className="flex items-center gap-2 text-white/70">
                                    <FiCopy className="text-[18px]" />
                                    <button className="text-[14px] font-medium transition hover:text-white">
                                        نسخ الرابط
                                    </button>
                                </div>

                                <span className="text-[18px] font-medium text-[#d9ab45]">
                                    {OfficeData.subdomain}              </span>
                            </div>
                        </div>
                    </div>

                    {/* left card */}
                    <div className="rounded-[30px] border border-white/5 bg-[linear-gradient(90deg,#132740_0%,#11253f_100%)] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                        <div className="mb-10 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <FiCreditCard className="text-[22px] text-[#d9ab45]" />
                                <h2 className="text-[18px] font-extrabold md:text-[20px]">
                                    تفاصيل الاشتراك
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-0">
                            <div className="flex items-center justify-between border-b border-white/5 py-6">
                                <span className="text-[15px] text-white/45">الخطة الحالية</span>
                                <span className="text-[18px] font-medium text-white">
                                    {OfficeData.subscription?.planSlug}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-white/5 py-6">
                                <span className="text-[15px] text-white/45">تاريخ البداية</span>
                                <span className="text-[18px] font-medium text-white">
                                    {formatDate(OfficeData.subscription?.startDate)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-white/5 py-6">
                                <span className="text-[15px] text-white/45">تاريخ الانتهاء</span>
                                <span className="text-[18px] font-medium text-white">
                                    {formatDate(OfficeData.subscription?.endDate)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-6">
                                <span className="text-[15px] text-white/45">نوع الاشتراك</span>
                                <span className="inline-flex rounded-md bg-[#0d2138] px-3 py-1 text-[13px] font-bold text-[#d9ab45]">
                                    {OfficeData.subscription?.billingInterval}
                                </span>
                            </div>
                        </div>

                        <div className="relative mt-8 overflow-hidden rounded-[18px] bg-[linear-gradient(90deg,rgba(217,171,69,0.16)_0%,rgba(255,255,255,0.04)_100%)] px-6 py-7">
                            <div className="absolute -left-8 -top-5 h-24 w-24 rounded-full bg-white/5" />

                            <p className="mb-3 text-center text-[15px] text-white/60">
                                الأيام المتبقية
                            </p>

                            <div className="mb-4 text-center text-[#d9ab45]">
                                <span className="text-[56px] font-light leading-none">{getRemainingDays(OfficeData.subscription?.endDate)}</span>
                                <span className="mr-2 text-[28px] font-medium"></span>
                            </div>

                            <div className="h-1.5 w-full  overflow-hidden rounded-full bg-[#74674b]/50">
                                <div className="h-full w-[76%] rounded-full bg-[#d9ab45]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div dir="rtl" className="min-h-screen  p-6 md:p-8">
                <div className="rounded-[26px] border border-white/5 bg-[linear-gradient(90deg,#132740_0%,#11253f_100%)] px-8 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                    <div className="mb-10 flex items-center justify-center gap-2 text-white">
                        <FiBarChart2 className="text-[16px] text-[#d9ab45]" />
                        <h2 className="text-[18px] font-extrabold md:text-[20px]">
                            إحصائيات الاستخدام
                        </h2>
                    </div>

                    <div className="space-y-10">
                        <div>
                            <div className="mb-3 flex items-start justify-between">
                                <div className="text-left">
                                    <div className="text-[13px] text-[#d9ab45]">{usersPercent}%</div>
                                </div>

                                <div className="text-right">
                                    <p className="mb-1 text-[13px] text-white/45">عدد المستخدمين</p>
                                    <div className="text-[15px] text-white/95">
                                        <span className="text-[34px] font-light leading-none">
                                            {usersUsed}
                                        </span>
                                        <span className="mx-1 text-white/50">/</span>
                                        <span className="text-white/50">{usersLimit}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#22344d]">
                                <div
                                    className="h-full rounded-full bg-[#d9ab45]"
                                    style={{ width: `${usersPercent}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-3 flex items-start justify-between">
                                <div className="text-left">
                                    <div className="text-[13px] text-[#d9ab45]">{storagePercent}%</div>
                                </div>

                                <div className="text-right">
                                    <p className="mb-1 text-[13px] text-white/45">مساحة التخزين</p>
                                    <div className="text-[15px] text-white/95">
                                        <span className="text-[34px] font-light leading-none">
                                            {storageUsed}
                                        </span>
                                        <span className="mx-1 text-white/50">/</span>
                                        <span className="text-white/50">{storageLimit}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#22344d]">
                                <div
                                    className="h-full rounded-full bg-[#d9ab45]"
                                    style={{ width: `${storagePercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* <div className="mt-8 rounded-[16px] border border-white/5 bg-white/[0.02] px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#d9ab45]">
                                <FiFolder size={16} />
                            </div>

                            <div className="text-center">
                                <p className="text-[13px] text-white/45">عدد القضايا والملفات النشطة</p>
                                <div className="mt-1 text-[18px] font-medium text-white">
                                    {filesCount} ملف
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>


        </>
    )
}

export default OfficeProfile