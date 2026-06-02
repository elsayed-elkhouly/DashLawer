import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiCheckCircle, BiChevronDownCircle, BiLockAlt, BiMapPin, BiPhoneCall, BiUser, } from 'react-icons/bi'
import { BsChevronDown } from 'react-icons/bs'
import { CgLockUnlock } from 'react-icons/cg'
import { GoShieldCheck } from 'react-icons/go'
import { HiShieldCheck } from 'react-icons/hi2'
import { IoIosArrowBack } from 'react-icons/io'
import { MdOutlineChat } from 'react-icons/md'
import { RiMicAiLine } from 'react-icons/ri'
import { SlCalender } from 'react-icons/sl'
import api from '../../api/axios'
import { ARAB_COUNTRY_CODES } from '../../utils/constants'

const BookDate = () => {
    const [slots, setSlots] = useState([])
    const [countryCode, setCountryCode] = useState("+20");
    const [loading, setLoading] = useState(false);

    const [casee, setCase] = useState([])
    const [isloding, setisLoding] = useState(false)
    const [settings, setSettings] = useState(null);
    const features = [
        {
            title: "رد سريع خلال 24 ساعة",
            desc: "نقدر وقتك، فريقنا سيتواصل معك بأسرع وقت ممكن لتأكيد طلبك.",
        },
        {
            title: "استشارة سرية بالكامل",
            desc: "خصوصية بياناتك وقضيتك هي أولويتنا القصوى وفقاً لأعلى المعايير.",
        },
        {
            title: "خبرة أكثر من 20 سنة",
            desc: "فريق من المحامين والمستشارين ذوي الباع الطويل في القضاء السعودي.",
        },
        {
            title: "نسبة نجاح 98%",
            desc: "سجل حافل بالنجاحات في أصعب القضايا التجارية والجنائية.",
        },
    ];
    const { handleSubmit, register, reset, formState: { errors } } = useForm({
    })
    async function Booked(values) {
        setisLoding(true);
        try {
            const payload = {
                ...values,
                phone: `${countryCode}${values.phone.replace(/^0+/, "")}`,
            };
            const res = await api.post(
                "/appointment/BOOKED",
                payload
            );

            reset({
                fullName: "",
                phone: "",
                email: "",
                description: "",
                caseType: "",
                slot: "",
            });
            toast.success("تم الحجز بنجاح");


            setTimeout(() => {
                window.location.reload();
            }, 2000); // بعد ثانيتين
        }
        catch (error) {
            console.log("Response Data:", error.response?.data.message);
            toast.error(error.response?.data.message || "حدث خطأ ما");
        } finally {
            setisLoding(false);
        }
    }

    async function GetTime() {
        const data = await api.get("/slots/available")
        setSlots(data.data.slots)
    }

    async function GetActiveCase() {
        const data = await api.get("/CaseType/")
        setCase(data.data.caseTypes);
    }
    async function getData() {
        try {
            const res = await api.get(
                "/SettingsService/"
            );
            console.log("API:", res.data.Settings);
            setSettings(res?.data?.Settings)
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        getData()
        GetTime();
        GetActiveCase()
    }, []);
    return (
        <>
            <section
                dir="rtl"
                className="bg-[#071a33] font-sans py-10 px-4 sm:px-6 md:py-14 lg:min-h-screen lg:flex lg:items-center"
            >
                <div className="w-full max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-right mb-10 mt-20">
                        <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                            احجز موعدك الآن
                        </h1>
                        <p className="text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed">
                            املأ البيانات وسنتواصل معك لتأكيد الموعد خلال 24 ساعة.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                        {/* FORM */}
                        <div className="lg:col-span-2 bg-[#061328] border border-gray-800/50 rounded-3xl p-5 sm:p-6 md:p-10 lg:p-12 shadow-2xl">
                            <div className="border border-gray-800/50 rounded-3xl p-8 md:p-12 shadow-2xl">
                                <form onSubmit={handleSubmit(Booked)} className="space-y-8">
                                    {/* Row 1: Name and Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-gray-300 text-sm block mr-1">الاسم الكامل</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="أدخل اسمك الثلاثي"
                                                    className="w-full bg-[#111927] border border-gray-700/50 rounded-xl py-4 px-12 text-white focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 outline-none transition-all placeholder:text-gray-600"
                                                    {...register("fullName", { required: "الاسم مطلوب" })}
                                                />
                                                <BiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            </div>
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-gray-300 text-sm block mr-1">رقم الهاتف</label>
                                            <div className="relative flex">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="tel"
                                                        placeholder="0123456789"
                                                        className="w-full bg-[#111927] border border-gray-700/50 rounded-r-xl py-4 px-12 text-white focus:border-yellow-600 outline-none transition-all placeholder:text-gray-600"
                                                        maxLength={11}
                                                        {...register("phone", {
                                                            required: "رقم الهاتف مطلوب",
                                                            pattern: {
                                                                value: /^[0-9]{11}$/,
                                                                message: "رقم الهاتف يجب أن يكون 11 رقم",
                                                            },
                                                        })}
                                                    />
                                                    <BiPhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                                </div>
                                                <select
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    disabled={loading}
                                                    className="bg-[#111927] text-white px-3 py-3 outline-none rounded-l-xl  border-gray-700 cursor-pointer text-sm font-medium"
                                                    dir="ltr"
                                                >
                                                    {ARAB_COUNTRY_CODES.map(c => (
                                                        <option key={c.code} value={c.code} title={c.name}>{c.code}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                        </div>
                                    </div>

                                    {/* Row 2: Email and Service Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-gray-300 text-sm block mr-1">البريد الإلكتروني</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    placeholder="example@domain.com"
                                                    className="w-full bg-[#111927] border border-gray-700/50 rounded-xl py-4 px-12 text-white focus:border-yellow-600 outline-none transition-all placeholder:text-gray-600 text-left"
                                                    {...register("email", { required: "البريد الإلكتروني مطلوب" })}
                                                />
                                                <RiMicAiLine className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-gray-300 text-sm block mr-1">نوع الخدمة القانونية</label>
                                            <div className="relative">
                                                <select
                                                    {...register("caseType", { required: "اختر نوع الاستشارة" })}
                                                    defaultValue=""
                                                    className="w-full bg-[#111927] border border-gray-700/50 rounded-xl py-4 px-12 text-white appearance-none focus:border-yellow-600 outline-none transition-all cursor-pointer"
                                                >
                                                    <option value="" disabled>
                                                        اختر نوع الاستشارة
                                                    </option>
                                                    {casee?.filter(cas => cas.isActive).map((cas, index) => (
                                                        <option key={index} value={cas?._id}>{cas?.name}</option>
                                                    ))}
                                                </select>
                                                <SlCalender className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                                <BsChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                            </div>
                                            {errors.caseType && <p className="text-red-500 text-xs mt-1">{errors.caseType.message}</p>}
                                        </div>
                                    </div>

                                    {/* Row 3: Date and Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-gray-300 text-sm block mr-1">الوقت المتاح</label>
                                            <div className="relative">
                                                <select
                                                    {...register("slot", { required: "اختر الوقت" })}
                                                    defaultValue=""
                                                    className="w-full bg-[#111927] border border-gray-700/50 rounded-xl py-4 px-12 text-white appearance-none focus:border-yellow-600 outline-none transition-all cursor-pointer"
                                                >
                                                    <option value="" disabled>
                                                        اختر الوقت
                                                    </option>
                                                    {slots?.map((slot, index) => {
                                                        const startDate = new Date(slot?.startAt);
                                                        const endAtDate = new Date(slot?.endAt);
                                                        const formattedStart = startDate.toLocaleString("ar-EG", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                            timeZone: "Africa/Cairo",
                                                        });
                                                        const formattedEnd = endAtDate.toLocaleString("ar-EG", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        });
                                                        return (
                                                            <option key={index} value={slot?._id}>
                                                                {formattedStart} / {formattedEnd}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <CgLockUnlock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                                <BiChevronDownCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                            </div>
                                            {errors.slot && <p className="text-red-500 text-xs mt-1">{errors.slot.message}</p>}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm block mr-1">وصف القضية / الموضوع</label>
                                        <textarea
                                            rows="4"
                                            placeholder="يرجى كتابة تفاصيل مختصرة عن موضوع الاستشارة..."
                                            className="w-full bg-[#111927] border border-gray-700/50 rounded-xl py-4 px-6 text-white focus:border-yellow-600 outline-none transition-all placeholder:text-gray-600 resize-none"
                                            {...register("description", { required: "يرجى كتابة وصف للقضية" })}
                                        ></textarea>
                                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="w-full cursor-pointer bg-[#c9a152] hover:bg-[#b89144] text-[#0a111a] font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-yellow-900/10"
                                    >
                                        {isloding ? <span className="loading loading-infinity loading-xl"></span> : "تأكيد الحجز"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* SIDEBAR */}
                        <div className="flex flex-col gap-6 mt-6 lg:mt-0">
                            <div className="flex flex-col gap-6">
                                {/* Why Choose Us */}
                                <section className="bg-[#061328] border border-gray-800/50 rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-center gap-2 mb-8">
                                        <GoShieldCheck className="text-[#c9a152] w-6 h-6" />
                                        <h2 className="text-white text-xl font-bold">لماذا تختارنا؟</h2>
                                    </div>
                                    <div className="space-y-8">
                                        {features?.map((item, index) => (
                                            <div key={index} className="flex gap-4 group">
                                                <div className="bg-gray-800/40 p-2 rounded-lg group-hover:bg-[#c9a152]/10 transition-colors flex justify-center items-center">
                                                    <BiCheckCircle className="text-[#c9a152] w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-sm mb-1">{item?.title}</h3>
                                                    <p className="text-gray-400 text-xs">{item?.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                            {/* Quick Booking */}
                            <section className="bg-[#061328] border border-gray-800/50 rounded-2xl p-5 sm:p-6 shadow-xl text-center">
                                <h2 className="text-white text-lg sm:text-xl font-bold mb-2">
                                    هل تريد حجز سريع؟
                                </h2>

                                <p className="text-gray-400 text-xs mb-6">
                                    تواصل معنا مباشرة عبر القنوات الرسمية للاستفسارات المستعجلة
                                </p>

                                <a
                                    href="https://wa.me/201553132233"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between bg-[#071d1a] border border-green-900/30 rounded-xl p-4 transition-all hover:border-green-500/50 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#25D366] p-2 rounded-lg">
                                            <MdOutlineChat />
                                        </div>
                                        <span className="text-green-500 font-bold text-sm">
                                            مراسلة عبر واتساب
                                        </span>
                                    </div>

                                    <span className="text-green-500 text-xl group-hover:-translate-x-1 transition">
                                        <IoIosArrowBack />
                                    </span>
                                </a>
                            </section>
                            {/* Map */}
                            <section className="relative h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden group">
                                <iframe
                                    src={settings?.mapEmbedUrl}
                                    className="w-full h-full"
                                    loading="lazy"
                                >

                                    a                                </iframe>


                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default BookDate