import React, { useEffect, useRef } from 'react'
import api from '../../api/axios'
import Cookies from 'js-cookie';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import toast from 'react-hot-toast';

const MyProfile = () => {
    function getProfile() {
        return api.get("/users/profile/me", {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,

            }
        })

    }
    const { data,isLoading } = useQuery({
        queryKey: ["MyProfile"],
        queryFn: getProfile
    })
    console.log(data);
      
   

    
    const queryClient = useQueryClient();
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    
   

   

    const UserData = data?.data?.user
    console.log(UserData);

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
            reset({
                UserName: UserData?.UserName || "",
                email: UserData?.email || "",
                phone: UserData?.phone ? String(UserData.phone) : "",
                department: UserData?.department || "",
                jobTitle: UserData?.jobTitle || "",
            });

            setPreviewImage(UserData?.ProfilePhoto?.url || "");
        }
    }, [UserData, reset]);

    const handleEditClick = () => {
        reset({
            UserName: UserData?.UserName || "",
            email: UserData?.email || "",
            phone: UserData?.phone ? String(UserData.phone) : "",
            department: UserData?.department || "",
            jobTitle: UserData?.jobTitle || "",
        });
        setPreviewImage(UserData?.ProfilePhoto?.url || "");
        setIsEditing(true);
    };
    // const handleFreezeUser = async () => {
    //     if (!window.confirm("هل أنت متأكد من تجميد الحساب؟")) return;

    //     try {
    //         await api.patch(
    //             `/users/${id}/freeze`,
    //             {},
    //             {
    //                 headers: {
    //                     authorization: `Bearer ${Cookies.get("token")}`,
    //                 },
    //             }
    //         );

    //         toast.success("تم تجميد الحساب");

    //         queryClient.invalidateQueries(["UserProfile", id]);
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("حصل خطأ");
    //     }
    // };

    // const handleUnfreezeUser = async () => {
    //     if (!window.confirm("هل أنت متأكد من فك التجميد؟")) return;

    //     try {
    //         await api.patch(
    //             `/users/${id}/unfreeze`,
    //             {},
    //             {
    //                 headers: {
    //                     authorization: `Bearer ${Cookies.get("token")}`,
    //                 },
    //             }
    //         );

    //         toast.success("تم فك التجميد");

    //         queryClient.invalidateQueries(["UserProfile", id]);
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("حصل خطأ");
    //     }
    // };
    // useEffect(() => {
    //     const handleClickOutside = (e) => {
    //         if (menuRef.current && !menuRef.current.contains(e.target)) {
    //             setShowAccountMenu(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, []);

    const handleCancel = () => {
        reset({
            UserName: UserData?.UserName || "",
            email: UserData?.email || "",
            phone: UserData?.phone ? String(UserData.phone) : "",
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
                    phone: String(formValues.phone),
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

            reset({
                UserName: updatedUser?.UserName || "",
                email: updatedUser?.email || "",
                phone: updatedUser?.phone ? String(updatedUser.phone) : "",
                department: updatedUser?.department || "",
                jobTitle: updatedUser?.jobTitle || "",
            });

            setPreviewImage(updatedUser?.ProfilePhoto?.url || "");
            setIsEditing(false);
            toast.success("تم تعديل البيانات بنجاح");
        } catch (error) {
            console.log(error);
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

            const response = await api.patch(`users/updateProfilePhoto`, formData, {
                headers: {
                    authorization: `Bearer ${Cookies.get("token")}`,

                },
            });

            const updatedUser =
                response?.data?.user || response?.data?.data || response?.data;

            

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
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
                                            نشط
                                        </span>

                                      
                                            <span className="rounded-full bg-amber-400/20 px-2 py-1 text-xs text-amber-300">
                                                {UserData?.jobTitle}
                                            </span>
                                      
                                    </div>

                                  
                                        <h2 className="mt-2 text-2xl font-bold">{UserData?.UserName}</h2>
                                  

                                    <p className="rounded-full bg-amber-400/20 px-2 py-1 text-xs text-amber-300 w-fit mt-2">
                                        {UserData?.role}
                                    </p>

                                    <div className="mt-2 space-y-2">
                                        
                                            <>
                                                <p className="text-sm text-[#8EA3BF]">
                                                    القسم: {UserData?.department}
                                                </p>

                                                <p className="text-sm text-[#8EA3BF]">
                                                    رقم التسجيل: 83742939847
                                                </p>

                                                <p className="mt-2 text-xs text-[#8EA3BF]">
                                                    {UserData?.email} • {UserData?.phone}
                                                </p>
                                            </>
                                      
                                    </div>
                                </div>
                            </div>

                       



                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {[
                            { title: "مواعيد اليوم", value: 3, icon: <HiOutlineCalendarDays />, color: "text-red-400" },
                            { title: "القضايا النشطة", value: 12, icon: <HiOutlineBriefcase />, color: "text-purple-400" },
                            { title: "القضايا المنجزة", value: 18, icon: <HiOutlineFolder />, color: "text-blue-400" },
                            { title: "إجمالي القضايا", value: 42, icon: <HiOutlineClipboardDocumentList />, color: "text-amber-400" },
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
                            {[
                                {
                                    id: "#CASE-4412",
                                    client: "شركة الأركان المحدودة",
                                    type: "نزاع تجاري",
                                    status: "قيد المراجعة",
                                    date: "2024/05/12",
                                },
                                {
                                    id: "#CASE-4398",
                                    client: "مؤسسة النجاح",
                                    type: "قضية عمالية",
                                    status: "تحضير الجلسة",
                                    date: "2024/05/10",
                                },
                                {
                                    id: "#CASE-4201",
                                    client: "سالم عبد العزيز",
                                    type: "تحصيل ديون",
                                    status: "مكتمل",
                                    date: "2024/04/28",
                                },
                            ].map((c, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-5 items-center rounded-xl bg-[#081b31] px-4 py-3"
                                >
                                    <div>{c.date}</div>
                                    <div className="text-blue-400">{c.status}</div>
                                    <div>{c.type}</div>
                                    <div>{c.client}</div>
                                    <div className="text-amber-400">{c.id}</div>
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
                            {[
                                {
                                    title: "مراجعة العقود النهائية لشركة الوفاق",
                                    status: "أولوية قصوى",
                                    color: "text-red-400",
                                },
                                {
                                    title: "تقديم مذكرة الدفاع في القضية #4398",
                                    status: "متأخرة",
                                    color: "text-amber-400",
                                },
                                {
                                    title: "اتصال مع العميل سالم عبد العزيز",
                                    status: "منخفضة",
                                    color: "text-blue-400",
                                },
                            ].map((t, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl bg-[#081b31] px-4 py-4"
                                >
                                    <HiOutlineDotsVertical className="text-[#8EA3BF]" />

                                    <div className="text-right">
                                        <p>{t.title}</p>
                                        <p className={`text-xs ${t.color}`}>{t.status}</p>
                                    </div>

                                    <input type="checkbox" className="accent-amber-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>



        </>)
}


export default MyProfile