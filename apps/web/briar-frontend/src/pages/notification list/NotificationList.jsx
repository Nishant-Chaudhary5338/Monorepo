/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { fetchNotificationData } from '../../api/notificationList';
import { fetchCustomNotificationData } from '../../api/customNotifList';
import { handleSort } from '../../utils/sortingUtils';
import StatusFilterDropdown from '../../components/StatusFilterDropdown';
import LogoutButton from '../../small-components/LogoutButton';

const MOCK_DATA = [
  { Notification: '10045231', Reported_By: 'NCHAUDHARY', Equipment_number: 'P-301', equipment_desc: 'Centrifugal Pump — Unit 3', funn_loca: 'BCL-P301', plan_grp: 'ME-01', plant_section: 'PS-A', statustext: 'OPEN', manit_order: 'MO-8821', Notification_Date: '2026-04-07', Notification_Time: '2026-04-07T08:30:00', Description: 'Pump seal showing leakage at gland area', activity_type: 'PM01' },
  { Notification: '10045228', Reported_By: 'RSINGH', Equipment_number: 'CB-102', equipment_desc: 'Conveyor Belt — Section B', funn_loca: 'BCL-CB102', plan_grp: 'ME-02', plant_section: 'PS-B', statustext: 'IN PROGRESS', manit_order: 'MO-8818', Notification_Date: '2026-04-06', Notification_Time: '2026-04-06T09:15:00', Description: 'Belt tension uneven, causing vibration', activity_type: 'PM02' },
  { Notification: '10045215', Reported_By: 'APATEL', Equipment_number: 'V-201', equipment_desc: 'Reactor Control Valve', funn_loca: 'BCL-V201', plan_grp: 'ME-01', plant_section: 'PS-A', statustext: 'COMPLETED', manit_order: 'MO-8810', Notification_Date: '2026-04-05', Notification_Time: '2026-04-05T11:00:00', Description: 'Valve seat erosion detected during inspection', activity_type: 'PM03' },
  { Notification: '10045200', Reported_By: 'MKUMAR', Equipment_number: 'CT-04', equipment_desc: 'Cooling Tower Fan Motor', funn_loca: 'BCL-CT04', plan_grp: 'EL-03', plant_section: 'PS-C', statustext: 'CLOSED', manit_order: 'MO-8801', Notification_Date: '2026-04-04', Notification_Time: '2026-04-04T14:45:00', Description: 'Motor overheating — bearing replaced', activity_type: 'EL01' },
  { Notification: '10045198', Reported_By: 'NCHAUDHARY', Equipment_number: 'B-101', equipment_desc: 'Fire Tube Boiler', funn_loca: 'BCL-B101', plan_grp: 'ME-03', plant_section: 'PS-A', statustext: 'OPEN', manit_order: '', Notification_Date: '2026-04-03', Notification_Time: '2026-04-03T07:20:00', Description: 'Scheduled tube inspection — annual PM', activity_type: 'PM01' },
  { Notification: '10045190', Reported_By: 'DVERMA', Equipment_number: 'AG-03', equipment_desc: 'Agitator — Reactor 3', funn_loca: 'BCL-AG03', plan_grp: 'ME-02', plant_section: 'PS-B', statustext: 'IN PROGRESS', manit_order: 'MO-8795', Notification_Date: '2026-04-02', Notification_Time: '2026-04-02T10:00:00', Description: 'Shaft coupling misalignment reported', activity_type: 'PM02' },
  { Notification: '10045185', Reported_By: 'RSINGH', Equipment_number: 'HX-201', equipment_desc: 'Shell & Tube Heat Exchanger', funn_loca: 'BCL-HX201', plan_grp: 'ME-01', plant_section: 'PS-A', statustext: 'OPEN', manit_order: '', Notification_Date: '2026-04-01', Notification_Time: '2026-04-01T13:30:00', Description: 'Fouling on tube side reducing efficiency', activity_type: 'PM03' },
  { Notification: '10045177', Reported_By: 'APATEL', Equipment_number: 'C-101', equipment_desc: 'Distillation Column', funn_loca: 'BCL-C101', plan_grp: 'ME-03', plant_section: 'PS-C', statustext: 'COMPLETED', manit_order: 'MO-8780', Notification_Date: '2026-03-31', Notification_Time: '2026-03-31T08:00:00', Description: 'Tray damage in column rectifying section', activity_type: 'PM01' },
  { Notification: '10045170', Reported_By: 'MKUMAR', Equipment_number: 'E-302', equipment_desc: 'Centrifugal Compressor', funn_loca: 'BCL-E302', plan_grp: 'EL-03', plant_section: 'PS-B', statustext: 'CLOSED', manit_order: 'MO-8771', Notification_Date: '2026-03-30', Notification_Time: '2026-03-30T15:00:00', Description: 'Bearing noise — vibration analysis done', activity_type: 'EL02' },
  { Notification: '10045162', Reported_By: 'NCHAUDHARY', Equipment_number: 'T-501', equipment_desc: 'Storage Tank — Caustic', funn_loca: 'BCL-T501', plan_grp: 'ME-02', plant_section: 'PS-A', statustext: 'OPEN', manit_order: '', Notification_Date: '2026-03-29', Notification_Time: '2026-03-29T09:45:00', Description: 'Minor corrosion on tank nozzle flange', activity_type: 'PM02' },
  { Notification: '10045155', Reported_By: 'DVERMA', Equipment_number: 'F-401', equipment_desc: 'Fired Heater', funn_loca: 'BCL-F401', plan_grp: 'ME-01', plant_section: 'PS-C', statustext: 'IN PROGRESS', manit_order: 'MO-8765', Notification_Date: '2026-03-28', Notification_Time: '2026-03-28T11:00:00', Description: 'Refractory lining cracking detected', activity_type: 'PM03' },
  { Notification: '10045148', Reported_By: 'RSINGH', Equipment_number: 'PU-202', equipment_desc: 'Dosing Pump — Chemical Feed', funn_loca: 'BCL-PU202', plan_grp: 'ME-03', plant_section: 'PS-B', statustext: 'COMPLETED', manit_order: 'MO-8758', Notification_Date: '2026-03-27', Notification_Time: '2026-03-27T14:00:00', Description: 'Diaphragm replaced — pump calibrated', activity_type: 'PM01' },
];

const STATUS_STYLES = {
  'OPEN': 'bg-blue-100 text-blue-700',
  'IN PROGRESS': 'bg-amber-100 text-amber-700',
  'COMPLETED': 'bg-green-100 text-green-700',
  'CLOSED': 'bg-slate-100 text-slate-600',
};

const NotificationList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState([]);
  const [plannerGroupFilter, setPlannerGroupFilter] = useState('');
  const [plantSectionFilter, setPlantSectionFilter] = useState('');
  const [skip, setSkip] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const source = data.length > 0 ? data : [];
    setFilteredData(source instanceof Array ? source : [source]);
  }, [data]);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      const reportedBy = user ? user.toUpperCase() : 'DEMO';
      const notificationData = await fetchNotificationData(accessToken, reportedBy);
      if (notificationData && notificationData.length > 0) {
        setData(notificationData);
      } else {
        setData(MOCK_DATA);
      }
    } catch {
      setData(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const fetchCustomData = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      const reportedBy = user ? user.toUpperCase() : 'DEMO';
      setLoading(true);
      const notificationData = await fetchCustomNotificationData(accessToken, reportedBy, startDate, endDate, plannerGroupFilter, plantSectionFilter, statusFilter, skip);
      if (notificationData && notificationData.length > 0) {
        setData(skip > 0 ? (prev) => [...prev, ...notificationData] : notificationData);
        setHasMoreData(notificationData.length >= 100);
      } else {
        setData(MOCK_DATA);
      }
      setLoading(false);
    } catch {
      setData(MOCK_DATA);
      setLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const formatTime = (t) => t ? new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';

  const handleRowClick = (notifNo) => navigate(`/update/${notifNo}`);

  const handleCheckboxChange = (e) => {
    const val = e.target.value;
    setStatusFilter((prev) => prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]);
  };

  const displayData = filteredData.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.Notification?.toLowerCase().includes(q) ||
      item.Description?.toLowerCase().includes(q) ||
      item.Equipment_number?.toLowerCase().includes(q) ||
      item.equipment_desc?.toLowerCase().includes(q)
    );
  });

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(displayData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notifications');
    XLSX.writeFile(wb, 'notifications.xlsx');
  };

  const handleSortWrapper = (col) => handleSort(col, filteredData, sortOrder, setFilteredData, setSortOrder);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/engineering')} className="text-slate-400 hover:text-slate-700 transition-colors text-sm flex items-center gap-1">← Engineering</button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">Work Notification Report</span>
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
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">All Notifications</h1>
            <p className="text-slate-500 text-sm mt-0.5">{displayData.length} records</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-5">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search notification, equipment, description…"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={startDate} onChange={(e) => { setStartDate(e.target.value); setSkip(0); }} />
            <span className="text-slate-400 text-sm">to</span>
            <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={endDate} onChange={(e) => { setEndDate(e.target.value); setSkip(0); }} />
            <input type="text" placeholder="Planner group" className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-green-400" value={plannerGroupFilter} onChange={(e) => setPlannerGroupFilter(e.target.value)} />
            <StatusFilterDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} handleCheckboxChange={handleCheckboxChange} />
            <button
              onClick={() => { setSkip(0); fetchCustomData(); }}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Apply
            </button>
            <button
              onClick={handleDownloadExcel}
              className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RiFileExcel2Fill size={16} className="text-green-600" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Loading notifications…</div>
          ) : displayData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                    {[
                      { label: 'Notif. No.', col: 'Notification' },
                      { label: 'Description', col: 'Description' },
                      { label: 'Equipment', col: 'Equipment_number' },
                      { label: 'Equip. Desc', col: 'equipment_desc' },
                      { label: 'Planner', col: 'plan_grp' },
                      { label: 'Section', col: 'plant_section' },
                      { label: 'Status', col: null },
                      { label: 'Date', col: 'Notification_Date' },
                    ].map(({ label, col }) => (
                      <th
                        key={label}
                        className={`text-left px-4 py-3 font-medium ${col ? 'cursor-pointer hover:text-slate-700' : ''}`}
                        onClick={col ? () => handleSortWrapper(col) : undefined}
                      >
                        {label} {col ? '↕' : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((item) => (
                    <tr
                      key={item.Notification}
                      className="border-t border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(item.Notification)}
                    >
                      <td className="px-4 py-3 font-mono text-slate-700 font-medium text-xs">{item.Notification}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{item.Description}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{item.Equipment_number}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">{item.equipment_desc}</td>
                      <td className="px-4 py-3 text-slate-500">{item.plan_grp}</td>
                      <td className="px-4 py-3 text-slate-500">{item.plant_section}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[item.statustext] || 'bg-slate-100 text-slate-600'}`}>
                          {item.statustext}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{formatDate(item.Notification_Date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination footer */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {displayData.length} of {data.length} notifications</span>
            {hasMoreData && (
              <button onClick={() => { setSkip((s) => s + 100); fetchCustomData(); }} className="text-green-600 font-medium hover:underline">
                Load next 100 →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationList;
