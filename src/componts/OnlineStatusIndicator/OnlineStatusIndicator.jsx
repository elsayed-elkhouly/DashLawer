import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

const OnlineStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(!navigator.onLine); // Show immediately if initial load is offline
  const [hasChanged, setHasChanged] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasChanged(true);
      setShowStatus(true);

      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasChanged(true);
      setShowStatus(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!hasChanged || !showStatus) return null;

  return (
    <div className="fixed top-5 left-5 z-[100000] pointer-events-none transition-all duration-500 ease-out">
      {isOnline ? (
        <div className="flex items-center gap-3 bg-[#0d211a]/95 border border-emerald-500/30 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm pointer-events-auto transition-all animate-bounce">
          <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
            <Wifi className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-right" dir="rtl">
            <span className="font-bold text-sm text-emerald-200">تم استعادة الاتصال بالإنترنت</span>
            <span className="text-[11px] text-emerald-400/80 mt-0.5">
              تمت إعادة الاتصال، جاري تحديث البيانات...
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-[#240e11]/95 border border-rose-500/30 text-rose-300 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm pointer-events-auto transition-all">
          <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400 animate-pulse">
            <WifiOff className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-right" dir="rtl">
            <span className="font-bold text-sm text-rose-200">وضع عدم الاتصال بالإنترنت</span>
            <span className="text-[11px] text-rose-400/80 mt-0.5">
              أنت تعمل في وضع Offline. البيانات ستُعرض من الذاكرة المؤقتة.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineStatusIndicator;
