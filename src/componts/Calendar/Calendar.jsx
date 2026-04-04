import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiLoader,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { FaScaleBalanced } from "react-icons/fa6";
import api from "../../api/axios";
import Cookies from 'js-cookie';

const TYPE_META = {
  sessions: {
    label: "الجلسات",
    icon: FaScaleBalanced,
    badgeClass: "border-amber-400/20 bg-amber-500/10 text-amber-300",
    iconWrap: "bg-amber-500/10 text-amber-300",
  },
  tasks: {
    label: "المهام",
    icon: FiCheckSquare,
    badgeClass: "border-violet-400/20 bg-violet-500/10 text-violet-300",
    iconWrap: "bg-violet-500/10 text-violet-300",
  },
  invoices: {
    label: "الفواتير",
    icon: FiFileText,
    badgeClass: "border-rose-400/20 bg-rose-500/10 text-rose-300",
    iconWrap: "bg-rose-500/10 text-rose-300",
  },
  appointments: {
    label: "المواعيد",
    icon: FiCalendar,
    badgeClass: "border-sky-400/20 bg-sky-500/10 text-sky-300",
    iconWrap: "bg-sky-500/10 text-sky-300",
  },
};

const FILTERS = [
  { key: "all", label: "عرض الكل" },
  { key: "sessions", label: "الجلسات" },
  { key: "appointments", label: "مواعيد العملاء" },
  { key: "tasks", label: "المهام" },
  { key: "invoices", label: "الفواتير" },
];

const WEEK_DAYS = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthRange(anchorDate = new Date()) {
  const first = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const last = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);

  return {
    startDate: formatIsoDate(first),
    endDate: formatIsoDate(last),
  };
}

function shiftMonth(dateString, amount) {
  const date = new Date(`${dateString}T00:00:00`);
  const shifted = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  return getMonthRange(shifted);
}

function formatMonthLabel(dateString) {
  return new Intl.DateTimeFormat("ar-EG", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function formatFullDate(dateString) {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function countDayItems(counts = {}) {
  return Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0);
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function buildMonthCells(startDate, endDate) {
  const anchor = new Date(`${startDate}T00:00:00`);
  const firstDay = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const lastDay = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const prevMonthLastDate = new Date(anchor.getFullYear(), anchor.getMonth(), 0).getDate();

  const cells = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const dayNumber = prevMonthLastDate - i;
    const date = new Date(anchor.getFullYear(), anchor.getMonth() - 1, dayNumber);
    const iso = formatIsoDate(date);

    cells.push({
      date: iso,
      dayNumber,
      isCurrentMonth: false,
      inSelectedRange: iso >= startDate && iso <= endDate,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(anchor.getFullYear(), anchor.getMonth(), day);
    const iso = formatIsoDate(date);

    cells.push({
      date: iso,
      dayNumber: day,
      isCurrentMonth: true,
      inSelectedRange: iso >= startDate && iso <= endDate,
    });
  }

  let nextMonthDay = 1;
  while (cells.length % 7 !== 0) {
    const date = new Date(anchor.getFullYear(), anchor.getMonth() + 1, nextMonthDay);
    const iso = formatIsoDate(date);

    cells.push({
      date: iso,
      dayNumber: nextMonthDay,
      isCurrentMonth: false,
      inSelectedRange: iso >= startDate && iso <= endDate,
    });

    nextMonthDay += 1;
  }

  return cells;
}

function filterPreview(preview = [], activeType, searchTerm) {
  const keyword = normalizeText(searchTerm);

  return preview.filter((item) => {
    const matchesType = activeType === "all" || item.type === activeType;

    if (!keyword) {
      return matchesType;
    }

    return (
      matchesType &&
      [item.title, item.time, item.status, TYPE_META[item.type]?.label]
        .filter(Boolean)
        .some((value) => normalizeText(value).includes(keyword))
    );
  });
}

function StatCard({ label, value, icon: Icon, iconWrap }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_-48px_rgba(59,130,246,0.65)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrap}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function EventBadge({ item }) {
  const meta = TYPE_META[item.type] || TYPE_META.sessions;

  return (
    <div
      className={`rounded-xl border px-3 py-2 text-right text-xs ${meta.badgeClass}`}
      title={item.title}
    >
      <div className="truncate font-medium">{item.title}</div>
      {(item.time || item.status) && (
        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-300/90">
          <span className="truncate">{item.status}</span>
          <span className="truncate">{item.time}</span>
        </div>
      )}
    </div>
  );
}

export default function Calendar({

  previewLimit = 150,
}) {
  const initialRange = getMonthRange(new Date());

  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);
  const [selectedDate, setSelectedDate] = useState(initialRange.startDate);
  const [activeType, setActiveType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarData, setCalendarData] = useState({
  message: "",
  range: {
    startDate: "",
    endDate: "",
  },
  types: [],
  summary: {
    sessions: 0,
    tasks: 0,
    invoices: 0,
    appointments: 0,
  },
  days: {},
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const loadCalendar = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      startDate,
      endDate,
      previewLimit: String(previewLimit),
    });

    if (activeType !== "all") {
      params.append("type", activeType);
    }

    const response = await api(`/calendar/range?${params.toString()}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = response?.data || null;

    setCalendarData(data);

    const availableDays = Object.keys(data?.days || {}).sort();

    setSelectedDate((currentValue) => {
      if (currentValue && currentValue >= startDate && currentValue <= endDate) {
        return currentValue;
      }

      if (availableDays.length > 0) {
        return availableDays[0];
      }

      return data?.range?.startDate || startDate;
    });
  } catch (err) {
    setError(err?.response?.data?.message || err.message || "حدث خطأ أثناء جلب البيانات");
  } finally {
    setLoading(false);
  }
}, [activeType, endDate, previewLimit, startDate]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);
 useEffect(() => {
  if (!calendarData?.days) return;

  const availableDays = Object.keys(calendarData.days).sort();

  setSelectedDate((currentValue) => {
    if (currentValue && currentValue >= startDate && currentValue <= endDate) {
      return currentValue;
    }

    if (availableDays.length > 0) {
      return availableDays[0];
    }

    return startDate;
  });
}, [calendarData, startDate, endDate]);
  

  const monthCells = useMemo(() => buildMonthCells(startDate, endDate), [startDate, endDate]);
  const monthLabel = useMemo(() => formatMonthLabel(startDate), [startDate]);

  const summary = calendarData?.summary || {
    sessions: 0,
    tasks: 0,
    invoices: 0,
    appointments: 0,
  };

  const selectedDayData = calendarData?.days?.[selectedDate] || null;
const selectedDayPreview = filterPreview(
  selectedDayData?.preview || [],
  activeType,
  searchTerm
);

  const statCards = [
    {
      key: "sessions",
      label: "الجلسات خلال المدة",
      value: summary.sessions || 0,
      icon: TYPE_META.sessions.icon,
      iconWrap: TYPE_META.sessions.iconWrap,
    },
    {
      key: "appointments",
      label: "المواعيد القادمة",
      value: summary.appointments || 0,
      icon: TYPE_META.appointments.icon,
      iconWrap: TYPE_META.appointments.iconWrap,
    },
    {
      key: "tasks",
      label: "المهام المفتوحة",
      value: summary.tasks || 0,
      icon: TYPE_META.tasks.icon,
      iconWrap: TYPE_META.tasks.iconWrap,
    },
    {
      key: "invoices",
      label: "الفواتير المستحقة",
      value: summary.invoices || 0,
      icon: TYPE_META.invoices.icon,
      iconWrap: TYPE_META.invoices.iconWrap,
    },
  ];

  function handlePrevMonth() {
    const nextRange = shiftMonth(startDate, -1);
    setStartDate(nextRange.startDate);
    setEndDate(nextRange.endDate);
  }

  function handleNextMonth() {
    const nextRange = shiftMonth(startDate, 1);
    setStartDate(nextRange.startDate);
    setEndDate(nextRange.endDate);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#071426] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-300">
              {monthLabel}
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">التقويم القانوني</h1>
            <p className="mt-2 text-sm text-slate-400 md:text-base">
              إدارة الجلسات والمهام والمواعيد القانونية من مكان واحد.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[760px] xl:grid-cols-4">
            {statCards.map((card) => (
              <StatCard
                key={card.key}
                label={card.label}
                value={card.value}
                icon={card.icon}
                iconWrap={card.iconWrap}
              />
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_-48px_rgba(59,130,246,0.65)] backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_170px_170px_130px]">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="ابحث داخل المعروض من الأحداث"
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#0c1d34] pr-11 text-sm text-white outline-none transition focus:border-blue-400/40"
              />
            </div>

            <label className="flex flex-col gap-1 text-sm text-slate-400">
              <span>من تاريخ</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="h-12 rounded-2xl border border-white/10 bg-[#0c1d34] px-4 text-white outline-none transition focus:border-blue-400/40"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-400">
              <span>إلى تاريخ</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="h-12 rounded-2xl border border-white/10 bg-[#0c1d34] px-4 text-white outline-none transition focus:border-blue-400/40"
              />
            </label>

            <button
              type="button"
              onClick={loadCalendar}
              className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 font-semibold text-slate-950 transition hover:opacity-90"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiRefreshCw />}
              تحديث
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeType === filter.key;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveType(filter.key)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${isActive
                    ? "border-amber-400/20 bg-amber-500/10 text-amber-300"
                    : "border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/[0.06]"
                    }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_-48px_rgba(59,130,246,0.65)] backdrop-blur-sm">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">تفاصيل اليوم</p>
                <h2 className="mt-1 text-xl font-bold text-white">{formatFullDate(selectedDate)}</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
                <FiClock size={20} />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(TYPE_META).map(([key, meta]) => {
                const Icon = meta.icon;
                const count = selectedDayData?.counts?.[key] || 0;

                return (
                  <div key={key} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${meta.badgeClass}`}>
                    <Icon size={14} />
                    <span>{meta.label}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              {selectedDayPreview.length > 0 ? (
                selectedDayPreview.map((item) => {
                  const meta = TYPE_META[item.type] || TYPE_META.sessions;
                  const Icon = meta.icon;

                  return (
                    <div key={`${item.type}-${item.id}`} className="rounded-2xl border border-white/10 bg-[#0b1a30] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${meta.iconWrap}`}>
                          <Icon size={18} />
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs ${meta.badgeClass}`}>
                          {meta.label}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>

                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
                        <span>{item.status}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b1a30] p-4 text-sm text-slate-400">
                  لا توجد عناصر مطابقة لهذا اليوم.
                </div>
              )}
            </div>

            {selectedDayData?.hasMore && (
              <div className="mt-4 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
                يوجد عناصر إضافية غير ظاهرة لأن قيمة <span className="font-semibold">previewLimit</span> الحالية هي {selectedDayData.previewLimitApplied}.
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b1a30] p-4 text-sm text-slate-300">
              <p className="mb-2 font-semibold text-white">النطاق الحالي</p>
              <div className="space-y-1 text-slate-400">
                <p>من: {startDate}</p>
                <p>إلى: {endDate}</p>
              </div>
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_-48px_rgba(59,130,246,0.65)] backdrop-blur-sm md:p-5">
            <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.06]"
                  >
                    <FiChevronRight />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.06]"
                  >
                    <FiChevronLeft />
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">{monthLabel}</h2>
                  <p className="text-sm text-slate-400">عرض شهري</p>
                </div>
              </div>

              <div className="inline-flex rounded-2xl border border-white/10 bg-[#0b1a30] p-1 text-sm">
                <button type="button" className="rounded-xl px-4 py-2 text-slate-400">
                  يومي
                </button>
                <button type="button" className="rounded-xl px-4 py-2 text-slate-400">
                  أسبوعي
                </button>
                <button type="button" className="rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-950">
                  شهري
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1a30]">
              <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.02]">
                {WEEK_DAYS.map((day) => (
                  <div key={day} className="px-3 py-4 text-center text-sm font-medium text-slate-400">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-white/10">
  {monthCells.map((cell) => {
    const dayData = calendarData?.days?.[cell.date] || null;
    const preview = filterPreview(dayData?.preview || [], activeType, searchTerm);

    const totalCount =
      activeType === "all"
        ? countDayItems(dayData?.counts || {})
        : dayData?.counts?.[activeType] || 0;

    const hiddenCount = Math.max(0, totalCount - preview.length);
    const isSelected = cell.date === selectedDate;

    return (
      <button
        key={cell.date}
        type="button"
        onClick={() => setSelectedDate(cell.date)}
        className={`min-h-[124px] bg-[#0b1a30] p-3 text-right transition md:min-h-[138px]
          ${cell.isCurrentMonth ? "text-white" : "text-slate-500"}
          ${cell.inSelectedRange ? "" : "opacity-50"}
          ${isSelected ? "ring-1 ring-amber-400/40" : "hover:bg-[#10213b]"}
        `}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-semibold
              ${
                isSelected
                  ? "bg-amber-400 text-slate-950"
                  : cell.isCurrentMonth
                  ? "bg-white/[0.05] text-slate-200"
                  : "bg-white/[0.03] text-slate-500"
              }
            `}
          >
            {cell.dayNumber}
          </div>

          {totalCount > 0 && (
            <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[11px] text-slate-300">
              {totalCount} عنصر
            </span>
          )}
        </div>

        <div className="space-y-2">
          {preview.length > 0 ? (
            <>
              {preview.map((item) => (
                <EventBadge key={`${item.type}-${item.id}`} item={item} />
              ))}

              {hiddenCount > 0 && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300">
                  + {hiddenCount} عناصر أخرى
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-white/5 px-3 py-2 text-[11px] text-slate-500">
              —
            </div>
          )}
        </div>
      </button>
    );
  })}
</div>
            </div>

            {loading && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
                <FiLoader className="animate-spin" />
                جاري تحميل بيانات التقويم...
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
