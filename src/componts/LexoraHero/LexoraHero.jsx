import { MdAccountBalanceWallet, MdVerified } from "react-icons/md";
import logo from "../../assets/images/LEX LOGO.png"
import { BsPeopleFill } from "react-icons/bs";

export default function LexoraHero() {
    const features = [
        {
            title: "إدارة القضايا الذكية",
            desc: "تنظيم وجدولة متقدمة لكل تفاصيل ملفاتك",
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3l2.2 1.2 2.5-.2.8 2.4 2.2 1.2-1.2 2.2.2 2.5-2.4.8-1.2 2.2-2.2-1.2-2.5.2-.8-2.4-2.2-1.2 1.2-2.2-.2-2.5 2.4-.8L12 3z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )
        },
        {
            title: "بوابة العملاء",
            desc: "تواصل احترافي ومشاركة آمنة للمستندات",
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
                    <circle cx="10" cy="7" r="3" />
                    <path d="M20 8v6m3-3h-6" />
                </svg>
            )
        },
        {
            title: "نظام مالي متطور",
            desc: "فوترة دقيقة وتحصيل إلكتروني سريع",
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5" y="4" width="14" height="16" rx="2" />
                    <path d="M9 8h6M9 12h6M9 16h4" />
                </svg>
            )
        }
    ];

    return (
        <section dir="rtl" className="min-h-screen  w-full relative overflow-hidden bg-linear-to-br from-[#08162e] via-[#0d1f45] to-[#2d3c95] text-white">
            {/* background lines */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,transparent_49.7%,rgba(255,255,255,0.06)_50%,transparent_50.3%)]" />
            </div>

            <div className="relative  mx-auto  px-6  flex items-center justify-center ">
                <div className="flex flex-col items-center text-center">
                    {/* Logo */}
                    <div className="mt-17">
                        <div className="w-32 sm:w-40 md:w-45 mx-auto flex justify-center">
                            <img src={logo} className="w-full " alt="" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-black leading-tight text-[#d8af4d] mb-6">
                        ليكسورا - LEXORA
                    </h1>

                    <p className="text-xl  text-slate-300 mb-2">
                        نظام متكامل لإدارة مكاتب المحاماة
                    </p>

                    {/* Features */}
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="flex flex-col  gap-8 p-8" >

                            {/* إدارة القضايا الذكية */}
                            <div className="flex items-center justify-end gap-6">
                                <div className="bg-[#1a2a4a] border border-[#C9A14A33] rounded-2xl p-4 flex-shrink-0">
                                    <MdVerified className="text-[#C9A14A] w-4 h-4" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-white text-l font-bold mb-1">إدارة القضايا الذكية</h3>
                                    <p className="text-slate-400 text-sm">تنظيم وجدولة متقدمة لكل تفاصيل ملفاتك</p>
                                </div>
                            </div>

                            {/* بوابة العملاء */}
                            <div className="flex items-center justify-around gap-6">
                                <div className="bg-[#1a2a4a] border border-[#C9A14A33] rounded-2xl p-4 flex-shrink-0">
                                    <BsPeopleFill className="text-[#C9A14A] w-4 h-4" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-white text-l font-bold mb-1">بوابة العملاء</h3>
                                    <p className="text-slate-400 text-sm">تواصل احترافي ومشاركة آمنة للمستندات</p>
                                </div>
                            </div>

                            {/* نظام مالي متطور */}
                            <div className="flex items-center justify-around gap-10">
                                <div className="bg-[#1a2a4a] border border-[#C9A14A33] rounded-2xl p-4 ">
                                    <MdAccountBalanceWallet className="text-[#C9A14A] w-4 h-4" />
                                </div>
                                <div className="text-right">
                                    <h3 className="text-white text-l font-bold mb-1">نظام مالي متطور</h3>
                                    <p className="text-slate-400 text-sm">فوترة دقيقة وتحصيل إلكتروني سريع</p>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
