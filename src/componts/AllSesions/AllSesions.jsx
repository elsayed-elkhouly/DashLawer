import React from 'react'
import api from '../../api/axios';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { BiCalendar, BiChevronLeft, BiMapPin } from 'react-icons/bi';

const AllSesions = () => {
  function getSessions() {
    return api.get("/session/", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      }
    })
  }
  const { data: Session } = useQuery({
    queryKey: ["Sessions"],
    queryFn: getSessions
  })
  console.log(Session?.data?.sessions);
  function formatDateArabic(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();

    const months = [
      "يناير", "فبراير", "مارس", "أبريل",
      "مايو", "يونيو", "يوليو", "أغسطس",
      "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    const month = months[date.getMonth()];

    return `${day} ${month}`;
  }
  const formatDate = (date) => {
    if (!date) return "غير متوفر";

    return new Date(date).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <>

      <section className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="w-full p-4 sm:p-6 bg-[#061328] text-white font-sans rounded-2xl border border-gray-800">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <BiCalendar className="w-5 h-5 text-[#C9A14A]" />
              <h2 className="text-lg sm:text-xl font-bold">جلسات الاستماع القادمة</h2>
            </div>

          </div>

          <div className="space-y-4">
            {Session?.data?.sessions
              ?.slice(0, 3)
              .map((hearing) => (
                <div
                  key={hearing.id}
                  className="p-4 bg-[#09172b] border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="bg-[#0b1220] border border-amber-500/20 rounded-xl px-4 py-2 text-center min-w-17.5 shrink-0">
                        <span className="block text-xl font-bold text-[#C9A14A]">
                          {formatDateArabic(hearing.startAt)}
                        </span>
                      </div>

                      <div className="text-right min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base mb-1 wrap-break-word">
                          {hearing.legalCase.description}
                        </h3>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <BiMapPin className="w-3 h-3 shrink-0" />
                          <span className="wrap-break-word">
                            {hearing.courtName} - {hearing.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6">
                      <div className="text-right lg:text-left">
                        <p className="text-sm font-bold mb-1">
                          {formatDate(hearing.startAt)}
                        </p>
                        <span className="inline-block text-[10px] sm:text-xs px-3 py-1 rounded-full border bg-[#101c2e]">
                          {hearing.type}
                        </span>
                      </div>
                      <BiChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>)
}

export default AllSesions