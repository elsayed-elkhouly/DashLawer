import { ArrowDownLeft, ArrowLeft, Gavel } from 'lucide-react'
import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import {
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { HiOutlineXMark } from "react-icons/hi2";
import { FiTrash2 } from "react-icons/fi";
import { MdGavel } from 'react-icons/md'
import { useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from "@tanstack/react-query"
import toast from 'react-hot-toast';
import api from '../../api/axios';

const AddNewCase = () => {

  const [search, setSearch] = useState("");
  const [showClients, setShowClients] = useState(false);
  const [loding, setloding] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      caseNumber: "",
      caseType: "",
      client: "",
      openedAt: "",
      court: "",
      city: "",
      description: "",
      priority: "عاجلة",
      status: "قيد التحضير",
      assignedTo: "",
      team: [],
      fees: {
        totalAmount: 0,
        paidAmount: 0,
        paymentMethod: "تحويل بنكي",
        notes: "",
      },
    },
  });;
  const onSubmit = async (data) => {
    setloding(true)
    try {
      const res = await api.post("/LegalCase/", data, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`
        }
      })

      toast.success(res?.data?.message)
      setSearch("");
      setShowClients(false);
      reset();
      setloding(false)
    } catch (error) {
      console.log("Full Error:", error);
      console.log("Response Data:", error?.response?.data);
      toast.error(error?.response?.data)
      console.log("Response Status:", error?.response?.status);
      console.log("Response Headers:", error?.response?.headers);

    }




  };
  const selectedPriority = watch("priority");



  function getCases() {
    return api.get("/CaseType/", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`
      }
    })
  }
  const { data: Cases } = useQuery({
    queryKey: ["cases"],
    queryFn: getCases
  })

  function getUSers() {
    return api.get("/users", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,

      }
    })
  }
  const { data: Lawer } = useQuery({
    queryKey: ["Users"],
    queryFn: getUSers
  })
  // console.log(Lawer?.data?.users);
  async function getClients(search) {
    const res = await api.get(
      "/Client/all",
      {
        params: {
          search,
          page: 1,
          limit: 10,
        },
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return res.data;
  }
  const { data: clients, isLoading } = useQuery({
    queryKey: ["Clients", search],
    queryFn: () => getClients(search),
    enabled: search.trim().length > 0,
  });
  // console.log(clients);

  return (
    <>
      {/* header */}
      <div dir="rtl" className="bg-slate-950 p-6 text-white">
        <div className="mx-auto w-full max-w-7xl rounded-3xl bg-[#071a33] px-8 py-7 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-start justify-between gap-6">
            <div className="text-right">
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                إضافة قضية جديدة
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                قم بتعبئة بيانات القضية والمحامي المسؤول والتفاصيل المالية.
              </p>
            </div>
            <div className="flex items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setValue("priority", "عاجلة");
                }}
                className="cursor-pointer text-sm font-medium text-slate-300 transition hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#c79a3b] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-[#c79a3b]/20 transition hover:brightness-110"
              >
                <FiSave className="text-base" />
                {loding ? <span className="loading loading-infinity loading-xl"></span> : <span>حفظ القضية</span>}
              </button>

              <Link to="/CaseMangemnt">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#c79a3b] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-[#c79a3b]/20 transition hover:brightness-110"
                >
                  <ArrowLeft className="text-base" />
                  <span>رجوع</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className="min-h-screen bg-[#041124] px-4 py-8 text-white md:px-8"
        dir="rtl"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Main Data / بيانات القضية الأساسية */}
            <section className="rounded-3xl border border-[#10233e] bg-[#061327]/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.22)] md:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="text-right">
                  <h2 className="text-lg font-semibold text-[#f3f7fb]">
                    بيانات القضية الأساسية
                  </h2>
                  <p className="mt-1 text-xs text-[#6f86a6]">
                    المعلومات القانونية والمكانية للقضية
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4a3d17] bg-[#1e1a0d] text-[#d3a53d]">
                  <MdGavel size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    رقم القضية
                  </label>
                  <input
                    dir="rtl"
                    {...register("caseNumber", {
                      required: "رقم القضية مطلوب",
                    })}
                    placeholder="ادخل رقم القضية"
                    className="h-11 w-full rounded-xl border border-[#132949] bg-[#07162d] px-4 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                  />
                  {errors.caseNumber && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.caseNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    نوع القضية
                  </label>
                  <select
                    {...register("caseType", {
                      required: "نوع القضية مطلوب",
                    })}
                    dir="rtl"
                    className="h-11 w-full rounded-xl border border-[#132949] bg-[#07162d] px-4 text-sm text-white outline-none transition focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                  >
                    <option value="">اختر نوع القضية</option>

                    {Cases?.data?.caseTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>

                  {errors.caseType && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.caseType.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    تاريخ الافتتاح
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6f86a6]">
                      <HiOutlineCalendarDays size={18} />
                    </span>
                    <input
                      type="date"
                      {...register("openedAt", {
                        required: "تاريخ الافتتاح مطلوب",
                      })}
                      dir="rtl"
                      className="h-11 w-full rounded-xl border border-[#132949] bg-[#07162d] pr-10 pl-4 text-sm text-white outline-none transition focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                    />
                  </div>
                  {errors.openedAt && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.openedAt.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    حالة القضية
                  </label>
                  <div className="relative">
                    <select
                      {...register("status")}
                      dir="rtl"
                      className="h-11 w-full appearance-none rounded-xl border border-[#132949] bg-[#07162d] pr-4 pl-10 text-right text-sm text-white outline-none transition focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                    >
                      <option value="قيد التحضير">قيد التحضير</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="منتهية">منتهية</option>
                      <option value="موقوفة">موقوفة</option>
                      <option value="مؤرشفة">مؤرشفة</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#6f86a6]">
                      <HiOutlineChevronDown size={18} />
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    المحكمة
                  </label>
                  <input
                    {...register("court")}
                    dir="rtl"
                    placeholder="اسم المحكمة المختصة"
                    className="h-11 w-full rounded-xl border border-[#132949] bg-[#07162d] px-4 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    المدينة
                  </label>
                  <div className="relative">
                    <input
                      {...register("city")}
                      placeholder="ادخل المدينة"
                      dir="rtl"
                      className="h-11 w-full appearance-none rounded-xl border border-[#132949] bg-[#07162d] pr-4 pl-10 text-right text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                  وصف القضية
                </label>
                <textarea
                  {...register("description")}
                  dir="rtl"
                  placeholder="اكتب ملخصاً موجزاً عن وقائع القضية..."
                  className="min-h-23 w-full rounded-xl border border-[#132949] bg-[#07162d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                />
              </div>
            </section>

            {/* client and lawyer */}
            <section className="mt-6 rounded-3xl border border-[#10233e] bg-[#061327]/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.22)] md:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="text-right">
                  <h2 className="text-lg font-semibold text-[#f3f7fb]">
                    العميل والمحامي
                  </h2>
                  <p className="mt-1 text-xs text-[#6f86a6]">
                    إدارة أطراف القضية والفريق القانوني
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4a3d17] bg-[#1e1a0d] text-[#d3a53d]">
                  <HiOutlineBriefcase size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    اختيار العميل
                  </label>

                  <input
                    type="hidden"
                    {...register("client", {
                      required: "العميل مطلوب",
                    })}
                  />

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#6f86a6]">
                      <HiOutlineMagnifyingGlass size={18} />
                    </span>

                    <input
                      dir="rtl"
                      value={search}
                      placeholder="ابحث باسم العميل"
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowClients(true);
                      }}
                      className="h-11 w-full rounded-xl border border-[#132949] bg-[#07162d] pr-10 pl-4 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                    />
                  </div>

                  {errors.client && (
                    <p className="mt-1 text-xs text-red-400">{errors.client.message}</p>
                  )}

                  {isLoading && <p className="mt-2 text-white">جاري البحث...</p>}

                  {showClients && clients?.clients?.length > 0 && (
                    <div className="mt-2 rounded-lg border border-[#132949] bg-[#07162d]">
                      {clients.clients.map((item) => (
                        <div
                          key={item.id}
                          className="cursor-pointer border-b border-[#132949] p-3 text-white hover:bg-[#0b1d39]"
                          onClick={() => {
                            setValue("client", item.id);
                            setSearch(item.fullName);
                            setShowClients(false);
                          }}
                        >
                          <p>{item.fullName}</p>
                          <p className="text-xs text-[#6f86a6]">ID: {item.id}</p>
                          <p className="text-xs text-[#6f86a6]">{item.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
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
                      <option disabled>اختر المحامي المسؤول</option>

                      {Lawer?.data?.users
                        ?.filter((user) => user.role === "LAWYER")
                        .map((user) => (
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
                    <p className="mt-1 text-xs text-red-400">
                      {errors.assignedTo.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#112541] bg-[#05142a] p-3">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                      فريق القضية
                    </label>

                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-[#132949] bg-[#07162d] p-3">
                      {Lawer?.data?.users.map((user) => (
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

                  <div>
                    <label className="mb-3 block text-sm font-medium text-[#d8e3f0]">
                      أولوية القضية
                    </label>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => setValue("priority", "عاجلة")}
                        className={`h-14 rounded-2xl border text-sm font-medium transition ${selectedPriority === "عاجلة"
                          ? "border-[#ff5c88] bg-[#2a1620] text-[#ff5c88]"
                          : "border-[#5a2433] bg-[#1a1220] text-[#ff5c88]"
                          }`}
                      >
                        عاجلة
                      </button>

                      <button
                        type="button"
                        onClick={() => setValue("priority", "عالية")}
                        className={`h-14 rounded-2xl border text-sm font-medium transition ${selectedPriority === "عالية"
                          ? "border-[#ff9b4a] bg-[#24180f] text-[#ff9b4a]"
                          : "border-[#6f3e1c] bg-[#1c140d] text-[#ff9b4a]"
                          }`}
                      >
                        عالية
                      </button>

                      <button
                        type="button"
                        onClick={() => setValue("priority", "متوسطة")}
                        className={`h-14 rounded-2xl border text-sm font-medium transition ${selectedPriority === "متوسطة"
                          ? "border-[#f0c14a] bg-[#332a15] text-[#f0c14a]"
                          : "border-[#c79a32] bg-[#2a2412] text-[#f0c14a]"
                          }`}
                      >
                        متوسطة
                      </button>

                      <button
                        type="button"
                        onClick={() => setValue("priority", "منخفضة")}
                        className={`h-14 rounded-2xl border text-sm font-medium transition ${selectedPriority === "منخفضة"
                          ? "border-[#c8d5e6] bg-[#182b46] text-[#c8d5e6]"
                          : "border-[#22395e] bg-[#13233c] text-[#c8d5e6]"
                          }`}
                      >
                        منخفضة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* fees */}
            <section className="mt-6 rounded-3xl border border-[#10233e] bg-[#061327]/95 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.22)] md:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="text-right">
                  <h2 className="text-lg font-semibold text-[#f3f7fb]">
                    معلومات الأتعاب
                  </h2>
                  <p className="mt-1 text-xs text-[#6f86a6]">
                    التفاصيل المالية والاتفاق المادي
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4a3d17] bg-[#1e1a0d] text-[#d3a53d]">
                  <HiOutlineCurrencyDollar size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    قيمة الأتعاب
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-xs text-[#6f86a6]">
                      EGP
                    </span>
                    <input
                      {...register("fees.totalAmount", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      dir="rtl"
                      className="h-11 w-full rounded-xl border border-[#132949] bg-[#07162d] pr-4 pl-14 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                    />
                  </div>
                </div>

               

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                    شروط الدفع
                  </label>
                  <div className="relative">
                    <select
                      {...register("fees.paymentMethod")}
                      dir="rtl"
                      className="h-11 w-full appearance-none rounded-xl border border-[#132949] bg-[#07162d] pr-4 pl-10 text-right text-sm text-white outline-none transition focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                    >
                      <option value="تحويل بنكي">تحويل بنكي</option>
                      <option value="كاش">كاش</option>
                      <option value="شيك">شيك</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#6f86a6]">
                      <HiOutlineChevronDown size={18} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[#d8e3f0]">
                  ملاحظات مالية
                </label>
                <textarea
                  {...register("fees.notes")}
                  dir="rtl"
                  placeholder="أي تفاصيل إضافية تخص الدفع أو الخصومات..."
                  className="min-h-14.5 w-full rounded-xl border border-[#132949] bg-[#07162d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4a63d]/70 focus:ring-2 focus:ring-[#d4a63d]/20"
                />
              </div>

              <button type="submit" className="hidden">
                submit
              </button>
            </section>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddNewCase