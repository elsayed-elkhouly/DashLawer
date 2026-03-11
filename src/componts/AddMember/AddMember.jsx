import React, { useState } from 'react'
import { Camera, X, Info } from 'lucide-react';
import { useForm } from "react-hook-form";
import { url, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, ShieldCheck } from "lucide-react";
import { FiEdit3, FiRotateCcw } from 'react-icons/fi'
import { MdGavel, MdOutlineSecurity } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { FaCamera, FaMoneyBills } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import InputField from '../InputField/InputField';
import { IoIosCamera } from "react-icons/io";
import axios from 'axios';
import Cookies from 'js-cookie';

const AddMember = () => {
  Cookies.get("token")
  const AddUser = async (data) => {
    const formData = new FormData();
    // ضيف كل الفيلدز
    formData.append("UserName", data.UserName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("jobTitle", data.jobTitle);
    formData.append("department", data.department);
    formData.append("role", data.role);
    formData.append("lawyerRegistrationNo", data.lawyerRegistrationNo);
    formData.append("password", data.password);

    // ✅ ابعت الفايل نفسه
    if (data.profile && data.profile[0]) {
      formData.append("profile", data.profile[0]);
    }
    try {
      const response = await axios.post("https://lawersystem-production.up.railway.app/users/addUsers", formData, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },


      });
      console.log(response);
    } catch (error) {
      console.log("FULL ERROR:", error.response?.data);

      error.response?.data?.message?.forEach((err, index) => {
        console.log(`Error ${index + 1}:`);
        console.log("Path:", err.path);
        console.log("Message:", err.message);
        console.log("Code:", err.code);
      });
    }

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    reset(); // 🔥 Reset بعد الحفظ
  };

  const schema = z.object({
    UserName: z.string().min(3, "الاسم لازم يكون 3 حروف على الأقل").trim(),
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().min(10, "رقم الهاتف غير صحيح"),
    jobTitle: z.string().min(2, "المسمى الوظيفي مطلوب"),
    department: z.string().min(1, "اختار القسم"),
    role: z.string().min(1, "اختار نوع الحساب"),
    lawyerRegistrationNo: z
      .string()
      .regex(/^\d+$/, "لازم يكون أرقام بس")
      .max(7, "رقم التسجيل لازم يكون 7 أرقام بالكتير"),
    password: z.string().min(8, "كلمة المرور لازم تكون 8 أحرف على الأقل ").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "كلمة المرور لازم تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل"
    ),
    profile: z.any(),
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm(
    {
      defaultValues: {
        UserName: "",
        email: "",
        phone: "",
        jobTitle: "",
        department: "",
        role: "",
        lawyerRegistrationNo: "",
        password: "",
      },

      resolver: zodResolver(schema),
      mode: "onBlur",
      reValidateMode: "onChange",
      criteriaMode: "all"
    });



  const imageFile = watch("profile");



  // console.log(Cookies.get("token"));


  const SelectField = ({ label, options, name, error, register }) => (
    <div className="space-y-2">
      <label className="text-gray-400 text-sm mr-1">{label}</label>
      <select
        {...register(name)}
        className="w-full bg-[#161D27] border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-[#C59D4A]"
      >
        <option value="">اختر...</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error[name] && (
        <p className="text-red-500 text-xs">{error[name].message}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(AddUser)}>

      <div
        className=" min-h-screen bg-[#101c2e] text-white p-8 font-sans"
        dir="rtl"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">إضافة عضو فريق جديد</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl  grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <div className="bg-[#151f2f] p-8 rounded-2xl border border-gray-800/50">
              <div className="flex items-center gap-2 mb-8 text-[#C59D4A]">
                <div className="p-2 bg-[#C59D4A]/10 rounded-lg">
                  <Info size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  المعلومات الأساسية
                </h2>
              </div>
              <div className='flex items-center gap-5 py-5 mb-5'>

                <label className='bg-[#0b1220] w-25 h-25 rounded-full border-4 border-[#1E293B] flex items-center justify-center cursor-pointer overflow-hidden'>


                  {imageFile && imageFile[0] ? (
                    <img
                      src={URL.createObjectURL(imageFile[0])}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IoIosCamera className='text-[#C9A14A] text-4xl' />
                  )}


                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("profile")}
                  />
                </label>

                <div>
                  <h4 className='text-xl'>صورة الملف الشخصي</h4>
                  <p className='text-[17px] text-[#94A3B8]'>
                    يُفضل استخدام صورة مربعة بجودة عالية (JPG, PNG)
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-6">
                <InputField name="UserName" label="الاسم الكامل" placeholder="أدخل الاسم الرباعي" register={register} error={errors} />
                <InputField name="email" label="البريد الإلكتروني" placeholder="name@gmail.com" type="email" register={register} error={errors} />
                <InputField name="phone" label="رقم الهاتف" placeholder="+966" register={register} error={errors} />
                <InputField name="jobTitle" label="المسمى الوظيفي" placeholder="مثال: محامي أول" register={register} error={errors} />
                <SelectField register={register}
                  error={errors}
                  name="department"
                  label="القسم"
                  options={[
                    { value: "القضايا التجارية", label: "القضايا التجارية" },
                    { value: "القضايا الجنائية", label: "القضايا الجنائية" },
                    { value: "الإدارة", label: "الإدارة" }
                  ]}
                />
                <SelectField
                  register={register}
                  error={errors}
                  name="role"
                  label="نوع الحساب"
                  options={[
                    { value: "ADMIN", label: "مدير النظام" },
                    { value: "LAWYER", label: "محامي شريك" },
                    { value: "STAFF", label: "سكرتارية" }
                  ]}
                />
                <InputField name="lawyerRegistrationNo" label="رقم تسجيل المحاماة" placeholder="83724923798473298" register={register} error={errors} />
                <InputField name="password" label="كلمة المرور" placeholder="********" type="password" register={register} error={errors} />
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* submit Button */}
      <div className='me-0 py-10 bg-[#101c2e]'>
        <button
          type="submit"
          className="cursor-pointer mx-auto px-6 py-2 rounded-lg bg-[#C59D4A] text-[#0B121D] font-bold flex items-center gap-2 hover:bg-[#b08b3e] transition-colors shadow-lg shadow-[#C59D4A]/20"
        >
          <UserPlus size={18} />
          حفظ العضو
        </button>
      </div>
    </form>
  );
};

export default AddMember