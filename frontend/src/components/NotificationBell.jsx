import { useState, useEffect } from 'react';
import { getMyNotifications, markAsRead } from '../api/notificationApi';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const response = await getMyNotifications();
    setNotifications(response.data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRead = async (id) => {
    await markAsRead(id);
    load();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-white">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg text-gray-800 z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 && <p className="p-4 text-sm text-gray-500">No notifications</p>}
          {notifications.map((n) => (
            <div key={n.id}
              onClick={() => !n.isRead && handleRead(n.id)}
              className={`p-3 border-b cursor-pointer text-sm ${n.isRead ? 'bg-white' : 'bg-green-50 font-semibold'}`}>
              <p>{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;