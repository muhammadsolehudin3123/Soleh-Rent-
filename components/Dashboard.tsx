import React from 'react';
import { InventoryItem, RentalTransaction, RentalStatus } from '../types';
import { TrendingUp, Smartphone, AlertCircle, Wallet } from 'lucide-react';

interface DashboardProps {
  inventory: InventoryItem[];
  rentals: RentalTransaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, rentals }) => {
  const totalRevenue = rentals.reduce((sum, r) => sum + r.totalCost, 0);
  const activeRentals = rentals.filter(r => r.status === RentalStatus.ACTIVE).length;
  const availableItems = inventory.filter(i => i.status === 'Available').length;
  const utilizationRate = inventory.length > 0 
    ? ((inventory.length - availableItems) / inventory.length) * 100 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 border-slate-200">Dashboard Executive</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Revenue" 
          value={`Rp ${totalRevenue.toLocaleString()}`} 
          icon={<Wallet className="text-emerald-500" />} 
          trend="+12% from last month"
          color="border-l-4 border-emerald-500"
        />
        <Card 
          title="Active Rentals" 
          value={activeRentals.toString()} 
          icon={<TrendingUp className="text-blue-500" />} 
          trend="Currently ongoing"
          color="border-l-4 border-blue-500"
        />
        <Card 
          title="Inventory Available" 
          value={availableItems.toString()} 
          icon={<Smartphone className="text-purple-500" />} 
          trend={`${inventory.length} total units`}
          color="border-l-4 border-purple-500"
        />
        <Card 
          title="Utilization Rate" 
          value={`${utilizationRate.toFixed(1)}%`} 
          icon={<AlertCircle className="text-orange-500" />} 
          trend="Asset efficiency"
          color="border-l-4 border-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rentals.slice(0, 5).map(r => (
                  <tr key={r.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.customerName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        r.status === RentalStatus.ACTIVE ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">Rp {r.totalCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rentals.length === 0 && <p className="text-center py-4 text-slate-400">No transactions yet.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-800">Review Overdue Items</p>
                <p className="text-xs text-slate-500">Check for rentals past their return date.</p>
              </div>
              <button className="text-sm bg-white border border-slate-300 px-3 py-1 rounded hover:bg-slate-100">Check</button>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-800">Financial Audit</p>
                <p className="text-xs text-slate-500">Prepare monthly general ledger.</p>
              </div>
              <button className="text-sm bg-white border border-slate-300 px-3 py-1 rounded hover:bg-slate-100">Start</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{title: string; value: string; icon: React.ReactNode; trend: string; color: string}> = ({ title, value, icon, trend, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    </div>
    <p className="text-xs text-slate-400 mt-4">{trend}</p>
  </div>
);

export default Dashboard;