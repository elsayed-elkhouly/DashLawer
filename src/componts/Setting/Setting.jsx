import React, { useEffect, useRef, useState } from 'react'
import { FaCloudArrowUp } from 'react-icons/fa6';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useForm } from "react-hook-form";

import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';



const Setting = () => {
  const emptyValues = {
    officeName: "",
    crNumber: "",
    officialEmail: "",
    phone: "",
    addressDetail: "",
    governorate: "",
    country: "",
    mapEmbedUrl: "",
  };

  const mapSettingsToForm = (settings) => ({
    officeName: settings?.officeName || "",
    crNumber: settings?.crNumber || "",
    officialEmail: settings?.officialEmail || "",
    phone: settings?.phone || "",
    addressDetail: settings?.addressDetail || "",
    governorate: settings?.governorate || "",
    country: settings?.country || "",
    mapEmbedUrl: settings?.mapEmbedUrl || "",
  });

  const [activeToggleId, setActiveToggleId] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const nameRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [caseError, setCaseError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: emptyValues,
  });

  const {
    register: registerWork,
    handleSubmit: handleSubmitWork,
    formState: { errors: errorsWork },
    reset: resetWork,
  } = useForm();

  const {
    register: registerBooking,
    handleSubmit: handleSubmitBooking,
    formState: { errors: errorsBooking },
    reset: resetBooking,
  } = useForm();

  function getSetting() {
    return api.get("/SettingsService/").then((res) => res.data);
  }

  function getCases() {
    return api.get("/CaseType/all", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
  }

  function getSlots() {
    return api.get("/slots/?page=1&limit=7", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
  }

  const {
    data: settingData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["setting"],
    queryFn: getSetting,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
  console.log(settingData);
  

  const { data: cases } = useQuery({
    queryKey: ["Cases"],
    queryFn: getCases,
  });

  const { data: Slotdata } = useQuery({
    queryKey: ["Slots"],
    queryFn: getSlots,
  });

  const watchedValues = watch();

  useEffect(() => {
    const settings = settingData?.Settings;
    if (!settings) return;

    reset(mapSettingsToForm(settings));
  }, [settingData, reset]);

  const addSettingMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.put("/SettingsService/", formData, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["setting"], (oldData) => ({
        ...oldData,
        Settings: {
          ...(oldData?.Settings || {}),
          ...variables,
        },
      }));

      reset(variables);
      setIsEditing(false);
      toast.success("تم تحديث الإعدادات");
    },
    onError: (error) => {
      console.error("Submit Error:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التحديث");
    },
  });

  const addCaseMutation = useMutation({
    mutationFn: async (data) => {
      return await api.post("/CaseType/createCaseType", data, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Cases"] });
      if (nameRef.current) {
        nameRef.current.value = "";
        nameRef.current.focus();
      }
      setCaseError("");
    },
    onError: (err) => {
      setCaseError(err.response?.data?.message || err.message || "حدث خطأ ما");
    },
  });

  const toggleCaseMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const url = isActive ? `/CaseType/${id}/disable` : `/CaseType/${id}/enable`;

      return await api.patch(url, null, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    },
    onMutate: ({ id }) => {
      setActiveToggleId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Cases"] });
    },
    onSettled: () => {
      setActiveToggleId(null);
    },
    onError: (error) => {
      console.log(error.response?.data || error.message);
    },
  });

  const addDateMutation = useMutation({
    mutationFn: async (values) => {
      const data = {
        workHours: [
          {
            days: values.days,
            from: values.from,
            to: values.to,
          },
        ],
      };

      return await api.put("/SettingsService/work-hours", data, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("تم إضافة الموعد بنجاح");
      resetWork();
      queryClient.invalidateQueries({ queryKey: ["setting"] });
    },
    onError: (error) => {
      if (error.response) {
        console.log("Data:", error.response.data);
        console.log("Status:", error.response.status);
      } else {
        console.log("Error:", error.message);
      }
    },
  });

  const deleteDayMutation = useMutation({
    mutationFn: async (days) => {
      return await api.delete("/SettingsService/work-hours", {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
        data: {
          days: Array.isArray(days) ? days : [days],
        },
      });
    },
    onSuccess: () => {
      toast.success("تم حذف الأيام بنجاح");
      queryClient.invalidateQueries({ queryKey: ["setting"] });
    },
    onError: (error) => {
      if (error.response) {
        console.log("Server Error:", error.response.data);
        console.log("Status:", error.response.status);
      } else {
        console.log(error.message);
      }
    },
  });

  const addSlotMutation = useMutation({
    mutationFn: async (values) => {
      const start = new Date(`${values.date}T${values.startTime}`);
      const end = new Date(`${values.date}T${values.endTime}`);

      const payload = {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      };

      return await api.post("/slots/createSlot", payload, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("تم اضافه ميعاد جديد");
      resetBooking();
      queryClient.invalidateQueries({ queryKey: ["Slots"] });
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data?.message || "حدث خطأ من السيرفر");
      } else if (error.request) {
        toast.error("السيرفر غير متاح");
      } else {
        toast.error("خطأ في إرسال الطلب");
      }
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/slots/${id}`, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Slots"] });
      toast.success("تم حذف الميعاد");
    },
    onError: (error) => {
      console.log(error.response?.data || error.message);
    },
  });

  const putLogoMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("logo", logoFile);

      return await api.patch("/SettingsService/logo", formData, {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("تم تحديث اللوجو");
      queryClient.invalidateQueries({ queryKey: ["setting"] });
    },
    onError: (error) => {
      console.log(error.response?.data || error.message);
      toast.error(" حجم الصوره كبير / فشل تحديث اللوجو");
    },
  });

  const AddSetting = (data) => {
    addSettingMutation.mutate(data);
  };

  const AddCase = () => {
    const value = nameRef.current?.value.trim();

    if (!value) {
      setCaseError("من فضلك اكتب نوع القضية");
      nameRef.current?.focus();
      return;
    }

    addCaseMutation.mutate({ name: value });
  };

  const toggleCase = (id, isActive) => {
    toggleCaseMutation.mutate({ id, isActive });
  };

  const AddDate = (values) => {
    addDateMutation.mutate(values);
  };

  const deleteDay = (days) => {
    deleteDayMutation.mutate(days);
  };

  const AddSlots = (values) => {
    addSlotMutation.mutate(values);
  };

  const deleteSlots = (id) => {
    deleteSlotMutation.mutate(id);
  };

  const PutLogo = () => {
    if (!logoFile) return;
    putLogoMutation.mutate();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogo(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoFile(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    reset(mapSettingsToForm(settingData?.Settings));
    setIsEditing(false);
  };

  const handleResetForm = () => {
    reset(mapSettingsToForm(settingData?.Settings));
  };

  const validDays = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  function formatTime(time) {
    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString("en-EG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (isLoading) {
    return (
      <div className="text-[#C9A14A] text-center">
        <span className="loading loading-infinity w-[50%]"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-400">
        حصل خطأ: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <>
      <div className="text-right">
        <h2 className="text-[37px] mt-10 mr-15 text-white font-bold">إعدادات المكتب</h2>
      </div>

      <section>
        <div
          dir="rtl"
          className="min-h-screen flex items-center justify-center p-6"
        >
          <div className="w-full max-w-5xl bg-[#081226] rounded-2xl p-8 shadow-2xl border border-[#1E2D3D]">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-[32px] font-bold text-white flex items-center ">
                <span className="text-[#C6A24F]">👤</span>
                المعلومات الشخصية
              </h2>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2 text-[#F0A500] text-lg font-medium hover:opacity-90 transition"
                >
                  <span>✏️</span>
                  تعديل
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-white cursor-pointer px-5 py-2 rounded-xl font-medium border border-[#1E2D3D] hover:bg-[#1d2b3d] transition"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    form="basic-info-form"
                    disabled={addSettingMutation.isPending}
                    className="bg-[#C6A24F] cursor-pointer text-black px-5 py-2 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {addSettingMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                  </button>
                </div>
              )}

             
            </div>

            <form
              id="basic-info-form"
              className="space-y-6"
              onSubmit={handleSubmit(AddSetting)}
            >
              {!isEditing ? (
                <>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-12">
                      <div>
                        <label className="block text-[18px] text-[#7f93b0] mb-3">
                          الاسم الكامل
                        </label>
                        <p className="text-white text-[24px] font-bold">
                          {watchedValues.officeName || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[18px] text-[#7f93b0] mb-3">
                          رقم الهاتف
                        </label>
                        <p className="text-white text-[24px] font-bold">
                          {watchedValues.phone || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[18px] text-[#7f93b0] mb-3">
                          العنوان
                        </label>
                        <p className="text-white text-[24px] font-bold">
                          {[
                            watchedValues.addressDetail,
                            watchedValues.governorate,
                            watchedValues.country,
                          ]
                            .filter(Boolean)
                            .join(" - ") || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-12">
                      <div>
                        <label className="block text-[18px] text-[#7f93b0] mb-3 text-center">
                          رقم السجل التجاري
                        </label>
                        <p className="text-white text-[24px] font-bold text-center">
                          {watchedValues.crNumber || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[18px] text-[#7f93b0] mb-3 text-center">
                          البريد الإلكتروني
                        </label>
                        <p className="text-white text-[24px] font-bold text-center break-all">
                          {watchedValues.officialEmail || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[18px] text-[#7f93b0] mb-3">
                      الموقع
                    </label>
                    <div className="w-full min-h-[56px] bg-[#1A2638] rounded-xl px-4 py-4 text-white break-all">
                      {watchedValues.mapEmbedUrl || ""}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        اسم الشركة / المكتب
                      </label>
                      <input
                        type="text"
                        placeholder="هيلبر للمحاماة"
                        className="w-full bg-[#1A2638] border border-[#1E2D3D] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A24F]"
                        {...register("officeName", {
                          minLength: {
                            value: 2,
                            message: "اسم الشركة لازم يكون حرفين على الأقل",
                          },
                        })}
                      />
                      {errors.officeName && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.officeName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        رقم السجل التجاري (CR)
                      </label>
                      <input
                        type="text"
                        placeholder="1010XXXX"
                        className="w-full bg-[#1A2638] border border-[#1E2D3D] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A24F]"
                        {...register("crNumber")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        البريد الإلكتروني الرسمي
                      </label>
                      <input
                        type="email"
                        placeholder="contact@helper.com"
                        className="w-full bg-[#1A2638] border border-[#1E2D3D] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A24F]"
                        {...register("officialEmail")}
                      />
                      {errors.officialEmail && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.officialEmail.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        رقم التواصل
                      </label>
                      <input
                        type="text"
                        placeholder="+04 5212765"
                        className="w-full bg-[#1A2638] border border-[#1E2D3D] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A24F]"
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      العنوان بالتفصيل
                    </label>
                    <textarea
                      rows={3}
                      placeholder="البحيرة - كفر الدوار - امام المحكمة"
                      className="w-full bg-[#1A2638] border border-[#1E2D3D] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A24F]"
                      {...register("addressDetail")}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        المحافظة
                      </label>
                      <input
                        type="text"
                        placeholder="البحيرة"
                        className="w-full bg-[#1A2638] border border-[#1E2D3D] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A24F]"
                        {...register("governorate")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        الدولة
                      </label>
                      <input
                        type="text"
                        placeholder="مصر"
                        className="w-full bg-[#1A2638] border border-[#1E2D3D] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A24F]"
                        {...register("country")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">الموقع</label>
                    <input
                      type="text"
                      placeholder="https://maps.app.goo.gl/BeywpLGaciVPwtfT9"
                      className="w-full bg-[#1A2638] border border-[#1E2D3D] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A24F]"
                      {...register("mapEmbedUrl")}
                    />
                    {errors.mapEmbedUrl && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.mapEmbedUrl.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center py-5">
        <div className="bg-[#081226] w-255 p-8 rounded-xl text-white border border-gray-700">
          <div dir="rtl">
            <h2 className="text-[20px] font-semibold text-white mb-4 flex items-center gap-2 mr-15">
              <span className="w-2.5 h-2.5 bg-[#C6A24F] rounded-full"></span>
              الهوية البصرية
            </h2>
          </div>

          <div className="flex justify-between text-right items-center gap-8 px-10">
            <div className="flex-1">
              <p className="text-white text-l leading-relaxed">
                سيتم استخدام هذا الشعار في ترويسات الفواتير، العقود، والمخاطبات
                الرسمية. يفضل استخدام شعار بخلفية شفافة وبأبعاد 500x500 بكسل على الأقل.
              </p>

              {logo && (
                <button
                  onClick={removeLogo}
                  className="mt-4 text-white hover:text-red-300 text-sm font-medium btn bg-red-600 rounded-3xl cursor-pointer"
                >
                  حذف
                </button>
              )}
            </div>

            <div className="w-40 h-40 bg-[#222c3c] border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative overflow-hidden">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-2 flex items-center flex-col gap-1">
                  <FaCloudArrowUp className="text-3xl text-center" />
                  <span className="text-[10px] text-gray-500">
                    رفع شعار المكتب (PNG, JPG)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={PutLogo}
              disabled={putLogoMutation.isPending}
              className="px-4 py-2 rounded-2xl bg-[#C6A24F] cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {putLogoMutation.isPending && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}

              {putLogoMutation.isPending ? "جاري الرفع..." : "إرسال"}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="w-full max-w-300 px-4 mx-auto min-h-screen text-white" dir="rtl">
          <div className="bg-[#081226] p-4 md:p-6 rounded-xl mb-8">
            <h2 className="text-2xl md:text-[40px] font-bold mb-1">إضافة مواعيد العمل</h2>
            <p className="text-gray-400 text-sm md:text-[20px] mb-6">
              قم بتحديد المواعيد المتاحة للعمل
            </p>

            <form onSubmit={handleSubmitWork(AddDate)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <select
                    multiple
                    {...registerWork("days", { required: "اختار يوم واحد على الأقل" })}
                    className="bg-slate-800 p-3 rounded-lg border border-slate-700 w-full h-40"
                  >
                    {validDays.map((day, index) => (
                      <option key={index} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  {errorsWork.days && (
                    <p className="text-red-500 text-sm">{errorsWork.days.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 text-sm">من</label>
                  <input
                    type="time"
                    {...registerWork("from", {
                      required: "من فضلك اختر وقت البداية",
                    })}
                    className="bg-slate-800 p-3 rounded-lg border border-slate-700 w-full text-white"
                  />
                  {errorsWork.from && (
                    <p className="text-red-500 text-sm">{errorsWork.from.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-300 text-sm">إلى</label>
                  <input
                    type="time"
                    {...registerWork("to", {
                      required: "من فضلك اختر وقت النهاية",
                    })}
                    className="bg-slate-800 p-3 rounded-lg border border-slate-700 w-full text-white"
                  />
                  {errorsWork.to && (
                    <p className="text-red-500 text-sm">{errorsWork.to.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#C9A14A] cursor-pointer text-black px-6 py-2 rounded-lg font-bold hover:bg-amber-400 transition w-full md:w-auto"
              >
                + إضافة موعد
              </button>
            </form>
          </div>

          <div className="bg-[#081226] rounded-xl overflow-hidden border border-[#2D3245] shadow-2xl">
            <div className="p-4 font-bold text-lg md:text-xl bg-[#081226] text-[#C9A14A] border border-[#2D3245]">
              مواعيد العمل
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-150">
                <thead>
                  <tr className="text-gray-400 bg-[#1C1F2B80]">
                    <th className="ps-6 md:ps-20 py-3">اليوم</th>
                    <th className="p-3 md:p-4">من الساعة</th>
                    <th className="p-3 md:p-4">إلى الساعة</th>
                    <th className="p-3 md:p-4">إجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {settingData?.Settings?.workHours?.map((item, index) => (
                    <tr
                      key={index}
                      className="border bg-[#081226] border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="ps-6 md:ps-20 py-3">{item.days?.join(" , ")}</td>
                      <td className="p-3 md:p-4">{formatTime(item.from)}</td>
                      <td className="p-3 md:p-4">{formatTime(item.to)}</td>
                      <td
                        className="p-3 md:p-4 cursor-pointer text-red-400 text-lg"
                        onClick={() => deleteDay(item.days)}
                      >
                        <RiDeleteBin6Line />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div dir="rtl" className="bg-[#081226] text-white mx-auto p-8 rounded-xl max-w-300 mt-10">
          <h2 className="text-xl font-bold mb-2">إضافة مواعيد الحجز</h2>
          <p className="text-gray-400 mb-6">قم بتحديد المواعيد المتاحة لاستقبال العملاء</p>

          <form onSubmit={handleSubmitBooking(AddSlots)} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm">اليوم</label>
              <input
                type="date"
                {...registerBooking("date", { required: "من فضلك اختر اليوم" })}
                className="w-full bg-[#1d293d] border border-gray-600 rounded-lg p-3"
              />
              {errorsBooking.date && (
                <p className="text-red-500 text-sm mt-1">{errorsBooking.date.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm">من الساعة</label>
                <input
                  type="time"
                  {...registerBooking("startTime", {
                    required: "من فضلك اختر وقت البداية",
                  })}
                  className="w-full bg-[#1d293d] border border-gray-600 rounded-lg p-3"
                />
                {errorsBooking.startTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsBooking.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm">إلى الساعة</label>
                <input
                  type="time"
                  {...registerBooking("endTime", {
                    required: "من فضلك اختر وقت النهاية",
                  })}
                  className="w-full bg-[#1d293d] border border-gray-600 rounded-lg p-3"
                />
                {errorsBooking.endTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsBooking.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#C9A14A] text-black px-4 py-2 rounded-lg mt-4 cursor-pointer"
            >
              + إضافة موعد
            </button>
          </form>

          <div dir="rtl" className="p-6 flex items-start justify-center">
            <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#151b2b] shadow-2xl shadow-black/40">
              <div className="px-6 py-5 border-b bg-[#081226] border-white/5">
                <h2 className="text-xl font-semibold text-[#f0b44b]">مواعيد العمل</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-white/90">
                  <thead>
                    <tr className="text-white/60">
                      <th className="px-6 py-4 font-medium">اليوم</th>
                      <th className="px-6 py-4 font-medium">من الساعة</th>
                      <th className="px-6 py-4 font-medium">إلى الساعة</th>
                      <th className="px-6 py-4 font-medium">إجراءات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Slotdata?.data?.slots?.map((row) => {
                      const startDate = new Date(row.startAt);
                      const endDate = new Date(row.endAt);

                      const day = startDate.toLocaleDateString("ar-EG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });

                      const from = startDate.toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      const to = endDate.toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr
                          key={row._id}
                          className="border-t bg-[#19202e] border-white/5 hover:bg-white/2 transition-colors"
                        >
                          <td className="px-6 py-6 font-medium">{day}</td>
                          <td className="px-6 py-6 text-white/85">{from}</td>
                          <td className="px-6 py-6 text-white/85">{to}</td>
                          <td className="px-6 py-6">
                            <button
                              onClick={() => deleteSlots(row._id)}
                              className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md text-white/40 transition hover:bg-white/5 hover:text-red-500"
                              aria-label="حذف الموعد"
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="min-h-screen text-white p-4 md:p-8" dir="rtl">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-right">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                إعدادات القضايا
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-400">
                إدارة وتصنيف أنواع القضايا في النظام.
              </p>
            </div>

            <div className="rounded-3xl border border-white/5 bg-[#081226] shadow-2xl shadow-black/20 p-4 md:p-5">
              <div className="flex flex-col md:flex-row-reverse gap-4 items-stretch md:items-center">
                <button
                  onClick={AddCase}
                  disabled={addCaseMutation.isPending}
                  className="cursor-pointer h-12 px-6 rounded-2xl bg-[#d9ae45] text-[#101828] font-bold hover:opacity-95 transition shadow-lg shadow-[#d9ae45]/20 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="text-xl leading-none">
                    {addCaseMutation.isPending ? "..." : "+"}
                  </span>

                  <span>
                    {addCaseMutation.isPending ? "جاري الإضافة..." : "إضافة النوع"}
                  </span>
                </button>

                <div className="relative flex-1">
                  <input
                    ref={nameRef}
                    type="text"
                    placeholder="مثال: قضايا تجارية"
                    className="w-full h-12 rounded-2xl border border-white/10 bg-[#222c3c] px-4 text-right text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#d9ae45]/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) {
                        AddCase();
                      }
                    }}
                  />

                  <span className="pointer-events-none absolute -top-5 right-1 text-xs text-slate-500">
                    إضافة نوع قضية جديد
                  </span>

                  {caseError && (
                    <p className="mt-2 text-sm text-red-400 text-right">{caseError}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-white/5 shadow-2xl shadow-black/20">
              <div className="grid grid-cols-2 bg-[#232e3d] text-sm text-slate-300 border-b border-white/5">
                <div className="px-6 py-4 text-right font-semibold">نوع القضية</div>
                <div className="px-6 py-4 text-center font-semibold">الحالة</div>
              </div>

              <div>
                {cases?.data?.caseTypes?.map((issue) => (
                  <div
                    key={issue._id}
                    className="grid grid-cols-2 bg-[#081226] items-center border-b border-white/4"
                  >
                    <div className="px-6 py-5 text-right text-sm md:text-base text-slate-100">
                      {issue.name}
                    </div>

                    <div className="px-6 py-5 flex justify-center">
                      <button
                        onClick={() => toggleCase(issue._id, issue.isActive)}
                        disabled={
                          toggleCaseMutation.isPending && activeToggleId === issue._id
                        }
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                          issue.isActive
                            ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25"
                            : "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20"
                        }`}
                      >
                        {toggleCaseMutation.isPending && activeToggleId === issue._id
                          ? "جاري التحديث..."
                          : issue.isActive
                          ? "مفعل"
                          : "غير مفعل"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Setting;

