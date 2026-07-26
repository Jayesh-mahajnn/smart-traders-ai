import { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/adminApi';

function UsersPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.fullName}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{u.role}</span></td>
              <td className="p-3">{u.phoneNumber || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPanel;