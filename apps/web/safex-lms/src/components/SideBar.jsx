import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { RxDashboard } from 'react-icons/rx';
import { BsTrainFront } from 'react-icons/bs';
import { MdOutlinePolicy, MdOutlineQuiz } from 'react-icons/md';
import { GiProgression } from 'react-icons/gi';
import { IoIdCardOutline } from 'react-icons/io5';
import { TfiGallery } from 'react-icons/tfi';
import { GoPeople } from 'react-icons/go';
import { VscFeedback } from 'react-icons/vsc';

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: <AiOutlineHome size={18} /> },
  { to: '/dashboard', label: 'Dashboard', icon: <RxDashboard size={18} /> },
  { to: '/training', label: 'Training', icon: <BsTrainFront size={18} /> },
  { to: '/policy', label: 'User Policy', icon: <MdOutlinePolicy size={18} /> },
  { to: '/quiz', label: 'Quiz', icon: <MdOutlineQuiz size={18} /> },
  { to: '/progress', label: 'Progress', icon: <GiProgression size={18} /> },
];

const SECONDARY_ITEMS = [
  { to: '/idCard', label: 'ID Card', icon: <IoIdCardOutline size={18} /> },
  { to: '/gallery', label: 'Gallery', icon: <TfiGallery size={18} /> },
  { to: '/feedback', label: 'Feedback', icon: <VscFeedback size={18} /> },
  { to: '/employees', label: 'Employees', icon: <GoPeople size={18} /> },
];

const SideBar = () => {
  return (
    <div className="w-56 min-h-screen bg-white border-r border-slate-200 flex flex-col py-4 shrink-0">
      {/* Main nav */}
      <div className="px-3 mb-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main</p>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <span className="shrink-0">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Divider */}
      <div className="mx-4 my-3 border-t border-slate-100" />

      {/* Secondary nav */}
      <div className="px-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Tools</p>
        <nav className="space-y-0.5">
          {SECONDARY_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <span className="shrink-0">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
