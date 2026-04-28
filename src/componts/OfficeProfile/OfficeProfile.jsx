import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { FiInfo, FiCreditCard, FiCopy } from "react-icons/fi";
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { FiBarChart2, FiFolder } from "react-icons/fi";
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { HiOutlineXCircle } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


const OfficeProfile = () => {
    const { id } = useParams()
    const [showEditSubscription, setShowEditSubscription] = useState(false);
    const queryClient = useQueryClient();

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
    const usersPercent = data?.data?.usersCount;

    const storageUsed = OfficeData?.storageUsedBytes;
    const storageLimit = OfficeData?.features?.["storage.max"];
    const storagePercent = OfficeData?.storageUsedBytes;
    const isPending = OfficeData?.subscription?.status === "pending";

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset
    } = useForm({
        defaultValues: {
            planSlug: "",
            status: "active",
            billingInterval: "",
            endDate: "",
        },
    });
    useEffect(() => {
        if (OfficeData?.subscription) {
            reset({
                planSlug: OfficeData.subscription.planSlug,
                status: "active",
                billingInterval: OfficeData.subscription.billingInterval || "yearly",
                endDate: isPending
        ? ""
        : formatDate2(OfficeData.subscription.endDate),
            });
        }
    }, [OfficeData, reset]);
    const formatDate2 = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
    };
    const selectedPlan = watch("planSlug");
    const subscriptionType = watch("billingInterval");
    const endDate = watch("endDate");
    const formatViewDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-GB");
    };
    const onSubmitSubscription = async (data) => {
  try {
    const isPending = OfficeData?.subscription?.status === "pending";

    const payload = {
      ...data,
      ...(isPending && { endDate: undefined }), // 👈 هنا السحر
    };

    const res = await api.put(
      `/super-admin/updateOfficeSubscription/${id}`,
      payload
    );

    queryClient.invalidateQueries(["Office"]);

    console.log(res); // هتشوف endDate undefined

    toast.success(res.data.message);
    setShowEditSubscription(false);
  } catch (error) {
    console.log(error.response?.data);
  }
};
    async function stopOffice() {
        try {
            const res = await api.put(`/super-admin/toggleOfficeStatus/${id}`)
            console.log(res);
            queryClient.invalidateQueries({
                queryKey: ["Office"],
            });

        } catch (error) {
            console.log(error);

        }
    }
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

                    <button
                        onClick={stopOffice}
                        className={`rounded-lg border px-5 py-2 text-[12px] font-medium transition ${OfficeData?.isActive
                            ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            }`}
                    >
                        {OfficeData?.isActive ? "إيقاف المكتب" : "تشغيل المكتب"}
                    </button>

                    <button
                        onClick={() => setShowEditSubscription(true)}
                        className="rounded-lg bg-[#d5aa43] px-5 py-2  cursor-pointer text-[12px] font-bold text-[#1d2430] transition hover:bg-[#e4b84e]"
                    >
                        تعديل الاشتراك
                    </button>
                    {showEditSubscription && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                            <form
                                onSubmit={handleSubmit(onSubmitSubscription)}
                                dir="rtl"
                                className="relative w-full max-w-140 rounded-[18px] border border-white/10 bg-[#07182b] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowEditSubscription(false)}
                                    className="absolute left-5 top-5 text-white/50  cursor-pointer transition hover:text-white"
                                >
                                    <HiOutlineXCircle size={20} />
                                </button>

                                <div className="mb-6 text-right">
                                    <h2 className="text-[22px] font-extrabold text-white">
                                        تعديل الاشتراك
                                    </h2>
                                    <p className="mt-1 text-[12px] text-white/45">
                                        تغيير خطة الاشتراك ومدته للاشتراك الحالي
                                    </p>
                                </div>

                                <div className="mb-5">
                                    <p className="mb-3 text-right text-[13px] text-white/75">
                                        اختر الباقة
                                    </p>

                                    <div className="grid grid-cols-3 gap-3">
                                        {["الباقة-الأساسية", "الباقة-الاحترافية", "باقة-المؤسسات"].map((plan) => (
                                            <button
                                                key={plan}
                                                type="button"
                                                onClick={() => setValue("planSlug", plan)}
                                                className={`rounded-xl border p-4 text-right transition ${selectedPlan === plan
                                                    ? "border-[#d5aa43] bg-[#d5aa43]/10"
                                                    : "border-white/8 bg-white/3 hover:bg-white/6"
                                                    }`}
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-[10px] text-white/45">
                                                        {plan}
                                                    </span>

                                                    <HiOutlineCheckCircle
                                                        className={
                                                            selectedPlan === plan ? "text-[#d5aa43]" : "text-white/40"
                                                        }
                                                        size={16}
                                                    />
                                                </div>

                                                <h3 className="text-[14px] font-bold">
                                                    {plan === "الباقة-الأساسية"
                                                        ? "الأساسية"
                                                        : plan === "الباقة-الاحترافية"
                                                            ? "الاحترافية"
                                                            : "المؤسسات"}
                                                </h3>

                                                <p className="mt-1 text-[11px] text-white/45">
                                                    {plan === "الباقة-الأساسية"
                                                        ? "للمكاتب الصغيرة"
                                                        : plan === "الباقة-الاحترافية"
                                                            ? "للمكاتب المتوسطة"
                                                            : "للشركات الكبيرة"}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-5 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="mb-2 text-right text-[13px] text-white/75">
                                            حالة الاشتراك
                                        </p>

                                        <select
                                            {...register("status")}
                                            className="h-10.5 w-full rounded-lg border border-white/8 bg-[#11243b] px-3 text-[12px] text-white outline-none"
                                        >
                                            <option value="active">Active (نشط)</option>
                                            <option value="suspended">suspended (غير نشط)</option>
                                            <option value="expired">expired (منتهي)</option>
                                            <option value="cancelled">cancelled (ملغي)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-right text-[13px] text-white/75">
                                            نوع الاشتراك
                                        </p>

                                        <div className="grid h-10.5 grid-cols-2 overflow-hidden rounded-lg bg-[#11243b] p-1">
                                            <button
                                                type="button"
                                                onClick={() => setValue("billingInterval", "yearly")}
                                                className={`rounded-md text-[12px] font-bold transition ${subscriptionType === "yearly"
                                                    ? "bg-[#d5aa43] text-[#1d2430]"
                                                    : "text-white/55"
                                                    }`}
                                            >
                                                سنويًا
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setValue("billingInterval", "monthly")}
                                                className={`rounded-md text-[12px] font-bold transition ${subscriptionType === "monthly"
                                                    ? "bg-[#d5aa43] text-[#1d2430]"
                                                    : "text-white/55"
                                                    }`}
                                            >
                                                شهريًا
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {OfficeData?.subscription?.status !== "pending" && (
                                    <div className="mb-5">
                                        <p className="mb-2 text-right text-[13px] text-white/75">
                                            تاريخ انتهاء الاشتراك
                                        </p>

                                        <input
                                            type="date"
                                            {...register("endDate")}
                                            className="h-10.5 w-full rounded-lg border border-white/8 bg-[#11243b] px-3 text-[12px] text-white outline-none"
                                        />
                                    </div>
                                )}

                                <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#d5aa43]/20 bg-[#d5aa43]/15 p-4 text-right">
                                    <HiOutlineExclamationTriangle
                                        className="shrink-0 text-[#d5aa43]"
                                        size={22}
                                    />
                                    <p className="text-[12px] leading-6 text-[#d5aa43]">
                                        سيتم تحديث تفاصيل الاشتراك للمكتب بناءً على الباقة الجديدة.
                                    </p>
                                </div>
                                <div className="mb-6 rounded-xl border border-white/5 bg-white/3 p-4">
                                    <div className="mb-3 flex items-center justify-between text-[12px]">
                                        <span className="text-white/45">تغيير الباقة</span>

                                        <span className="font-bold text-white">
                                            {OfficeData?.subscription?.planSlug || "—"} ← {selectedPlan || "—"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-[12px]">
                                        <span className="text-white/45">تاريخ الانتهاء</span>

                                        <span className="font-bold text-white">
                                            {formatViewDate(OfficeData?.subscription?.endDate)} ←{" "}
                                            {formatViewDate(endDate)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-start gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditSubscription(false)}
                                        className="rounded-lg border border-white/10 px-6 py-2.5 text-[12px] font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                                    >
                                        إلغاء
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded-lg bg-[#d5aa43] px-6 py-2.5 text-[12px] font-extrabold text-[#1d2430] transition hover:bg-[#e4b84e]"
                                    >
                                        حفظ التعديلات
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div >
            </div >

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
                                    {formatDate(OfficeData.createdAt)}              </h3>
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
            <div dir="rtl" className="  p-6 md:p-8">
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