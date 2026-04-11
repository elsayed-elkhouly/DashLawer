import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import {
  HiOutlinePlusCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineCalendarDays,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardDocumentList,
  HiOutlineExclamationCircle,
  HiOutlinePrinter,
  HiOutlineXMark,
} from "react-icons/hi2";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Bills = () => {
  const [open, setOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const tabs = [
    { key: "late", label: "المتأخرة" },
    { key: "unpaid", label: "غير المدفوعة" },
    { key: "paid", label: "المدفوعة" },
    { key: "all", label: "كل الفواتير" },
  ];

  function formatDateToArabic(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");

    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "مدفوعة":
        return "bg-white/10 text-green-600";

      case "متأخرة":
        return "bg-white/10 text-red-600";

      case "مُصدرة":
      case "مسودة":
        return "bg-white/10 text-white";

      case "ملغية":
        return "bg-gray-100 text-gray-400";

      default:
        return "bg-white/10 text-white";
    }
  };

  const getRemainingClass = (status) => {
    if (status === "متأخرة") return "text-red-600 font-semibold";
    if (status === "مدفوعة") return "text-green-600 font-semibold";
    if (status === "مُصدرة" || status === "مسودة") return "font-medium";
    if (status === "ملغية") return "text-gray-400";

    return "text-[#8BA2C1]";
  };

  function getAllInvoics(page = 1) {
    return api.get("/invoices/all", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: {
        page,
        limit,
      },
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Bills", currentPage],
    queryFn: () => getAllInvoics(currentPage),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return api.delete(
        `/invoices/${id}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["Bills"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeTab]);

  const invoices = data?.data?.invoices || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;
  const page = data?.data?.page || 1;

  const searchText = debouncedSearch.trim().toLowerCase();

  const searchedInvoices = invoices.filter((invoice) => {
    if (!searchText) return true;

    return (
      invoice?.invoiceNumber?.toString().toLowerCase().includes(searchText) ||
      invoice?.client?.fullName?.toLowerCase().includes(searchText) ||
      invoice?.service?.toLowerCase().includes(searchText)
    );
  });

  const tabFilteredInvoices = searchedInvoices.filter((invoice) => {
    if (activeTab === "all") return true;
    if (activeTab === "paid") return invoice.status === "مدفوعة";
    if (activeTab === "late") return invoice.status === "متأخرة";
    if (activeTab === "unpaid") {
      return invoice.status === "مُصدرة" || invoice.status === "مسودة";
    }
    return true;
  });

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);



  async function PrintSingleInvoic(id) {
    try {
      const res = await api.get(
        `/invoices/${id}/print`,
        {
          responseType: "blob",
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileURL);

      toast.success("Download Done");
    } catch (error) {
      console.log(error);
      toast.error("حصل خطأ أثناء تنزيل الملف");
    }
  }
  console.log(data?.data);

  if (isLoading) return <div className="text-[#C9A14A] flex items-center justify-center min-h-screen "> <span className="loading loading-infinity loading-xl w-[50%]  "></span></div>;
  if (isError) return <div className="text-red-500">حصل خطأ</div>;

  return (
    <>
      <div className="w-full bg-[#04152b] px-5 py-6 text-white md:px-8" dir="rtl">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="text-right">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                إدارة الفواتير
              </h1>
              <p className="mt-2 text-sm text-[#7f93ad]">
                نظرة شاملة على جميع العمليات المالية والمطالبات.
              </p>
            </div>

            <Link to={"/Bills/AddNewFees"}>
              <button
                type="button"
                className="inline-flex h-12 cursor-pointer items-center gap-2 self-start rounded-2xl bg-[#d4aa45] px-5 text-sm font-bold text-[#08162b] shadow-[0_14px_30px_rgba(212,170,69,0.24)] transition hover:opacity-95"
              >
                <HiOutlinePlusCircle className="text-lg" />
                فاتورة جديدة
              </button>
            </Link>
          </div>

          <div className="rounded-3xl border border-[#112543] bg-[#07182f] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6f86a6]">
                  <HiOutlineMagnifyingGlass size={18} />
                </span>
                <input
                  dir="rtl"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث عن عميل، رقم فاتورة..."
                  className="h-12 w-full rounded-2xl border border-[#132949] bg-[#091b35] pr-11 pl-4 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4aa45]/70 focus:ring-2 focus:ring-[#d4aa45]/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0d2847_0%,#061529_42%,#05111f_100%)] px-4 py-6 text-white md:px-8">
          <div className="mx-auto max-w-375">
            <div className="mb-4 flex items-center justify-end gap-5 overflow-x-auto whitespace-nowrap pb-2 text-sm text-[#91A4BF]">
              {tabs.map((tab) => {
                const count =
                  tab.key === "all"
                    ? searchedInvoices.length
                    : searchedInvoices.filter((invoice) => {
                      if (tab.key === "paid") return invoice.status === "مدفوعة";
                      if (tab.key === "late") return invoice.status === "متأخرة";
                      if (tab.key === "unpaid") {
                        return (
                          invoice.status === "مُصدرة" || invoice.status === "مسودة"
                        );
                      }
                      return false;
                    }).length;

                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setCurrentPage(1);
                    }}
                    className={`group relative flex items-center gap-2 pb-3 transition cursor-pointer ${isActive ? "text-[#D7AE46]" : "hover:text-white"
                      }`}
                  >
                    <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-[#8FA5C3] group-hover:text-white">
                      {count}
                    </span>
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 right-0 h-0.5 w-full rounded-full bg-[#D7AE46]" />
                    )}
                  </button>
                );
              })}
            </div>

         <div
  dir="rtl"
  className="overflow-hidden rounded-[22px] border border-white/5 bg-[#081A31]/95 shadow-[0_30px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm"
>
  {/* 👇 ده المهم */}
<div className="w-full overflow-x-auto xl:overflow-visible">    
    {/* 👇 ده بيحافظ على شكل الجدول */}
<div className="min-w-275 xl:min-w-0">
      {/* Header */}
      <div className="grid grid-cols-[1.2fr_1.7fr_1.15fr_1.2fr_0.95fr_0.95fr_0.95fr_1.15fr_1fr_1.15fr] items-center gap-4 bg-white/[0.03] px-6 py-4 text-[12px] text-[#90A4BF]">
        <div>رقم الفاتورة</div>
        <div>العميل</div>
        <div>نوع الخدمة</div>
        <div>المجموع الكلي</div>
        <div className="text-center">المجموع بعد الخصم</div>
        <div className="text-center">المدفوع</div>
        <div className="text-center">المتبقي</div>
        <div className="text-center">تاريخ الاستحقاق</div>
        <div className="text-center">الحالة</div>
        <div className="text-center">الإجراءات</div>
      </div>

      {/* Data */}
      {isLoading ? (
        <div className="px-6 py-8 text-center text-sm text-[#8EA3BF]">
          <span className="loading loading-infinity loading-xl"></span>
        </div>
      ) : tabFilteredInvoices.length > 0 ? (
        tabFilteredInvoices.map((invoice) => (
          <div
            key={invoice._id}
            className="grid grid-cols-[1.2fr_1.7fr_1.15fr_1.2fr_0.95fr_0.95fr_0.95fr_1.15fr_1fr_1.15fr] items-center gap-4 border-t border-white/5 px-6 py-4 text-[13px] text-white"
          >
            <div className="font-medium text-[#D7AE46]">
              {invoice.invoiceNumber}
            </div>

            <div className="flex items-center gap-3 overflow-hidden">
              <span className="truncate">
                {invoice.client.fullName}
              </span>
            </div>

            <div className="text-[12px] text-[#D1D9E6]">
              {invoice.service}
            </div>

            <div>{invoice.subtotal}</div>

            <div className="text-center font-semibold">
              {invoice.total}
            </div>

            <div className="text-center">
              {invoice.paidAmount}
            </div>

            <div className={`text-center ${getRemainingClass(invoice.status)}`}>
              {invoice.remaining}
            </div>

            <div
              className={`text-center text-[12px] ${
                invoice.status === "متأخرة"
                  ? "text-[#F05B5B]"
                  : "text-[#8EA3BF]"
              }`}
            >
              {invoice?.dueDate
                ? formatDateToArabic(invoice.dueDate)
                : "لم يتم التحديد"}
            </div>

            <div className="flex justify-center">
              <span
                className={`inline-flex min-w-18 items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium ${getStatusClass(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#8EA3BF]">
              <button
                onClick={() => setSelectedInvoice(invoice)}
                className="rounded-full border border-white/10 bg-white/2 p-2 transition hover:bg-white/10 hover:text-white"
              >
                <HiOutlineEye size={14} />
              </button>

              <button
                onClick={() => handleDelete(invoice._id)}
                className="rounded-full border border-white/10 bg-white/2 p-2 text-red-400 transition hover:bg-white/10 hover:text-red-600"
              >
                <HiOutlineTrash size={14} />
              </button>

              <button
                onClick={() => PrintSingleInvoic(invoice._id)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#243752] text-[#a7bad2] transition hover:bg-[#12233f] hover:text-white"
              >
                <HiOutlinePrinter size={18} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="px-6 py-8 text-center text-sm text-[#8EA3BF]">
          لا توجد نتائج مطابقة
        </div>
      )}

    </div>
  </div>

  {/* pagination زي ما هو بدون تعديل */}
  <div className="flex flex-col gap-4 border-t border-white/5 px-6 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-[#8EA3BF]">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <HiOutlineChevronRight size={14} />
                  </button>

                  {pageNumbers.map((pageNumber) => {
                    const active = pageNumber === currentPage;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`flex h-8 min-w-8 items-center justify-center rounded-full border text-xs transition ${active
                          ? "border-[#D7AE46] bg-[#D7AE46] text-[#071A2F]"
                          : "border-white/10 bg-white/[0.02] text-[#8EA3BF] hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <HiOutlineChevronLeft size={14} />
                  </button>
                </div>

                <div className="text-xs text-[#647B98]">
                  عرض {total === 0 ? 0 : (page - 1) * limit + 1} إلى{" "}
                  {Math.min(page * limit, total)} من أصل {total} فاتورة
                </div>
              </div>
</div>

            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-white/5 bg-[#081A31]/95 px-6 py-5 shadow-[0_25px_40px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#8EA3BF]">إجمالي الإيرادات</p>
                    <h3 className="mt-2 text-[31px] font-bold tracking-wide text-white">
                      {data?.data?.stats?.totalRevenue}
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D7AE46]/15 text-[#D7AE46]">
                    <HiOutlineCurrencyDollar size={22} />
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-white/5 bg-[#081A31]/95 px-6 py-5 shadow-[0_25px_40px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#8EA3BF]">مستحقات غير مدفوعة</p>
                    <h3 className="mt-2 text-[31px] font-bold tracking-wide text-white">
                      {data?.data?.stats?.totalUnpaid}
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#24334A] text-[#91A4BF]">
                    <HiOutlineClipboardDocumentList size={22} />
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-white/5 bg-[#081A31]/95 px-6 py-5 shadow-[0_25px_40px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#8EA3BF]">فواتير متأخرة التحصيل</p>
                    <h3 className="mt-2 text-[31px] font-bold tracking-wide text-white">
                      {data?.data?.stats?.overdueAmount}
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3A2230] text-[#F05B5B]">
                    <HiOutlineExclamationCircle size={22} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Bills