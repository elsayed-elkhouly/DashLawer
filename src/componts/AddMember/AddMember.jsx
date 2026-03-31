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
import { IoArrowBack, IoSettingsSharp } from "react-icons/io5";
import InputField from '../InputField/InputField';
import { IoIosCamera } from "react-icons/io";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AddMember = () => {
  const [loding, setLoding] = useState(false)
  Cookies.get("token")
  const AddUser = async (data) => {
    const formData = new FormData();
    formData.append("UserName", data.UserName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("jobTitle", data.jobTitle);
    formData.append("department", data.department);
    formData.append("role", data.role);
    formData.append("lawyerRegistrationNo", data.lawyerRegistrationNo);
    formData.append("password", data.password);
    formData.append("salary", data.salary);


    if (data.profile && data.profile[0]) {
      formData.append("profile", data.profile[0]);
    }
    setLoding(true)
    try {
      const response = await api.post("/users/addUsers", formData, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },


      });
      console.log(response);
      setLoding(false)
      toast.success(response?.data?.message)
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
 setLoding(false)
    reset();
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
    salary: z.string()
      .regex(/^\d+$/, "لازم يكون أرقام بس")
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
        salary: ""
      },

      resolver: zodResolver(schema),
      mode: "onBlur",
      reValidateMode: "onChange",
      criteriaMode: "all"
    });
  const imageFile = watch("profile");

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
      <div className="min-h-screen bg-[#101c2e] text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans" dir="rtl">
        {/* Header */}
        <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 sm:mb-10">
          <h1 className="text-xl sm:text-2xl font-bold text-right">
            إضافة عضو فريق جديد
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <Link to={"/TeamMember"} className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-700 text-white hover:bg-[#C9A14A] transition-colors duration-300 cursor-pointer flex items-center gap-2 justify-center"
              >
                Back
                <IoArrowBack />
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-[#151f2f] p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-800/50">
              {/* Section title */}
              <div className="flex items-center gap-2 mb-6 sm:mb-8 text-[#C59D4A]">
                <div className="p-2 bg-[#C59D4A]/10 rounded-lg shrink-0">
                  <Info size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  المعلومات الأساسية
                </h2>
              </div>

              {/* Profile image */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 py-4 sm:py-5 mb-5">
                <label className="bg-[#0b1220] w-24 h-24 sm:w-25 sm:h-25 rounded-full border-4 border-[#1E293B] flex items-center justify-center cursor-pointer overflow-hidden shrink-0 mx-auto sm:mx-0">
                  {imageFile && imageFile[0] ? (
                    <img
                      src={URL.createObjectURL(imageFile[0])}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IoIosCamera className="text-[#C9A14A] text-4xl" />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("profile")}
                  />
                </label>

                <div className="text-center sm:text-right">
                  <h4 className="text-lg sm:text-xl">صورة الملف الشخصي</h4>
                  <p className="text-sm sm:text-base text-[#94A3B8] leading-6">
                    يُفضل استخدام صورة مربعة بجودة عالية (JPG, PNG)
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <InputField
                  name="UserName"
                  label="الاسم الكامل"
                  placeholder="أدخل الاسم الرباعي"
                  register={register}
                  error={errors}
                />

                <InputField
                  name="email"
                  label="البريد الإلكتروني"
                  placeholder="name@gmail.com"
                  type="email"
                  register={register}
                  error={errors}
                />

                <InputField
                  name="phone"
                  label="رقم الهاتف"
                  placeholder="+966"
                  register={register}
                  error={errors}
                />

                <InputField
                  name="jobTitle"
                  label="المسمى الوظيفي"
                  placeholder="مثال: محامي أول"
                  register={register}
                  error={errors}
                />

                <SelectField
                  register={register}
                  error={errors}
                  name="department"
                  label="القسم"
                  options={[
                    { value: "القضايا التجارية", label: "القضايا التجارية" },
                    { value: "القضايا الجنائية", label: "القضايا الجنائية" },
                    { value: "الإدارة", label: "الإدارة" },
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
                    { value: "STAFF", label: "سكرتارية" },
                  ]}
                />

                <InputField
                  name="lawyerRegistrationNo"
                  label="رقم تسجيل المحاماة"
                  placeholder="83724923798473298"
                  register={register}
                  error={errors}
                />

                <InputField
                  name="password"
                  label="كلمة المرور"
                  placeholder="********"
                  type="password"
                  register={register}
                  error={errors}
                />
                <InputField
                  name="salary"
                  label="salary "
                  register={register}
                  error={errors}
                />
              </div>

              {/* Submit button */}
              <div className="pt-8 sm:pt-10">
                <button
                  type="submit"
                  className="cursor-pointer w-full sm:w-auto sm:min-w-[180px] mx-auto sm:mx-0 px-6 py-3 rounded-lg bg-[#C59D4A] text-[#0B121D] font-bold flex items-center justify-center gap-2 hover:bg-[#b08b3e] transition-colors shadow-lg shadow-[#C59D4A]/20"
                >
                  <UserPlus size={18} />
                  {loding ? <span className="loading loading-infinity loading-xl text-[#C9A14A]"></span> : " حفظ العضو"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddMember