import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, Search, User } from 'lucide-react'
import React, { useState } from 'react'
import { MdOutlinePictureAsPdf } from "react-icons/md";
import Cookies from 'js-cookie';
import api from '../../api/axios';

const DigitalArchive = () => {
  const [searchTerm, setSearchTerm] = useState("");
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

const documents = data?.data?.documents || [];

const filteredDocuments = useMemo(() => {
  if (!searchTerm.trim()) return documents;

  const term = searchTerm.toLowerCase();

  return documents.filter((doc) => {
    return (
      doc.name?.toLowerCase().includes(term) ||
      doc.clientName?.toLowerCase().includes(term) ||
      doc.relatedDisplay?.toLowerCase().includes(term)
    );
  });
}, [documents, searchTerm]);
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث عن اسم ملف، رقم قضية، أو موكل..."
                className="h-12 w-full rounded-2xl border border-[#132949] bg-[#091b35] pr-11 pl-4 text-sm text-white outline-none transition placeholder:text-[#59708f] focus:border-[#d4aa45]/70 focus:ring-2 focus:ring-[#d4aa45]/20"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-500" />
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
        ) : filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc, index) => {
            return (
              <a
                key={doc?._id || doc?.id || index}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div
                  className="cursor-pointer w-full rounded-2xl md:rounded-3xl border border-[#C9A34A]/30 bg-[#061328] p-4 md:p-6 text-white shadow-xl transition-all hover:border-[#C9A34A]"
                  dir="rtl"
                >
                  {/* Top Section */}
                  <div className="mb-4 flex items-start justify-between">
                    {/* Right in RTL */}
                    <div className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl md:rounded-3xl bg-[#EF44441A] shrink-0">
                      <MdOutlinePictureAsPdf className="h-5 w-5 md:h-7 md:w-7 text-red-500" />
                    </div>

                    {/* Left in RTL */}
                    <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-[#C9A34A] shrink-0" />
                  </div>

                  {/* Content */}
                  <div className="mb-4 md:mb-6 text-right min-w-0">
                    <h3 className="mb-2 text-base md:text-xl font-bold leading-7 line-clamp-2 break-words">
                      {doc.name}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-400">
                      <span className="text-gray-500">رقم القضية:</span>{" "}
                      <span dir="ltr" className="inline-block font-mono">
                        CASE-2024-001
                      </span>
                    </p>

                    {doc.relatedDisplay && (
                      <p className="mt-1 text-xs md:text-sm text-gray-500 truncate">
                        {doc.relatedDisplay}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="mb-3 md:mb-4 h-px w-full bg-white/10" />

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-400 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <User size={14} className="shrink-0" />

                      <span
                        dir="ltr"
                        className="truncate max-w-37.5"
                      >
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