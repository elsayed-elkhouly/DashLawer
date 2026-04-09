import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, Search, User } from 'lucide-react'
import React from 'react'
import { MdOutlinePictureAsPdf } from "react-icons/md";
import Cookies from 'js-cookie';
import api from '../../api/axios';

const DigitalArchive = () => {
  function getData() {
    return api.get("/Archive/?page=1", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["Archive"],
    queryFn: getData,
  });

  console.log(data?.data?.documents);

  return (
    <>
      <div className=" w-full p-4 md:p-8 font-sans" dir="rtl">
        {/* Title Section */}
        <div className="mb-6 md:mb-8 text-right">
          <h1 className="text-xl md:text-3xl font-bold text-white">
            الأرشيف الرقمي
          </h1>
          <p className="mt-1 text-xs md:text-sm text-gray-400">
            إدارة الوثائق القانونية والملفات السرية للمكتب
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="rounded-2xl border border-gray-800 bg-[#061328]/50 p-4 md:p-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row-reverse items-stretch md:items-center gap-3">

            {/* Main Search Input */}
            <div className="relative w-full md:grow order-1 md:order-2">
              <input
                type="text"
                placeholder="البحث عن اسم ملف، رقم قضية، أو موكل..."
                className="w-full rounded-xl border border-gray-700 bg-[#1a2634] py-2 md:py-3 pr-4 pl-10 text-sm md:text-base text-right text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-500" />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 order-2 md:order-1">
              <button className="text-xs md:text-sm rounded-full border border-gray-700 bg-[#1a2634] px-4 md:px-6 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                نوع الوثيقة
              </button>

              <button className="text-xs md:text-sm rounded-full border border-gray-700 bg-[#1a2634] px-4 md:px-6 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                تاريخ الرفع
              </button>

              <button className="text-xs md:text-sm rounded-full border border-gray-700 bg-[#1a2634] px-4 md:px-6 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                الحالة
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-3 md:px-6">
  {isLoading ? (
    <div className="text-white text-center col-span-full">
      جاري تحميل الملفات...
    </div>
  ) : error ? (
    <div className="text-red-400 text-center col-span-full">
      حدث خطأ أثناء تحميل البيانات
    </div>
  ) : data?.data?.documents?.length > 0 ? (
    data?.data?.documents?.map((doc, index) => {
      return (
        <a
          key={doc?._id || doc?.id || index}
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div
            className="cursor-pointer w-full rounded-2xl md:rounded-3xl border border-[#FFFFFF14] bg-[#061328] p-4 md:p-6 text-white shadow-xl transition-all hover:border-[#C9A34A]"
            dir="rtl"
          >
            {/* Top Section */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center justify-center rounded-2xl md:rounded-3xl bg-[#EF44441A] p-2 md:p-3">
                <MdOutlinePictureAsPdf className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
              </div>
              <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#C9A34A]" />
            </div>

            {/* Content */}
            <div className="mb-4 md:mb-6 text-right">
              <h3 className="mb-1 text-base md:text-xl font-bold line-clamp-2">
                {doc.name}
              </h3>

              <p className="text-xs md:text-sm font-mono text-gray-500">
                رقم القضية: #CASE-2024-001
              </p>

              <p className="text-xs md:text-sm font-mono text-gray-500">
                {doc.relatedDisplay}
              </p>
            </div>

            {/* Divider */}
            <div className="mb-3 md:mb-4 h-px w-full bg-gray-800" />

            {/* Footer */}
            <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <User size={14} />
                <span className="truncate max-w-[120px] md:max-w-full">
                  {doc.clientName}
                </span>
              </div>
            </div>
          </div>
        </a>
      );
    })
  ) : (
    <div className="text-gray-400 text-center col-span-full">
      لا توجد مستندات حالياً
    </div>
  )}
</div>
    </>
  );
};
export default DigitalArchive