import React, { useEffect, useState } from 'react'
import { HiOutlineNoSymbol, HiOutlinePencil, HiOutlinePlusCircle, HiOutlinePrinter } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const CaseInfo = ({ Case, onSave, isSaving, lawer }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        court: "",
        city: "",
        priority: "",
        status: "",
        assignedTo: "",
    });

    useEffect(() => {
        if (Case) {
            setFormData({
                court: Case.court || "",
                city: Case.city || "",
                priority: Case.priority || "",
                status: Case.status || "",
                assignedTo: Case.assignedTo?._id || "",
            });
        }
    }, [Case]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            court: Case?.court || "",
            city: Case?.city || "",
            priority: Case?.priority || "",
            status: Case?.status || "",
        });
        setIsEditing(false);
    };

    const formatDateArabic = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        return date.toLocaleDateString("ar-EG", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };
    const formatDateISO = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return "-";

        return date.toISOString().split("T")[0];
    };
    return (
        <>

            <section>
                <div
                    className="w-full bg-[#071a31] px-6 py-5 text-white mb-10"
                    dir="rtl"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="text-right">
                            <div className="mb-2 flex items-center justify-end gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-white">
                                    تفاصيل القضية
                                </h1>

                                <span className="inline-flex items-center rounded-full border border-[#2b3b56] bg-[#16263f] px-3 py-1 text-xs font-medium text-[#d3a53d]">
                                    {Case?.caseNumber}
                                </span>
                            </div>

                            <p className="text-sm text-[#7f93ad]">
                                تاريخ الإنشاء : {formatDateArabic(Case?.openedAt)}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex h-11 items-center gap-2 rounded-full outline-0 bg-[#d3a53d] px-5 text-sm font-semibold text-[#0b1830] transition hover:opacity-90"
                                >
                                    <HiOutlinePencil size={16} />
                                    تعديل القضية
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="inline-flex h-11 items-center gap-2 rounded-full bg-[#d3a53d] px-5 text-sm font-semibold text-[#0b1830] transition hover:opacity-90 disabled:opacity-60"
                                    >
                                        {isSaving ? "جارٍ الحفظ..." : "حفظ"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-600 bg-transparent px-5 text-sm font-medium text-white transition hover:bg-[#12233f]"
                                    >
                                        إلغاء
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#7d6524] bg-transparent px-5 text-sm font-medium text-[#d3a53d] transition hover:bg-[#12233f]"
                            >
                                <HiOutlinePlusCircle size={16} />
                                إضافة جلسة
                            </button>

                            <Link to={"/CaseMangemnt"}
                            >
                                <button
                                    type="button"
                                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[#7b2334] bg-transparent px-5 text-sm font-medium text-[#ff5d7d] transition hover:bg-[#1a1321]"
                                >
                                    <HiOutlineNoSymbol size={16} />
                                    إغلاق القضية
                                </button>
                            </Link>

                            <button
                                type="button"
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#243752] bg-transparent text-[#a7bad2] transition hover:bg-[#12233f] hover:text-white"
                            >
                                <HiOutlinePrinter size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div
                    className="w-285 mx-auto rounded-2xl border border-[#1a2d47] bg-[#09172b] px-6 py-10 mb-10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                    dir="rtl"
                >
                    <div className="grid grid-cols-4 gap-y-6 md:grid-cols-5 md:gap-7">
                        <div className="text-right">
                            <p className="mb-2 text-xs font-medium text-[#7f93ad]">
                                نوع القضية
                            </p>
                            <h3 className="text-sm font-semibold text-white">
                                {Case?.caseType?.name}
                            </h3>
                        </div>

                        <div className="text-right">
                            <p className="mb-2 text-xs font-medium text-[#7f93ad]">الحالة</p>
                            {isEditing ? (
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-[#1d2a3b] p-2 text-sm text-white outline-none"

                                >
                                    <option value="قيد التحضير">قيد التحضير</option>
                                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                                    <option value="منتهية">منتهية</option>
                                    <option value="موقوفة">موقوفة</option>
                                    <option value="مؤرشفة">مؤرشفة</option>
                                </select>

                            ) : (
                                <span className="inline-flex items-center rounded-full border border-[#244a7a] bg-[#0f2542] px-3 py-1 text-xs font-medium text-[#6aa8ff]">
                                    {Case?.status}
                                </span>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="mb-2 text-xs font-medium text-[#7f93ad]">
                                المحامي المسؤول
                            </p>

                            {isEditing ? (
                                <select
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-[#1d2a3b] p-2 text-sm text-white outline-none"
                                >
                                    <option value="">اختر محامي</option>

                                    {lawer?.users?.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.UserName}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <h3 className="text-sm font-semibold text-[#d3a53d]">
                                    أ. {Case?.assignedTo?.UserName}
                                </h3>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="mb-2 text-xs font-medium text-[#7f93ad]">المحكمة</p>
                            {isEditing ? (
                                <input
                                    name="court"
                                    value={formData.court}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-[#1d2a3b] p-2 text-sm text-white outline-none"
                                />
                            ) : (
                                <h3 className="text-sm font-semibold text-white">
                                    {Case?.court}
                                </h3>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="mb-2 text-xs font-medium text-[#7f93ad]">المدينة</p>
                            {isEditing ? (
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-[#1d2a3b] p-2 text-sm text-white outline-none"
                                />
                            ) : (
                                <h3 className="text-sm font-semibold text-white">
                                    {Case?.city}
                                </h3>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="mb-2 text-xs font-medium text-[#7f93ad]">
                                تاريخ الفتح
                            </p>
                            <h3 className="text-sm font-semibold text-white">
                                {formatDateISO(Case?.openedAt)}
                            </h3>
                        </div>

                        <div className="text-right">
                            <p className="mb-2 text-xs font-medium text-[#7f93ad]">
                                اسم العميل
                            </p>
                            <h3 className="text-sm font-semibold text-white">
                                {Case?.client?.fullName}
                            </h3>
                        </div>

                        <div className="text-right">
                            <p className="mb-2 text-xs font-medium text-[#7f93ad]">
                                درجة الأولوية
                            </p>
                            {isEditing ? (
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-[#1d2a3b] p-2 text-sm text-white outline-none"


                                >
                                    <option value="قيد التحضير"> عاجلة</option>
                                    <option value="قيد التنفيذ">عالية </option>
                                    <option value="منتهية">متوسطة</option>
                                    <option value="موقوفة">منخفضة</option>
                                </select>

                            ) : (
                                <span className="inline-flex items-center rounded-full border border-[#5b2431] bg-[#24131a] px-3 py-1 text-xs font-medium text-[#ff6b88]">
                                    {Case?.priority}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CaseInfo