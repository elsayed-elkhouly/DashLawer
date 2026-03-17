import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';
import { HiOutlineDocument, HiOutlineDocumentText, HiOutlineFolderOpen, HiOutlineNoSymbol, HiOutlinePencil, HiOutlinePlusCircle, HiOutlinePrinter } from 'react-icons/hi2';
import { FaRegFilePdf, FaRegFileWord } from 'react-icons/fa';

const CaseDetails = () => {

    const { id } = useParams()
    const queryClient = useQueryClient();
    function getCaseDetails() {
        return axios.get(`https://lawersystem-production.up.railway.app/LegalCase/${id}`, {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,
            }
        })
    }
    const { data, error } = useQuery({
        queryKey: ["CaseDetails"],
        queryFn: getCaseDetails,
    });
    console.log(data?.data);



    return (
        <>
            {/* // hedaer */}
            <div className="w-full bg-[#071a31] px-6 py-5 text-white" dir="rtl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="text-right">
                        {/*  */}
                        <div className="mb-2 flex items-center justify-end gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                تفاصيل القضية
                            </h1>

                            <span className="inline-flex items-center rounded-full border border-[#2b3b56] bg-[#16263f] px-3 py-1 text-xs font-medium text-[#d3a53d]">
                                #882-2024
                            </span>
                        </div>

                        <p className="text-sm text-[#7f93ad]">
                            تاريخ الإنشاء: 14 أكتوبر 2023
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex h-11 items-center gap-2 rounded-full outline-0  bg-[#d3a53d] px-5 text-sm font-semibold text-[#0b1830] transition hover:opacity-90"
                        >
                            <HiOutlinePencil size={16} />
                            تعديل القضية
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#7d6524] bg-transparent px-5 text-sm font-medium text-[#d3a53d] transition hover:bg-[#12233f]"
                        >
                            <HiOutlinePlusCircle size={16} />
                            إضافة جلسة
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#7b2334] bg-transparent px-5 text-sm font-medium text-[#ff5d7d] transition hover:bg-[#1a1321]"
                        >
                            <HiOutlineNoSymbol size={16} />
                            إغلاق القضية
                        </button>

                        <button
                            type="button"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#243752] bg-transparent text-[#a7bad2] transition hover:bg-[#12233f] hover:text-white"
                        >
                            <HiOutlinePrinter size={18} />
                        </button>
                    </div>
                </div>
            </div>
            {/* about cases */}
            <div className="w-full rounded-2xl border border-[#1a2d47] bg-[#09172b] px-6 py-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]" dir="rtl">
                <div className="grid grid-cols-4 gap-y-6 md:grid-cols-5 md:gap-7">
                    <div className="text-right">
                        <p className="mb-2 text-xs font-medium text-[#7f93ad]">نوع القضية</p>
                        <h3 className="text-sm font-semibold text-white">قضية عقارية</h3>
                    </div>

                    <div className="text-right">
                        <p className="mb-2 text-xs font-medium text-[#7f93ad]">حالة القضية</p>
                        <span className="inline-flex items-center rounded-full border border-[#244a7a] bg-[#0f2542] px-3 py-1 text-xs font-medium text-[#6aa8ff]">
                            قيد النظر
                        </span>
                    </div>

                    <div className="text-right">
                        <p className="mb-2 text-xs font-medium text-[#7f93ad]">المحامي المسؤول</p>
                        <h3 className="text-sm font-semibold text-[#d3a53d]">أ. محمد كمال</h3>
                    </div>

                    <div className="text-right">
                        <p className="mb-2 text-xs font-medium text-[#7f93ad]">المحكمة</p>
                        <h3 className="text-sm font-semibold text-white">المحكمة العامة</h3>
                    </div>

                    <div className="text-right">
                        <p className="mb-2 text-xs font-medium text-[#7f93ad]">المدينة</p>
                        <h3 className="text-sm font-semibold text-white">كفر الدوار</h3>
                    </div>

                    <div className="text-right">
                        <p className="mb-2 text-xs font-medium text-[#7f93ad]">تاريخ الفتح</p>
                        <h3 className="text-sm font-semibold text-white">2025-10-14</h3>
                    </div>
                    <div className="text-right">
                        <p className="mb-2 text-xs font-medium text-[#7f93ad]">اسم العميل</p>
                        <h3 className="text-sm font-semibold text-white">
                            شركة التطور العقاري المحدودة
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="mb-2 text-xs font-medium text-[#7f93ad]">درجة الأولوية</p>
                        <span className="inline-flex items-center rounded-full border border-[#5b2431] bg-[#24131a] px-3 py-1 text-xs font-medium text-[#ff6b88]">
                            عالية
                        </span>
                    </div>
                </div>
            </div>
            {/* وصف القضيه  */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3" dir="rtl">
                <div className="lg:col-span-2 rounded-2xl border border-[#1a2d47] bg-[#09172b] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                            <HiOutlineDocumentText size={18} className="text-[#d3a53d]" />
                            وصف القضية
                        </h2>
                    </div>

                    <div className="border-t border-[#13243b] pt-4">
                        <p className="text-sm leading-8 text-[#c8d6e8]">
                            نزاع حول حدود ملكية أرض تجارية في شمال غرب الرياض، حيث تدّعي الجهة
                            المدعية امتداد حدود الصكوك العقارية للمنطقة المجاورة لملكيتهم الخاصة
                            بالعميل.
                        </p>

                        <div className="mt-5 rounded-2xl border border-[#13243b] bg-[#0d1c33] px-5 py-4">
                            <h3 className="mb-2 text-sm font-semibold text-[#d3a53d]">
                                ملاحظات إضافية
                            </h3>
                            <p className="text-sm leading-7 text-[#8fa3bd]">
                                تم استلام التقارير الهندسية من المكتب الهندسي المعتمد، بانتظار رأي
                                فريق العمل بخصوص تحديث الملف.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#1a2d47] bg-[#09172b] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                            <HiOutlineFolderOpen size={18} className="text-[#d3a53d]" />
                            المستندات
                        </h2>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-2xl border border-[#13243b] bg-[#0d1c33] px-4 py-4 transition hover:bg-[#10203a]">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3d2b2f] bg-[#1b1620] text-[#ff5f7a]">
                                    <FaRegFilePdf size={16} />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">
                                        ملف الملكية الأصلي.pdf
                                    </p>
                                    <p className="mt-1 text-xs text-[#7f93ad]">
                                        MB 2.4 • اليوم
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[#243752] bg-[#0a1830] text-[#a7bad2] transition hover:bg-[#12233f] hover:text-white"
                            >
                                <HiOutlineDocument size={16} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-[#13243b] bg-[#0d1c33] px-4 py-4 transition hover:bg-[#10203a]">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#244a7a] bg-[#13233e] text-[#6aa8ff]">
                                    <FaRegFileWord size={16} />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">
                                        تقرير المحكمة.docx
                                    </p>
                                    <p className="mt-1 text-xs text-[#7f93ad]">
                                        MB 5.1 • 20 يوليو 2023
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[#243752] bg-[#0a1830] text-[#a7bad2] transition hover:bg-[#12233f] hover:text-white"
                            >
                                <HiOutlineDocument size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CaseDetails