import { useState } from 'react';
import Navbar from '../../components/Navbar';
import BrowseCrops from './BrowseCrops';
import MyProducts from './MyProducts';
import MyPurchases from './MyPurchases';

function TraderDashboard() {
  const [tab, setTab] = useState('browse');

  const tabs = [
    { key: 'browse', label: 'Browse Crops' },
    { key: 'products', label: 'My Product Requests' },
    { key: 'purchases', label: 'My Purchases' },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex gap-2 mb-6 border-b">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 font-semibold ${
                tab === t.key ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'browse' && <BrowseCrops />}
        {tab === 'products' && <MyProducts />}
        {tab === 'purchases' && <MyPurchases />}
      </div>
    </div>
  );
}

export default TraderDashboard;