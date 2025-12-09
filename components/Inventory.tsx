import React, { useState } from 'react';
import { InventoryItem, ItemStatus } from '../types';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';

interface InventoryProps {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ items, setItems }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    model: '',
    serialNumber: '',
    dailyRate: 0,
    status: ItemStatus.AVAILABLE,
    purchaseValue: 0
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.model || !newItem.serialNumber) return;

    const item: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      model: newItem.model,
      serialNumber: newItem.serialNumber,
      dailyRate: Number(newItem.dailyRate),
      status: newItem.status as ItemStatus,
      purchaseValue: Number(newItem.purchaseValue)
    };

    setItems([...items, item]);
    setIsAdding(false);
    setNewItem({ model: '', serialNumber: '', dailyRate: 0, status: ItemStatus.AVAILABLE, purchaseValue: 0 });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const filteredItems = items.filter(i => 
    i.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Inventory Assets</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Add Asset
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">New Asset Entry</h3>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
              <input 
                type="text" 
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.model}
                onChange={e => setNewItem({...newItem, model: e.target.value})}
                placeholder="e.g. iPhone 13 Pro"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
              <input 
                type="text" 
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.serialNumber}
                onChange={e => setNewItem({...newItem, serialNumber: e.target.value})}
                placeholder="SN-123456"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Daily Rate (Rp)</label>
              <input 
                type="number" 
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.dailyRate}
                onChange={e => setNewItem({...newItem, dailyRate: Number(e.target.value)})}
                placeholder="150000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Value (Rp)</label>
              <input 
                type="number" 
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newItem.purchaseValue}
                onChange={e => setNewItem({...newItem, purchaseValue: Number(e.target.value)})}
                placeholder="For asset valuation"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search assets by model or serial..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Model</th>
              <th className="px-6 py-4">Serial Number</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Daily Rate</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{item.model}</td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.serialNumber}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === ItemStatus.AVAILABLE ? 'bg-green-100 text-green-800' :
                    item.status === ItemStatus.RENTED ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">Rp {item.dailyRate.toLocaleString()}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800 p-1"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No assets found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;