import { PaginationButton } from 'flowbite-react';
import React, { useState, useMemo } from 'react'
import { BiCalendar, BiCalendarAlt, BiCalendarCheck, BiChevronDown, BiChevronLeftCircle, BiChevronRight, BiCloudDownload, BiDownload, BiPlus, BiSearch } from 'react-icons/bi'
import { BsEye } from 'react-icons/bs';
import { FiEdit3, FiRotateCcw } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineFolder,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { RiDeleteBin6Line } from 'react-icons/ri';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const CaseMange = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = [
    { label: 'الحالة' },
    { label: 'نوع القضية' },
    { label: 'المحكمة' },
    { label: 'المحامي' },
  ];
  const tabs = [
    { id: "all", label: "كل القضايا" },

  ];






  const getStatusStyle = (status) => {
    switch (status) {
      case "نشطة":
        return "border border-[#6f5a22] bg-[#2a2411] text-[#d7b14a]";
      case "مؤجلة":
        return "border border-[#31445c] bg-[#162538] text-[#9db2ca]";
      case "مغلقة":
        return "border border-[#28364d] bg-[#111c2c] text-[#7f90a8]";
      case "مؤرشفة":
        return "border border-[#4a2c33] bg-[#1d1419] text-[#c67886]";
      default:
        return "border border-[#31445c] bg-[#162538] text-[#9db2ca]";
    }
  };
  function getAllCases() {
    return api.get("/LegalCase/", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,

      }
    })
  }
  const { data: Cases, isLoading } = useQuery({
    queryKey: ["Cases"],
    queryFn: getAllCases
  })

  async function deleteCase(id) {
    try {
      const res = await api.delete(
        `/LegalCase/${id}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log("Delete response:", res.data);
      return res.data;
    } catch (error) {
      console.log("Delete error:", error);
      console.log("Delete error response:", error.response);
      throw error;
    }
  }

  const deleteMutation = useMutation({
    mutationFn: deleteCase,

    onSuccess: () => {
      toast.success("Case deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["Cases"] });
      queryClient.refetchQueries({ queryKey: ["Cases"], type: "active" });
    },

    onError: (error) => {
      console.log("Delete mutation error:", error);
      toast.error("Something went wrong while deleting");
    },
  });
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };
  console.log(Cases?.data?.cases);
  const cases = Cases?.data?.cases || [];
  const filteredCases = useMemo(() => {
    if (activeTab === "all") return cases;
    return cases.filter((item) => item.tab === activeTab);
  }, [activeTab, cases]);
  return (
    <>
      <div className="w-full  px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 font-sans" dir="rtl">
  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
    {/* Title and Subtitle */}
    <div className="text-right order-1">
      <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">
        إدارة القضايا
      </h1>
      <p className="text-gray-400 text-sm sm:text-base leading-6">
        نظرة عامة على جميع القضايا القانونية النشطة والمؤجلة والمغلقة
      </p>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 order-2 xl:order-1">
      <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
        <BiDownload size={18} />
        <span className="text-sm">تصدير PDF / Excel</span>
      </button>

      <Link to={"/CaseMangemnt/AddNewCase"} className="w-full sm:w-auto">
        <button className="w-full sm:w-auto flex items-center justify-center cursor-pointer gap-2 bg-[#c5a059] hover:bg-[#b38f4d] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold transition-colors shadow-lg">
          <BiPlus size={20} />
          <span>إضافة قضية جديدة</span>
        </button>
      </Link>
    </div>
  </div>
</div>

<div className="w-full  px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6" dir="rtl">
  <div className="bg-[#061224]/50 p-4 rounded-xl border border-gray-800">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3">
      {/* Search Input */}
      <div className="relative md:col-span-2 xl:col-span-5">
        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <BiSearch size={18} className="text-gray-500" />
        </span>
        <input
          type="text"
          className="w-full bg-[#0b0f1a] border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-10 placeholder-gray-500"
          placeholder="البحث برقم القضية، اسم العميل، أو موضوع النزاع..."
        />
      </div>

      {/* Dropdown Filters */}
      {filterOptions.map((filter, index) => (
        <div key={index} className="xl:col-span-2">
          <button className="w-full flex items-center justify-between bg-[#0b0f1a] border border-gray-700 text-gray-400 text-sm px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
            <BiChevronDown size={16} className="text-gray-500 shrink-0" />
            <span className="truncate">{filter.label}</span>
          </button>
        </div>
      ))}

      {/* Reset Button */}
      <div className="xl:col-span-1 flex items-center">
        <button className="w-full xl:w-auto flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm px-4 py-2.5 transition-colors">
          <FiRotateCcw size={16} />
          <span>إعادة ضبط</span>
        </button>
      </div>
    </div>
  </div>
</div>
      {/* name of each tab group should be unique */}

      <div className="min-h-screen bg-[#061224] p-6 text-white" dir="rtl">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#1a2d47] pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      // setCurrentPage(1);
                    }}
                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition ${isActive
                      ? "text-[#d7b14a]"
                      : "text-[#7f93ad] hover:text-white"
                      }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-[-17px] right-0 h-[2px] w-full bg-[#d7b14a]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-sm text-[#7f93ad]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3a1820] text-[10px] text-[#ff6b81]">
                3
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#1a2d47] bg-[#09172b] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#1a2d47] text-xs text-[#7f93ad]">
                    <th className="px-6 py-4 text-right font-medium">رقم القضية</th>
                    <th className="px-6 py-4 text-right font-medium">العميل</th>
                    <th className="px-6 py-4 text-right font-medium">نوع القضية</th>
                    <th className="px-6 py-4 text-right font-medium">المحكمة</th>
                    <th className="px-6 py-4 text-right font-medium">الجلسة القادمة</th>
                    <th className="px-6 py-4 text-right font-medium">الحالة</th>
                    <th className="px-6 py-4 text-right font-medium">الإجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center">
                        <div className="flex items-center justify-center">
                          <span className="loading loading-infinity w-16 text-[#d3a63f]"></span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCases.length > 0 ? (
                    filteredCases.map((item, index) => (
                      <tr
                        key={`${item.id}-${index}`}
                        className="border-b border-[#13243b] text-sm text-[#dbe7f5] last:border-b-0"
                      >
                        <td className="px-6 py-5 font-semibold text-[#d7b14a]">
                          {item.caseNumber}
                        </td>

                        <td className="px-6 py-5">
                          <div className="font-medium text-white">{item.client?.fullName}</div>
                          <div className="mt-1 text-xs text-[#6f86a6]">{item.clientId}</div>
                        </td>

                        <td className="px-6 py-5 text-[#c8d6e8]">
                          {item.caseType?.name}
                        </td>

                        <td className="px-6 py-5 text-[#c8d6e8]">{item.court}</td>

                        <td className="px-6 py-5">
                          <div className="text-[#dbe7f5]">{item.nextSession}</div>
                          {item.nextSessionTime ? (
                            <div className="mt-1 text-xs text-[#6f86a6]">
                              {item.nextSessionTime}
                            </div>
                          ) : null}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Link to={`/CaseMangemnt/CaseDetails/${item.id}`}>
                              <button
                                type="button"
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#2c425f] bg-[#0b1c35] text-[#d7b14a] transition hover:bg-[#112541]"
                              >
                                <HiOutlineEye size={16} />
                              </button>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="cursor-pointer text-lg text-red-400 hover:text-red-600"
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-10 text-center text-sm text-[#7f93ad]"
                      >
                        لا توجد قضايا في هذا التبويب
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1a2d47] px-6 py-4">
              <p className="text-xs text-[#6f86a6]">
                عرض 1 إلى {filteredCases.length} من أصل {cases.length} قضية
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-[#1f3552] bg-[#0a1830] text-[#7f93ad] transition hover:text-white"
                >
                  <HiOutlineChevronRight size={16} />
                </button>

                <button
                  type="button"
                  className="flex h-8 min-w-[32px] items-center justify-center rounded-md bg-[#d7b14a] px-3 text-xs font-bold text-[#0a1322]"
                >
                  1
                </button>

                <button
                  type="button"
                  className="flex h-8 min-w-[32px] items-center justify-center rounded-md border border-[#1f3552] bg-[#0a1830] px-3 text-xs text-[#7f93ad] transition hover:text-white"
                >
                  2
                </button>

                <button
                  type="button"
                  className="flex h-8 min-w-[32px] items-center justify-center rounded-md border border-[#1f3552] bg-[#0a1830] px-3 text-xs text-[#7f93ad] transition hover:text-white"
                >
                  3
                </button>

                <span className="px-1 text-[#7f93ad]">...</span>

                <button
                  type="button"
                  className="flex h-8 min-w-[32px] items-center justify-center rounded-md border border-[#1f3552] bg-[#0a1830] px-3 text-xs text-[#7f93ad] transition hover:text-white"
                >
                  44
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-[#1f3552] bg-[#0a1830] text-[#7f93ad] transition hover:text-white"
                >
                  <HiOutlineChevronLeft size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CaseMange