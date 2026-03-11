import { Download, Hammer, Icon, UserPlus, Users } from 'lucide-react'
import { GiGavel } from 'react-icons/gi'
import { MdGavel, MdOutlineAccountBalanceWallet } from 'react-icons/md'
import { MoreVertical, Eye, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Building2, UserRound } from "lucide-react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    Search, SlidersHorizontal,
    Pencil,
} from "lucide-react";
import Pagination from '../Pagination/Pagination';
import React, { useMemo, useState } from "react";
const Clients = () => {
    const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(2);

    const demoData = [
        {
            id: 1,
            name: "السيد",
            clientId: "108429384",
            type: "فرد",
            phone: "01237847846",
            casesCount: 8,
            openCases: 3,
            totalDue: 14200,
            status: "نشط",
            lastActivity: "منذ ساعتين",
            avatar: "JI",
            avatarClass: "bg-amber-500/20 text-amber-300",
        },
        {
            id: 2,
            name: "شركة آفاق للاستثمار",
            clientId: "4030123456",
            type: "شركة",
            phone: "01237847846",
            casesCount: 24,
            openCases: 9,
            totalDue: 85600,
            status: "نشط",
            lastActivity: "يوم أمس",
            avatar: "A",
            avatarClass: "bg-emerald-500/20 text-emerald-300",
        },
        {
            id: 3,
            name: "محمد كمال",
            clientId: "110293847",
            type: "فرد",
            phone: "01237847846",
            casesCount: 2,
            openCases: 0,
            totalDue: 0,
            status: "غير نشط",
            lastActivity: "منذ شهرين",
            avatar: "مح",
            avatarClass: "bg-slate-500/20 text-slate-300",
        },
        {
            id: 4,
            name: "مجموعة اللوجستية المتحدة",
            clientId: "1010887766",
            type: "شركة",
            phone: "01237847846",
            casesCount: 12,
            openCases: 5,
            totalDue: 42500,
            status: "نشط",
            lastActivity: "منذ 15 دقيقة",
            avatar: "U",
            avatarClass: "bg-zinc-100 text-zinc-700",
        },
    ];


    async function getClients(page = 1, search = "") {
        const res = await axios.get("https://lawersystem-production.up.railway.app/Client/all/", {
            params: {
                limit: 4,
                page,
                search,
            },
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,
            },
        });

        return res.data;
    }
    const { data: Clients, isLoading, isError } = useQuery({
        queryKey: ["Clients", currentPage, search],
        queryFn: () => getClients(currentPage, search),
    });
    const clientsList =
    Clients?.data?.clients?.map((client) => ({
        ...client,
        id: client._id,
        openCases: client.documents?.length || 0,
        totalDue: client.totalPaid || 0,
        status: client.isDeleted ? "محذوف" : "نشط",
        lastActivity: new Date(client.updatedAt).toLocaleDateString("ar-EG"),
        avatar: client.fullName?.slice(0, 2).toUpperCase() || "CL",
        avatarClass: "bg-sky-500/15 text-sky-300",
    })) || [];
    console.log(Clients?.clients);


    const formatCurrency = (value) => {
        if (!value) return "EGY 0";
        return new Intl.NumberFormat("en-US").format(value) + " EGY";
    };

    const statusClasses = {
        نشط: "text-emerald-400",
        "غير نشط": "text-slate-400",
    };

    const typeClasses = {
        فرد: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20",
        شركة: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20",
    };

  

const totalPages = Clients?.data?.totalPages || 1;
   

    


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            fullName: "",
            crNumber: "",
            email: "",
            phone: "",
            address: "",
            type: "قرد",
            notes: "",
        },
        mode: "onBlur",
    });
    const clientType = watch("type");
    const AddClient = async (data) => {
        const res = await axios.post(
            "https://lawersystem-production.up.railway.app/Client/create",
            data,
            {
                headers: {
                    authorization: `Bearer ${Cookies.get("token")}`,
                },
            }
        );

        return res.data;
    };
    const { data: stats } = useQuery({
        queryKey: ["Stats"],
        queryFn: getStats,
    });

    function getStats() {
        return axios.get("https://lawersystem-production.up.railway.app/Client/", {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,
            }
        })
    }
    const addClientMutation = useMutation({
        mutationFn: AddClient,
        onSuccess: () => {
            toast.success("done");
            queryClient.invalidateQueries({ queryKey: ["Stats"] });
            reset();
        },
        onError: (error) => {
            console.log("Full error:", error);
            console.log("Error response:", error.response);
            console.log("Error data:", error.response?.data);
            console.log("Error status:", error.response?.status);
            toast.error("something went wrong");
        },
    });
    const onSubmit = (data) => {
        addClientMutation.mutate(data);
    }

    const inputClass =
        "h-[38px] w-full rounded-full border border-white/5 bg-[#11243a] px-5 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-[#d3a63f] focus:ring-2 focus:ring-[#d3a63f]/20";

    const errorClass = "mt-2 text-xs text-red-400";
    if (isLoading) {
    return <div className="text-white p-6">جاري تحميل البيانات...</div>;
}

if (isError) {
    return <div className="text-red-400 p-6">حصل خطأ أثناء تحميل العملاء</div>;
}
    return (
        <>
            {/* header */}
            <section>
                <div className="w-full bg-[#0e1a2b] p-6 flex flex-row-reverse items-center justify-between">
                    {/* Right Side: Title */}
                    <h1 className="text-white text-[47px] font-bold">
                        إدارة العملاء
                    </h1>

                    {/* Left Side: Buttons */}
                    <div className="flex gap-4 items-center">
                        {/* Add New Customer Button */}
                        <button className="flex items-center gap-2 bg-[#c49a4d] hover:bg-[#b08940] text-[#0f172a] px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20"
                            onClick={() => document.getElementById('my_modal_5').showModal()}>  <UserPlus size={20} />
                            <span>إضافة عميل جديد</span></button>
                        <dialog id="my_modal_5" className="modal modal-middle">
                            <div className="modal-box  w-[92%] max-w-155 rounded-none border-0 bg-transparent p-0 shadow-none">
                                <div
                                    dir="rtl"
                                    className="overflow-hidden rounded-[6px] border border-white/10 bg-[#081a2f] text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                                >
                                    <div

                                        className="border-b border-[#22344a] px-4 py-4 sm:px-8">
                                        <div className="flex items-start justify-between">

                                            <div className="text-right">
                                                <h2 className="text-[20px] font-extrabold leading-none text-[#d5a93f] sm:text-[22px]">
                                                    إضافة عميل جديد
                                                </h2>
                                                <p className="mt-2 text-sm text-slate-400">
                                                    أدخل البيانات الأساسية لإنشاء ملف العميل في النظام
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("my_modal_5")?.close()}
                                                className="text-2xl text-slate-400 transition hover:text-white cursor-pointer hover:bg-slate-400 rounded-full flex items-center justify-center h-10 w-10"
                                            >
                                                ×
                                            </button>


                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-4 sm:px-5">
                                        <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                                    الاسم بالكامل (أو اسم المنشأة){" "}
                                                    <span className="text-[#d3a63f]">*</span>
                                                </label>
                                                <input
                                                    className={inputClass}
                                                    placeholder="مثال: شركة النجم الساطع"
                                                    {...register("fullName", {
                                                        required: "الاسم مطلوب",
                                                        minLength: {
                                                            value: 3,
                                                            message: "الاسم يجب أن يكون 3 أحرف على الأقل",
                                                        },
                                                    })}
                                                />
                                                {errors.fullName && (
                                                    <p className={errorClass}>{errors.fullName.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                                    رقم الهوية / السجل التجاري{" "}
                                                    <span className="text-[#d3a63f]">*</span>
                                                </label>
                                                <input
                                                    className={inputClass}
                                                    placeholder="10xxxxxxxx"
                                                    {...register("crNumber", {
                                                        required: "رقم الهوية أو السجل التجاري مطلوب",
                                                        pattern: {
                                                            value: /^\d{14}$/,
                                                            message: "يجب إدخال 14 رقمًا",
                                                        },
                                                    })}
                                                />
                                                {errors.crNumber && (
                                                    <p className={errorClass}>{errors.crNumber.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                                    البريد الإلكتروني
                                                </label>
                                                <input
                                                    className={inputClass}
                                                    placeholder="example@email.com"
                                                    {...register("email", {
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message: "صيغة البريد الإلكتروني غير صحيحة",
                                                        },
                                                    })}
                                                />
                                                {errors.email && (
                                                    <p className={errorClass}>{errors.email.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                                    رقم الجوال
                                                </label>
                                                <div className="flex rounded-full border border-white/5 bg-[#11243a] focus-within:border-[#d3a63f] focus-within:ring-2 focus-within:ring-[#d3a63f]/20">
                                                    <span className="flex items-center rounded-r-full border-l border-white/10 px-4 text-sm text-slate-400">
                                                        +01
                                                    </span>
                                                    <input
                                                        className="h-[38px] w-full rounded-l-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-slate-400"
                                                        placeholder="5xxxxxxxx"
                                                        {...register("phone", {
                                                            required: "رقم الهاتف مطلوب",
                                                            pattern: {
                                                                value: /^[0-9]{8,15}$/,
                                                                message: "رقم الجوال يجب أن يكون من 8 إلى 15 رقمًا",
                                                            },
                                                        })}
                                                    />
                                                </div>
                                                {errors.phone && (
                                                    <p className={errorClass}>{errors.phone.message}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                                    العنوان
                                                </label>
                                                <input
                                                    className={inputClass}
                                                    placeholder="الجيزة - كفر الزواد - سيدي شحاتة"
                                                    {...register("address", {
                                                        minLength: {
                                                            value: 5,
                                                            message: "العنوان قصير جدًا",
                                                        },
                                                    })}
                                                />
                                                {errors.address && (
                                                    <p className={errorClass}>{errors.address.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="mb-3 block text-sm font-medium text-slate-200">
                                                نوع العميل
                                            </label>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setValue("type", "شركة", { shouldValidate: true })}
                                                    className={`flex h-[48px] items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${clientType === "شركة"
                                                        ? "border-[#d3a63f] bg-[#d3a63f]/10 text-[#f1c55e]"
                                                        : "border-white/10 bg-[#11243a] text-white hover:border-white/20"
                                                        }`}
                                                >
                                                    <Building2 size={18} />
                                                    شركة / مؤسسة
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setValue("type", "فرد", { shouldValidate: true })
                                                    }
                                                    className={`flex h-[48px] items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${clientType === "فرد"
                                                        ? "border-[#d3a63f] bg-[#d3a63f]/10 text-[#f1c55e]"
                                                        : "border-white/10 bg-[#11243a] text-white hover:border-white/20"
                                                        }`}
                                                >
                                                    <UserRound size={18} />
                                                    فرد
                                                </button>
                                            </div>

                                            <input
                                                type="hidden"
                                                {...register("type", {
                                                    required: "نوع العميل مطلوب",
                                                })}
                                            />
                                            {errors.type && <p className={errorClass}>{errors.type.message}</p>}
                                        </div>

                                        <div className="mt-4">
                                            <label className="mb-2 block text-sm font-medium text-slate-200">
                                                ملاحظات إضافية
                                            </label>
                                            <textarea
                                                rows={3}
                                                className="w-full rounded-[24px] border border-white/5 bg-[#11243a] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 transition focus:border-[#d3a63f] focus:ring-2 focus:ring-[#d3a63f]/20"
                                                placeholder="أي تفاصيل مهمة تخص العميل..."
                                                {...register("notes", {
                                                    maxLength: {
                                                        value: 500,
                                                        message: "الحد الأقصى للملاحظات هو 500 حرف",
                                                    },
                                                })}
                                            />
                                            {errors.notes && (
                                                <p className={errorClass}>{errors.notes.message}</p>
                                            )}
                                        </div>

                                        <div className="mt-5 border-t border-[#22344a] pt-4">
                                            <div className="flex items-center gap-4">


                                                <button
                                                    type="submit"
                                                    disabled={addClientMutation.isPending}
                                                    className="rounded-full bg-[#d3a63f] px-8 py-2.5 text-sm font-extrabold text-[#0b1b2d] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
                                                >
                                                    {addClientMutation.isPending ? (
                                                        <>
                                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0b1b2d] border-t-transparent"></span>
                                                            جارٍ الحفظ...
                                                        </>
                                                    ) : (
                                                        "حفظ البيانات"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <form method="dialog" className="modal-backdrop bg-[#06111f]/70 backdrop-blur-[6px]">
                                <button>close</button>
                            </form>
                        </dialog>

                        {/* Export Excel Button */}
                        <button className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 text-slate-300 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all">
                            <Download size={18} />
                            <div className="flex gap-1 items-center">
                                <span>تصدير</span>
                                <span className="text-xs opacity-70">Excel</span>
                            </div>
                        </button>
                    </div>
                </div>
            </section>
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 lg:grid-cols-4  place-items-center">
                    <div className="w-full max-w-70 p-6 bg-[#141d2f] border border-[#EF444433] rounded-3xl shadow-xl flex flex-col justify-between h-49.25 hover:border-[#EF4444] duration-300">
                        <div className="flex justify-start">
                            <span className="text-[#EF4444] font-semibold text-sm">
                                متأخرات
                            </span>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="p-3 bg-[#EF44441A] rounded-3xl">
                                <MdOutlineAccountBalanceWallet className="w-6 h-6 text-[#EF4444]" />
                            </div>
                            <div className="text-right ">
                                <p className="text-slate-400 text-sm font-medium my-1 "> مستحقات معلقة </p>
                                <div className='flex items-center gap-2'>
                                    <p className=' text-[14px] text-[#64748B]'>Egy</p>
                                    <h2 className="text-white text-4xl font-bold tracking-tight py-2 ">
                                        {stats?.data?.stats?.pendingFees}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-70 p-6 bg-[#141d2f] border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between h-49.25 hover:border-amber-200 duration-300">
                        <div className="flex justify-start">
                            <span className="text-[#C9A34A] font-semibold text-sm">
                                هذا الشهر
                            </span>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="p-3 bg-[#C9A34A1A] rounded-3xl">
                                <GiGavel className="w-6 h-6 text-[#C9A34A]" />
                            </div>

                            <div className="text-right">
                                <p className="text-slate-400 text-sm font-medium mb-1 ">
                                    عملاء جدد
                                </p>
                                <h2 className="text-white text-4xl font-bold tracking-tight py-2 ">
                                    {stats?.data?.stats?.newThisMonth}                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-70 p-6 bg-[#141d2f] border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between h-49.25 hover:border-amber-200 duration-300">
                        <div className="flex justify-start">
                            <span className="text-emerald-400 font-semibold text-sm">
                                +5%
                            </span>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="p-3 bg-[#C9A34A1A] rounded-3xl">
                                <MdGavel className="w-6 h-6 text-[#C9A34A]" />
                            </div>

                            <div className="text-right">
                                <p className="text-slate-400 text-sm font-medium mb-1 ">
                                    العملاء النشطون
                                </p>
                                <h2 className="text-white text-4xl font-bold tracking-tight py-2 ">
                                    {stats?.data?.stats?.activeClients}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-70 p-6 bg-[#141d2f] border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between h-49.25 hover:border-amber-200 duration-300">
                        <div className="flex justify-start">
                            <span className="text-emerald-400 font-semibold text-sm">
                                +12%
                            </span>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="p-3 bg-[#C9A34A1A] rounded-3xl">
                                <Users className="w-6 h-6 text-[#C9A34A]" />
                            </div>

                            <div className="text-right">
                                <p className="text-slate-400 text-sm font-medium mb-1 ">
                                    إجمالي العملاء
                                </p>
                                <h2 className="text-white text-4xl font-bold tracking-tight py-2 ">
                                    {stats?.data?.stats?.totalClients}
                                </h2>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <section>
                <div dir="rtl" className="min-h-screen bg-[#071224] p-6 text-white">
                    <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0b1830_0%,#0a162b_100%)] shadow-2xl shadow-black/20 overflow-hidden">
                        <div className="border-b border-white/5 p-4 md:p-5">
                            <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-[#0a1730] p-3 md:p-4">
                                <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10">
                                    <SlidersHorizontal className="h-5 w-5" />
                                </button>
                                <div className="relative flex-1">
                                    <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="البحث عن عميل بالاسم، الرقم، أو رقم الهوية..."
                                        className="h-12 w-full rounded-2xl border border-white/5 bg-[#081226] pr-12 pl-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/40"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400">
                                        <th className="px-5 py-4 text-right font-medium">اسم العميل</th>
                                        <th className="px-4 py-4 text-right font-medium">النوع</th>
                                        <th className="px-4 py-4 text-right font-medium">رقم التواصل</th>
                                        <th className="px-4 py-4 text-right font-medium">عدد القضايا</th>
                                        <th className="px-4 py-4 text-right font-medium">القضايا المفتوحة</th>
                                        <th className="px-4 py-4 text-right font-medium">إجمالي المستحقات</th>
                                        <th className="px-4 py-4 text-right font-medium">الحالة</th>
                                        <th className="px-4 py-4 text-right font-medium">آخر نشاط</th>
                                        <th className="px-4 py-4 text-right font-medium">الإجراءات</th>
                                    </tr>
                                </thead>

                                <tbody>
    {clientsList.map((client) => (
        <tr
            key={client.id}
            className="border-b border-white/5 transition hover:bg-white/[0.02]"
        >
            <td className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${client.avatarClass}`}
                    >
                        {client.avatar}
                    </div>

                    <div className="min-w-0 flex-1 text-right">
                        <p className="truncate text-sm font-semibold text-white">
                            {client.fullName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            ID: {client.id}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-4 py-4">
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        typeClasses?.[client.type] || "bg-slate-500/10 text-slate-300"
                    }`}
                >
                    {client.type}
                </span>
            </td>

            <td className="px-4 py-4 text-slate-300">{client.phone}</td>

            <td className="px-4 py-4 font-semibold text-slate-200">
                {String(client.casesCount || 0).padStart(2, "0")}
            </td>

            <td className="px-4 py-4 font-semibold text-amber-300">
                {String(client.openCases || 0).padStart(2, "0")}
            </td>

            <td className="px-4 py-4 font-semibold text-slate-200">
                {formatCurrency(client.totalDue || 0)}
            </td>

            <td className="px-4 py-4">
                <span
                    className={`inline-flex items-center gap-2 ${
                        statusClasses?.[client.status] || "text-emerald-400"
                    }`}
                >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {client.status}
                </span>
            </td>

            <td className="px-4 py-4 text-slate-400">{client.lastActivity}</td>

            <td className="px-4 py-4">
                <div className="flex items-center gap-3 text-slate-400">
                    <button className="transition hover:text-white" aria-label="المزيد">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                    <button className="transition hover:text-white" aria-label="تعديل">
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button className="transition hover:text-white" aria-label="عرض">
                        <Eye className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    ))}
</tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                if (page >= 1 && page <= totalPages) setCurrentPage(page);
                            }}
                        />
                    </div>

                    <div className="mx-auto mt-4 max-w-7xl rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-right text-sm text-slate-400">
                        الباجينيشن متظبط بحيث تقدر تربطه بسهولة مع الـ API عن طريق currentPage و totalPages و onPageChange.
                    </div>
                </div>
            </section>







        </>
    )
}

export default Clients