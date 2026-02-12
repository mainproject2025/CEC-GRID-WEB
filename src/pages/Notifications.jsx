import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Check,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================================
     FETCH NOTIFICATIONS FROM API
  ================================ */

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/notification");
      const data = await res.json();

      const formatted = data.map((n) => ({
        ...n,
        time: n.createdAt
          ? formatTime(new Date(n.createdAt._seconds * 1000))
          : "Just now",
      }));

      setNotifications(formatted);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  
  /* ================================
     ICON PICKER
  ================================ */
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={22} className="text-[#137333]" />;
      case "warning":
        return <AlertCircle size={22} className="text-[#EA580C]" />;
      case "info":
        return <Info size={22} className="text-[#2D7FF9]" />;
      default:
        return <Bell size={22} className="text-[#737373]" />;
    }
  };

 

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[24px] font-Pmed text-[#262626]">
              NOTIFICATIONS
            </h1>

            <button
               
              className="flex items-center gap-2 px-4 py-2 text-[#2D7FF9] hover:bg-[#F1F5FF] rounded-lg font-Pmed"
            >
              <Check size={18} />
              Mark all as read
            </button>
          </div>

          <div className="w-full h-px bg-[#737373]" />
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loading && (
            <p className="text-[#737373]">Loading notifications...</p>
          )}

          {!loading && notifications.length === 0 && (
            <p className="text-[#737373] text-center py-10">
              No notifications available
            </p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`border rounded-lg p-6 transition-colors ${
                n.read
                  ? "bg-white border-[#E6E6E6]"
                  : "bg-[#F1F5FF] border-[#2D7FF9]"
              }`}
            >
              <div className="flex gap-4">

                <div className="mt-1">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-Pmed text-[#262626]">
                      {n.title}
                    </p>

                    {!n.read && (
                      <span className="w-2 h-2 bg-[#2D7FF9] rounded-full mt-2" />
                    )}
                  </div>

                  <p className="text-[#737373] font-Preg mb-3">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-[#737373]">
                    <Clock size={14} />
                    <span>{n.time}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

/* ================================
   TIME FORMATTER
================================ */
function formatTime(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} minutes ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return date.toLocaleDateString();
}

export default Notifications;
