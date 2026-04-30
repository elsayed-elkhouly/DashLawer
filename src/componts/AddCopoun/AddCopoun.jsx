import { Info } from 'lucide-react'
import { Settings, ChevronDown } from "lucide-react";
import { Calendar, MousePointerClick } from "lucide-react";
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const AddCopoun = () => {
    const [loading, setLoading] = useState(false);

    function getAllPlans() {
        return api.get("super-admin/getPlans")
    }

    const { data } = useQuery({
        queryKey: ["Plans"],
        queryFn: getAllPlans
    })


    const Plans = data?.data?.plans
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const formattedData = {
                code: data.code,
                type: data.type,
                value: Number(data.value),
                maxUses: Number(data.maxUses),
                plans: data.plan,
                validFrom: data.validFrom,
                validUntil: data.validUntil,
            };


            const res = await api.post(
                "/super-admin/createCoupon",
                formattedData
            );

            toast.success(res?.data?.message)
            reset()
        } catch (error) {
            // console.log(error?.response?.data?.message);
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div dir="rtl" className=" p-8 pb-0 flex justify-center items-start">
                    <div className="bg-[#12233c] text-white p-8 rounded-3xl w-full max-auto border border-white/5 space-y-8">

                        {/* العنوان مع الأيقونة */}
                        <div className="flex items-center justify-between gap-2 mb-8">
                            <div className='flex items-center justify-center gap-2'>
                                <Info className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-xl font-bold">المعلومات الأساسية</h2>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#fbbf24] px-3 py-3 rounded-3xl cursor-pointer hover:bg-[#fbbe24ce] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        جاري الإنشاء...
                                    </>
                                ) : (
                                    "إنشاء الكوبون"
                                )}
                            </button>
                        </div>

                        <div className="space-y-6">

                            {/* رمز الكوبون */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-300 mr-1">رمز الكوبون</label>
                                <input
                                    {...register("code", { required: "مطلوب" })}
                                    type="text"
                                    placeholder="مثلاً: LAW20"
                                    className="bg-[#051424] border-none rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 outline-none w-full text-right"
                                />
                                {errors.code && <p className="text-red-500">{errors.code.message}</p>}

                            </div>


                            {/* العنوان مع أيقونة الترس */}
                            <div className="flex items-center justify-start gap-2 mb-8">
                                <Settings className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-xl font-bold">إعدادات الخصم</h2>
                            </div>

                            <div className="space-y-6">
                                {/* قيمة الخصم */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-300 mr-1 text-right">قيمة الخصم</label>
                                    <div className="relative flex items-center">
                                        <input
                                            {...register("value", { required: "مطلوب" })}

                                            type="text"
                                            placeholder="20"
                                            className="bg-[#051424] border-none rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 outline-none w-full text-right"
                                        />

                                        {/* رمز النسبة المئوية في الجهة اليسرى */}
                                        <span className="absolute left-5 text-gray-400 font-bold">%</span>
                                    </div>
                                    {errors.value && <p className="text-red-500">{errors.value.message}</p>}
                                    <label> نوع الخصم</label>
                                    <div className='flex gap-3'>
                                        <label>نسبه مئويه </label>
                                        <input
                                            {...register("type")}
                                            value="percent" type="radio" className="radio" />
                                        <label> مبلغ ثابت </label>
                                        <input
                                            {...register("type")}
                                            value="fixed" type="radio" className="radio" />
                                    </div>

                                </div>

                                {/* تحديد الباقة */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-300 mr-1 text-right">تحديد الباقة</label>
                                    <div className="relative flex items-center">

                                        <div className="flex flex-col">
                                            {Plans?.map((item) => (
                                                <label
                                                    key={item._id}
                                                    className="flex items-center gap-2 cursor-pointer text-white"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={item._id}
                                                        {...register("plan")}
                                                        className="accent-blue-500 w-4 h-4"
                                                    />
                                                    {item.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

                <div dir="rtl" className=" p-8 flex justify-between items-start ">
                    {/* شبكة لترتيب البطاقتين */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

                        {/* قسم الصلاحية */}
                        <div className="bg-[#12233c] text-white p-6 rounded-3xl border border-white/5 space-y-6">
                            <div className="flex items-center justify-start gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-lg font-bold">الصلاحية</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs text-gray-400 mr-1">تاريخ البدء</label>
                                    <div className="relative">
                                        <input
                                            {...register("validFrom")}
                                            type="date"
                                            className="bg-[#051424] border-none rounded-2xl px-5 py-3 text-white w-full text-right focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
                                        />
                                        {/* أيقونة التقويم داخل الحقل */}
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs text-gray-400 mr-1">تاريخ الانتهاء</label>
                                    <div className="relative">
                                        <input
                                            {...register("validUntil")}
                                            type="date"
                                            className="bg-[#051424] border-none rounded-2xl px-5 py-3 text-white w-full text-right focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
                                        />
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* قسم حدود الاستخدام */}
                        <div className="bg-[#12233c] text-white p-6 rounded-3xl border border-white/5 space-y-6">
                            <div className="flex items-center justify-start gap-2 mb-4">
                                <MousePointerClick className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-lg font-bold">حدود الاستخدام</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs text-gray-400 mr-1">الحد الأقصى لمرات الاستخدام</label>
                                    <input
                                        {...register("maxUses")}
                                        type="number"
                                        placeholder="100"
                                        className="bg-[#051424] border-none rounded-2xl px-5 py-3 text-white placeholder-gray-500 w-full text-right focus:ring-2 focus:ring-blue-500/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </form>

        </>
    )
}

export default AddCopoun