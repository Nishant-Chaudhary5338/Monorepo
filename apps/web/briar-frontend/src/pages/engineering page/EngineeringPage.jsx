import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiToolsFill } from 'react-icons/ri';
import { MdUpdate, MdOutlineApproval } from 'react-icons/md';
import { GiMaterialsScience } from 'react-icons/gi';
import { TbReservedLine } from 'react-icons/tb';
import { useGroupData } from '../../context/groupData';
import LogoutButton from '../../small-components/LogoutButton';

const MODULES = [
  {
    title: 'Work Notification Entry',
    desc: 'Create new maintenance work notifications for equipment issues and breakdowns.',
    icon: <RiToolsFill size={22} />,
    iconBg: 'bg-blue-100 text-blue-600',
    badge: '18 open',
    badgeColor: 'bg-blue-50 text-blue-600',
    path: '/entry',
    key: 'entry',
  },
  {
    title: 'Work Notification Report',
    desc: 'View and filter all submitted notifications. Export to Excel.',
    icon: <MdUpdate size={22} />,
    iconBg: 'bg-green-100 text-green-600',
    badge: '247 total',
    badgeColor: 'bg-green-50 text-green-600',
    path: '/list',
    key: 'list',
  },
  {
    title: 'Work Notification Approve',
    desc: 'Review and approve or reject pending work notifications.',
    icon: <MdOutlineApproval size={22} />,
    iconBg: 'bg-amber-100 text-amber-600',
    badge: '3 urgent',
    badgeColor: 'bg-amber-50 text-amber-600',
    path: '/approve',
    key: 'approve',
    requiresApprove: true,
  },
  {
    title: 'Bills of Material',
    desc: 'Browse and search the bill of materials for all plant equipment.',
    icon: <GiMaterialsScience size={22} />,
    iconBg: 'bg-purple-100 text-purple-600',
    badge: '1,240 items',
    badgeColor: 'bg-purple-50 text-purple-600',
    path: '/bom',
    key: 'bom',
  },
  {
    title: 'Outstanding Reservations',
    desc: 'Track all open material reservations pending fulfillment.',
    icon: <TbReservedLine size={22} />,
    iconBg: 'bg-rose-100 text-rose-600',
    badge: '34 pending',
    badgeColor: 'bg-rose-50 text-rose-600',
    path: '/reservations',
    key: 'reservations',
  },
];

const EngineeringPage = () => {
  const navigate = useNavigate();
  const { groupData } = useGroupData();
  const showPageApprove = groupData.includes('SWI-EA');

  const visibleModules = MODULES.filter((m) => !m.requiresApprove || showPageApprove);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="text-slate-400 hover:text-slate-700 transition-colors text-sm flex items-center gap-1"
          >
            ← Home
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">Engineering</span>
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
        {/* Section header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <RiToolsFill size={18} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Engineering</h1>
          </div>
          <p className="text-slate-500 text-sm ml-12">Maintenance notifications, BOM lookups, and material reservations.</p>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleModules.map((mod) => (
            <div
              key={mod.key}
              onClick={() => navigate(mod.path)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 cursor-pointer hover:border-green-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${mod.iconBg} flex items-center justify-center`}>
                  {mod.icon}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${mod.badgeColor}`}>
                  {mod.badge}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2 text-base">{mod.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{mod.desc}</p>
              <div className="mt-4 text-sm text-green-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Open →
              </div>
            </div>
          ))}
        </div>

        {/* Info strip */}
        <div className="mt-8 bg-slate-800 rounded-xl px-5 py-4 flex items-center justify-between">
          <div className="text-slate-300 text-sm">
            <span className="font-semibold text-white">Plant: Briar Site A</span>
            <span className="mx-2 text-slate-600">·</span>
            Maintenance planner group: <span className="text-white">ME-01, ME-02, ME-03</span>
          </div>
          <div className="text-xs text-slate-500">SAP-PM Integration Active</div>
        </div>
      </main>
    </div>
  );
};

export default EngineeringPage;
