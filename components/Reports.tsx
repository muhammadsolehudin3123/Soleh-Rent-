import React, { useEffect, useState } from 'react';
import { RentalTransaction, InventoryItem } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyzeFinancials } from '../services/geminiService';
import { BrainCircuit, RefreshCw } from 'lucide-react';

interface ReportsProps {
  rentals: RentalTransaction[];
  inventory: InventoryItem[];
}

const Reports: React.FC<ReportsProps> = ({ rentals, inventory }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Simple Data Processing for Chart
  const data = rentals.reduce((acc: any[], rental) => {
    const existing = acc.find(d => d.date === rental.startDate);
    if (existing) {
      existing.revenue += rental.totalCost;
    } else {
      acc.push({ date: rental.startDate, revenue: rental.totalCost });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAnalysis = async () => {
    setLoading(true);
    const result = await analyzeFinancials(rentals, inventory);
    setAiAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 border-slate-200">Financial Reports</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700 mb-6">Revenue Stream (Daily)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `Rp${value/1000}k`} />
              <Tooltip 
                 cursor={{fill: '#f1f5f9'}}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#10b981" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simple Ledger Representation */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">General Ledger (Summary)</h3>
          <div className="overflow-hidden border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Account</th>
                  <th className="px-4 py-2 text-right">Debit</th>
                  <th className="px-4 py-2 text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2 font-medium">Cash / Accounts Receivable</td>
                  <td className="px-4 py-2 text-right">Rp {rentals.reduce((a,b)=>a+b.totalCost,0).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Rental Income</td>
                  <td className="px-4 py-2 text-right">-</td>
                  <td className="px-4 py-2 text-right">Rp {rentals.reduce((a,b)=>a+b.totalCost,0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <BrainCircuit className="text-purple-400" />
               <h3 className="text-lg font-semibold">AI Financial Analyst</h3>
            </div>
            
            {aiAnalysis ? (
              <div className="prose prose-invert prose-sm">
                <p className="text-slate-300 italic">"{aiAnalysis}"</p>
                <button 
                  onClick={handleAnalysis}
                  className="mt-4 text-xs text-purple-300 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Regenerate Analysis
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                 <p className="text-slate-400 text-sm mb-4">Generate insights on your financial health and inventory efficiency.</p>
                 <button 
                   onClick={handleAnalysis}
                   disabled={loading}
                   className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                 >
                   {loading ? 'Analyzing...' : 'Generate Report'}
                 </button>
              </div>
            )}
          </div>
          {/* Decorative background element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Reports;