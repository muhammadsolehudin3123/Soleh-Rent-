import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Rentals from './components/Rentals';
import Reports from './components/Reports';
import { InventoryItem, RentalTransaction, ItemStatus, RentalStatus } from './types';

// Mock Data for "Soleh Rent"
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', model: 'iPhone 13', serialNumber: 'SN-APL-001', dailyRate: 150000, status: ItemStatus.AVAILABLE, purchaseValue: 12000000 },
  { id: '2', model: 'Samsung S22', serialNumber: 'SN-SAM-002', dailyRate: 140000, status: ItemStatus.RENTED, purchaseValue: 11000000 },
  { id: '3', model: 'Xiaomi 12', serialNumber: 'SN-XIA-003', dailyRate: 100000, status: ItemStatus.AVAILABLE, purchaseValue: 8000000 },
  { id: '4', model: 'iPhone 14 Pro', serialNumber: 'SN-APL-004', dailyRate: 250000, status: ItemStatus.MAINTENANCE, purchaseValue: 18000000 },
];

const INITIAL_RENTALS: RentalTransaction[] = [
  { 
    id: 'r1', 
    itemId: '2', 
    customerName: 'Ahmad Fulan', 
    customerNik: '3201012345678', 
    startDate: '2023-10-25', 
    endDate: '2023-10-28', 
    totalCost: 420000, 
    status: RentalStatus.ACTIVE,
    agreementText: 'Surat Perjanjian Sewa...\n\nPihak Pertama (Soleh Rent) menyerahkan unit Samsung S22 kepada Pihak Kedua (Ahmad Fulan) dengan kondisi baik...' 
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [rentals, setRentals] = useState<RentalTransaction[]>(INITIAL_RENTALS);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard inventory={inventory} rentals={rentals} />;
      case 'inventory':
        return <Inventory items={inventory} setItems={setInventory} />;
      case 'rentals':
        return <Rentals rentals={rentals} setRentals={setRentals} inventory={inventory} setInventory={setInventory} />;
      case 'reports':
        return <Reports rentals={rentals} inventory={inventory} />;
      default:
        return <Dashboard inventory={inventory} rentals={rentals} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;