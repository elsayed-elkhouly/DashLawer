import React, { useEffect, useMemo, useState } from 'react'
import {
  HiOutlineUserGroup,
  HiOutlineArrowTrendingDown,
  HiOutlineWallet,
  HiOutlineEye,
} from "react-icons/hi2";
import api from '../../api/axios'
import Cookies from 'js-cookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

function PyrollMangment() {

  const [openSalaryModal, setOpenSalaryModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
    const queryClient = useQueryClient();
  
  function getUsers() {
    return api.get("/users/", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,

      }
    })
  }
  const { data: Users } = useQuery({
    queryKey: ["Users"],
    queryFn: getUsers
  })
  // console.log(Users?.data?.users);
  const excludedRoles = ["ADMIN", "SUPER_ADMIN"];
  const {
    register,
    handleSubmit,
    reset,
    watch,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      employee: "",
      type: "",
      advanceMode: "",
      installmentMonths: "",
      amount: "",
      date: "",
      note: "",
    },
  });

  const type = watch("type");
  const advanceMode = watch("advanceMode");



  const onSubmit = async (data) => {
    try {
      let payload = {};

      if (data.type === "ADVANCE") {
        payload = {
          employee: data.employee,
          type: "ADVANCE",
          amount: Number(data.amount),
          advanceMode: data.advanceMode,
          note: data.note || "",
        };

        if (data.advanceMode === "INSTALLMENT") {
          payload.installmentMonths = Number(data.installmentMonths);
        }
      } else {
        payload = {
          employee: data.employee,
          type: data.type,
          amount: Number(data.amount),
          note: data.note || "",
        };
      }

      const res = await api.post(
        "/payroll/transactions",
        payload, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,

        }
      }
      );
      console.log(res);
      toast.success("ضن")
      setOpenModal(false)
      reset()
    } catch (error) {
      console.error(error?.response?.data || error.message);
    }
  };

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const months = [
    { value: 1, label: "يناير" },
    { value: 2, label: "فبراير" },
    { value: 3, label: "مارس" },
    { value: 4, label: "أبريل" },
    { value: 5, label: "مايو" },
    { value: 6, label: "يونيو" },
    { value: 7, label: "يوليو" },
    { value: 8, label: "أغسطس" },
    { value: 9, label: "سبتمبر" },
    { value: 10, label: "أكتوبر" },
    { value: 11, label: "نوفمبر" },
    { value: 12, label: "ديسمبر" },
  ];
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const arr = [];
    for (let y = 2026; y <= currentYear + 3; y++) {
      arr.push(y);
    }
    return arr;
  }, []);


  const selectedMonthName =
    months.find((m) => m.value === Number(selectedMonth))?.label || "";

  const getMonthlyPayroll = async (month, year) => {
    const { data } = await api.get("/payroll/monthly", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { month, year },
    });
      queryClient.invalidateQueries({ queryKey: ["MonthPayrol"] });

    return data;
  };
  const { data: MonthPay } = useQuery({
    queryKey: ["MonthPayrol", selectedMonth, selectedYear],
    queryFn: () => getMonthlyPayroll(selectedMonth, selectedYear),
  });

  const getuserMonthlyPayroll = async (month, year, id) => {
    const { data } = await api.get(`/payroll/employee/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { month, year },
    });

    return data;
  };
  const { mutate: fetchUserPayroll, data: userpayroll } = useMutation({
    mutationFn: ({ month, year, id }) =>
      getuserMonthlyPayroll(month, year, id),
  });
  console.log(userpayroll?.payroll);
  const advanceTransactions =
    userpayroll?.payroll?.transactions?.filter(
      (item) => item.type === "ADVANCE"
    ) || [];

  const formatEgyptDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "تاريخ غير صالح";

    return new Intl.DateTimeFormat("ar-EG", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "long",
      day: "numeric",

    }).format(date);
  };
  const getAdvanceTypeLabel = (type) => {
    switch (type) {
      case "ONE_TIME":
        return "مرة واحدة";
      case "INSTALLMENT":
        return "تقسيط";
      default:
        return type;
    }
  };
  async function deleteTransaction(id) {
    const res = await api.delete(`/payroll/transactions/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,

      }
    })
    console.log(res);
    
  }
  // const getEmployeePayrollHistory = async (userId) => {
  //   try {
  //     const { data } = await axios.get(

  //       `http://localhost:3000/payroll/employee/${userId}/history`
  //     );
  //     console.log("getEmployeePayrollHistory response:", data);
  //     return data;
  //   } catch (error) {
  //     console.error("getEmployeePayrollHistory error:", error);
  //   }
  // };
  return (
    <div dir="rtl" className="min-h-screen bg-[#071a2f] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-right">
            <h1 className="text-3xl font-bold">إدارة الرواتب</h1>
            <p className="text-sm text-[#8EA3BF]">
              إدارة رواتب الموظفين والمكافآت والخصومات الخاصة بهم
            </p>
          </div>
          <div className="flex items-center gap-3">
           

            <button
              onClick={() => setOpenModal(true)}
              className="rounded-xl bg-[#D7AE46] px-5 py-2 text-sm transition duration-200 hover:bg-amber-300 cursor-pointer font-bold text-[#071a2f]"
            >
              + إضافة عملية مالية
            </button>
          </div>
          {openModal && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-3 sm:p-4">
                <div className="flex min-h-full items-center justify-center">
                  <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl rounded-2xl bg-[#081b31] border border-white/10 shadow-2xl max-h-[90vh] overflow-hidden">

                    <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-4 border-b border-white/10 bg-[#081b31]">
                      <h2 className="text-white font-bold text-base sm:text-lg">
                        إضافة عملية مالية
                      </h2>

                      <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="shrink-0 text-slate-400 hover:text-white text-xl leading-none cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-4 sm:p-5 space-y-4 text-white overflow-y-auto max-h-[calc(90vh-140px)]">
                      <div className="text-right">
                        <h3 className="font-semibold">تفاصيل العملية المالية للموظف</h3>
                        <p className="text-xs text-[#8EA3BF] mt-1">
                          يرجى تعبئة كافة الحقول المطلوبة بدقة
                        </p>
                      </div>

                      {/* Employee */}
                      <div>
                        <label className="text-sm text-[#8EA3BF]">اسم الموظف</label>
                        <select
                          dir="rtl"
                          className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4 outline-none focus:border-amber-400"
                          {...register("employee", { required: "اختر الموظف" })}
                        >
                          <option value="" disabled>
                            اختر الموظف من القائمة
                          </option>

                          {Users?.data?.users
                            ?.filter((user) => !excludedRoles.includes(user.role))
                            .map((user) => (
                              <option key={user._id} value={user._id}>
                                {user.UserName}
                              </option>
                            ))}
                        </select>
                        {errors.employee && (
                          <p className="text-red-400 text-sm mt-1">{errors.employee.message}</p>
                        )}
                      </div>

                      {/* Type */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-[#8EA3BF]">نوع العملية</label>
                          <select
                            className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4 outline-none focus:border-amber-400"
                            {...register("type", {
                              required: "اختر نوع العملية",
                              onChange: (e) => {
                                const selectedType = e.target.value;

                                if (selectedType !== "ADVANCE") {
                                  resetField("advanceMode");
                                  resetField("installmentMonths");
                                }
                              },
                            })}
                          >
                            <option value="" disabled>
                              اختر نوع الخدمة
                            </option>
                            <option value="BONUS">مكافأة</option>
                            <option value="DEDUCTION">خصم</option>
                            <option value="ADVANCE">سلفة</option>
                          </select>
                          {errors.type && (
                            <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>
                          )}
                        </div>

                        {type === "ADVANCE" && (
                          <div>
                            <label className="text-sm text-[#8EA3BF]">طريقة دفع السلفة</label>
                            <select
                              className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4 outline-none focus:border-amber-400"
                              {...register("advanceMode", {
                                required: type === "ADVANCE" ? "اختر طريقة الدفع" : false,
                                onChange: (e) => {
                                  if (e.target.value !== "INSTALLMENT") {
                                    resetField("installmentMonths");
                                  }
                                },
                              })}
                            >
                              <option value="" disabled>
                                اختر طريقة الدفع
                              </option>
                              <option value="ONE_TIME">مرة واحدة</option>
                              <option value="INSTALLMENT">تقسيط</option>
                            </select>
                            {errors.advanceMode && (
                              <p className="text-red-400 text-sm mt-1">{errors.advanceMode.message}</p>
                            )}
                          </div>
                        )}

                        {type === "ADVANCE" && advanceMode === "INSTALLMENT" && (
                          <div>
                            <label className="text-sm text-[#8EA3BF]">عدد شهور التقسيط</label>
                            <input
                              type="number"
                              min="1"
                              placeholder="مثال: 6"
                              className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4 outline-none focus:border-amber-400"
                              {...register("installmentMonths", {
                                validate: (value) => {
                                  if (type === "ADVANCE" && advanceMode === "INSTALLMENT") {
                                    if (!value) return "ادخل عدد الشهور";
                                    if (Number(value) < 1) return "لازم يكون أكبر من أو يساوي 1";
                                  }
                                  return true;
                                },
                              })}
                            />
                            {errors.installmentMonths && (
                              <p className="text-red-400 text-sm mt-1">
                                {errors.installmentMonths.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="text-sm text-[#8EA3BF]">المبلغ</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4 outline-none focus:border-amber-400"
                          {...register("amount", {
                            required: "ادخل المبلغ",
                            min: { value: 1, message: "المبلغ لازم يكون أكبر من 0" },
                          })}
                        />
                      </div>



                      {/* Notes */}

                      <div>
                        <label className="text-sm text-[#8EA3BF]">ملاحظات إضافية</label>
                        <textarea
                          rows={3}
                          placeholder="اكتب أي ملاحظات..."
                          className="mt-2 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4 py-2 outline-none focus:border-amber-400"
                          {...register("note")}
                        />
                      </div>

                    </div>

                    <div className="sticky bottom-0 z-10 flex items-center justify-between px-4 sm:px-5 py-4 border-t border-white/10 bg-[#081b31]">
                      <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="text-[#8EA3BF] hover:text-white"
                      >
                        إلغاء
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#D7AE46] text-[#071a2f] px-5 py-2 rounded-xl font-bold"
                      >
                        {isSubmitting ? "جارٍ الحفظ..." : "حفظ العملية"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}


        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="flex items-center justify-between rounded-2xl bg-[#0d2139] px-5 py-10 ">
            <div className="text-right">
              <p className="text-lg text-[#8EA3BF]">إجمالي الرواتب</p>
              <h3 className="text-xl font-bold">{MonthPay?.summary?.totalBasic}</h3>
            </div>
            <div className="text-emerald-400">
              <HiOutlineWallet size={20} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[#0d2139] px-5 py-10">
            <div className="text-right">
              <p className="text-lg text-[#8EA3BF]">إجمالي السلف</p>
              <h3 className="text-xl font-bold">{MonthPay?.summary?.totalAdvances}</h3>
            </div>
            <div className="text-red-400">
              <HiOutlineArrowTrendingDown size={20} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[#0d2139] px-5 py-10">
            <div className="text-right">
              <p className="text-lg text-[#8EA3BF]">إجمالي الخصومات</p>
              <h3 className="text-xl font-bold">{MonthPay?.summary?.totalDeductions}</h3>
            </div>
            <div className="text-red-400">
              <HiOutlineArrowTrendingDown size={20} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[#0d2139] px-5 py-10">
            <div className="text-right">
              <p className="text-lg text-[#8EA3BF]">إجمالي المكافأت</p>
              <h3 className="text-xl font-bold">{MonthPay?.summary?.totalBonuses}</h3>
            </div>
            <div className="text-emerald-400">
              <HiOutlineWallet size={20} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[#0d2139] px-5 py-10">

            <div className="text-right">
              <p className="text-lg text-[#8EA3BF]">  صافي الرواتب </p>
              <h3 className="text-xl font-bold">{MonthPay?.summary?.totalAdvances}</h3>
            </div>
            <div className="text-green-400">
              <HiOutlineUserGroup size={20} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-[#081b31] p-3 sm:p-4 md:p-5">
          <div>
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex flex-col gap-4 text-right lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full">
                  <div className="text-right">
                    <h3 className="text-base font-bold sm:text-lg md:text-xl">
                      كشف رواتب الموظفين - {selectedMonthName} {selectedYear}
                    </h3>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="w-full rounded-lg bg-[#081b31] px-3 py-2 text-sm sm:w-45 sm:text-base"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-full rounded-lg bg-[#081b31] px-4 py-2 text-sm sm:w-[180px] sm:text-base"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => getMonthlyPayroll(selectedMonth, selectedYear)}
                  className="inline-flex w-full min-w-30 cursor-pointer items-center justify-center rounded-xl bg-[#D7AE46] px-5 py-2.5 text-base font-bold text-black shadow-md transition duration-200 hover:bg-amber-300 active:scale-95 sm:w-auto sm:text-lg"
                >
                  بحث
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-225">
              {/* Header */}
              <div className="grid grid-cols-8 border-b border-white/5 px-4 py-3 text-xs text-[#8EA3BF] sm:text-sm">
                <div>اسم الموظف</div>
                <div>المسمى الوظيفي</div>
                <div>الراتب الأساسي</div>
                <div>البدلات</div>
                <div>السلف</div>
                <div>الخصومات</div>
                <div>صافي الراتب</div>
                <div >إجراءات</div>
              </div>

              {/* Rows */}
              {MonthPay?.items.map((emp, i) => (
                <div
                  key={i}
                  className="grid grid-cols-8 items-center border-b border-white/5 px-4 py-4 text-xs sm:text-sm"
                >
                  <div className="font-medium">{emp.employee?.UserName}</div>
                  <div className="text-[#8EA3BF]">{emp.employee?.role}</div>

                  <div>{emp.basicSalary}</div>
                  <div className="text-green-400">{emp.bonuses}</div>
                  <div className="text-[#8EA3BF]">{emp.advances}</div>
                  <div className="text-red-400">{emp.deductions}</div>

                  <div className="font-bold text-amber-400">{emp.netSalary}</div>

                  <button
                    onClick={() => {
                      fetchUserPayroll({
                        month: selectedMonth,
                        year: selectedYear,
                        id: emp.employee?._id,
                      });
                      setOpenSalaryModal(true);
                    }}
                    className="text-[#8EA3BF] hover:text-white cursor-pointer"
                  >
                    <HiOutlineEye />
                  </button>
                </div>

              ))}
            </div>
            {openSalaryModal && (
              <div onClick={() => setOpenSalaryModal(false)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex max-h-[95vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#081b31] text-white shadow-2xl sm:max-w-lg">

                  {/* Header */}
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#081b31] px-4 py-4 sm:px-5">

                    <h2 className="text-sm font-bold sm:text-base">تفاصيل الراتب الشهري</h2>
                    <button
                      onClick={() => setOpenSalaryModal(false)}
                      className="rounded-lg p-1 text-slate-400 transition hover:bg-white/5 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                    <div className="space-y-6 text-sm">

                      {/* Top */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-full border-2 border-amber-400 sm:h-14 sm:w-14" />

                        <div className="min-w-0 flex-1 text-right">
                          <h3 className="truncate text-base font-bold sm:text-lg">
                            {userpayroll?.payroll?.employee?.UserName || "غير متوفر"}
                          </h3>
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-[#D7AE46] sm:text-base">
                          معلومات الموظف
                        </h4>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-3 rounded-xl border border-white/10 bg-[#0a2038] p-3 text-[13px] sm:text-sm">
                          <div className="text-[#8EA3BF]">المسمى الوظيفي</div>
                          <div className="text-right wrap-break-word">
                            {userpayroll?.payroll?.employee?.jobTitle || "غير متوفر"}
                          </div>

                          <div className="text-[#8EA3BF]">القسم</div>
                          <div className="text-right wrap-break-word">
                            {userpayroll?.payroll?.employee?.department || "غير متوفر"}
                          </div>

                          <div className="text-[#8EA3BF]">تاريخ الانضمام</div>
                          <div className="text-right wrap-break-word">
                            {formatEgyptDate(userpayroll?.payroll?.employee?.employmentDate || "غير متوفر")}
                          </div>
                        </div>
                      </div>

                      {/* Salary */}
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-[#D7AE46] sm:text-base">
                          تفاصيل الراتب
                        </h4>

                        <div className="space-y-3 rounded-xl border border-white/10 bg-[#0a2038] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[#8EA3BF]">الراتب الأساسي</span>
                            <span className="text-right break-all">
                              {userpayroll?.payroll?.basicSalary ?? 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 text-green-400">
                            <span>المكافآت</span>
                            <span className="text-right break-all">
                              + {userpayroll?.payroll?.bonuses ?? 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 text-red-400">
                            <span>الخصم</span>
                            <span className="text-right break-all">
                              - {userpayroll?.payroll?.deductions ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Loans */}
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-[#D7AE46] sm:text-base">
                          السلف
                        </h4>

                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a2038]">
                          <div className="grid grid-cols-5 border-b border-white/10 px-3 py-3 text-center text-[11px] text-[#8EA3BF] sm:text-xs">
                            <span>المبلغ</span>
                            <span>التاريخ</span>
                            <span>نوع السلف</span>
                            <span> مده التقسيط</span>
                            <span>  اجراءات</span>
                          </div>

                          <div className="max-h-48 overflow-y-auto">
                            {advanceTransactions.length > 0 ? (
                              advanceTransactions.map((item, index) => (
                                <div
                                  key={item._id || index}
                                  className="grid grid-cols-5 items-center border-b border-white/5 px-3 py-3 text-center text-[12px] last:border-b-0 sm:text-sm"
                                >
                                  <span className="truncate">{item.amount}</span>

                                  <span className="truncate">
                                    {formatEgyptDate(item.date)}
                                  </span>

                                  <span className="truncate text-amber-400">
                                    {getAdvanceTypeLabel(item?.advanceMode)}
                                  </span>

                                  <span className="truncate">
                                    {item.installmentMonths &&
                                      `${item.installmentMonths} شهور`}
                                  </span>

                                  <div className='flex items-center justify-center gap-2'>
                                    <button
                                    onClick={()=> deleteTransaction(item._id)}
                                    className="flex justify-center text-red-500 hover:text-red-200 transition-colors cursor-pointer">
                                      <Trash2 size={16} />
                                    </button>
                                    {/* <button className="flex justify-center text-red-500 hover:text-red-200 transition-colors cursor-pointer">
                                      <Trash2 size={16} />
                                    </button> */}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-4 text-center text-sm text-[#8EA3BF]">
                                لا توجد سلف
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                        <span className="text-[#8EA3BF]">صافي الراتب النهائي</span>
                        <span className="text-lg font-bold text-amber-400 sm:text-xl">
                          {userpayroll?.payroll?.netSalary}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 flex flex-col gap-3 border-t border-white/10 bg-[#081b31] px-4 py-4 sm:flex-row sm:px-5">
                    <button className="w-full rounded-xl bg-[#D7AE46] py-2.5 font-bold text-[#071a2f] transition hover:opacity-90">
                      طباعة
                    </button>

                    <button className="w-full rounded-xl border border-white/10 py-2.5 text-[#8EA3BF] transition hover:bg-white/5 hover:text-white">
                      تحميل PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#8EA3BF] sm:flex-row sm:items-center sm:justify-between">
            <div>عرض 4 من أصل 50 موظف</div>

            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg bg-white/5 px-3 py-1">السابق</button>
              <button className="rounded-lg bg-white/5 px-3 py-1">التالي</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default PyrollMangment