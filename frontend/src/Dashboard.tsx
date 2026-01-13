import { useEffect, useState } from 'react';
import api from './api';
import { ArrowDown, ArrowUp, Box, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/stats')
       .then(res => setStats(res.data))
       .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="p-10 text-xl">Loading...</div>;

  if (stats.error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md">
            <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Global Admin Access</h1>
            <p className="text-gray-600 mb-6">{stats.error}</p>
            <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                <p><strong>Note:</strong> As an Admin, you do not have a personal inventory.</p>
                <p>Please use the <strong>Transfers</strong> tab to move assets between any base.</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Base Dashboard (ID: {stats.base_id})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Box size={24} />
            <h3 className="font-semibold">Closing Balance</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {stats.inventory.reduce((acc:any, curr:any) => acc + curr.quantity, 0)} Units
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 text-green-600 mb-2">
            <ArrowUp size={24} />
            <h3 className="font-semibold">Total Incoming</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.incoming_count}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <ArrowDown size={24} />
            <h3 className="font-semibold">Total Outgoing</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.outgoing_count}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold">Inventory Breakdown</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="p-4">Item Name</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.inventory.map((item: any) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-gray-600">{item.asset_name || "Unknown Asset"}</td>
                <td className="p-4 font-bold">{item.quantity}</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">In Stock</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}