import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi2";
import api from '../../api/axios';
import Cookies from 'js-cookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TaskMangment = () => {
  const navigate = useNavigate();


  const queryClient = useQueryClient();

  const statusStyle = {
    "قيد التنفيذ": "bg-amber-400/20 text-amber-300",
    مجدولة: "bg-slate-500/20 text-slate-300",
    متأخرة: "bg-red-500/20 text-red-400",
    مكتملة: "bg-emerald-500/20 text-emerald-400",
  };

  const priorityStyle = {
    عاجلة: "bg-red-500/20 text-red-400",
    عالية: "bg-red-500/20 text-red-400",
    متوسطة: "bg-amber-400/20 text-amber-300",
    منخفضة: "bg-emerald-500/20 text-emerald-400",
  };
  const [openModal, setOpenModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("متوسطة");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      client: "",
      assignedTo: "",
      priority: "متوسطة",
      dueDate: "",
      file: null,
    },
  });
  const watchedFile = watch("file");

  async function createTask(data) {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "file") {
        if (data.file?.[0]) {
          formData.append("file", data.file[0]);
        }
      } else if (key === "client") {
        if (data.client) {
          formData.append("client", data.client);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    const res = await api.post("/task/", formData, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    return res.data;
  }
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tasks"] });
      toast.success("تم إنشاء المهمة بنجاح ✅");
      reset();
      setSelectedPriority("متوسطة");
    },
    onError: (err) => {
      toast.error("حصل خطأ أثناء الإرسال ❌");
      console.log("Full error:", err);
      console.log("Error response:", err.response);
      console.log("Error data:", err.response?.data);
      console.log("Error status:", err.response?.status);
      console.error(err);
      console.error(err.response);

    },
  });
  const onSubmit = (data) => {
    createTaskMutation.mutate(data);
  };
  async function getClients() {
    const res = await api.get(
      "/Client/all/",
      {

        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return res.data;
  }
  const {
    data: Clients,

  } = useQuery({
    queryKey: ["Clients"],
    queryFn: getClients,


  });
  function getUSers() {
    return api.get("/users", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,

      }
    })
  }
  const { data: Lawer } = useQuery({
    queryKey: ["Users"],
    queryFn: getUSers
  })

  const LIMIT = 5;


  async function getTasks(page = 1) {
    const res = await api.get("/task/", {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: {
        page,
        limit: LIMIT,
      },
    });

    return res.data;
  }
  const [page, setPage] = useState(1);

  const {
    data: Tasks,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["Tasks", page],
    queryFn: () => getTasks(page),
    keepPreviousData: true,
  });
  // console.log(Tasks);

  const tasks = Tasks?.tasks || [];
  const total = Tasks?.total || 0;
  const currentPage = Tasks?.currentPage || page;
  const totalPages = Tasks?.totalPages || 1;

  const startItem = total === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const endItem = Math.min(currentPage * LIMIT, total);
  const stats = [
    {
      id: 1,
      title: "إجمالي المهام",
      value: Tasks?.stats?.total,
      icon: <HiOutlineClipboardDocumentList size={18} />,
      iconColor: "text-slate-300",
    },
    {
      id: 2,
      title: "مهام متأخرة",
      value: Tasks?.stats?.overdue,
      icon: <HiOutlineExclamationCircle size={18} />,
      iconColor: "text-red-400",
    },
    {
      id: 3,
      title: "مهام قيد التنفيذ",
      value: Tasks?.stats?.pending,
      icon: <HiOutlineClock size={18} />,
      iconColor: "text-amber-400",
    },
    {
      id: 4,
      title: "المهام المكتملة",
      value: Tasks?.stats?.completed,
      icon: <HiOutlineCheckCircle size={18} />,
      iconColor: "text-emerald-400",
    },
  ];
  const priorities = ["عاجلة", "عالية", "متوسطة", "منخفضة"];
  const handleViewTask = (task) => {
    navigate(`/TaskMangment/TaskDetails/${task.id || task._id}`, { state: { task } });
  };
  async function deleteTask(id) {
    const res = await api.delete(`/task/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    return res.data;
  }
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (deletedTaskId) => {
      await queryClient.cancelQueries({ queryKey: ["Tasks", page] });

      const previousTasksData = queryClient.getQueryData(["Tasks", page]);

      queryClient.setQueryData(["Tasks", page], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          tasks: oldData.tasks.filter((t) => t.id !== deletedTaskId && t._id !== deletedTaskId),
          total: Math.max(0, (oldData.total || 1) - 1),
        };
      });

      return { previousTasksData };
    },
    onError: (err, deletedTaskId, context) => {
      if (context?.previousTasksData) {
        queryClient.setQueryData(["Tasks", page], context.previousTasksData);
      }
      toast.error(err.response.data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tasks"] });
      toast.success("تم حذف المهمة بنجاح 🗑️");
    },
  });
  return (

    <>
      {/* header */}
      <div dir="rtl" className="w-full  px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Right Side (Title) */}
          <div className="text-right">
            <h1 className="text-2xl sm:text-4xl font-bold text-white">إدارة المهام</h1>
            <p className="mt-1 text-sm text-[#8EA3BF] leading-6">
              عرض وصيانة كافة مهام المكتب القانوني بنظام الجداول
            </p>
          </div>

          {/* Left Side (Button) */}
          <button
            onClick={() => setOpenModal(true)}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 rounded-full bg-[#D7AE46] px-5 py-2.5 text-sm font-medium text-[#071a2f] transition hover:opacity-90"
          >
            <span className="text-lg">+</span>
            إضافة مهمة جديدة
          </button>

          {openModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
              <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#081b31] border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-white/10 gap-4">
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-white">إضافة مهمة جديدة</h2>
                    <p className="text-xs sm:text-sm text-[#8EA3BF] mt-1">
                      أدخل تفاصيل المهمة وتعيين الفريق
                    </p>
                  </div>

                  <button
                    onClick={() => setOpenModal(false)}
                    className="shrink-0 text-slate-400 hover:text-white text-xl cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-4 sm:p-6 space-y-4 text-white"
                >
                  <div>
                    <label className="text-sm text-slate-400">عنوان المهمة</label>
                    <input
                      type="text"
                      placeholder="مثلاً: مراجعة العقد..."
                      className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4 outline-none focus:border-amber-400"
                      {...register("title", { required: "عنوان المهمة مطلوب" })}
                    />
                    {errors.title && (
                      <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-slate-400">وصف المهمة</label>
                    <textarea
                      rows={3}
                      placeholder="اكتب التفاصيل..."
                      className="mt-2 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4 py-2 outline-none focus:border-amber-400"
                      {...register("description", { required: "وصف المهمة مطلوب" })}
                    />
                    {errors.description && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div>
                      <label className="text-sm text-slate-400">العميل</label>
                      <select
                        {...register("client", {
                          setValueAs: (value) => (value === "" ? undefined : value),
                        })}
                        className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4"
                      >
                        <option value="">اختر عميل</option>
                        {Clients?.clients.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.fullName}
                          </option>
                        ))}
                      </select>
                      {errors.client && (
                        <p className="text-red-400 text-xs mt-1">{errors.client.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-slate-400">إسناد إلى</label>
                      <select
                        {...register("assignedTo", {
                          required: "المحامي المسؤول مطلوب",
                        })}
                        dir="rtl"
                        className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4"
                      >
                        <option disabled>اختر المحامي المسؤول</option>

                        {Lawer?.data?.users
                          ?.filter((user) => user.role === "LAWYER")
                          .map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.UserName}
                            </option>
                          ))}
                      </select>
                      {errors.assignedTo && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.assignedTo.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-slate-400">الأولوية</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {priorities.map((p) => (
                          <button
                            type="button"
                            key={p}
                            onClick={() => {
                              setSelectedPriority(p);
                              setValue("priority", p);
                            }}
                            className={`px-3 py-1 rounded-full text-xs border transition ${selectedPriority === p
                              ? "border-amber-400 bg-amber-400/20 text-amber-300"
                              : "border-white/10 bg-white/5 hover:bg-amber-400/20"
                              }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <input type="hidden" {...register("priority")} />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">
                        الموعد النهائي
                      </label>
                      <input
                        type="date"
                        className="h-11 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4"
                        {...register("dueDate", { required: "الموعد النهائي مطلوب" })}
                      />
                      {errors.dueDate && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 block mb-2">إرفاق ملف</label>
                    <input
                      type="file"
                      className="w-full text-sm text-slate-300"
                      {...register("file")}
                    />
                    {watchedFile?.[0] && (
                      <p className="text-xs text-slate-400 mt-2">
                        الملف المختار: {watchedFile[0].name}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={createTaskMutation.isPending}
                    className="w-full h-11 rounded-xl bg-amber-400 text-black font-semibold disabled:opacity-50 hover:bg-amber-300 cursor-pointer"
                  >
                    {createTaskMutation.isPending ? "جاري الإرسال..." : "إرسال المهمة"}
                  </button>
                </form>


              </div>
            </div>
          )}
        </div>
      </div>

      {/* cards */}
      <div dir="rtl" className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[...stats].reverse().map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/5 bg-[#0d2139] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-right min-w-0">
                  <p className="text-sm text-[#8EA3BF]">{item.title}</p>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-bold leading-none text-white break-words">
                    {item.value}
                  </h3>
                </div>

                <div className={`mt-1 shrink-0 ${item.iconColor}`}>{item.icon}</div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* table */}
      <div dir="rtl" className="mt-6 px-4 sm:px-6 lg:px-8 pb-6">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#081b31]">
          {/* Header */}
          <div className="hidden lg:grid grid-cols-10 bg-white/3 px-4 py-3 text-sm text-[#8EA3BF]">
            <div className="col-span-1">عنوان المهمة</div>
            <div className="col-span-2">الموكل</div>
            <div className="col-span-3">المسؤول</div>
            <div className="col-span-1">الأولوية</div>
            <div className="col-span-1">الموعد النهائي</div>
            <div className="col-span-1">الحالة</div>
            <div className="col-span-1 ">الإجراءات</div>
          </div>

          {/* الحالة العامة */}
          {isLoading ? (
            //  Loading 
            <>
              {/* Mobile loading */}
              <div className="lg:hidden divide-y divide-white/5">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="p-4 space-y-3  flex items-center justify-center">
                    <span className="loading loading-infinity loading-xl text-[#C9A14A]"></span>
                  </div>
                ))}
              </div>

              {/* Desktop loading */}
              <div className="hidden lg:block">
                {[1, 2, 3, 4].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 border-t border-white/5 bg-white/5  flex items-center justify-center "
                  ><span className="loading loading-infinity loading-xl text-[#C9A14A]"></span></div>
                ))}
              </div>
            </>
          ) : !Tasks?.tasks?.length ? (

            <div className="p-8 text-center text-[#8EA3BF]">
              لا توجد مهام حالياً
            </div>
          ) : (
            <>
              {/*  Mobile */}
              <div className="lg:hidden divide-y divide-white/5">
                {Tasks.tasks.map((task, index) => (
                  <div
                    key={task.id || task._id || index}
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {task.title || "-"}
                        </p>
                        <p className="text-xs text-[#8EA3BF] mt-1">
                          {task.client?.fullName || "-"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-xs whitespace-nowrap ${priorityStyle?.[task.priority] ||
                          "bg-white/10 text-white"
                          }`}
                      >
                        {task.priority || "-"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-right">
                        <p className="text-[#8EA3BF] text-xs mb-1">الموكل</p>
                        <p className="text-white">
                          {task.client?.fullName || "-"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[#8EA3BF] text-xs mb-1">المسؤول</p>
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-white">
                            {task.assignedTo?.UserName || "-"}
                          </span>

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20 text-xs text-amber-300">
                            {task.assignedTo?.UserName?.charAt(0) || "-"}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[#8EA3BF] text-xs mb-1">الموعد النهائي</p>
                        <p className="text-white">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("en-GB")
                            : "-"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[#8EA3BF] text-xs mb-1">الحالة</p>
                        <span
                          className={`rounded-full px-2 py-1 text-xs inline-block ${statusStyle?.[task.status] ||
                            "bg-white/10 text-white"
                            }`}
                        >
                          {task.status || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-start gap-2 text-[#8EA3BF] pt-1">
                      <button
                        onClick={() => handleViewTask(task)}
                        className="rounded-lg p-2 hover:bg-white/5"
                      >
                        <HiOutlineEye className='cursor-pointer' />
                      </button>



                      <button
                        onClick={() => deleteTaskMutation.mutate(task.id)}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                        <HiOutlineTrash className='cursor-pointer'
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/*  Desktop */}
              <div className="hidden lg:block">
                {Tasks.tasks.map((task, index) => (
                  <div
                    key={task.id || task._id || index}
                    className="grid grid-cols-10 items-center border-t border-white/5 px-4 py-4 text-sm"
                  >
                    <div className="col-span-1 text-white text-right">
                      {task.title || "-"}
                    </div>

                    <div className="col-span-2 text-[#8EA3BF] text-right">
                      {task.client?.fullName || "-"}
                    </div>

                    <div className="col-span-3 flex items-center gap-2">

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20 text-xs text-amber-300">
                        {task.assignedTo?.UserName?.charAt(0) || "-"}
                      </div>
                      <p className="text-white">
                        {task.assignedTo?.UserName || "-"}
                      </p>
                    </div>

                    <div className="col-span-1">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${priorityStyle?.[task.priority] ||
                          "bg-white/10 text-white"
                          }`}
                      >
                        {task.priority || "-"}
                      </span>
                    </div>

                    <div className="col-span-1 text-[#8EA3BF]">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-GB")
                        : "-"}
                    </div>

                    <div className="col-span-1">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${statusStyle?.[task.status] ||
                          "bg-white/10 text-white"
                          }`}
                      >
                        {task.status || "-"}
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-start gap-2 text-[#8EA3BF]">
                      <button
                        onClick={() => handleViewTask(task)}
                        className="rounded-lg p-2 hover:bg-white/5 cursor-pointer"
                      >
                        <HiOutlineEye className='cursor-pointer' />
                      </button>



                      <button
                        onClick={() => deleteTaskMutation.mutate(task._id)}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 cursor-pointer">
                        <HiOutlineTrash className='cursor-pointer' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 px-4 py-3 text-sm text-[#8EA3BF]">
            <div className="text-center sm:text-right">
              عرض {startItem} إلى {endItem} من أصل {total} مهمة
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-8 w-8 rounded-full ${currentPage === pageNumber
                    ? "bg-amber-400 text-black"
                    : "bg-white/5 hover:bg-white/10 text-white"
                    }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default TaskMangment