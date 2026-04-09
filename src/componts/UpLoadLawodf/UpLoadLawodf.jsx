import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function UploadLawPdf({data}) {
    const [open, setOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
 
 
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            category: "EGYPTIAN_LAW",
            file: null,
        },
    });

    const watchedFile = watch("file");

    const handleFileChange = (file) => {
        if (!file) return;
        setSelectedFile(file);
        setValue("file", file, { shouldValidate: true });
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

   const onSubmit = async (data) => {
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("title", data.title);
    formData.append("category", data.category);

    const response = await api.post(
      "/lawReminder/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    console.log("Upload success:", response.data);

    toast.success("تم رفع الملف بنجاح");
    reset();
    setSelectedFile(null);
    setOpen(false);
  } catch (error) {
    console.error(error);
    console.log(error.response);
    toast.error(error?.response?.data?.message || "حصل خطأ أثناء الرفع");
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="p-6">
            <button
                onClick={() => setOpen(true)}
                className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
            >
                Upload Law PDF
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">رفع ملف قانون</h2>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    reset();
                                    setSelectedFile(null);
                                }}
                                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="اكتب عنوان الملف"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                    {...register("title", {
                                        required: "العنوان مطلوب",
                                    })}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                    {...register("category", {
                                        required: "القسم مطلوب",
                                    })}
                                >
                                    <option value="EGYPTIAN_LAW">EGYPTIAN_LAW</option>
                                    <option value="CONSTITUTIONF">CONSTITUTION</option>

                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    PDF File
                                </label>

                                <div
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${dragActive
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                                    />

                                    <p className="text-sm text-gray-600">
                                        اسحب ملف الـ PDF هنا أو اضغط للاختيار
                                    </p>

                                    {selectedFile && (
                                        <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 inline-block shadow-sm">
                                            {selectedFile.name}
                                        </p>
                                    )}
                                </div>

                                <input
                                    type="hidden"
                                    {...register("file", {
                                        required: "الملف مطلوب",
                                        validate: (value) =>
                                            value instanceof File || "لازم تختار ملف صحيح",
                                    })}
                                />

                                {errors.file && (
                                    <p className="mt-1 text-sm text-red-500">{errors.file.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        reset();
                                        setSelectedFile(null);
                                    }}
                                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {loading ? "جاري الرفع..." : "رفع الملف"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}