import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

function getReminders() {
  return api.get("/reminders");
}

export default function ReminderListener() {
  const { data } = useQuery({
    queryKey: ["reminders"],
    queryFn: getReminders,
    refetchInterval: 60000, // كل دقيقة 👈 مهم
  });

  useEffect(() => {
    if (data?.data) {
      data.data.forEach((reminder) => {
        toast.custom(() => (
          <div className="bg-[#061328] text-white p-4 rounded-xl shadow-xl border border-yellow-500">
            <h3 className="font-bold text-yellow-400">
              📌 {reminder.title}
            </h3>
            <p className="text-sm">{reminder.description}</p>
          </div>
        ));
      });
    }
  }, [data]);

  return null; // مهم جدا 👈 مفيش UI
}