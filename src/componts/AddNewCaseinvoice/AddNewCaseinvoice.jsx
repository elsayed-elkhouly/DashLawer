import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlinePrinter,
} from "react-icons/hi2"
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";

const AddNewCaseinvoice = () => {
  const { id } = useParams()
  // console.log(id);

  const [search, setSearch] = useState("");
  const [showClients, setShowClients] = useState(false);

  async function getClients(search) {
    const res = await api.get(
      "/Client/all",
      {
        params: {
          search,
          page: 1,
          limit: 10,
        }
      }
    );

    return res.data;
  }

  const { data: clients, isLoading } = useQuery({
    queryKey: ["Clients", search],
    queryFn: () => getClients(search),
    enabled: search.trim().length > 0,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      clientId: "",
      caseNumber: "",
      dueDate: "",
      paidAmount: "",
      paymentMethod: "",
      discount: 0,
      tax: 0,
      notes: "",
      isFromFees: "false",
      items: [
        { description: "", amount: 0 },
        ,
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const discountPercent = Number(watch("discount")) || 0;
  const taxPercent = Number(watch("tax")) || 0;
  const paid = Number(watch("paidAmount")) || 0;
  const paymentMethod = Number(watch("paymentMethod"));

  const subtotal =
    items?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;

  const discountValue = (subtotal * discountPercent) / 100;
  const taxValue = (subtotal * taxPercent) / 100;
  const total = subtotal - discountValue + taxValue;
  const remaining = total - paid;

  const onSubmit = async (data) => {
    const payload = {
      clientId: data.clientId,
      items: data.items.map((item) => ({
        description: item.description,
        amount: Number(item.amount),
      })),
      paidAmount: Number(data.paidAmount),
      paymentMethod: data.paymentMethod,
      discount: Number(data.discount),
      tax: Number(data.tax),
      isFromFees: data.isFromFees === "true",
      notes: data.notes,
      dueDate: data.dueDate,
      caseNumber: data.caseNumber,
    };

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        const res = await api.post(`/LegalCase/${id}/invoices`, payload);    
        toast.success("تم إنشاء الفاتورة بنجاح ✅");
        reset();
        setSearch("");
        return;

      } catch (error) {
        const serverMsg = error.response?.data?.message || "";
        const isDuplicate = serverMsg.includes("E11000") || serverMsg.includes("duplicate key");

        if (isDuplicate && attempt < MAX_RETRIES - 1) {
          attempt++;
          continue;
        }

        if (isDuplicate) {
          toast.error("فشل إنشاء الفاتورة بعد عدة محاولات، تواصل مع الدعم الفني ❌");
        } else if (error.response?.status === 403) {
          toast.error("غير مصرح لك بإنشاء الفاتورة ⛔");
        } else if (error.response?.status === 404) {
          toast.error("القضية أو العميل غير موجود 🔍");
        } else if (!error.response) {
          toast.error("تعذر الاتصال بالسيرفر، تحقق من الإنترنت 🌐");
        } else {

          toast.error(error.response?.data?.message || "حصل خطأ أثناء إنشاء الفاتورة ❌");
        }
        return;
      }
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#07172B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* RIGHT CONTENT */}
            <div className="order-2 lg:order-1 lg:col-span-9">
              <div className="rounded-[26px] border border-white/5 bg-[#081a30] p-6 shadow-2xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold">إنشاء فاتورة جديدة</h1>
                    <p className="mt-2 text-sm text-[#8AA0BF]">
                      إدارة المستحقات المالية وعروض الأسعار القانونية
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer rounded-xl bg-[#E7B53F] px-5 py-3 text-sm font-bold text-[#081a30] transition hover:opacity-90 disabled:opacity-60"
                    >
                      {isSubmitting ? "جاري الحفظ..." : "حفظ الفاتورة"}
                    </button>

                    <Link to={"/Bills"}>
                      <button
                        type="button"
                        onClick={() => {
                          reset();
                          setSearch("");
                        }}
                        className=" cursor-pointer rounded-xl border border-white/10 bg-[#0D223C] px-5 py-3 text-sm text-white"
                      >
                        إلغاء
                      </button>
                    </Link>
                  </div>
                </div>
                {/* case */}
                {/* Client & case section */}
                <div className="mb-10">
                  <div className="mb-5 flex items-center gap-2 text-lg font-semibold">
                    <HiOutlineBriefcase className="text-[#E7B53F]" size={20} />
                    <h2>تفاصيل العميل والقضية</h2>
                  </div>
                  <div className="flex gap-3 py-3">

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="true"
                        {...register("isFromFees")}
                        className="hidden peer"
                      />
                      <div className="px-5 py-2 rounded-lg border border-gray-600 text-white 
                    peer-checked:bg-[#c59d4a] peer-checked:border-[#c59d4a] 
                    peer-checked:font-bold transition-all duration-200">
                        خاص بالاتعاب
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="false"
                        {...register("isFromFees")}
                        className="hidden peer"
                      />
                      <div className="px-5 py-2 rounded-lg border border-gray-600 text-white 
                    peer-checked:bg-[#183356] peer-checked:border-[#183356] 
                    peer-checked:font-bold transition-all duration-200">
                        أخرى
                      </div>
                    </label>

                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* due date */}
                    <div>
                      <label className="mb-2 block text-sm text-[#D7E1EF]">
                        تاريخ الاستحقاق
                      </label>
                      <input
                        type="date"
                        {...register("dueDate", {

                        })}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[#091D34] px-4 text-sm text-white outline-none focus:border-[#E7B53F]/40"
                      />
                      {errors.dueDate && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.dueDate.message}
                        </p>
                      )}
                    </div>


                  </div>
                </div>

                {/* invoice items */}
                <div>
                  <div className="mb-5 flex items-center gap-2 text-lg font-semibold">
                    <HiOutlineDocumentText className="text-[#E7B53F]" size={20} />
                    <h2>بنود الفاتورة</h2>
                  </div>




                  {/* items table */}
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#091B31]">
                    <div className="grid grid-cols-12 border-b border-white/10 px-4 py-3 text-sm text-[#8EA3C1]">
                      <div className="col-span-7">البند</div>
                      <div className="col-span-3">المبلغ</div>
                      <div className="col-span-2">حذف</div>
                    </div>

                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 items-center border-b border-white/5 px-4 py-3 last:border-b-0"
                      >
                        <div className="col-span-7">
                          <input
                            type="text"
                            placeholder="اسم الخدمة"
                            {...register(`items.${index}.description`, {
                              required: "اسم الخدمة مطلوب",
                            })}
                            className="h-11 w-full rounded-xl border border-white/10 bg-transparent px-3 text-sm text-white outline-none"
                          />
                        </div>

                        <div className="col-span-3 px-2">
                          <input
                            type="number"
                            placeholder="0"
                            {...register(`items.${index}.amount`, {
                              required: "المبلغ مطلوب",
                            })}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#07182c] px-3 text-center text-sm text-white outline-none"
                          />
                        </div>

                        <div className="col-span-2 flex justify-start">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => append({ description: "", amount: 0 })}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#E7B53F]"
                  >
                    <HiOutlinePlusCircle size={18} />
                    إضافة بند جديد
                  </button>

                  {/* extra fields close to screenshot */}
                  <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-[#D7E1EF]">
                        المبلغ المدفوع
                      </label>
                      <input
                        type="number"
                        {...register("paidAmount")}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[#091D34] px-4 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-[#D7E1EF]">
                        طريقة الدفع
                      </label>
                      <select
                        {...register("paymentMethod")}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[#091D34] px-4 text-sm text-white outline-none"
                      >
                        <option value="">اختر طريقة الدفع</option>
                        <option value="كاش">كاش</option>
                        <option value="تحويل">تحويل بنكي</option>
                        <option value="شيك">شيك</option>
                        <option value="محفظه الكنرونية">محفظه الكنرونية</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-[#D7E1EF]">
                        الخصم (%)
                      </label>
                      <input
                        type="number"
                        {...register("discount")}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[#091D34] px-4 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-[#D7E1EF]">
                        الضريبة
                      </label>
                      <input
                        type="number"
                        {...register("tax")}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[#091D34] px-4 text-sm text-white outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm text-[#D7E1EF]">
                        ملاحظات
                      </label>
                      <textarea
                        rows={4}
                        {...register("notes")}
                        placeholder="اكتب ملاحظات الفاتورة"
                        className="w-full rounded-2xl border border-white/10 bg-[#091D34] px-4 py-3 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT SUMMARY */}
            <div className="order-1 lg:order-2 lg:col-span-3">
              <div className="sticky top-6 space-y-5">
                <div className="rounded-[28px] border border-white/5 bg-[#0B1D34] p-5 shadow-2xl">
                  <h3 className="mb-5 text-center text-xl font-bold">ملخص الفاتورة</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#A7B9D3]">المجموع الفرعي</span>
                      <span className="text-[#DCE7F5]">{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#A7B9D3]">الخصم ({discountPercent}%)</span>
                      <span className="text-red-400">-{discountValue.toFixed(2)}</span>
                    </div>


                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#A7B9D3]">الضريبة ({taxPercent}%)</span>
                      <span className="text-[#DCE7F5]">{taxValue.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-[#D6A634]" />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">الإجمالي</span>
                    <span className="text-3xl font-extrabold text-[#E7B53F]">
                      {total.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">المبلغ المدفوع</span>
                      <span className="rounded-lg bg-[#132A46] px-4 py-1 text-xl font-extrabold text-white">
                        {paid.toFixed(0)}
                      </span>
                    </div>

                    <div className="border-t border-[#D6A634] pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">باقي الحساب</span>
                        <span className="text-3xl font-extrabold text-[#E7B53F]">
                          {remaining.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="rounded-[24px] border border-white/5 bg-[#0B1D34] p-4">
                  <p className="mb-3 text-center text-xs text-[#92A6C3]">طريقة الدفع</p>
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-white/10 bg-[#09182B] px-4 py-3 text-sm text-white"
                  >
                    {paymentMethod}
                  </button>
                </div> */}

                {/* <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#1A2B45] px-4 py-4 text-sm font-semibold text-white"
                >
                  <HiOutlinePrinter size={18} />
                  طباعة الفاتورة
                </button> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddNewCaseinvoice