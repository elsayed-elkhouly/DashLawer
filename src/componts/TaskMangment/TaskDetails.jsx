import React, { useState, useEffect, useRef } from 'react';
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineHashtag,
  HiOutlineCheckCircle,
  HiOutlinePaperClip,
  HiOutlinePlus,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineDocumentText,
  HiOutlineXMark,
  HiArrowRight,
  HiOutlinePencil,
  HiOutlineArrowUturnLeft
} from 'react-icons/hi2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const getActivityText = (activity) => {
  const userName = activity.userId?.UserName || "مستخدم غير معروف";
  switch (activity.action) {
    case 'created':
      return `قام ${userName} بإنشاء المهمة`;
    case 'updated':
      return `قام ${userName} بتعديل تفاصيل المهمة`;
    case 'status_changed':
      return `قام ${userName} بتغيير الحالة من "${activity.details?.from || 'غير معروف'}" إلى "${activity.details?.to || 'غير معروف'}"`;
    case 'comment_added':
      return `أضاف ${userName} تعليقاً جديداً`;
    case 'file_uploaded':
      return `قام ${userName} برفع ملف جديد`;
    case 'step_completed':
      return `أكمل ${userName} خطوة: ${activity.details?.stepText || ''}`;
    default:
      return `قام ${userName} بنشاط (${activity.action})`;
  }
};

const TaskDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [currentTask, setCurrentTask] = useState(location.state?.task || {});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const token = Cookies.get("token");
  let userRole = null;
  if (token) {
    try {
      userRole = jwtDecode(token).role;
    } catch (e) { }
  }
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showAddSubtask, setShowAddSubtask] = useState(false);

  // Add Comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId, file }) => {
      const formData = new FormData();
      formData.append("content", content);
      if (parentCommentId) {
        formData.append("parentCommentId", parentCommentId);
      }
      if (file) {
        formData.append("file", file);
      }

      const res = await api.post(`/task/${id}/comments`, formData, {
        headers: { authorization: `Bearer ${Cookies.get("token")}` }
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم إضافة التعليق بنجاح ✅");
      setCommentText("");
      setReplyTo(null);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["Comments", id] });
    },
    onError: (err) => {
      toast.error("حدث خطأ أثناء إضافة التعليق ❌");
      console.error(err);
    }
  });

  // Queries for Clients and Users
  async function getClients() {
    const res = await api.get("/Client/all/", {
      headers: { authorization: `Bearer ${Cookies.get("token")}` }
    });
    return res.data;
  }
  const { data: Clients } = useQuery({
    queryKey: ["Clients"],
    queryFn: getClients,
  });

  function getUSers() {
    return api.get("/users", {
      headers: { authorization: `Bearer ${Cookies.get("token")}` }
    });
  }
  const { data: Lawer } = useQuery({
    queryKey: ["Users"],
    queryFn: getUSers
  });

  // Status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const res = await api.patch(`/task/${id}/status`, { status: newStatus });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success("تم تحديث الحالة بنجاح ✅");
      setCurrentTask(prev => ({ ...prev, status: variables }));
      queryClient.invalidateQueries({ queryKey: ["Tasks"] });
    },
    onError: (err) => {
      toast.error("حصل خطأ أثناء تحديث الحالة ❌");
      console.error(err);
    }
  });

  // Edit mutation
  const editTaskMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data };
      // Remove file if not provided since we are sending JSON
      if (!payload.file || payload.file.length === 0) {
        delete payload.file;
      }

      const res = await api.patch(`/task/${id}`, payload);
      return res.data;
    },
    onSuccess: (updatedData, variables) => {
      toast.success("تم تعديل المهمة بنجاح ✅");
      setIsEditModalOpen(false);
      setCurrentTask(prev => ({ ...prev, ...variables })); // Optimistic update
      queryClient.invalidateQueries({ queryKey: ["Tasks"] });
    },
    onError: (err) => {
      console.log(err.response.data);

      toast.error("حصل خطأ أثناء التعديل ❌");
      console.error(err);
    }
  });

  const addSubtaskMutation = useMutation({
    mutationFn: async (title) => {
      const res = await api.post(`/task/${id}/subtasks`, { title }, {
        headers: { authorization: `Bearer ${Cookies.get("token")}` }
      });
      return res.data;
    },
    onSuccess: (resData) => {
      toast.success("تم إضافة الخطوة بنجاح ✅");
      setNewSubtaskTitle("");
      setShowAddSubtask(false);

      const newSubtask = resData?.data || resData?.subtask || resData;
      setCurrentTask(prev => {
        const subtasks = prev.subtasks || [];
        return { ...prev, subtasks: [...subtasks, newSubtask] };
      });
      queryClient.invalidateQueries({ queryKey: ["Tasks"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إضافة الخطوة ❌");
      console.error(err);
    }
  });

  const toggleSubtaskMutation = useMutation({
    mutationFn: async ({ subtaskId, isCompleted }) => {
      const res = await api.patch(`/task/${id}/subtasks/${subtaskId}`, { isCompleted }, {
        headers: { authorization: `Bearer ${Cookies.get("token")}` }
      });
      return { subtaskId, isCompleted, data: res.data };
    },
    onSuccess: ({ subtaskId, isCompleted }) => {
      setCurrentTask(prev => {
        const subtasks = (prev.subtasks || []).map(st =>
          (st._id === subtaskId || st.id === subtaskId) ? { ...st, isCompleted } : st
        );
        return { ...prev, subtasks };
      });
    },
    onError: (err) => {
      toast.error("حدث خطأ أثناء التحديث ❌");
      console.error(err);
    }
  });

  const deleteSubtaskMutation = useMutation({
    mutationFn: async (subtaskId) => {
      const res = await api.delete(`/task/${id}/subtasks/${subtaskId}`);
      return { subtaskId, data: res.data };
    },
    onSuccess: ({ subtaskId }) => {
      toast.success("تم حذف الخطوة بنجاح ✅");
      setCurrentTask(prev => {
        const subtasks = (prev.subtasks || []).filter(st => st._id !== subtaskId && st.id !== subtaskId);
        return { ...prev, subtasks };
      });
      queryClient.invalidateQueries({ queryKey: ["Tasks"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء الحذف ❌");
      console.error(err);
    }
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    if (isEditModalOpen) {
      reset({
        title: currentTask.title || "",
        description: currentTask.description || "",
        priority: currentTask.priority || "متوسطة",
        dueDate: currentTask.dueDate ? currentTask.dueDate.split('T')[0] : "",
        client: currentTask.client?._id || currentTask.client || "",
        assignedTo: currentTask.assignedTo?._id || currentTask.assignedTo || "",
      });
    }
  }, [isEditModalOpen, currentTask, reset]);

  const onEditSubmit = (data) => {
    editTaskMutation.mutate(data);
  };
  function getCommnets() {
    return api.get(`/task/${id}/comments`);
  }
  const { data: Comments } = useQuery({
    queryKey: ["Comments", id],
    queryFn: getCommnets
  });
  // console.log(Comments);

  function getActivity() {
    return api.get(`/task/${id}/activity`);
  }
  const { data: Activity } = useQuery({
    queryKey: ["Activity", id],
    queryFn: getActivity
  });
  // console.log(Activity?.data?.logs);

  // Fallback data if task is not provided

  const data = {
    title: currentTask?.title || "مراجعة اتفاقية الاستحواذ - مجموعة الشراع",
    description: currentTask?.description || "لا يوجد وصف لهذه المهمة.",
    priority: currentTask?.priority || "أولوية عالية",
    dueDate: currentTask?.dueDate ? new Date(currentTask.dueDate).toLocaleDateString("ar-EG") : "25 أكتوبر 2026",
    status: currentTask?.status || "قيد التنفيذ",
    creator: currentTask?.assignedTo?.UserName || currentTask?.creator || "أحمد مصطفى",
    createdAt: currentTask?.createdAt ? new Date(currentTask.createdAt).toLocaleDateString("ar-EG") : "10 أكتوبر 2026",
    taskNumber: currentTask?._id ? `#TSK-${currentTask._id.slice(-4).toUpperCase()}` : "#TSK-992",
    steps: currentTask?.subtasks || [],
    comments: Comments?.data?.comments || [],
    activities: Activity?.data?.logs || []
  };

  const steps = data.steps;
  const completedStepsCount = steps.filter(s => s.isCompleted).length;
  const progressPercentage = steps.length > 0 ? (completedStepsCount / steps.length) * 100 : 0;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtaskMutation.mutate(newSubtaskTitle.trim());
    }
  };

  const toggleStep = (subtaskId, currentStatus) => {
    toggleSubtaskMutation.mutate({ subtaskId, isCompleted: !currentStatus });
  };

  const handleDeleteSubtask = (subtaskId) => {
    deleteSubtaskMutation.mutate(subtaskId);
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Top Header & Back Button */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#8EA3BF] hover:text-white transition group"
        >
          <HiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="font-medium">العودة للمهام</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* Main Content (Right Column) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">

          {/* Header Section */}
          <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8 border border-white/5 relative">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white flex-1">
                {data.title}
              </h1>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-[#8EA3BF] hover:text-white rounded-lg transition"
              >
                <HiOutlinePencil className="w-5 h-5" />
                <span className="hidden sm:inline">تعديل المهمة</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 text-sm font-medium rounded-full border border-amber-400 text-amber-400 bg-amber-400/10">
                {data.priority}
              </span>
              <div className="flex items-center gap-2 text-sm text-[#8EA3BF]">
                <HiOutlineCalendar className="w-4 h-4" />
                <span>موعد التسليم: {data.dueDate}</span>
              </div>

              {/* Status Dropdown */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <select
                  value={data.status}
                  onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                  disabled={updateStatusMutation.isPending}
                  className="bg-transparent text-amber-400 text-sm font-medium outline-none cursor-pointer border-b border-dashed border-amber-400/30 pb-0.5 disabled:opacity-50"
                >
                  <option className="text-black" value="قيد التنفيذ">قيد التنفيذ</option>
                  <option className="text-black" value="مجدولة">مجدولة</option>
                  <option className="text-black" value="متأخرة">متأخرة</option>
                  <option className="text-black" value="مكتملة">مكتملة</option>
                </select>
              </div>
            </div>

            <p className="text-[#8EA3BF] leading-relaxed text-sm md:text-base">
              {data.description}
            </p>

            <div className="mt-4 flex justify-end">
              <button className="text-amber-400 text-sm font-medium hover:underline">
                عرض المزيد ⌄
              </button>
            </div>
          </div>

          {/* Checklist Section */}
          <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                <HiOutlineCheckCircle className="w-6 h-6 text-amber-400" />
                <h2>قائمة الخطوات</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#8EA3BF]">
                  إنجاز {completedStepsCount} من {steps.length}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddSubtask(!showAddSubtask)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-400 text-[#0A1628] hover:bg-amber-500 transition"
                  >
                    <HiOutlinePlus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#14233A] rounded-full mb-6 overflow-hidden flex" dir="ltr">
              <div
                className="h-full bg-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Add Subtask Form */}
            {showAddSubtask && isAdmin && (
              <form onSubmit={handleAddSubtask} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="عنوان الخطوة الجديدة..."
                  className="flex-1 bg-[#14233A] text-white px-4 py-2 rounded-xl outline-none focus:ring-1 focus:ring-amber-400 border border-transparent focus:border-amber-400 text-sm"
                />
                <button
                  type="submit"
                  disabled={addSubtaskMutation.isPending || !newSubtaskTitle.trim()}
                  className="bg-amber-400 text-[#0A1628] px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-500 transition disabled:opacity-50"
                >
                  {addSubtaskMutation.isPending ? "جاري الإضافة..." : "إضافة"}
                </button>
              </form>
            )}

            {/* List */}
            <div className="space-y-4">
              {steps.map(step => (
                <div key={step.id || step._id} className="flex items-center gap-2">
                  <label
                    className={`flex-1 flex items-center gap-4 p-3 rounded-xl cursor-pointer transition ${step.isCompleted ? 'bg-white/5' : 'hover:bg-white/5'}`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${step.isCompleted ? 'bg-amber-400 border-amber-400' : 'border-[#8EA3BF] bg-transparent'}`}>
                      {step.isCompleted && <HiOutlineCheckCircle className="w-4 h-4 text-[#0A1628]" />}
                    </div>
                    <span className={`text-sm md:text-base ${step.isCompleted ? 'text-[#8EA3BF] line-through decoration-[#8EA3BF]/50' : 'text-white'}`}>
                      {step.title}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={step.isCompleted || false}
                      onChange={() => toggleStep(step.id || step._id, step.isCompleted)}
                    />
                  </label>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteSubtask(step.id || step._id)}
                      disabled={deleteSubtaskMutation.isPending}
                      className="p-3 text-[#8EA3BF] cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-xl transition disabled:opacity-50"
                      title="حذف الخطوة"
                    >
                      <HiOutlineXMark className="w-5 h-5 cursor-pointer" />
                    </button>
                  )}
                </div>
              ))}
              {steps.length === 0 && (
                <div className="text-center text-[#8EA3BF] py-4 text-sm">لا توجد خطوات مضافة حالياً.</div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8 border border-white/5">
            <div className="flex items-center gap-3 text-white font-bold text-lg mb-8">
              <HiOutlineChatBubbleLeftEllipsis className="w-6 h-6 text-amber-400" />
              <h2>التعليقات</h2>
            </div>

            <div className="space-y-6">
              {(data?.comments?.filter(c => !c.parentCommentId) || []).map(mainComment => (
                <div key={mainComment._id || mainComment.id} className="flex flex-col gap-4">
                  {/* Main Comment */}
                  <div className="flex gap-4">
                    {
                      mainComment.userId?.ProfilePhoto?.url ? (
                        <img
                          src={mainComment.userId.ProfilePhoto.url}
                          alt={mainComment.userId?.UserName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full  flex items-center justify-center text-white font-bold bg-[#c59d4a]">
                          {mainComment.userId?.UserName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )
                    }
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{mainComment.userId?.UserName || "مستخدم غير معروف"}</span>
                        <span className="text-xs text-[#8EA3BF]">{mainComment.createdAt ? new Date(mainComment.createdAt).toLocaleString("ar-EG") : ""}</span>
                      </div>
                      <div className="bg-[#14233A] rounded-2xl rounded-tr-none p-4 border border-white/5">
                        <p className="text-sm text-[#D7E3F4] leading-relaxed whitespace-pre-wrap">
                          {mainComment.content}
                        </p>

                        {mainComment.attachments && mainComment.attachments.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {mainComment.attachments.map((attachment, idx) => (
                              <a
                                key={attachment._id || idx}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-[#0A1628] rounded-xl w-fit border border-white/5 hover:border-amber-400/30 transition cursor-pointer group"
                              >
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500/20 transition">
                                  <HiOutlineDocumentText className="w-5 h-5" />
                                </div>
                                <span className="text-sm text-white group-hover:text-amber-400 transition">{attachment.name || "مرفق"}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => setReplyTo({ id: mainComment._id || mainComment.id, user: mainComment.userId?.UserName })}
                            className="flex items-center gap-1 text-xs text-[#8EA3BF] hover:text-amber-400 transition"
                          >
                            <HiOutlineArrowUturnLeft className="w-3 h-3" />
                            <span>رد</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  <div className="mr-8 md:mr-14 flex flex-col gap-4">
                    {(data?.comments?.filter(c => c.parentCommentId === (mainComment._id || mainComment.id)) || []).map(reply => (
                      <div key={reply._id || reply.id} className="flex gap-4 relative">
                        <div className="absolute -right-6 md:-right-10 top-4 w-4 md:w-6 h-px bg-white/10"></div>
                        <div className="absolute -right-6 md:-right-10 -top-full bottom-full w-px bg-white/10"></div>

                        <img src={reply.userId?.ProfilePhoto?.url || "https://i.pravatar.cc/150"} alt={reply.userId?.UserName} className="w-8 h-8 rounded-full object-cover border-2 border-[#0A1628]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white text-sm">{reply.userId?.UserName || "مستخدم غير معروف"}</span>
                            <span className="text-xs text-[#8EA3BF]">{reply.createdAt ? new Date(reply.createdAt).toLocaleString("ar-EG") : ""}</span>
                          </div>
                          <div className="bg-[#0A1628] rounded-2xl rounded-tr-none p-3 border border-white/5">
                            <p className="text-sm text-[#D7E3F4] leading-relaxed whitespace-pre-wrap">
                              {reply.content}
                            </p>

                            {reply.attachments && reply.attachments.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {reply.attachments.map((attachment, idx) => (
                                  <a
                                    key={attachment._id || idx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 bg-[#14233A] rounded-lg w-fit border border-white/5 hover:border-amber-400/30 transition cursor-pointer group"
                                  >
                                    <div className="p-1.5 bg-red-500/10 rounded-md text-red-500 group-hover:bg-red-500/20 transition">
                                      <HiOutlineDocumentText className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-white group-hover:text-amber-400 transition">{attachment.name || "مرفق"}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="mt-8 relative">
              {replyTo && (
                <div className="flex items-center justify-between bg-amber-400/10 border border-amber-400/20 p-2 px-4 rounded-t-xl mb-1">
                  <span className="text-xs text-amber-400">رد على: {replyTo.user}</span>
                  <button onClick={() => setReplyTo(null)} className="text-[#8EA3BF] hover:text-white transition">
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                </div>
              )}
              {selectedFile && (
                <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2 px-4 mb-2 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <HiOutlineDocumentText className="w-4 h-4 text-amber-400" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="text-[#8EA3BF] hover:text-red-400 transition">
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                </div>
              )}

              <textarea
                placeholder="اكتب تعليقك هنا..."
                className={`w-full min-h-[120px] bg-[#14233A] text-white p-4 pr-4 pl-4 pb-16 outline-none border border-transparent focus:border-amber-400/50 resize-none transition ${replyTo || selectedFile ? 'rounded-b-2xl rounded-t-none border-t border-white/5' : 'rounded-2xl'}`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-[#8EA3BF] hover:text-white transition text-sm"
                >
                  <HiOutlinePaperClip className="w-5 h-5" />
                  <span>إرفاق ملف</span>
                </button>
                <button
                  onClick={() => addCommentMutation.mutate({ content: commentText, parentCommentId: replyTo?.id, file: selectedFile })}
                  disabled={!commentText.trim() && !selectedFile || addCommentMutation.isPending}
                  className="bg-amber-400 text-[#0A1628] px-6 py-2 rounded-xl font-medium text-sm hover:bg-amber-500 transition disabled:opacity-50"
                >
                  {addCommentMutation.isPending ? "جاري الإرسال..." : "إرسال"}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar (Left Column) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">

          {/* Task Info */}
          <div className="bg-[#0A1628] rounded-2xl p-6 border border-white/5">
            <h3 className="text-amber-400 font-medium mb-6 text-sm">معلومات المهمة</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-[#8EA3BF]">أنشئت بواسطة</span>
                  <span className="text-sm text-white font-medium">{data.creator}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8EA3BF]">
                  <HiOutlineUser className="w-5 h-5" />
                </div>
              </div>

              <div className="h-px w-full bg-white/5"></div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-[#8EA3BF]">تاريخ الإنشاء</span>
                  <span className="text-sm text-white font-medium">{data.createdAt}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8EA3BF]">
                  <HiOutlineCalendar className="w-5 h-5" />
                </div>
              </div>

              <div className="h-px w-full bg-white/5"></div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-[#8EA3BF]">رقم المهمة</span>
                  <span className="text-sm text-white font-medium" dir="ltr">{data.taskNumber}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8EA3BF]">
                  <HiOutlineHashtag className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-[#0A1628] rounded-2xl p-6 border border-white/5">
            <h3 className="text-amber-400 font-medium mb-6 text-sm">سجل النشاطات</h3>

            <div className="relative border-r-2 border-white/5 pr-4 space-y-8 mt-2">
              {data.activities && data.activities.length > 0 ? data.activities.map((activity, index) => (
                <div key={activity._id || index} className="relative">
                  {/* Timeline Dot */}
                  <span className="absolute -right-[23px] top-1 w-3 h-3 rounded-full bg-amber-400 border-4 border-[#0A1628]"></span>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-white whitespace-pre-wrap">{getActivityText(activity)}</p>
                    <span className="text-xs text-[#8EA3BF]">
                      {activity.createdAt ? new Date(activity.createdAt).toLocaleString('ar-EG') : ""}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-[#8EA3BF]">لا توجد نشاطات حتى الآن.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {/* <div className="flex flex-col gap-3">
            <button className="w-full bg-amber-400 text-[#0A1628] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 transition">
              <HiOutlineCheckCircle className="w-5 h-5" />
              <span>اعتماد المهمة</span>
            </button>
            <button className="w-full bg-transparent border border-white/10 text-[#EF4444] py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 transition">
              <HiOutlineXMark className="w-5 h-5" />
              <span>طلب تعديل</span>
            </button>
          </div> */}

        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#081b31] border border-white/10 shadow-2xl">
            <div className="flex items-start justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">تعديل المهمة</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit(onEditSubmit)} className="p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-400">عنوان المهمة</label>
                <input
                  type="text"
                  className="mt-2 w-full h-11 rounded-xl bg-[#0a2038] border border-white/10 px-4 text-white outline-none focus:border-amber-400"
                  {...register("title", { required: "مطلوب" })}
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">وصف المهمة</label>
                <textarea
                  rows={4}
                  className="mt-2 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4 py-2 text-white outline-none focus:border-amber-400"
                  {...register("description", { required: "مطلوب" })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">العميل</label>
                  <select
                    className="h-11 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4 text-white outline-none"
                    {...register("client", {
                      setValueAs: (value) => (value === "" ? undefined : value),
                    })}
                  >
                    <option value="">اختر عميل</option>
                    {Clients?.clients?.map((c) => (
                      <option key={c._id} value={c._id}>{c.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">إسناد إلى</label>
                  <select
                    className="h-11 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4 text-white outline-none"
                    {...register("assignedTo", { required: "المحامي المسؤول مطلوب" })}
                  >
                    <option value="" disabled>اختر المحامي المسؤول</option>
                    {Lawer?.data?.users
                      ?.filter((user) => user.role === "LAWYER")
                      .map((user) => (
                        <option key={user._id} value={user._id}>{user.UserName}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">الموعد النهائي</label>
                  <input
                    type="date"
                    className="h-11 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4 text-white outline-none"
                    {...register("dueDate")}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">الأولوية</label>
                  <select
                    className="h-11 w-full rounded-xl bg-[#0a2038] border border-white/10 px-4 text-white outline-none"
                    {...register("priority")}
                  >
                    <option value="عاجلة">عاجلة</option>
                    <option value="عالية">عالية</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="منخفضة">منخفضة</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={editTaskMutation.isPending}
                className="w-full h-11 mt-4 rounded-xl bg-amber-400 text-black font-semibold disabled:opacity-50 hover:bg-amber-300"
              >
                {editTaskMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskDetails;
