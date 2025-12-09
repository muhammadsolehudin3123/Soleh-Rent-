import React from 'react';
import { LayoutDashboard, Smartphone, Repeat, BarChart3, Calculator } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory HP', icon: Smartphone },
    { id: 'rentals', label: 'Transaksi Sewa', icon: Repeat },
    { id: 'reports', label: 'Laporan Keuangan', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
        <Calculator className="text-emerald-400 w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold tracking-wider">SOLEH RENT</h1>
          <p className="text-xs text-slate-400">ERP System v1.0</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded p-3 text-xs text-slate-400">
          <p className="font-semibold text-slate-200">User Logged In:</p>
          <p>Prof. Accountant</p>
          <p className="mt-1 text-emerald-500">System Online</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;