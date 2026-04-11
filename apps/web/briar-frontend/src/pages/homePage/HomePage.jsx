import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiToolsFill, RiStockFill } from 'react-icons/ri';
import { LuTowerControl } from 'react-icons/lu';
import { BomHelpContext } from '../../context/BomHelpContext';
import { getBomHelp } from '../../api/bomHelp';
import { useGroupData } from '../../context/groupData';
import LogoutButton from '../../small-components/LogoutButton';

const STAT_CARDS = [
  { label: 'Total Notifications', value: '247', change: '+12 this week', icon: '🔔', color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
  { label: 'Pending Approvals', value: '18', change: '3 urgent', icon: '⏳', color: 'bg-amber-50 text-amber-600', border: 'border-amber-200' },
  { label: 'Stock Transfers', value: '34', change: '+5 today', icon: '📦', color: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
  { label: 'QC Items', value: '12', change: '2 flagged', icon: '🔬', color: 'bg-green-50 text-green-600', border: 'border-green-200' },
];

const RECENT_NOTIFICATIONS = [
  { id: '10045231', desc: 'Pump seal replacement — Unit 3', equipment: 'P-301', planner: 'ME-01', status: 'OPEN', date: '07 Apr 2026' },
  { id: '10045228', desc: 'Conveyor belt inspection overdue', equipment: 'CB-102', planner: 'ME-02', status: 'IN PROGRESS', date: '06 Apr 2026' },
  { id: '10045215', desc: 'Reactor valve leak — Line 2', equipment: 'V-201', planner: 'ME-01', status: 'COMPLETED', date: '05 Apr 2026' },
  { id: '10045200', desc: 'Cooling tower fan motor fault', equipment: 'CT-04', planner: 'EL-03', status: 'CLOSED', date: '04 Apr 2026' },
  { id: '10045198', desc: 'Boiler tube inspection scheduled', equipment: 'B-101', planner: 'ME-03', status: 'OPEN', date: '03 Apr 2026' },
];

const STATUS_STYLES = {
  'OPEN': 'bg-blue-100 text-blue-700',
  'IN PROGRESS': 'bg-amber-100 text-amber-700',
  'COMPLETED': 'bg-green-100 text-green-700',
  'CLOSED': 'bg-slate-100 text-slate-600',
};

const HomePage = () => {
  const navigate = useNavigate();
  const { groupData } = useGroupData();
  const { bomData } = useContext(BomHelpContext);

  const showPageLogistics = groupData.includes('SWI-LB');
  const showPageQualityControl = groupData.includes('SWI-QCA');
  const showPageBasic = groupData.includes('SWI-EB');
  const showPageApprove = groupData.includes('SWI-EA');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    getBomHelp(token).then((data) => { if (data) bomData(data); }).catch(() => {});
  }, []);

  const modules = [
    showPageBasic || showPageApprove
      ? { title: 'Engineering', desc: 'Work notifications, BOM, approvals & reservations', icon: <RiToolsFill size={24} />, iconBg: 'bg-blue-100 text-blue-600', count: '5 sub-modules', path: '/engineering' }
      : null,
    showPageLogistics
      ? { title: 'Logistics', desc: 'Stock transfers, inventory management & reports', icon: <RiStockFill size={24} />, iconBg: 'bg-purple-100 text-purple-600', count: '1 sub-module', path: '/logistics' }
      : null,
    showPageQualityControl
      ? { title: 'Quality Control', desc: 'QC releases, block release & unrestricted stock', icon: <LuTowerControl size={24} />, iconBg: 'bg-green-100 text-green-600', count: '4 sub-modules', path: '/qc' }
      : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-0 flex items-center justify-between h-14 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/briarLogo.png" className="h-10 w-auto" alt="Briar Chemicals" />
          <span className="text-slate-800 font-bold text-lg tracking-tight">Briar Chemicals ERP</span>
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Plant: Briar Site A</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className={`bg-white rounded-xl border ${card.border} shadow-sm p-4`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">{card.label}</span>
                <span className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center text-base`}>{card.icon}</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{card.value}</div>
              <div className="text-xs text-slate-400 mt-1">{card.change}</div>
            </div>
          ))}
        </div>

        {/* Module Cards */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-slate-700 mb-3">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((mod) => (
              <div
                key={mod.title}
                onClick={() => navigate(mod.path)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 cursor-pointer hover:border-green-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${mod.iconBg} flex items-center justify-center`}>{mod.icon}</div>
                  <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">{mod.count}</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{mod.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{mod.desc}</p>
                <div className="mt-4 text-sm text-green-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Open module →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Notifications</h2>
            <button
              onClick={() => navigate('/list')}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View all →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Notif. No.</th>
                  <th className="text-left px-5 py-3 font-medium">Description</th>
                  <th className="text-left px-5 py-3 font-medium">Equipment</th>
                  <th className="text-left px-5 py-3 font-medium">Planner</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_NOTIFICATIONS.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/update/${row.id}`)}
                  >
                    <td className="px-5 py-3 font-mono text-slate-700 font-medium">{row.id}</td>
                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{row.desc}</td>
                    <td className="px-5 py-3 text-slate-500">{row.equipment}</td>
                    <td className="px-5 py-3 text-slate-500">{row.planner}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
