import { useState, useEffect } from 'react';
import { getAuditLogs } from '../../api/adminApi';

function AuditLogsPanel() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAuditLogs().then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Time</th>
            <th className="p-3">User</th>
            <th className="p-3">Action</th>
            <th className="p-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="p-3">{log.userEmail}</td>
              <td className="p-3">{log.action}</td>
              <td className="p-3">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {logs.length === 0 && <p className="p-4 text-gray-500">No audit logs yet.</p>}
    </div>
  );
}

export default AuditLogsPanel;