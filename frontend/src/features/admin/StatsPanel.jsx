import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStats } from '../../api/adminApi';

function StatsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  const chartData = [
    { name: 'Farmers', count: stats.totalFarmers },
    { name: 'Traders', count: stats.totalTraders },
    { name: 'Vendors', count: stats.totalVendors },
  ];

  const cards = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Crops', value: stats.totalCrops },
    { label: 'Total Products', value: stats.totalProducts },
    { label: 'Total Transactions', value: stats.totalTransactions },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{c.value}</p>
            <p className="text-sm text-gray-600">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold mb-3">Users by Role</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#15803d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatsPanel;