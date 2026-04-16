import React from 'react'

import {
    HiOutlineCalendarDays,
    HiOutlineClock,
    HiOutlineMagnifyingGlass,
    HiOutlinePaperClip,
    HiOutlineCloudArrowUp,
    HiOutlineBellAlert,
    HiOutlineChevronDown,
    HiOutlineXMark,
    HiOutlineDocumentText,
} from "react-icons/hi2";
import api from '../../api/axios';
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useQuery } from '@tanstack/react-query';


const AddSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            date: "",
            time: "",
            type: "جلسة محكمة",
            city: "",
            circuit: "",
            courtName: "",
            assignedTo: "",
            team: [],
            notes: "",
        },
    });

    function getCaseDetails() {
        return api.get(`/LegalCase/${id}`, {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
    }

    const { data } = useQuery({
        queryKey: ["CaseDetails", id],
        queryFn: getCaseDetails,
    });

    const Case = data?.data?.case || {};

    function getUSers() {
        return api.get("/users", {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
    }

    const { data: Lawer } = useQuery({
        queryKey: ["Users"],
        queryFn: getUSers,
    });

    const lawyers =
        Lawer?.data?.users?.filter((user) => user.role === "LAWYER") || [];

    const onSubmit = async (formData) => {

        try {
            const startAt = `${formData.date}T${formData.time}:00`;

            const payload = {
                legalCase: id,
                type: formData.type,
                startAt,
                courtName: formData.courtName,
                city: formData.city,
                circuit: formData.circuit,
                notes: formData.notes,
                assignedTo: formData.assignedTo,
                team: Array.isArray(formData.team)
                    ? formData.team.flat().filter(Boolean)
                    : formData.team
                        ? [formData.team]
                        : [],
            };
            // console.log(formData.team);
            // console.log(payload);
            await api.post("/session/", payload, {
                headers: {
                    authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            toast.success("تم إنشاء الجلسة بنجاح");
            reset();
            navigate(-1);
        } catch (error) {
            console.log(error?.response?.data || error);
            toast.error(error?.response?.data?.message || "حدث خطأ أثناء إنشاء الجلسة");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-screen bg-[radial-gradient(circle_at_top,#0d2847_0%,#07192e_45%,#05111f_100%)] p-6 text-white"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-start justify-between">
                    <div className="text-right">
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            إضافة جلسة جديدة
                        </h1>
                        <p className="mt-2 text-sm text-[#8EA3BF]">
                            قم بإضافة جلسة جديدة وربطها بالقضية الخاصة بها بسهولة
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-2xl border border-white/10 px-6 py-3 text-sm text-[#a9b7cf] transition hover:bg-white/5 hover:text-white"
                        >
                            إلغاء
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-2xl bg-[#D7AE46] px-6 py-3 text-sm font-bold text-[#071a2f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <HiOutlineDocumentText size={16} />
                            {isSubmitting ? "جاري الحفظ..." : "حفظ الجلسة"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="space-y-6">
                        <div className="rounded-[26px] border border-white/5 bg-[#12243d] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-2xl font-bold">القضية</h3>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border border-[#D7AE46]/10 bg-[#0b1830] px-5 py-4">
                                <div className="text-right">
                                    <h4 className="text-lg font-bold">
                                        {Case?.client?.fullName || "-"}
                                    </h4>
                                    <h6 className="text-[#8EA3BF]">
                                        الوصف :{" "}
                                        <span className="text-white">{Case?.description || "-"}</span>
                                    </h6>
                                    <p className="mt-1 text-sm text-[#8EA3BF]">
                                        قضية رقم {Case?.caseNumber || "-"} -{" "}
                                        {Case?.caseType?.name || "-"}
                                    </p>
                                </div>

                                <div className="rounded-full bg-[#D7AE46]/15 px-4 py-1 text-sm text-[#D7AE46]">
                                    {Case?.status || "-"}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[26px] border border-white/5 bg-[#12243d] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                            <div className="mb-6 flex items-center justify-between">
                                <HiOutlineCalendarDays className="text-[#D7AE46]" size={18} />
                                <h3 className="text-2xl font-bold">تفاصيل الجلسة</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm text-[#93a7c3]">
                                        تاريخ الجلسة
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            {...register("date", {
                                                required: "تاريخ الجلسة مطلوب",
                                            })}
                                            className="h-14 w-full rounded-2xl border border-white/5 bg-[#07142a] px-4 text-sm text-white outline-none"
                                        />
                                        <HiOutlineCalendarDays
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7186a5]"
                                            size={18}
                                        />
                                    </div>
                                    {errors.date && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.date.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-[#93a7c3]">
                                        وقت الجلسة
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            {...register("time", {
                                                required: "وقت الجلسة مطلوب",
                                            })}
                                            className="h-14 w-full rounded-2xl border border-white/5 bg-[#07142a] px-4 text-sm text-white outline-none"
                                        />
                                        <HiOutlineClock
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7186a5]"
                                            size={18}
                                        />
                                    </div>
                                    {errors.time && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.time.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-[#93a7c3]">
                                        نوع الجلسة
                                    </label>
                                    <select
                                        {...register("type", {
                                            required: "نوع الجلسة مطلوب",
                                        })}
                                        className="h-14 w-full rounded-2xl border border-white/5 bg-[#07142a] px-4 text-sm text-white outline-none"
                                    >
                                        <option value="نيابة">نيابة</option>
                                        <option value="جلسة محكمة">جلسة محكمة</option>
                                        <option value="جلسة استماع">جلسة استماع</option>
                                        <option value="اجتماع">اجتماع</option>
                                        <option value="مكالمة">مكالمة</option>
                                        <option value="أخرى">أخرى</option>
                                    </select>
                                    {errors.type && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.type.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-[#93a7c3]">
                                        المدينه
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="مثال: البحيره كفر الدوار"
                                        {...register("city", {
                                            required: "المدينة مطلوبة",
                                        })}
                                        className="h-14 w-full rounded-2xl border border-white/5 bg-[#07142a] px-4 text-sm text-white outline-none"
                                    />
                                    {errors.city && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.city.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-[#93a7c3]">
                                        مكان الدائرة
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="مثال: قسم رمل اول"
                                        {...register("circuit", {
                                            required: "مكان الدائرة مطلوب",
                                        })}
                                        className="h-14 w-full rounded-2xl border border-white/5 bg-[#07142a] px-4 text-sm text-white outline-none"
                                    />
                                    {errors.circuit && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.circuit.message}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm text-[#93a7c3]">
                                        اسم المحكمة
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ادخل اسم المحكمة بالكامل..."
                                        {...register("courtName", {
                                            required: "اسم المحكمة مطلوب",
                                        })}
                                        className="h-14 w-full rounded-2xl border border-white/5 bg-[#07142a] px-4 text-sm text-white outline-none placeholder:text-[#667a98]"
                                    />
                                    {errors.courtName && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.courtName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                                        المحامي المسؤول
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register("assignedTo", {
                                                required: "المحامي المسؤول مطلوب",
                                            })}
                                            dir="rtl"
                                            className="h-11 w-full appearance-none rounded-xl border border-[#132949] bg-[#07162d] pr-4 pl-10 text-right text-sm text-white outline-none transition focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                                        >
                                            <option value="">اختر المحامي المسؤول</option>

                                            {lawyers.map((user) => (
                                                <option key={user._id} value={user._id}>
                                                    {user.UserName}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#6f86a6]">
                                            <HiOutlineChevronDown size={18} />
                                        </span>
                                    </div>
                                    {errors.assignedTo && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.assignedTo.message}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                                            فريق القضية
                                        </label>

                                        <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-[#132949] bg-[#07162d] p-3">
                                            {Lawer?.data?.users?.map((user) => (
                                                <label
                                                    key={user._id}
                                                    className="flex cursor-pointer items-center gap-2 text-sm text-white"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={user._id}
                                                        {...register("team")}
                                                        className="h-4 w-4 accent-[#d4a63d]"
                                                    />
                                                    <span>{user.UserName}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[26px] border border-white/5 bg-[#12243d] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                            <div className="mb-5 flex items-center justify-between">
                                <HiOutlineDocumentText className="text-[#D7AE46]" size={18} />
                                <h3 className="text-2xl font-bold">ملاحظات الجلسة</h3>
                            </div>

                            <textarea
                                {...register("notes")}
                                rows={5}
                                placeholder="اكتب أي ملاحظات خاصة بالجلسة..."
                                className="w-full rounded-2xl border border-white/5 bg-[#07142a] px-4 py-4 text-sm text-white outline-none placeholder:text-[#667a98]"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[26px] border border-white/5 bg-[#12243d] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                            <div className="mb-3 flex items-center justify-between">
                                <HiOutlineBellAlert className="text-[#D7AE46]" size={18} />
                                <h3 className="text-lg font-bold text-[#D7AE46]">
                                    تذكير تلقائي
                                </h3>
                            </div>
                            <p className="text-sm leading-7 text-[#8EA3BF]">
                                سيتم إرسال تنبيه إلى العميل ومسؤول القضية قبل موعد الجلسة بـ
                                24 ساعة عبر رسالة نصية.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddSession;

