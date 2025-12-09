import React, { useState } from 'react';
import { InventoryItem, RentalTransaction, RentalStatus, ItemStatus } from '../types';
import { Plus, Check, FileText, Loader2 } from 'lucide-react';
import { generateRentalAgreement } from '../services/geminiService';

interface RentalsProps {
  rentals: RentalTransaction[];
  setRentals: React.Dispatch<React.SetStateAction<RentalTransaction[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const Rentals: React.FC<RentalsProps> = ({ rentals, setRentals, inventory, setInventory }) => {
  const [viewState, setViewState] = useState<'LIST' | 'NEW'>('LIST');
  const [loadingAI, setLoadingAI] = useState(false);
  
  // New Rental Form State
  const [formData, setFormData] = useState({
    itemId: '',
    customerName: '',
    customerNik: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 1
  });

  const availableItems = inventory.filter(i => i.status === ItemStatus.AVAILABLE);

  const handleCreateRental = async (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === formData.itemId);
    if (!item) return;

    const endDate = new Date(formData.startDate);
    endDate.setDate(endDate.getDate() + formData.duration);

    const totalCost = item.dailyRate * formData.duration;

    const newRental: RentalTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: formData.itemId,
      customerName: formData.customerName,
      customerNik: formData.customerNik,
      startDate: formData.startDate,
      endDate: endDate.toISOString().split('T')[0],
      totalCost,
      status: RentalStatus.ACTIVE
    };

    // AI Generation for Agreement
    setLoadingAI(true);
    const agreement = await generateRentalAgreement(newRental, item);
    newRental.agreementText = agreement;
    setLoadingAI(false);

    // Update State
    setRentals([newRental, ...rentals]);
    setInventory(inventory.map(i => i.id === item.id ? { ...i, status: ItemStatus.RENTED } : i));
    setViewState('LIST');
    setFormData({ itemId: '', customerName: '', customerNik: '', startDate: new Date().toISOString().split('T')[0], duration: 1 });
  };

  const handleReturn = (rentalId: string) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return;

    if (confirm(`Confirm return for ${rental.customerName}?`)) {
      setRentals(rentals.map(r => r.id === rentalId ? { ...r, status: RentalStatus.COMPLETED, actualReturnDate: new Date().toISOString().split('T')[0] } : r));
      setInventory(inventory.map(i => i.id === rental.itemId ? { ...i, status: ItemStatus.AVAILABLE } : i));
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center border-b pb-4 border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Rental Transactions</h2>
        {viewState === 'LIST' && (
          <button 
            onClick={() => setViewState('NEW')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            New Rental
          </button>
        )}
      </div>

      {viewState === 'NEW' && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Create New Rental Contract</h3>
          <form onSubmit={handleCreateRental} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Asset</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                  value={formData.itemId}
                  onChange={e => setFormData({...formData, itemId: e.target.value})}
                  required
                >
                  <option value="">-- Choose Phone --</option>
                  {availableItems.map(item => (
                    <option key={item.id} value={item.id}>{item.model} - Rp {item.dailyRate}/day</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Days)</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.customerName}
                  onChange={e => setFormData({...formData, customerName: e.target.value})}
                  placeholder="Full legal name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer NIK</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.customerNik}
                  onChange={e => setFormData({...formData, customerNik: e.target.value})}
                  placeholder="ID Card Number"
                  required
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-6">
                <div className="flex items-start gap-3">
                  <FileText className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm">AI Contract Generation</h4>
                    <p className="text-xs text-blue-700 mt-1">Soleh Rent AI will automatically draft a "Surat Perjanjian Sewa" (Rental Agreement) upon submission.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
               <button 
                type="button" 
                onClick={() => setViewState('LIST')}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loadingAI}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loadingAI ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : 'Confirm Rental & Generate Contract'}
              </button>
            </div>
          </form>
        </div>
      )}

      {viewState === 'LIST' && (
        <div className="grid gap-4">
          {rentals.map(rental => {
            const item = inventory.find(i => i.id === rental.itemId);
            return (
              <div key={rental.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                     <h3 className="font-bold text-lg text-slate-800">{rental.customerName}</h3>
                     <span className={`text-xs px-2 py-0.5 rounded-full border ${
                       rental.status === RentalStatus.ACTIVE 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-green-50 border-green-200 text-green-700'
                     }`}>{rental.status}</span>
                  </div>
                  <p className="text-slate-500 text-sm">{item?.model} • {rental.startDate} to {rental.endDate}</p>
                  <p className="text-emerald-600 font-semibold text-sm mt-1">Rp {rental.totalCost.toLocaleString()}</p>
                  
                  {rental.agreementText && (
                    <details className="mt-3 text-xs text-slate-500 max-w-xl cursor-pointer">
                      <summary className="hover:text-emerald-600 font-medium">View Digital Contract (Akad)</summary>
                      <div className="mt-2 p-3 bg-slate-50 border rounded font-mono whitespace-pre-wrap">
                        {rental.agreementText}
                      </div>
                    </details>
                  )}
                </div>
                
                {rental.status === RentalStatus.ACTIVE && (
                  <button 
                    onClick={() => handleReturn(rental.id)}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium"
                  >
                    <Check size={16} /> Mark Returned
                  </button>
                )}
              </div>
            );
          })}
          {rentals.length === 0 && (
             <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
               <p className="text-slate-400">No rental transactions found. Start by creating one.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rentals;