import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeftRight, ChevronDown, ChevronLeft, ChevronRight, Download, Edit2, Eye, PlusCircle, RotateCcw, Search, Trash2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Team = () => {
  const queryClient = useQueryClient();
  const formatEgyptDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "تاريخ غير صالح";

    return new Intl.DateTimeFormat("ar-EG", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };


  function getUSers() {
    return api.get("/users", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,

      }
    })
  }
  const { data, isLoading } = useQuery({
    queryKey: ["Users"],
    queryFn: getUSers
  })

  console.log(data?.data);

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      api.delete(`/users/hardDeleteUser/${id}`, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),

    onSuccess: () => {
      toast.success(" تم المسح")
      queryClient.invalidateQueries(["Users"]);
    },

    onError: (error) => {
      console.log(error.response?.data || error.message);
    },
  });
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };
  return (

    <>
      {/* Header */}
      <div
        className="w-full  px-4 sm:px-6 lg:px-8 py-5 mt-5 font-sans"
        dir="rtl"
      >
        <div className="flex flex-col gap-5 lg:flex-row-reverse lg:items-center lg:justify-between">
          {/* Left Side: Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-[#C59D4A] text-[#C59D4A] rounded-3xl hover:bg-[#C59D4A] hover:text-white transition-all duration-300">
              <Download size={18} />
              <span className="text-sm font-medium">تصدير PDF / Excel</span>
            </button>

            <Link to={"/AddMember"} className="w-full sm:w-auto">
              <button className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-7 py-3 bg-[#C59D4A] text-white rounded-2xl hover:bg-[#b08b3e] transition-all duration-300 shadow-lg shadow-[#C59D4A]/20">
                <PlusCircle size={18} />
                <span className="text-sm font-medium">إضافة عضو جديد</span>
              </button>
            </Link>
          </div>
          {/* Right Side: Title and Subtitle */}
          <div className="text-right">
            <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1">
              أعضاء الفريق
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-6">
              إدارة الصلاحيات والوصول للموظفين والمستشارين القانونيين
            </p>
          </div>


        </div>
      </div>

      {/* Filters */}
      {/* <section className="px-3 sm:px-4 lg:px-6"> */}
      {/* <div
          className="w-full mx-auto bg-[#101c2e] py-6 sm:py-8 px-4 sm:px-5 rounded-xl border border-gray-800/50"
          dir="rtl"
        > */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4"> */}
      {/* Search Input */}
      {/* <div className="md:col-span-2 xl:col-span-5">
              <label className="block text-gray-400 text-sm mb-2 mr-1">البحث</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث بالاسم، البريد، أو التخصص..."
                  className="w-full bg-[#16253a] border border-gray-700 text-white rounded-lg py-2.5 pr-10 pl-4 focus:outline-none focus:border-[#C59D4A] transition-colors"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
              </div>
            </div> */}

      {/* Account Type Dropdown */}
      {/* <div className="xl:col-span-2">
              <label className="block text-gray-400 text-sm mb-2 mr-1">نوع الحساب</label>
              <div className="relative">
                <select className="w-full bg-[#16253a] border border-gray-700 text-white rounded-lg py-2.5 pr-4 pl-10 appearance-none focus:outline-none focus:border-[#C59D4A]">
                  <option>الكل</option>
                  <option>موظف</option>
                  <option>مستشار</option>
                </select>
                <ChevronDown
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
            </div> */}

      {/* Status Dropdown */}
      {/* <div className="xl:col-span-2">
              <label className="block text-gray-400 text-sm mb-2 mr-1">الحالة</label>
              <div className="relative">
                <select className="w-full bg-[#16253a] border border-gray-700 text-white rounded-lg py-2.5 pr-4 pl-10 appearance-none focus:outline-none focus:border-[#C59D4A]">
                  <option>الكل</option>
                  <option>نشط</option>
                  <option>غير نشط</option>
                </select>
                <ChevronDown
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
            </div> */}

      {/* Search Button */}
      {/* <div className="xl:col-span-2 flex items-end">
              <button className="w-full bg-[#C59D4A] hover:bg-[#b08b3e] text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-[#C59D4A]/10">
                بحث
              </button>
            </div> */}

      {/* Reset Button */}
      {/* <div className="xl:col-span-1 flex items-end">
              <button
                type="reset"
                className="w-full xl:w-auto flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2.5 px-2 transition-colors"
              >
                <RotateCcw size={16} />
                <span className="text-sm">إعادة ضبط</span>
              </button>
            </div> */}
      {/* </div>
        </div> */}
      {/* </section> */}

      {/* Table */}
      <section className="px-3 sm:px-4 lg:px-6">
        <div
          className="w-full mx-auto mt-5 bg-[#101c2e] rounded-xl border border-gray-800 overflow-hidden mb-10"
          dir="rtl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-60 sm:h-72">
              <span className="loading loading-infinity w-20 sm:w-28 text-[#d3a63f] text-center"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-right border-collapse">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-800 bg-[#0f172a]">
                    <th className="p-4 font-medium">العضو</th>
                    <th className="p-4 font-medium">البريد الإلكتروني</th>
                    <th className="p-4 font-medium">رقم الجوال</th>
                    <th className="p-4 font-medium text-center">نوع الحساب</th>
                    <th className="p-4 font-medium text-center">الحالة</th>
                    <th className="p-4 font-medium text-center">تاريخ الإضافة</th>
                    <th className="p-4 font-medium text-center">الإجراءات</th>
                  </tr>
                </thead>

                <tbody className="text-gray-300">
                  {data?.data?.users?.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-gray-800/50 hover:bg-white/5 transition-colors"
                    >
                      {/* Member Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          {member.ProfilePhoto?.url ? (
                            <img
                              src={member.ProfilePhoto.url}
                              alt={member.UserName}
                              className="w-10 h-10 rounded-full border border-gray-700 object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center bg-gray-700 text-white text-sm font-bold shrink-0">
                              {member?.UserName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-white font-bold text-sm truncate">
                              {member.UserName
                              }
                            </div>
                            {/* <div className="text-gray-500 text-xs truncate">
                              {member.role}
                            </div> */}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-sm whitespace-nowrap">
                        {member.email || "-"}
                      </td>

                      <td className="p-4 text-sm font-mono whitespace-nowrap">
                        {member.phone || "-"}
                      </td>

                      {/* Account Type Badge */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs border ${member.role === "ADMIN"
                            ? "border-[#C59D4A] text-[#C59D4A]"
                            : "border-gray-700 text-gray-400"
                            } bg-gray-800/30`}
                        >
                          {member.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${member.isDeleted ? "bg-gray-500" : "bg-emerald-500"
                              }`}
                          ></span>
                        </div>
                      </td>

                      <td className="p-4 text-center text-sm text-gray-500 whitespace-nowrap">
                        {formatEgyptDate(member?.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                          <Link to={`/TeamMember/TeamProfile/${member?.id}`}>
                            <button className="p-1.5 cursor-pointer rounded-full border border-gray-700 text-gray-400 hover:text-[#C59D4A] hover:border-[#C59D4A] transition-colors">
                              <Eye size={16} />
                            </button>
                          </Link>


                          <button
                            onClick={() => handleDelete(member?.id)}
                            className="p-1.5 cursor-pointer rounded-full border border-gray-700 text-red-500 hover:bg-red-500/10 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {/*
      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800 text-sm">
        <div className="text-gray-500 text-center sm:text-right">
          عرض <span className="text-white">1</span> إلى <span className="text-white">10</span> من أصل <span className="text-white">235</span> عضو
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button className="p-2 rounded-lg border border-gray-800 text-gray-400"><ChevronRight size={18} /></button>
          <button className="w-8 h-8 rounded-lg bg-[#C59D4A] text-[#0B121D] font-bold">1</button>
          <button className="w-8 h-8 rounded-lg border border-gray-800 text-gray-400">2</button>
          <button className="w-8 h-8 rounded-lg border border-gray-800 text-gray-400">3</button>
          <span className="text-gray-600 px-1">...</span>
          <button className="w-8 h-8 rounded-lg border border-gray-800 text-gray-400">24</button>
          <button className="p-2 rounded-lg border border-gray-800 text-gray-400"><ChevronLeft size={18} /></button>
        </div>
      </div>
      */}
        </div>
      </section>
    </>
  )
}

export default Team