import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Info, UserPlus } from "lucide-react";
import api from '../../api/axios';
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import { ARAB_COUNTRY_CODES } from '../../utils/constants';

const schema = z
  .object({
    UserName: z.string().trim().min(3, "الاسم لازم يكون 3 حروف على الأقل"),
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().regex(/^\d{7,10}$/, "رقم الهاتف يجب أن يكون من 7 إلى 10 أرقام"),
    jobTitle: z.string().min(2, "المسمى الوظيفي مطلوب"),
    department: z.string().min(1, "اختار القسم"),
    role: z.string().min(1, "اختار نوع الحساب"),
    lawyerRegistrationNo: z.string().optional(),
    password: z
      .string()
      .min(8, "كلمة المرور لازم تكون 8 أحرف على الأقل")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "كلمة المرور لازم تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل"
      ),
    profile: z.any().optional(),
    salary: z.string().regex(/^\d+$/, "لازم يكون أرقام بس"),
  })
  .superRefine((data, ctx) => {
    if (data.role === "LAWYER") {
      const regNo = data.lawyerRegistrationNo?.trim();

      if (!regNo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lawyerRegistrationNo"],
          message: "رقم تسجيل المحاماة مطلوب",
        });
        return;
      }

      if (!/^\d+$/.test(regNo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lawyerRegistrationNo"],
          message: "لازم يكون أرقام بس",
        });
        return;
      }

      if (regNo.length !== 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lawyerRegistrationNo"],
          message: "رقم التسجيل لازم يكون 7 أرقام بالضبط",
        });
      }
    }
  });

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  maxLength,
  inputMode,
  disabled = false,
}) => {
  const registerOptions = {};

  if (name === "lawyerRegistrationNo" || name === "salary") {
    registerOptions.onChange = (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    };
  }

  return (
    <div className="space-y-2">
      <label className="mr-1 text-sm text-gray-400">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        disabled={disabled}
        {...register(name, registerOptions)}
        className={`w-full rounded-xl border bg-[#09172b] px-4 py-3 text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
          error?.[name]
            ? "border-red-500 focus:border-red-500"
            : "border-gray-700 focus:border-[#C59D4A]"
        }`}
      />

      {error?.[name] && (
        <p className="text-xs text-red-500">{error[name].message}</p>
      )}
    </div>
  );
};

const SelectField = ({ label, options, name, error, register, disabled }) => (
  <div className="space-y-2">
    <label className="mr-1 text-sm text-gray-400">{label}</label>

    <select
      {...register(name)}
      disabled={disabled}
      className={`w-full rounded-xl border bg-[#09172b] px-4 py-3 text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
        error?.[name]
          ? "border-red-500 focus:border-red-500"
          : "border-gray-700 focus:border-[#C59D4A]"
      }`}
    >
      <option value="">اختر...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

    {error?.[name] && (
      <p className="text-xs text-red-500">{error[name].message}</p>
    )}
  </div>
);

const AddMember = () => {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+20");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      UserName: "",
      email: "",
      phone: "",
      jobTitle: "",
      department: "",
      role: "",
      lawyerRegistrationNo: "",
      password: "",
      salary: "",
      profile: null,
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const selectedRole = watch("role");
  const imageFile = watch("profile");

  useEffect(() => {
    if (selectedRole !== "LAWYER") {
      setValue("lawyerRegistrationNo", "");
      clearErrors("lawyerRegistrationNo");
    }
  }, [selectedRole, setValue, clearErrors]);

  const AddUser = async (data) => {
    clearErrors();

    const formData = new FormData();
    formData.append("UserName", data.UserName.trim());
    formData.append("email", data.email.trim());
    formData.append("phone", countryCode + data.phone.trim());
    formData.append("jobTitle", data.jobTitle.trim());
    formData.append("department", data.department);
    formData.append("role", data.role);
    formData.append("password", data.password);
    formData.append("salary", data.salary.trim());

    if (data.role === "LAWYER" && data.lawyerRegistrationNo?.trim()) {
      formData.append("lawyerRegistrationNo", data.lawyerRegistrationNo.trim());
    }

    if (data.profile && data.profile[0]) {
      formData.append("profile", data.profile[0]);
    }

    try {
      setLoading(true);

      const response = await api.post("/users/addUsers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response?.data?.message || "تم إضافة العضو بنجاح");
      reset();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.log("FULL ERROR:", error?.response);

      const backendData = error?.response?.data;

      if (backendData?.details?.length) {
        backendData.details.forEach((item) => {
          if (item?.errors) {
            Object.entries(item.errors).forEach(([fieldName, messages]) => {
              setError(fieldName, {
                type: "server",
                message: Array.isArray(messages) ? messages[0] : messages,
              });
            });
          }
        });

        
      } else if (Array.isArray(backendData?.message)) {
        backendData.message.forEach((err) => {
          if (err?.path?.[0]) {
            setError(err.path[0], {
              type: "server",
              message: err.message,
            });
          }
        });

        toast.error("يرجى مراجعة البيانات المدخلة");
      } else {
        toast.error(backendData?.message || "حصل خطأ");
              console.log("FULL ERROR:", error?.response);

      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(AddUser)}>
      <div
        className="min-h-screen bg-[radial-gradient(circle_at_top,#0d2847_0%,#07192e_45%,#05111f_100%)] px-4 py-6 font-sans text-white sm:px-6 sm:py-8 lg:px-8"
        dir="rtl"
      >
        <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
          <h1 className="text-right text-xl font-bold sm:text-2xl">
            إضافة عضو فريق جديد
          </h1>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <button
              type="button"
              onClick={() => reset()}
              disabled={loading}
              className="w-full cursor-pointer rounded-lg border border-gray-700 px-6 py-2.5 text-gray-400 transition-colors hover:bg-[#09172b] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              إلغاء
            </button>

            <Link to="/TeamMember" className="w-full sm:w-auto">
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-700 px-6 py-2.5 text-white transition-colors duration-300 hover:bg-[#C9A14A] sm:w-auto"
              >
                Back
                <FaArrowLeft  />
              </button>
            </Link>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          <div className="space-y-8 xl:col-span-8">
            <div className="rounded-2xl border border-gray-800/50 bg-[#061328] p-4 sm:p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-2 text-[#C59D4A] sm:mb-8">
                <div className="shrink-0 rounded-lg bg-[#09172b]/10 p-2">
                  <Info size={20} />
                </div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  المعلومات الأساسية
                </h2>
              </div>

              <div className="mb-5 flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:gap-5 sm:py-5">
                <label className="mx-auto flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-[#1E293B] bg-[#0b1220] sm:mx-0 sm:h-25 sm:w-25">
                  {imageFile && imageFile[0] ? (
                    <img
                      src={URL.createObjectURL(imageFile[0])}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaCamera className="text-4xl text-[#C9A14A]" />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                    {...register("profile")}
                  />
                </label>

                <div className="text-center sm:text-right">
                  <h4 className="text-lg sm:text-xl">صورة الملف الشخصي</h4>
                  <p className="text-sm leading-6 text-[#94A3B8] sm:text-base">
                    يُفضل استخدام صورة مربعة بجودة عالية (JPG, PNG)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <InputField
                  name="UserName"
                  label="الاسم الكامل"
                  placeholder="أدخل الاسم الرباعي"
                  register={register}
                  error={errors}
                  disabled={loading}
                />

                <InputField
                  name="email"
                  label="البريد الإلكتروني"
                  placeholder="name@gmail.com"
                  type="email"
                  register={register}
                  error={errors}
                  disabled={loading}
                />

                <div className="space-y-2">
                  <label className="mr-1 text-sm text-gray-400">رقم الهاتف</label>
                  <div className={`flex border rounded-xl bg-[#09172b] overflow-hidden focus-within:border-[#C59D4A] transition-colors ${errors?.phone ? "border-red-500" : "border-gray-700"}`}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={loading}
                      className="bg-[#1A2638] text-white px-3 py-3 outline-none border-l border-gray-700 cursor-pointer text-sm font-medium"
                      dir="ltr"
                    >
                      {ARAB_COUNTRY_CODES.map(c => (
                        <option key={c.code} value={c.code} title={c.name}>{c.code}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="1012345678"
                      inputMode="numeric"
                      maxLength={10}
                      disabled={loading}
                      {...register("phone")}
                      className="w-full bg-transparent px-4 py-3 text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                        register("phone").onChange(e);
                      }}
                    />
                  </div>
                  {errors?.phone && (
                    <p className="text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <InputField
                  name="jobTitle"
                  label="المسمى الوظيفي"
                  placeholder="مثال: محامي أول"
                  register={register}
                  error={errors}
                  disabled={loading}
                />

                <SelectField
                  register={register}
                  error={errors}
                  name="department"
                  label="القسم"
                  disabled={loading}
                  options={[
                    { value: "القضايا التجارية", label: "القضايا التجارية" },
                    { value: "القضايا الجنائية", label: "القضايا الجنائية" },
                    { value: "الإدارة", label: "الإدارة" },
                    { value: "اخري", label: "اخري" },
                  ]}
                />

                <SelectField
                  register={register}
                  error={errors}
                  name="role"
                  label="نوع الحساب"
                  disabled={loading}
                  options={[
                    { value: "ADMIN", label: "مدير النظام" },
                    { value: "LAWYER", label: "محامي شريك" },
                    { value: "STAFF", label: "سكرتارية" },
                  ]}
                />

                {selectedRole === "LAWYER" && (
                  <InputField
                    name="lawyerRegistrationNo"
                    label="رقم تسجيل المحاماة"
                    placeholder="8372492"
                    register={register}
                    error={errors}
                    maxLength={7}
                    inputMode="numeric"
                    disabled={loading}
                  />
                )}

                <InputField
                  name="password"
                  label="كلمة المرور"
                  placeholder="********"
                  type="password"
                  register={register}
                  error={errors}
                  disabled={loading}
                />

                <InputField
                  name="salary"
                  label="salary"
                  placeholder="5000"
                  inputMode="numeric"
                  register={register}
                  error={errors}
                  disabled={loading}
                />
              </div>

              <div className="pt-8 sm:pt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="mx-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C59D4A] px-6 py-3 font-bold text-[#0B121D] shadow-lg shadow-[#C59D4A]/20 transition-colors hover:bg-[#b08b3e] disabled:cursor-not-allowed disabled:opacity-70 sm:mx-0 sm:min-w-45 sm:w-auto"
                >
                  <UserPlus size={18} />
                  {loading ? (
                    <span className="loading loading-infinity loading-xl text-[#C9A14A]"></span>
                  ) : (
                    "حفظ العضو"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddMember;