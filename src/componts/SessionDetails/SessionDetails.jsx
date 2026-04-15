import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import api from '../../api/axios';

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUniversity,
  FaGavel,
  FaStickyNote,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaFolderOpen,
  FaInfoCircle,
  FaClock,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlinePencil, HiCheck, HiXMark, HiOutlineFolderOpen } from "react-icons/hi2";
import { useEffect, useState } from "react";
const SessionDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    startAt: "",
    courtName: "",
    city: "",
    circuit: "",
    notes: "",
    assignedTo: "",
    team: [],
  });
  const getAllSesions = () => {
    return api.get(`/session/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
  };

  const {
    data: sessionResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["session", id],
    queryFn: getAllSesions,
  });
  console.log(sessionResponse);

  const updateSession = (updatedData) => {
    return api.patch(`/session/${id}`, updatedData, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
  };

  const { mutate: updateSessionMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", id] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Update error:", error);
    },
  });
  const session = sessionResponse?.data?.session;

  useEffect(() => {
    if (session) {
      setFormData({
        type: session?.type || "",
        startAt: session?.startAt
          ? new Date(session.startAt).toISOString().slice(0, 16)
          : "",
        courtName: session?.courtName || "",
        city: session?.city || "",
        circuit: session?.circuit || "",
        notes: session?.notes || "",
        assignedTo: session?.assignedTo?.id || session?.assignedTo?._id || "",
        team: Array.isArray(session?.team)
          ? session.team.map((member) => member?.id || member?._id).filter(Boolean)
          : [],
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      type: formData.type,
      startAt: formData.startAt ? new Date(formData.startAt).toISOString() : null,
      courtName: formData.courtName,
      city: formData.city,
      circuit: formData.circuit,
      notes: formData.notes,
      assignedTo: formData.assignedTo,
      team: Array.isArray(formData.team)
        ? formData.team.flat().filter(Boolean)
        : formData.team
          ? [formData.team]
          : [],
    };

    updateSessionMutate(payload);
  };
  const formatDate = (date) => {
    if (!date) return "غير متوفر";

    return new Date(date).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "مجدولة":
        return "bg-blue-100 text-blue-700";
      case "قيد التحضير":
        return "bg-amber-100 text-amber-700";
      case "منتهية":
        return "bg-green-100 text-green-700";
      case "ملغية":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0d2847_0%,#07192e_45%,#05111f_100%)] p-4"
      >

        <span className="loading loading-infinity loading-xl text-[#d4aa45] text-9xl"></span>
      </div>

    );
  }

  if (isError) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center  bg-[radial-gradient(circle_at_top,#0d2847_0%,#07192e_45%,#05111f_100%)] p-4"
      >
        <div className="rounded-2xl  px-6 py-4 text-red-600 shadow-sm  ">
          حدث خطأ أثناء تحميل البيانات: {error?.message}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#071a31] p-4"
      >
        <div className="rounded-2xl  px-6 py-4 shadow-sm  ">
          لا توجد بيانات للجلسة
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[radial-gradient(circle_at_top,#0d2847_0%,#07192e_45%,#05111f_100%)] p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-[#071a31] p-5 shadow-sm  border border-[#FFFFFF14] md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {session?.type || "جلسة"}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClasses(
                    session?.status
                  )}`}
                >
                  {session?.status || "غير محدد"}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClasses(
                    session?.legalCase?.status
                  )}`}
                >
                  {session?.legalCase?.status || "غير محدد"}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  {session?.courtName || "اسم المحكمة"}
                </h1>
                <p className="mt-1 text-sm text-slate-500 md:text-base">
                  {session?.circuit || "-"} - {session?.city || "-"}
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-85">
              <QuickInfoCard
                label="رقم القضية"
                value={session?.legalCase?.caseNumber || "-"}
              />
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full outline-0 bg-[#d3a53d] px-5 text-sm font-semibold text-[#0b1830] transition hover:opacity-90"
              >
                <HiOutlinePencil size={16} />
                تعديل الجلسه
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-3xl bg-[#071a31] p-5 shadow-sm border border-[#FFFFFF14]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">تفاصيل الجلسة</h2>

                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          type: session?.type || "",
                          startAt: session?.startAt
                            ? new Date(session.startAt).toISOString().slice(0, 16)
                            : "",
                          courtName: session?.courtName || "",
                          city: session?.city || "",
                          circuit: session?.circuit || "",
                          notes: session?.notes || "",
                          assignedTo:
                            session?.assignedTo?.id || session?.assignedTo?._id || "",
                          team: Array.isArray(session?.team)
                            ? session.team
                              .map((member) => member?.id || member?._id)
                              .filter(Boolean)
                            : [],
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-red-600 px-4 py-2 text-sm cursor-pointer text-red-400 hover:border-red-400"
                    >
                      <HiXMark size={16} />
                      إلغاء
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-2 rounded-full bg-[#d3a53d] hover:bg-[#e6b84c] cursor-pointer px-4 py-2 text-sm font-semibold text-[#0b1830] disabled:opacity-60"
                    >
                      <HiCheck size={16} />
                      {isUpdating ? "جارٍ الحفظ..." : "حفظ"}
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailCard
                    icon={<FaCalendarAlt />}
                    label="تاريخ البداية"
                    value={formatDate(session?.startAt)}
                  />
                  <DetailCard
                    icon={<FaUniversity />}
                    label="اسم المحكمة"
                    value={session?.courtName || "-"}
                  />
                  <DetailCard
                    icon={<FaGavel />}
                    label="الدائرة"
                    value={session?.circuit || "-"}
                  />
                  <DetailCard
                    icon={<FaMapMarkerAlt />}
                    label="المدينة"
                    value={session?.city || "-"}
                  />
                  <DetailCard
                    icon={<FaInfoCircle />}
                    label="حالة الجلسة"
                    value={session?.status || "-"}
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-white">نوع الجلسة</label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#FFFFFF14] bg-[#0d2139] px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white">تاريخ البداية</label>
                    <input
                      type="datetime-local"
                      name="startAt"
                      value={formData.startAt}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#FFFFFF14] bg-[#0d2139] px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white">اسم المحكمة</label>
                    <input
                      type="text"
                      name="courtName"
                      value={formData.courtName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#FFFFFF14] bg-[#0d2139] px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white">المدينة</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#FFFFFF14] bg-[#0d2139] px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white">الدائرة</label>
                    <input
                      type="text"
                      name="circuit"
                      value={formData.circuit}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#FFFFFF14] bg-[#0d2139] px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-white">الملاحظات</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-2xl border border-[#FFFFFF14] bg-[#0d2139] px-4 py-3 text-white outline-none"
                    />
                  </div>
                </form>
              )}
            </section>

            <section className="rounded-3xl bg-[#071a31] p-5 shadow-sm  border border-[#FFFFFF14]">
              <h2 className="mb-4 text-lg font-bold text-white">بيانات القضية</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard
                  icon={<FaFolderOpen />}
                  label="رقم القضية"
                  value={session?.legalCase?.caseNumber || "-"}
                />

                <DetailCard
                  icon={<FaInfoCircle />}
                  label="حالة القضية"
                  value={session?.legalCase?.status || "-"}
                />

                <DetailCard
                  icon={<FaUniversity />}
                  label="المحكمة"
                  value={session?.legalCase?.court || "-"}
                />

                <DetailCard
                  icon={<FaMapMarkerAlt />}
                  label="المدينة"
                  value={session?.legalCase?.city || "-"}
                />
              </div>
            </section>

            <section className="rounded-3xl bg-[#071a31] p-5 shadow-sm  border border-[#FFFFFF14]">
              <h2 className="mb-4 text-lg font-bold text-white">ملاحظات الجلسة</h2>
              <div className="flex items-start gap-3 rounded-2xl bg-[#071a31] p-4  border border-[#FFFFFF14]">
                <div className="mt-1 text-xl text-[#d4aa45]">
                  <FaStickyNote />
                </div>
                <p className="leading-8 text-white">
                  {session?.notes || "لا توجد ملاحظات"}
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-[#071a31] p-5 shadow-sm  border border-[#FFFFFF14]">
              <h2 className="mb-4 text-lg font-bold text-white">المسؤول عن الجلسة</h2>

              {session?.assignedTo ? (
                <PersonCard person={session.assignedTo} />
              ) : (
                <EmptyState text="لا يوجد شخص مسؤول محدد" />
              )}
            </section>

            <section className="rounded-3xl bg-[#071a31] p-5 shadow-sm  border border-[#FFFFFF14]">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <FaUsers />
                <span>فريق العمل</span>
              </h2>

              <div className="space-y-4">
                {session?.team?.length > 0 ? (
                  session.team.map((member) => (
                    <PersonCard key={member?.id || member?._id} person={member} />
                  ))
                ) : (
                  <EmptyState text="لا يوجد أعضاء في فريق العمل" />
                )}
              </div>
            </section>
            <section className="rounded-3xl bg-[#071a31] p-5 shadow-sm  border border-[#FFFFFF14]">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <HiOutlineFolderOpen size={18} className="text-[#d3a53d]" />
                المستندات
              </h2>

              <div className="space-y-4">
                {session?.team?.length > 0 ? (
                  session.team.map((member) => (
                    <PersonCard key={member?.id || member?._id} person={member} />
                  ))
                ) : (
                  <EmptyState text="لا يوجد أعضاء في فريق العمل" />
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-[#071a31] p-5 shadow-sm  border border-[#FFFFFF14]">
              <h2 className="mb-4 text-lg font-bold text-white">تم الإنشاء بواسطة</h2>

              {session?.createdBy ? (
                <div className="flex items-center gap-3 rounded-2xl bg-[#0d2139] p-4  border border-[#FFFFFF14]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071a31] text-[#d4aa45]">
                    <FaUser />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-white">
                      {session?.createdBy?.UserName || "-"}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {session?.createdBy?.email || "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyState text="لا توجد بيانات" />
              )}
            </section>

            <section className="rounded-3xl bg-[#0d2139] border-[#FFFFFF14] border p-5 shadow-sm ">
              <h2 className="mb-4 text-lg font-bold text-white">معلومات إضافية</h2>

              <div className="space-y-3">
                <InfoRow label="معرف الجلسة" value={session?.id || "-"} />
                <InfoRow label="معرف القضية" value={session?.legalCase?.id || "-"} />
                <InfoRow
                  label="عدد المرفقات"
                  value={session?.attachments?.length || 0}
                />
                <InfoRow label="تاريخ الإنشاء" value={formatDate(session?.createdAt)} />
                <InfoRow
                  label="محذوف؟"
                  value={session?.isDeleted ? "نعم" : "لا"}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;

const QuickInfoCard = ({ label, value, breakAll = false }) => {
  return (
    <div className="rounded-2xl bg-[#0d2139] flex flex-col justify-center p-2  border border-[#FFFFFF14]">
      <p className="text-sm  text-white ">{label}</p>
      <p
        className={`mt-1 font-bold text-slate-500 ${breakAll ? "break-all text-sm" : ""
          }`}
      >
        {value}
      </p>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#FFFFFF14] bg-[#0d2139] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071a31] text-[#d4aa45]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-white">{label}</p>
        <p className="mt-1 font-semibold leading-7 text-slate-500">{value}</p>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1 border-b border-[#FFFFFF14] pb-3 last:border-none last:pb-0">
      <span className="text-sm text-white">{label}</span>
      <span className="break-all font-medium text-slate-500 ">{value}</span>
    </div>
  );
};

const EmptyState = ({ text }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-[#0d2139] p-4 text-sm text-slate-500">
      {text}
    </div>
  );
};

const PersonCard = ({ person }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#FFFFFF14] bg-[#0d2139] p-4">
      {person?.ProfilePhoto?.url ? (
        <img
          src={person.ProfilePhoto.url}
          alt={person?.UserName || "user"}
          className="h-14 w-14 rounded-2xl object-cover  "
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl  bg-[#071a31] text-[#d4aa45] ">
          <FaUserTie />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold text-white">
          {person?.UserName || "-"}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <FaEnvelope className="shrink-0" />
          <span className="truncate">{person?.email || "-"}</span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
          <FaPhone className="shrink-0" />
          <span>{person?.phone || "-"}</span>
        </div>
      </div>
    </div>
  );
};