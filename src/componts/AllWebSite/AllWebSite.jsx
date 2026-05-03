import React, { useState } from 'react'
import {
    FaBalanceScale, FaGavel, FaLandmark,
    FaChartLine, FaFileInvoiceDollar, FaBuilding,
    FaStar, FaCar, FaShieldAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
const AllWebSite = () => {
    const services = [
        { title: "مجلس الدولة", subtitle: "القضاء الإداري", icon: <FaBalanceScale />, link: "https://esc.gov.eg/" },
        { title: "النيابة العامة", subtitle: "بوابة النيابة العامة", icon: <FaGavel />, link: "https://ppo.gov.eg/ppo/r/ppoportal/ppoportal/home" },
        { title: "وزارة العدل", subtitle: "الخدمات القضائية والمحاكم", icon: <FaLandmark />, link: "https://moj.gov.eg/" },
        { title: "هيئة الاستثمار", subtitle: "تسجيل الشركات والاستثمار", icon: <FaChartLine />, link: "https://www.investinegypt.gov.eg/Arabic/Pages/default.aspx" },
        { title: "مصلحة الضرائب", subtitle: "الخدمات الضريبية الإلكترونية", icon: <FaFileInvoiceDollar />, link: "https://eta.gov.eg/ar/home" },
        { title: "الشهر العقاري", subtitle: "توثيق العقارات والملكية", icon: <FaBuilding />, link: "https://rern.gov.eg/" },
        { title: "المرور", subtitle: "خدمات المرور وترخيص السيارات", icon: <FaCar />, link: "https://traffic.moi.gov.eg/Arabic/Pages/default.aspx" },
        { title: "وزارة الداخلية", subtitle: "الخدمات المدنية والأمنية", icon: <FaShieldAlt />, link: "https://moi.gov.eg/" },
    ];
    const servicesByCountry = {
        EG: [
            { title: "مجلس الدولة", subtitle: "القضاء الإداري", icon: <FaBalanceScale />, link: "https://esc.gov.eg/" },
            { title: "النيابة العامة", subtitle: "بوابة النيابة العامة", icon: <FaGavel />, link: "https://ppo.gov.eg/ppo/r/ppoportal/ppoportal/home" },
            { title: "وزارة العدل", subtitle: "الخدمات القضائية والمحاكم", icon: <FaLandmark />, link: "https://moj.gov.eg/" },
            { title: "هيئة الاستثمار", subtitle: "تسجيل الشركات والاستثمار", icon: <FaChartLine />, link: "https://www.investinegypt.gov.eg/Arabic/Pages/default.aspx" },
            { title: "مصلحة الضرائب", subtitle: "الخدمات الضريبية الإلكترونية", icon: <FaFileInvoiceDollar />, link: "https://eta.gov.eg/ar/home" },
            { title: "الشهر العقاري", subtitle: "توثيق العقارات والملكية", icon: <FaBuilding />, link: "https://rern.gov.eg/" },
            { title: "المرور", subtitle: "خدمات المرور وترخيص السيارات", icon: <FaCar />, link: "https://traffic.moi.gov.eg/Arabic/Pages/default.aspx" },
            { title: "وزارة الداخلية", subtitle: "الخدمات المدنية والأمنية", icon: <FaShieldAlt />, link: "https://moi.gov.eg/" }, ,
        ],
        SA: [
            { title: "وزارة العدل", subtitle: "ناجز للخدمات العدلية", icon: <FaBalanceScale />, link: "https://www.moj.gov.sa/" },
            { title: "النيابة العامة", subtitle: "بوابة النيابة العامة", icon: <FaGavel />, link: "https://www.pp.gov.sa/" },
            { title: "وزارة الاستثمار", subtitle: "استثمر في السعودية", icon: <FaChartLine />, link: "https://misa.gov.sa/" },
            { title: "هيئة الزكاة والضريبة", subtitle: "الخدمات الضريبية", icon: <FaFileInvoiceDollar />, link: "https://zatca.gov.sa/" },
            { title: "وزارة الداخلية", subtitle: "أبشر للخدمات الإلكترونية", icon: <FaShieldAlt />, link: "https://www.absher.sa/" },
            { title: "وزارة العدل", subtitle: "كتابات العدل", icon: <FaBuilding />, link: "https://www.moj.gov.sa/" },
            { title: "المرور", subtitle: "خدمات المرور", icon: <FaCar />, link: "https://www.moi.gov.sa/" },
            { title: "وزارة التجارة", subtitle: "منصة الأعمال", icon: <FaStar />, link: "https://mc.gov.sa/" },
        ],
        AE: [
            { title: "وزارة العدل", subtitle: "الخدمات القضائية", icon: <FaBalanceScale />, link: "https://www.moj.gov.ae/" },
            { title: "النيابة العامة", subtitle: "النيابة الاتحادية", icon: <FaGavel />, link: "https://www.pp.gov.ae/" },
            { title: "اقتصادية دبي", subtitle: "تراخيص الأعمال", icon: <FaChartLine />, link: "https://ded.ae/" },
            { title: "الهيئة الاتحادية للضرائب", subtitle: "الخدمات الضريبية", icon: <FaFileInvoiceDollar />, link: "https://tax.gov.ae/" },
            { title: "وزارة الداخلية", subtitle: "الخدمات المرورية والأمنية", icon: <FaShieldAlt />, link: "https://moi.gov.ae/" },
            { title: "دائرة الأراضي", subtitle: "تسجيل العقارات", icon: <FaBuilding />, link: "https://dubailand.gov.ae/" },
            { title: "هيئة الطرق والمواصلات", subtitle: "خدمات المرور", icon: <FaCar />, link: "https://www.rta.ae/" },
            { title: "منصة حكومة الإمارات", subtitle: "خدمات شاملة", icon: <FaStar />, link: "https://u.ae/" },
        ],
        KW: [
            { title: "وزارة العدل", subtitle: "الخدمات القضائية", icon: <FaBalanceScale />, link: "https://www.moj.gov.kw/" },
            { title: "النيابة العامة", subtitle: "بوابة النيابة العامة", icon: <FaGavel />, link: "https://pp.gov.kw/" },
            { title: "وزارة التجارة", subtitle: "تراخيص الشركات", icon: <FaChartLine />, link: "https://moci.gov.kw/" },
            { title: "وزارة المالية", subtitle: "الخدمات الضريبية", icon: <FaFileInvoiceDollar />, link: "https://mof.gov.kw/" },
            { title: "وزارة الداخلية", subtitle: "خدمات المرور والجوازات", icon: <FaShieldAlt />, link: "https://moi.gov.kw/" },
            { title: "العدل", subtitle: "التسجيل العقاري", icon: <FaBuilding />, link: "https://www.moj.gov.kw/" },
            { title: "وزارة الداخلية", subtitle: "خدمات المركبات", icon: <FaCar />, link: "https://moi.gov.kw/" },
            { title: "البوابة الرسمية", subtitle: "دولة الكويت", icon: <FaStar />, link: "https://e.gov.kw/" },
        ]
    };
    const [country, setCountry] = useState("EG");
    return (
        <>
            <header>
                <div className=" p-8 dir-rtl flex  items-center justify-between" dir="rtl">
                    <div className="mb-6">
                        <h2 className="text-white text-2xl font-bold">مواقع تهمك</h2>
                        <p className="text-gray-400 mt-1">روابط سريعة للمواقع الحكومية والخدمات القانونية</p>
                    </div>

                    <div className="inline-flex bg-[#1e293b] p-1 rounded-xl">
                        <button className="bg-[#eab308] text-white px-6 py-2 rounded-lg font-bold transition-all">
                            المواقع الحكومية
                        </button>
                        {/*     
    <button class="text-gray-400 hover:text-white px-6 py-2 rounded-lg transition-all">
      الخدمات القانونية
    </button> */}
                    </div>
                </div>
            </header>
            <section>

                <div className=" p-10">
                    <div className="flex  gap-3 p-4 mb-5 ">
                        <button
                            onClick={() => setCountry("EG")}
                            className={`px-6 py-2 rounded-lg transition-colors cursor-pointer duration-200 ${country === "EG" ? "bg-[#c59d4a] text-white  font-bold" : " bg-[#183356] text-white"}`}
                        >
                            EG مصر
                        </button>

                        <button
                            onClick={() => setCountry("SA")}
                            className={`px-6 py-2 rounded-lg transition-colors cursor-pointer duration-200 ${country === "SA" ? "bg-[#c59d4a] text-white  font-bold" : " bg-[#183356] text-white"}`}
                        >
                            SA السعودية
                        </button>

                        <button
                            onClick={() => setCountry("AE")}
                            className={`px-6 py-2 rounded-lg transition-colors cursor-pointer duration-200 ${country === "AE" ? "bg-[#c59d4a] text-white  font-bold" : " bg-[#183356] text-white"}`}
                        >
                            AE الإمارات
                        </button>
                        <button
                            onClick={() => setCountry("KW")}
                            className={`px-6 py-2 rounded-lg transition-colors cursor-pointer duration-200 ${country === "KW" ? "bg-[#c59d4a] text-white  font-bold" : " bg-[#183356] text-white"}`}
                        >
                            KW الكويت
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {servicesByCountry[country]?.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div
                                    className="bg-[#081226]  py-6 px-4 rounded-xl border  hover:scale-105  duration-300 border-stone-700 hover:border-[#c59d4a] transition-all cursor-pointer flex flex-col items-center text-white shadow-lg"
                                >
                                    <div className="text-[#c59d4a] text-3xl mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                    <p className="text-stone-400 text-sm">{item.subtitle}</p>
                                </div>
                            </a>

                        ))}
                    </div>
                </div>
            </section>

        </>)
}

export default AllWebSite