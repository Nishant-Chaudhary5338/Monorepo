import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiStockFill } from 'react-icons/ri';
import LogoutButton from '../../small-components/LogoutButton';

const KPI = [
  { label: 'Total Materials', value: '1,840', sub: 'across 4 storage locations', icon: '🗃️', color: 'border-blue-200', iconBg: 'bg-blue-50 text-blue-600' },
  { label: 'Pending Transfers', value: '23', sub: '5 flagged as urgent', icon: '🔄', color: 'border-amber-200', iconBg: 'bg-amber-50 text-amber-600' },
  { label: 'Low Stock Alerts', value: '7', sub: 'below reorder level', icon: '⚠️', color: 'border-rose-200', iconBg: 'bg-rose-50 text-rose-600' },
  { label: "Today's Movements", value: '156', sub: '+34 vs yesterday', icon: '📊', color: 'border-green-200', iconBg: 'bg-green-50 text-green-600' },
];

const MOCK_TRANSFERS = [
  { id: 'ST-20240401', material: '300012421', desc: 'Sodium Hydroxide 48%', from: 'WH-01', to: 'PROC-A', qty: 500, uom: 'L', status: 'COMPLETED', date: '07 Apr 2026' },
  { id: 'ST-20240398', material: '300009871', desc: 'Hydrochloric Acid 30%', from: 'WH-02', to: 'LAB-01', qty: 20, uom: 'L', status: 'IN TRANSIT', date: '07 Apr 2026' },
  { id: 'ST-20240395', material: '300011234', desc: 'Activated Carbon Powder', from: 'WH-01', to: 'PROC-B', qty: 1000, uom: 'KG', status: 'PENDING', date: '06 Apr 2026' },
  { id: 'ST-20240390', material: '300008810', desc: 'Ferric Chloride Solution', from: 'WH-03', to: 'PROC-A', qty: 250, uom: 'KG', status: 'COMPLETED', date: '06 Apr 2026' },
  { id: 'ST-20240387', material: '300010045', desc: 'Sulphuric Acid 98%', from: 'WH-02', to: 'PROC-C', qty: 100, uom: 'L', status: 'PENDING', date: '05 Apr 2026' },
  { id: 'ST-20240382', material: '300007720', desc: 'Calcium Hypochlorite', from: 'WH-01', to: 'PROC-B', qty: 200, uom: 'KG', status: 'IN TRANSIT', date: '05 Apr 2026' },
  { id: 'ST-20240379', material: '300012002', desc: 'Citric Acid Monohydrate', from: 'WH-03', to: 'LAB-02', qty: 50, uom: 'KG', status: 'COMPLETED', date: '04 Apr 2026' },
  { id: 'ST-20240375', material: '300009901', desc: 'Isopropyl Alcohol 99%', from: 'WH-02', to: 'LAB-01', qty: 80, uom: 'L', status: 'PENDING', date: '04 Apr 2026' },
  { id: 'ST-20240370', material: '300011555', desc: 'Potassium Permanganate', from: 'WH-01', to: 'PROC-A', qty: 30, uom: 'KG', status: 'COMPLETED', date: '03 Apr 2026' },
  { id: 'ST-20240365', material: '300008450', desc: 'Acetic Acid Glacial', from: 'WH-03', to: 'PROC-C', qty: 150, uom: 'L', status: 'IN TRANSIT', date: '03 Apr 2026' },
];

const STATUS_STYLES = {
  'COMPLETED': 'bg-green-100 text-green-700',
  'IN TRANSIT': 'bg-blue-100 text-blue-700',
  'PENDING': 'bg-amber-100 text-amber-700',
};

const LogisticsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const displayData = MOCK_TRANSFERS.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return item.material.includes(q) || item.desc.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-slate-400 hover:text-slate-700 transition-colors text-sm flex items-center gap-1">← Home</button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">Logistics</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">N</div>
            <span className="text-slate-700 text-sm font-medium">Nidhi</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <RiStockFill size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Stock Transfers</h1>
              <p className="text-slate-500 text-sm">Inventory movements — April 2026</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/stockList')}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            + New Transfer
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPI.map((k) => (
            <div key={k.label} className={`bg-white rounded-xl border ${k.color} shadow-sm p-4`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">{k.label}</span>
                <span className={`w-8 h-8 rounded-lg ${k.iconBg} flex items-center justify-center text-base`}>{k.icon}</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{k.value}</div>
              <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <h2 className="font-semibold text-slate-800">Transfer Log</h2>
            <input
              type="text"
              placeholder="Search material or transfer ID…"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Transfer ID</th>
                  <th className="text-left px-5 py-3 font-medium">Material No.</th>
                  <th className="text-left px-5 py-3 font-medium">Description</th>
                  <th className="text-left px-5 py-3 font-medium">From</th>
                  <th className="text-left px-5 py-3 font-medium">To</th>
                  <th className="text-right px-5 py-3 font-medium">Qty</th>
                  <th className="text-left px-5 py-3 font-medium">UoM</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((row) => (
                  <tr key={row.id} className="border-t border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-5 py-3 font-mono text-slate-700 text-xs font-medium">{row.id}</td>
                    <td className="px-5 py-3 font-mono text-slate-500 text-xs">{row.material}</td>
                    <td className="px-5 py-3 text-slate-700">{row.desc}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs font-mono">{row.from}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs font-mono">{row.to}</td>
                    <td className="px-5 py-3 text-slate-700 text-right font-medium">{row.qty.toLocaleString()}</td>
                    <td className="px-5 py-3 text-slate-500">{row.uom}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[row.status] || 'bg-slate-100 text-slate-600'}`}>{row.status}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
            Showing {displayData.length} of {MOCK_TRANSFERS.length} transfers
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogisticsPage;
