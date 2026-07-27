import { useState, useEffect } from 'react';
import { getAllNotificationsAdmin } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getAllNotificationsAdmin()
      .then((res) => setNotifications(res.data))
      .catch((err) => showToast(extractErrorMessage(err, 'Failed to load notifications'), 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (notifications.length === 0) return <EmptyState message="No notifications on the platform yet" icon="🔔" />;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
      <table className="w-full text-sm text-left min-w-[600px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Message</th>
            <th className="p-3">Read</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n.id} className="border-t">
              <td className="p-3">{n.message}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${n.read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {n.read ? 'Read' : 'Unread'}
                </span>
              </td>
              <td className="p-3 text-gray-500">{new Date(n.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NotificationManagement;