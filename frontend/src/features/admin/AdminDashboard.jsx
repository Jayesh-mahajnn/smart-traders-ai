import { useState } from 'react';
import Navbar from '../../components/Navbar';
import StatsPanel from './StatsPanel';
import AuditLogsPanel from './AuditLogsPanel';
import UsersPanel from './UsersPanel';
import CropManagement from './CropManagement';
import ProductManagement from './ProductManagement';
import TransactionManagement from './TransactionManagement';
import NotificationManagement from './NotificationManagement';

function AdminDashboard() {
  const [tab, setTab] = useState('stats');

  const tabs = [
    { key: 'stats', label: 'Statistics' },
    { key: 'users', label: 'Users' },
    { key: 'crops', label: 'Crops' },
    { key: 'products', label: 'Products' },
    { key: 'transactions', label: 'Transactions' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'audit', label: 'Audit Logs' },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                tab === t.key ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'stats' && <StatsPanel />}
        {tab === 'users' && <UsersPanel />}
        {tab === 'crops' && <CropManagement />}
        {tab === 'products' && <ProductManagement />}
        {tab === 'transactions' && <TransactionManagement />}
        {tab === 'notifications' && <NotificationManagement />}
        {tab === 'audit' && <AuditLogsPanel />}
      </div>
    </div>
  );
}

export default AdminDashboard;