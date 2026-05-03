import React, { useEffect, useRef, useState } from 'react'
import { HiCheck, HiOutlineDotsVertical } from 'react-icons/hi';
import {
    HiOutlinePencil,
    HiOutlineCog6Tooth,
    HiOutlineCalendarDays,
    HiOutlineClipboardDocumentList,
    HiOutlineFolder,
    HiOutlineBriefcase,
    HiXMark,
} from "react-icons/hi2";
import api from '../../api/axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ARAB_COUNTRY_CODES } from '../../utils/constants';

const parsePhone = (fullPhone) => {
    if (!fullPhone) return { countryCode: "+20", localPhone: "" };
    const phoneStr = String(fullPhone);
    const codeObj = ARAB_COUNTRY_CODES.find(c => phoneStr.startsWith(c.code));
    if (codeObj) {
        return { countryCode: codeObj.code, localPhone: phoneStr.slice(codeObj.code.length) };
    }
    return { countryCode: "+20", localPhone: phoneStr };
};

const TeamProfile = () => {

    const { id } = useParams();
    const queryClient = useQueryClient();
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [countryCode, setCountryCode] = useState("+20");

    function getUserData() {
        return api.get(`/users/${id}`, {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,
            },
        });
    }

    const { data, isLoading } = useQuery({
        queryKey: ["UserProfile", id],
        queryFn: getUserData,
        enabled: !!id,
    });
    // console.log(data);


    const UserData = data?.data?.user
    // console.log(data?.data?.stats);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            UserName: "",
            email: "",
            phone: "",
            department: "",
            jobTitle: "",
        },
    });

    useEffect(() => {
        if (UserData) {
            const parsed = parsePhone(UserData?.phone);
            setCountryCode(parsed.countryCode);
            reset({
                UserName: UserData?.UserName || "",
                email: UserData?.email || "",
                phone: parsed.localPhone,
                department: UserData?.department || "",
                jobTitle: UserData?.jobTitle || "",
            });

            setPreviewImage(UserData?.ProfilePhoto?.url || "");
        }
    }, [UserData, reset]);

    const handleEditClick = () => {
        const parsed = parsePhone(UserData?.phone);
        setCountryCode(parsed.countryCode);
        reset({
            UserName: UserData?.UserName || "",
            email: UserData?.email || "",
            phone: parsed.localPhone,
            department: UserData?.department || "",
            jobTitle: UserData?.jobTitle || "",
        });
        setPreviewImage(UserData?.ProfilePhoto?.url || "");
        setIsEditing(true);
    };
    const handleFreezeUser = async () => {

        try {
            await api.patch(
                `/users/${id}/freeze`,
                {},
                {
                    headers: {
                        authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            toast.success("تم تجميد الحساب");
            queryClient.invalidateQueries({ queryKey: ["UserProfile", id] });
        } catch (error) {
            console.log(error);
            toast.error("حصل خطأ");
        }
    };

    const handleUnfreezeUser = async () => {

        try {
            await api.patch(
                `/users/${id}/unfreeze`,
                {},
                {
                    headers: {
                        authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            toast.success("تم فك التجميد");

            queryClient.invalidateQueries(["UserProfile", id]);
        } catch (error) {
            console.log(error);
            toast.error("حصل خطأ");
        }
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowAccountMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCancel = () => {
        const parsed = parsePhone(UserData?.phone);
        setCountryCode(parsed.countryCode);
        reset({
            UserName: UserData?.UserName || "",
            email: UserData?.email || "",
            phone: parsed.localPhone,
            department: UserData?.department || "",
            jobTitle: UserData?.jobTitle || "",
        });
        setPreviewImage(UserData?.ProfilePhoto?.url || "");
        setIsEditing(false);
    };

    const onSubmit = async (formValues) => {
        try {
            setLoading(true);

            const response = await api.patch(
                `/users/updateUser/${id}`,
                {
                    UserName: formValues.UserName,
                    email: formValues.email,
                    phone: countryCode + String(formValues.phone),
                    department: formValues.department,
                    jobTitle: formValues.jobTitle,
                    employmentDate: UserData?.employmentDate,
                },
                {
                    headers: {
                        authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            const updatedUser =
                response?.data?.user || response?.data?.data || response?.data;

            queryClient.setQueryData(["UserProfile", id], (oldData) => ({
                ...oldData,
                data: {
                    ...oldData?.data,
                    user: updatedUser,
                },
            }));

            const parsed = parsePhone(updatedUser?.phone);
            setCountryCode(parsed.countryCode);
            reset({
                UserName: updatedUser?.UserName || "",
                email: updatedUser?.email || "",
                phone: parsed.localPhone,
                department: updatedUser?.department || "",
                jobTitle: updatedUser?.jobTitle || "",
            });

            setPreviewImage(updatedUser?.ProfilePhoto?.url || "");
            setIsEditing(false);
            toast.success("تم تعديل البيانات بنجاح");
        } catch (error) {
            console.log(error);
            console.log("Full error:", error);
            console.log("Error response:", error.response);
            console.log("Error data:", error.response?.data);
            console.log("Error status:", error.response?.status);
            toast.error(
                error?.response?.data?.message || "حصل خطأ أثناء تعديل البيانات"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleChangePhoto = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const oldImage = previewImage;
        const localPreview = URL.createObjectURL(file);
        setPreviewImage(localPreview);

        try {
            setPhotoLoading(true);

            const formData = new FormData();
            formData.append("profile", file);

            const response = await api.patch(`/users/updateProfilePhoto`, formData, {
                headers: {
                    authorization: `Bearer ${Cookies.get("token")}`,

                },
            });

            const updatedUser =
                response?.data?.user || response?.data?.data || response?.data;

            queryClient.setQueryData(["UserProfile", id], (oldData) => ({
                ...oldData,
                data: {
                    ...oldData?.data,
                    user: updatedUser,
                },
            }));

            setPreviewImage(updatedUser?.ProfilePhoto?.url || localPreview);
            toast.success("تم تحديث الصورة بنجاح");
        } catch (error) {
            console.error(error?.response?.data);
            setPreviewImage(oldImage);
            toast.error(
                error?.response?.data?.message || "حصل خطأ أثناء تحديث الصورة"
            );
        } finally {
            setPhotoLoading(false);
        }
    };
    function getTasks() {
        return api.get(`/task/lawyer/${id}`, {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,

            }
        })
    }
    const { data: Tasks } = useQuery({
        queryKey: ["Tasks"],
        queryFn: getTasks
    })
    function getLawerCase() {
        return api.get(`/LegalCase/lawyer/${id}`, {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,

            }
        })
    }
    const { data: LawerCases } = useQuery({
        queryKey: ["LawerCases"],
        queryFn: getLawerCase
    })
    // console.log(LawerCases?.data?.cases);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10 text-white">
                جاري تحميل البيانات...
            </div>
        );
    }
    return (
        <>
            <div
                dir="rtl"
                className="min-h-screen bg-[radial-gradient(circle_at_top,#0d2847_0%,#07192e_45%,#05111f_100%)] p-6 text-white"
            >
                <div className="mx-auto max-w-6xl space-y-6">

                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Info */}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="user"
                                            onClick={handlePhotoClick}
                                            className="h-20 w-20 rounded-full border-2 object-cover cursor-pointer"
                                        />
                                    ) : (
                                        <div
                                            onClick={handlePhotoClick}
                                            className="h-20 w-20 rounded-full border-2 flex items-center justify-center bg-gray-200 text-xl font-bold text-gray-700 cursor-pointer"
                                        >
                                            {UserData?.UserName?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handlePhotoClick}
                                        className="absolute -bottom-1 -right-1 rounded-full bg-[#D7AE46] p-2 text-[#071a2f]"
                                    >
                                        <HiOutlinePencil size={14} />
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleChangePhoto}
                                    />

                                    {photoLoading && (
                                        <span className="absolute -bottom-8 right-0 text-xs text-amber-300 whitespace-nowrap">
                                            جاري رفع الصورة...
                                        </span>
                                    )}
                                </div>

                              <div className="text-right">
  <div className="flex flex-wrap items-center justify-end gap-2">
    <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
      نشط
    </span>

    {isEditing ? (
      <input
        {...register("jobTitle", {})}
        className="rounded-full bg-amber-400/20 px-2 py-1 text-xs text-amber-300 outline-none border border-white/10"
      />
    ) : (
      <span className="rounded-full bg-amber-400/20 px-2 py-1 text-xs text-amber-300">
        {UserData?.jobTitle}
      </span>
    )}
  </div>

  {isEditing ? (
    <div className="mt-2">
      <input
        {...register("UserName", {})}
        className="text-lg sm:text-xl md:text-2xl font-bold bg-transparent border-b border-white/20 outline-none text-right w-full"
      />
      {errors.UserName && (
        <p className="mt-1 text-xs text-red-400">{errors.UserName.message}</p>
      )}
    </div>
  ) : (
    <h2 className="mt-2 text-lg sm:text-xl md:text-2xl font-bold break-words">
      {UserData?.UserName}
    </h2>
  )}

  <p className="rounded-full bg-amber-400/20 px-2 py-1 text-xs text-amber-300 w-fit mt-2">
    {UserData?.role}
  </p>

  <div className="mt-2 space-y-2">
    {isEditing ? (
      <>
        <div>
          <input
            {...register("department", {})}
            placeholder="القسم"
            className="block w-full text-sm bg-transparent border border-white/10 rounded-lg px-3 py-2 outline-none"
          />
          {errors.department && (
            <p className="mt-1 text-xs text-red-400">
              {errors.department.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "صيغة الإيميل غير صحيحة",
              },
            })}
            placeholder="البريد الإلكتروني"
            className="block w-full text-sm bg-transparent border border-white/10 rounded-lg px-3 py-2 outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex border border-white/10 rounded-lg overflow-hidden focus-within:border-[#C59D4A] transition-colors">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-[#1A2638] text-white px-3 py-2 outline-none border-l border-white/10 cursor-pointer text-sm font-medium"
              dir="ltr"
            >
              {ARAB_COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code} title={c.name}>{c.code}</option>
              ))}
            </select>
            <input
              type="text"
              {...register("phone", {
                pattern: {
                  value: /^\d{7,10}$/,
                  message: "رقم الهاتف يجب أن يكون من 7 إلى 10 أرقام",
                },
              })}
              placeholder="1012345678"
              className="block w-full text-sm bg-transparent px-3 py-2 outline-none"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
                register("phone").onChange(e);
              }}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
          )}
        </div>
      </>
    ) : (
      <>
        <p className="text-sm text-[#8EA3BF] break-words">
          القسم: {UserData?.department}
        </p>

        <p className="text-sm text-[#8EA3BF] break-words">
          رقم التسجيل: {UserData?.lawyerRegistrationNo}
        </p>

        <p className="mt-2 text-xs text-[#8EA3BF] break-words">
          {UserData?.email} • {UserData?.phone}
        </p>
      </>
    )}
  </div>
</div>

                            </div>

                            <div className="flex items-center gap-3">
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={handleEditClick}
                                        className="flex items-center gap-2 rounded-xl bg-[#D7AE46] px-5 py-2 text-sm font-semibold text-[#071a2f]"
                                    >
                                        <HiOutlinePencil size={16} />
                                        تعديل البيانات
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                        >
                                            <HiCheck size={16} />
                                            {loading ? "جاري الحفظ..." : "حفظ"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2 text-sm text-[#8EA3BF] hover:bg-white/5"
                                        >
                                            <HiXMark size={16} />
                                            إلغاء
                                        </button>
                                    </>
                                )}

                                <div className="relative" ref={menuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAccountMenu((prev) => !prev)}
                                        className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2 text-sm text-[#8EA3BF] hover:bg-white/5 transition"
                                    >
                                        <HiOutlineCog6Tooth size={16} />
                                        تعديل الحساب
                                    </button>

                                    <div
                                        className={`absolute left-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#071a2f] shadow-lg z-50 transition-all duration-200 origin-top
        ${showAccountMenu ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                                    >
                                        {!UserData?.isDeleted ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleFreezeUser();
                                                    setShowAccountMenu(false);
                                                }}
                                                className="w-full text-right px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition"
                                            >
                                                🔒 تجميد الحساب
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleUnfreezeUser();
                                                    setShowAccountMenu(false);
                                                }}
                                                className="w-full text-right px-4 py-3 text-sm text-green-400 hover:bg-white/5 transition"
                                            >
                                                🔓 فك التجميد
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>



                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {[
                            { title: " مهام الاسبوع", value: data?.data?.stats.thisWeekSessions, icon: <HiOutlineCalendarDays />, color: "text-red-400" },
                            { title: "القضايا النشطة", value: data?.data?.stats.activeCases, icon: <HiOutlineBriefcase />, color: "text-purple-400" },
                            { title: "القضايا المنجزة", value: data?.data?.stats.completedCases, icon: <HiOutlineFolder />, color: "text-blue-400" },
                            { title: "إجمالي القضايا", value: data?.data?.stats.totalCases, icon: <HiOutlineClipboardDocumentList />, color: "text-amber-400" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between rounded-2xl bg-[#0d2139] p-5"
                            >
                                <div className={item.color}>{item.icon}</div>
                                <div className="text-right">
                                    <p className="text-sm text-[#8EA3BF]">{item.title}</p>
                                    <h3 className="mt-2 text-xl font-bold">{item.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cases Table */}
                    <div className="rounded-2xl bg-[#0d2139] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">القضايا المسندة إليه</h3>
                            <button className="text-sm text-amber-400">عرض الكل</button>
                        </div>

                        <div className="space-y-3 text-sm">
                            {LawerCases?.data?.cases.map((c, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-5 items-center rounded-xl bg-[#081b31] px-4 py-3"
                                >
                                    <div>{c.openedAt}</div>
                                    <div className="text-blue-400">{c.status}</div>
                                    <div>{c.court}</div>
                                    <div>{c.client?.fullName}</div>
                                    <div className="text-amber-400">{c.caseNumber}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="rounded-2xl bg-[#0d2139] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">المهام الخاصة به</h3>
                            <button className="text-sm text-amber-400">+ مهمة جديدة</button>
                        </div>

                        <div className="space-y-3">
                            {Tasks?.data?.tasks?.map((t, i) => {
                                const date = new Date(t.dueDate);

                                const day = date.getDate();

                                const months = [
                                    "يناير", "فبراير", "مارس", "أبريل",
                                    "مايو", "يونيو", "يوليو", "أغسطس",
                                    "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
                                ];

                                const month = months[date.getMonth()];

                                return (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between rounded-2xl bg-[#081b31] px-4 py-4"
                                    >


                                        {/* Right content */}
                                        <div className="flex items-center gap-4">

                                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#d4af37] px-3 py-2 text-center min-w-[60px]">
                                                <span className="text-lg font-bold text-[#d4af37]">
                                                    {day}
                                                </span>
                                                <span className="text-xs text-gray-300">
                                                    {month}
                                                </span>
                                            </div>

                                            {/* Text content */}
                                            <div className="text-right">
                                                <p className="text-white font-medium">{t.title}</p>

                                                <div className="flex items-center gap-2 justify-end mt-1">
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(t.dueDate).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>

                                                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                                                        {t.priority}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="flex items-center gap-3">
                                            <HiOutlineDotsVertical className="text-[#8EA3BF]" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>



        </>)
}

export default TeamProfile