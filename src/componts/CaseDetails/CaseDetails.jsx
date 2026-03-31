import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie';
import { HiOutlineBanknotes, HiOutlineCalendarDays, HiOutlineDocument, HiOutlineDocumentText, HiOutlineFolderOpen, HiOutlineNoSymbol, HiOutlinePencil, HiOutlinePlusCircle, HiOutlinePrinter } from 'react-icons/hi2';
import { FaRegFilePdf, FaRegFileWord } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';
import CaseInfo from '../CaseInfo/CaseInfo';
import FessInfo from '../FeesInfo/FessInfo';
import api from '../../api/axios';

const CaseDetails = () => {

    const { id } = useParams()
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    async function AddDocument(selectedFile) {
        if (!selectedFile) {
            alert("اختر ملف أولا");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setLoading(true);

            const res = await api.post(
                `/LegalCase/${id}/attachments`,
                formData,
                {
                    headers: {
                        authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            console.log(res.data);
            toast.success("تم رفع الملف بنجاح");
            queryClient.invalidateQueries({ queryKey: ["CaseDetails", id] });
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "حصل خطأ أثناء رفع الملف");
        } finally {
            setLoading(false);
        }
    }
    function getCaseDetails() {
        return api.get(`/LegalCase/${id}`, {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,
            }
        })
    }
    const { data, error } = useQuery({
        queryKey: ["CaseDetails", id],
        queryFn: getCaseDetails,
    });
    const Case = data?.data?.case || []
    async function deleteDoc(publicId) {
        try {
            setLoading(true);

            const res = await api.delete(
                `/LegalCase/${id}/attachments/`,
                {
                    headers: {
                        authorization: `Bearer ${Cookies.get("token")}`,
                    },
                    data: {
                        publicId,
                    },
                }
            );

            console.log(res.data);
            toast.success("تم حذف الملف بنجاح");
            queryClient.invalidateQueries({ queryKey: ["CaseDetails", id] });
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "حصل خطأ أثناء حذف الملف");
        } finally {
            setLoading(false);
        }
    }
    function updateCaseData(updatedCase) {
        return api.put(
            `/LegalCase/${id}`,
            updatedCase,
            {
                headers: {
                    authorization: `Bearer ${Cookies.get("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );
    }
    const updateCaseMutation = useMutation({
        mutationFn: updateCaseData,
        onSuccess: (res, variables) => {
            queryClient.setQueryData(["CaseDetails", id], (oldData) => {
                if (!oldData) return oldData;

                const selectedLawyer = Lawer?.data?.users?.find(
                    (user) => user._id === variables.assignedTo
                );

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        case: {
                            ...oldData.data.case,
                            ...variables,
                            assignedTo: selectedLawyer || oldData.data.case.assignedTo,
                        },
                    },
                };
            });

            queryClient.invalidateQueries({ queryKey: ["CaseDetails", id] });
        },
    });
    function getUSers() {
        return api.get("/users", {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,

            }
        })
    }
    const { data: Lawer } = useQuery({
        queryKey: ["CaseDetails"],
        queryFn: getUSers
    })
    function updateFeesData(updatedFees) {
        return api.patch(
            `/LegalCase/${id}/fees`,
            updatedFees,
            {
                headers: {
                    authorization: `Bearer ${Cookies.get("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    const updateFeesMutation = useMutation({
        mutationFn: updateFeesData,
        onSuccess: (res, variables) => {
            queryClient.setQueryData(["CaseDetails", id], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        case: {
                            ...oldData.data.case,
                            fees: {
                                ...oldData.data.case?.fees,
                                ...variables,
                            },
                        },
                    },
                };
            });

            queryClient.invalidateQueries({ queryKey: ["CaseDetails", id] });
            toast.success("تم تعديل الأتعاب بنجاح");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "حصل خطأ أثناء تعديل الأتعاب");
        },
    });
    const formatDateISO = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return "-";

        return date.toISOString().split("T")[0];
    };
    function getAllSesions() {
        return api.get(`/session/case/${id}`, {
            headers: {
                authorization: `Bearer ${Cookies.get("token")}`,

            }
        })
    }
    const { data: Sesions } = useQuery({
        queryKey: ["Sesions"],
        queryFn: getAllSesions
    })
    console.log(Sesions?.data?.sessions);

    return (
        <>

            <CaseInfo
                Case={Case}
                onSave={(updatedCase) => updateCaseMutation.mutate(updatedCase)}
                isSaving={updateCaseMutation.isPending}
                lawer={Lawer?.data}
                id={id}
            />
            {/* وصف القضيه  */}

            <section className="flex justify-center px-4 py-6">
                <div className="grid w-full max-w-7xl grid-cols-1 gap-5 lg:grid-cols-3" dir="rtl">
                    <div className="lg:col-span-2 rounded-2xl border border-[#1a2d47] bg-[#09172b] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                                <HiOutlineDocumentText size={18} className="text-[#d3a53d]" />
                                وصف القضية
                            </h2>
                        </div>

                        <div className="border-t border-[#13243b] pt-4">
                            <p className="text-sm leading-8 text-[#c8d6e8]">
                                {Case?.description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#1a2d47] bg-[#09172b] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                                <HiOutlineFolderOpen size={18} className="text-[#d3a53d]" />
                                المستندات
                            </h2>

                            <label
                                className={`cursor-pointer rounded-lg bg-[#d3a53d] px-4 py-2 text-sm text-black hover:opacity-90 ${loading ? "pointer-events-none opacity-50" : ""
                                    }`}
                            >
                                {loading ? "جاري الرفع..." : "رفع مستند"}

                                <input
                                    type="file"
                                    className="hidden"
                                    disabled={loading}
                                    onChange={(e) => {
                                        const selectedFile = e.target.files?.[0];
                                        if (!selectedFile) return;
                                        AddDocument(selectedFile);
                                    }}
                                />
                            </label>
                        </div>

                        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                            {Case?.attachments?.length > 0 ? (
                                Case.attachments.map((file, index) => (
                                    <div
                                        key={file.publicId || index}
                                        className="flex items-center justify-between rounded-2xl border border-[#13243b] bg-[#0d1c33] px-4 py-4 transition hover:bg-[#10203a]"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3d2b2f] bg-[#1b1620] text-[#ff5f7a]">
                                                <FaRegFilePdf size={16} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {file.name || `مستند ${index + 1}`}
                                                </p>
                                                <p className="mt-1 text-xs text-[#7f93ad]">
                                                    {file.uploadedAt ? formatDateISO(file.uploadedAt) : "بدون تاريخ"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-3">
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#243752] bg-[#0a1830] text-[#a7bad2] transition hover:bg-[#12233f] hover:text-white"
                                            >
                                                <HiOutlineDocument size={16} />
                                            </a>

                                            <button
                                                type="button"
                                                onClick={() => deleteDoc(file.publicId)}
                                                className="cursor-pointer text-lg text-red-400 hover:text-red-600"
                                            >
                                                <RiDeleteBin6Line />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-[#7f93ad]">لا توجد مستندات</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/*  */}
            <section>
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12" dir="rtl">
                    {/* right side */}
                    <div className="xl:col-span-8 space-y-5">
                        {/* fees card */}
                        <FessInfo
                            fees={Case?.fees}
                            onSave={(updatedFees) => updateFeesMutation.mutate(updatedFees)}
                            isSaving={updateFeesMutation.isPending} />

                        {/* sessions table */}
                        <div className="rounded-2xl border border-[#1a2d47] bg-[#09172b] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <HiOutlineCalendarDays size={18} className="text-[#d3a53d]" />
                                    جدول الجلسات
                                </h2>

                                <button
                                    type="button"
                                    className="text-sm font-medium text-[#d3a53d] transition hover:opacity-90"
                                >
                                    مشاهدة الكل
                                </button>
                            </div>

                            <div className="overflow-x-auto border-t border-[#13243b] pt-4">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#13243b] text-xs text-[#7f93ad]">
                                            <th className="px-4 py-3 text-right font-medium">التاريخ</th>
                                            <th className="px-4 py-3 text-right font-medium">الوقت</th>
                                            <th className="px-4 py-3 text-right font-medium">نوع الجلسة</th>
                                            <th className="px-4 py-3 text-right font-medium">ملاحظات</th>
                                            <th className="px-4 py-3 text-right font-medium">الحالة</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Sesions?.data?.sessions.map((session, index) => {
                                            const dateObj = new Date(session.startAt);

                                            const date = dateObj.toLocaleDateString("en-CA"); // 2026-03-30
                                            const time = dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            });

                                            return (
                                                <tr
                                                    key={session._id}
                                                    className="border-b border-[#13243b] text-sm text-[#dbe7f5]"
                                                >
                                                    {/* التاريخ */}
                                                    <td className="px-4 py-4">{date}</td>

                                                    {/* الوقت */}
                                                    <td className="px-4 py-4">{time}</td>

                                                    {/* النوع */}
                                                    <td className="px-4 py-4">{session.type}</td>

                                                    {/* الملاحظات */}
                                                    <td className="px-4 py-4 text-[#9fb1c8]">
                                                        {session.notes || "لا يوجد ملاحظات"}
                                                    </td>

                                                    {/* الحالة */}
                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${session.status === "مجدولة"
                                                                    ? "bg-yellow-900 text-yellow-300"
                                                                    : session.status === "تمت"
                                                                        ? "bg-green-900 text-green-300"
                                                                        : session.status === "مؤجلة"
                                                                            ? "bg-blue-900 text-blue-300"
                                                                            : session.status === "ملغية"
                                                                                ? "bg-red-900 text-red-300"
                                                                                : "bg-gray-700 text-white"
                                                                }`}
                                                        >
                                                            {session.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* left side */}
                    <div className="xl:col-span-4">
                        <div className="rounded-2xl border border-[#1a2d47] bg-[#09172b] p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <span className="text-[#d3a53d]">👥</span>
                                    فريق العمل
                                </h2>
                            </div>
                            <div className="space-y-4 border-t border-[#13243b] pt-4">
                                {Case?.team?.map((member, index) => (
                                    <div
                                        key={member._id || index}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex-1 text-right">
                                            <h3 className="text-sm font-semibold text-white">
                                                {member.UserName}
                                            </h3>
                                            <p className="mt-1 text-xs text-[#7f93ad]">
                                                محامي رئيسي
                                            </p>
                                        </div>

                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#243752] bg-[#13233e] text-sm font-bold text-[#d3a53d]">
                                            {member.UserName.charAt(0)}
                                        </div>
                                    </div>
                                ))}


                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default CaseDetails