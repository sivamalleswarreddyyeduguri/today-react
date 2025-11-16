// import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { useEffect, useMemo, useState } from 'react';
// import {
//   FaClipboardList,
//   FaCubes,
//   FaIndustry,
//   FaSignOutAlt,
//   FaUser,
//   FaUserCircle,
//   FaWarehouse
// } from 'react-icons/fa';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../../styles/admin.css';
// import '../../styles/dashboard.css';
// import axiosInstance from '../shared/axiosInstance';

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Cell,
// } from 'recharts';

// export const DashboardInsideLayout = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   const role = useMemo(() => {
//     const raw = localStorage.getItem('roles') || '';
//     try {
//       const parsed = JSON.parse(raw);
//       if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
//     } catch {}
//     return raw;
//   }, []);

//   const isAdmin = role === 'ROLE_ADMIN';

//   const [loading, setLoading] = useState(true);
//   const [overview, setOverview] = useState({ vendors: 0, plants: 0, materials: 0, lots: 0 });
//   const [statusCounts, setStatusCounts] = useState({ pending: 0, passed: 0, failed: 0 });
//   const [activities, setActivities] = useState([]);

//   const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

//   const normalizeStatus = (value) => {
//     if (!value) return 'Pending';
//     const v = String(value).trim().toUpperCase();
//     if (v === 'PENDING') return 'Pending';
//     if (v === 'PASS' || v === 'PASSED') return 'Passed';
//     if (v === 'REJECT' || v === 'REJECTED' || v === 'FAILED' || v === 'FAIL') return 'Failed';
//     return 'Pending';
//   };

//   const mapActivityRow = (lot) => {
//     const date = lot.inspectionStartDate || lot.date || lot.createdAt || lot.updatedAt || null;
//     const lotNumber = lot.lotNo || lot.lotNumber || lot.lotId || lot.id || '—';
//     const uName = lot.userName;
//     const materialName =
//       (lot.material && (lot.material.name || lot.material.materialName)) ||
//       lot.materialName || '—';
//     const status = normalizeStatus(lot.result);
//     return { date, lotNumber, materialName, status, uName };
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [vendorsRes, plantsRes, materialsRes, lotsRes] = await Promise.all([
//         axiosInstance.get('api/v1/vendor/all', { headers }),
//         axiosInstance.get('api/v1/plant/get-all', { headers }),
//         axiosInstance.get('api/v1/material/get-all', { headers }),
//         axiosInstance.get('api/v1/inspection/get-all-lots', { headers }),
//       ]);

//       const vendors = Array.isArray(vendorsRes.data) ? vendorsRes.data : vendorsRes.data?.data || [];
//       const plants = Array.isArray(plantsRes.data) ? plantsRes.data : plantsRes.data?.data || [];
//       const materials = Array.isArray(materialsRes.data) ? materialsRes.data : materialsRes.data?.data || [];
//       const lots = Array.isArray(lotsRes.data) ? lotsRes.data : lotsRes.data?.data || [];

//       setOverview({
//         vendors: vendors.length,
//         plants: plants.length,
//         materials: materials.length,
//         lots: lots.length,
//       });

//       let pending = 0, passed = 0, failed = 0;
//       lots.forEach((lot) => {
//         const status = normalizeStatus(lot.result);
//         if (status === 'Pending') pending += 1;
//         else if (status === 'Passed') passed += 1;
//         else if (status === 'Failed') failed += 1;
//       });

//       setStatusCounts({ pending, passed, failed });

//       const sorted = [...lots].sort((a, b) => {
//         const ad = new Date(a.inspectionDate || a.date || a.createdAt || 0).getTime();
//         const bd = new Date(b.inspectionDate || b.date || b.createdAt || 0).getTime();
//         return bd - ad;
//       });
//       const recent = sorted.slice(0, 8).map(mapActivityRow);
//       setActivities(recent);
//     } catch (error) {
//       const msg = error.response?.data?.errorMessage || error.message || 'Failed to load dashboard data';
//       toast.error(msg, { position: 'top-center' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const chartData = [
//     { name: 'Pending', count: statusCounts.pending, fill: '#60a5fa' },
//     { name: 'Passed',  count: statusCounts.passed,  fill: '#34d399' },
//     { name: 'Failed',  count: statusCounts.failed,  fill: '#f87171' },
//   ];

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <div>
//           <h1>Material Inspection Management System</h1>
//           <p className="subheading">Overview & Activity</p>
//         </div>
//         <div className="header-actions">
//           {isAdmin && (
//             <NavLink to="/inspectors" className="btn btn-primary">Manage Users</NavLink>
//           )}
//           <div className="avatar">{(localStorage.getItem('username') || 'U')[0].toUpperCase()}</div>
//         </div>
//       </div>

//       {/* Overview cards (clickable) */}
//       <section className="overview-grid">
//         <div className="card stat-card clickable" onClick={() => navigate('/vendor-list')} role="button">
//           <div className="stat-label">Vendors</div>
//           <div className="stat-value">{overview.vendors}</div>
//         </div>
//         <div className="card stat-card clickable" onClick={() => navigate('/plant-list')} role="button">
//           <div className="stat-label">Plants</div>
//           <div className="stat-value">{overview.plants}</div>
//         </div>
//         <div className="card stat-card clickable" onClick={() => navigate('/material-list')} role="button">
//           <div className="stat-label">Materials</div>
//           <div className="stat-value">{overview.materials}</div>
//         </div>
//         <div className="card stat-card clickable" onClick={() => navigate('/inspection-lot-list')} role="button">
//           <div className="stat-label">Inspection Lots</div>
//           <div className="stat-value">{overview.lots}</div>
//         </div>
//       </section>

//       {/* Status chart (Recharts) */}
//       <section className="card status-card">
//         <div className="section-title">Inspection Status</div>
//         {loading ? (
//           <div className="skeleton skeleton-graph" />
//         ) : (
//           <div className="chart-wrap">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={chartData}
//                 layout="vertical"
//                 margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" allowDecimals={false} />
//                 <YAxis type="category" dataKey="name" width={80} />
//                 <Tooltip cursor={{ fill: 'rgba(2,8,23,0.04)' }} />
//                 <Bar dataKey="count" radius={[6, 6, 6, 6]}>
//                   {chartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.fill} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </section>

//       {/* Activities table */}
//       <section className="card table-card">
//         <div className="section-title">Inspection Activities</div>
//         {loading ? (
//           <div className="skeleton skeleton-table" />
//         ) : (
//           <div className="table-wrapper">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Inspection Lot</th>
//                   <th>Material</th>
//                    <th>Inspected By</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {activities.length === 0 ? (
//                   <tr><td colSpan={4} className="no-data">No recent inspections</td></tr>
//                 ) : (
//                   activities.map((row, idx) => (
//                     <tr key={idx}>
//                       <td>{row.date ? new Date(row.date).toLocaleDateString() : '—'}</td>
//                       <td>{row.lotNumber}</td>
//                       <td>{row.materialName}</td>
//                       <td>{row.uName}</td>
//                       <td>
//                         <span className={
//                           row.status === 'Passed' ? 'badge badge-success'
//                           : row.status === 'Failed' ? 'badge badge-danger'
//                           : 'badge badge-warning'
//                         }>
//                           {row.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// const Layout = () => {
//   const [adminDetails, setAdminDetails] = useState({
//     username: localStorage.getItem('username') || '',
//     email: localStorage.getItem('email') || '',
//     mobileNum: localStorage.getItem('mobileNumber') || ''
//   });

//   const token = localStorage.getItem('token');
//   const navigate = useNavigate();

//   const role = useMemo(() => {
//     const raw = localStorage.getItem('roles') || '';
//     try {
//       const parsed = JSON.parse(raw);
//       if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
//     } catch {}
//     return raw;
//   }, []);

//   const isRoleUser = role === 'ROLE_USER';
//   const isRoleInspector = role === 'ROLE_INSPECTOR';

//   const hideUsers = isRoleUser;
//   const hideMaterial = isRoleUser;
//   const hideInspectionLot = isRoleUser;
//   const disableUsers = isRoleInspector;

//   const avatarInitial = useMemo(() => {
//     const name = localStorage.getItem('username') || adminDetails.username || '';
//     return name ? name[0].toUpperCase() : 'U';
//   }, [adminDetails.username]);

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.put('api/v1//user/update-admin', adminDetails, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success(response.data.statusMsg || 'Profile updated successfully!', {
//         position: 'top-center',
//         autoClose: 1500
//       });

//       setTimeout(() => {
//         localStorage.setItem('username', adminDetails.username);
//         localStorage.setItem('email', adminDetails.email);
//         localStorage.setItem('mobileNumber', adminDetails.mobileNum);
//       }, 1600);
//     } catch (error) {
//       toast.error(error.response?.data?.errorMessage || 'Failed to update profile', {
//         position: 'top-center'
//       });
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div className="admin-dashboard">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2 className="sidebar-title">{(localStorage.getItem('username') || 'User') + '   DashBoard'}</h2>

//         <ul className="sidebar-menu">
//           {/* Dashboard link (index of root) */}
//           <li>
//             <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//               <span>Dashboard</span>
//             </NavLink>
//           </li>

//           {/* Profile */}
//           <li>
//             <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//               <FaUserCircle />
//               <span>Profile</span>
//               <span className="sidebar-avatar-initial" title={adminDetails.username || 'User'}>
//                 {avatarInitial}
//               </span>
//             </NavLink>
//           </li>

//           {/* Users */}
//           {!hideUsers && (
//             <li>
//               <NavLink
//                 to="/inspectors"
//                 className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${disableUsers ? 'disabled' : ''}`}
//                 onClick={(e) => { if (disableUsers) e.preventDefault(); }}
//                 aria-disabled={disableUsers ? 'true' : 'false'}
//                 tabIndex={disableUsers ? -1 : 0}
//                 style={disableUsers ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
//               >
//                 <FaUser /> <span>Users</span>
//               </NavLink>
//             </li>
//           )}

//           {/* Vendor */}
//           <li>
//             <NavLink to="/vendor-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//               <FaIndustry /> <span>Vendor</span>
//             </NavLink>
//           </li>

//           {/* Plant */}
//           <li>
//             <NavLink to="/plant-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//               <FaWarehouse /> <span>Plant</span>
//             </NavLink>
//           </li>

//           {/* Material */}
//           {!hideMaterial && (
//             <li>
//               <NavLink to="/material-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//                 <FaCubes /> <span>Material</span>
//               </NavLink>
//             </li>
//           )}

//           {/* Inspection Lot */}
//           {!hideInspectionLot && (
//             <li>
//               <NavLink to="/inspection-lot-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//                 <FaClipboardList /> <span>Inspection Lot</span>
//               </NavLink>
//             </li>
//           )}
//         </ul>

//         <div className="logout-section" onClick={handleLogout} role="button" tabIndex={0}>
//           <FaSignOutAlt /> <span>Logout</span>
//         </div>
//       </div>

//       {/* Right-side content container */}
//       <div className="main-content">
//         {/* This Outlet shows dashboard by default (index route) and other pages when navigated */}
//         <Outlet />
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default Layout;






import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  FaClipboardList,
  FaCubes,
  FaIndustry,
  FaSignOutAlt,
  FaUser,
  FaUserCircle,
  FaWarehouse
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/admin.css';
import '../../styles/dashboard.css';
import axiosInstance from '../shared/axiosInstance';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

export const DashboardInsideLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const role = useMemo(() => {
    const raw = localStorage.getItem('roles') || '';
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {}
    return raw;
  }, []);

  const isAdmin = role === 'ROLE_ADMIN';

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ vendors: 0, plants: 0, materials: 0, lots: 0 });
  const [statusCounts, setStatusCounts] = useState({ pending: 0, passed: 0, failed: 0 });
  // const [activities, setActivities] = useState([]);

  
const [groupedByStatus, setGroupedByStatus] = useState({
    Pending: [],
    Passed: [],
    Failed: [],
  });

  const [activities, setActivities] = useState([]);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const normalizeStatus = (value) => {
    if (!value) return 'Pending';
    const v = String(value).trim().toUpperCase();
    if (v === 'PENDING') return 'Pending';
    if (v === 'PASS' || v === 'PASSED') return 'Passed';
    if (v === 'REJECT' || v === 'REJECTED' || v === 'FAILED' || v === 'FAIL') return 'Failed';
    return 'Pending';
  };

  // Helpers to safely read material name & inspected by across API variations
  const getMaterialName = (lot) => {
    const m =
      (lot.material && (lot.material.name || lot.material.materialName)) ||
      lot.materialName ||
      lot.materialDes || // some APIs use description
      lot.material_code || // just in case
      '—';
    return m;
  };

  const getInspectedBy = (lot) => {
    // your data showed userName, also inspectedBy in your request
    return lot.inspectedBy || lot.userName || lot.inspectorName || '—';
  };

  const mapActivityRow = (lot) => {
    const date = lot.inspectionStartDate || lot.date || lot.createdAt || lot.updatedAt || null;
    const lotNumber = lot.lotNo || lot.lotNumber || lot.lotId || lot.id || '—';
    const materialName = getMaterialName(lot);
    const uName = getInspectedBy(lot);
    const status = normalizeStatus(lot.result);
    return { date, lotNumber, materialName, status, uName };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vendorsRes, plantsRes, materialsRes, lotsRes] = await Promise.all([
        axiosInstance.get('api/v1/vendor/all', { headers }),
        axiosInstance.get('api/v1/plant/get-all', { headers }),
        axiosInstance.get('api/v1/material/get-all', { headers }),
        axiosInstance.get('api/v1/inspection/get-all-lots', { headers }),
      ]);

      const vendors = Array.isArray(vendorsRes.data) ? vendorsRes.data : vendorsRes.data?.data || [];
      const plants = Array.isArray(plantsRes.data) ? plantsRes.data : plantsRes.data?.data || [];
      const materials = Array.isArray(materialsRes.data) ? materialsRes.data : materialsRes.data?.data || [];
      const lots = Array.isArray(lotsRes.data) ? lotsRes.data : lotsRes.data?.data || [];

      setOverview({
        vendors: vendors.length,
        plants: plants.length,
        materials: materials.length,
        lots: lots.length,
      });

      // Compute counts and grouped lists for tooltip
      let pending = 0, passed = 0, failed = 0;
      const groups = { Pending: [], Passed: [], Failed: [] };

      lots.forEach((lot) => {
        const status = normalizeStatus(lot.result);
        const entry = {
          materialName: getMaterialName(lot),
          inspectedBy: getInspectedBy(lot),
          lotNumber: lot.lotNo || lot.lotNumber || lot.lotId || lot.id || '—',
        };

        if (status === 'Pending') {
          pending += 1;
          groups.Pending.push(entry);
        } else if (status === 'Passed') {
          passed += 1;
          groups.Passed.push(entry);
        } else if (status === 'Failed') {
          failed += 1;
          groups.Failed.push(entry);
        } else {
          pending += 1;
          groups.Pending.push(entry);
        }
      });

      setStatusCounts({ pending, passed, failed });
      setGroupedByStatus(groups);

      const sorted = [...lots].sort((a, b) => {
        const ad = new Date(a.inspectionDate || a.date || a.createdAt || 0).getTime();
        const bd = new Date(b.inspectionDate || b.date || b.createdAt || 0).getTime();
        return bd - ad;
      });
      const recent = sorted.slice(0, 8).map(mapActivityRow);
      setActivities(recent);
    } catch (error) {
      const msg =
        error.response?.data?.errorMessage || error.message || 'Failed to load dashboard data';
      toast.error(msg, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const chartData = [
    { name: 'Pending', count: statusCounts.pending, fill: '#60a5fa' },
    { name: 'Passed',  count: statusCounts.passed,  fill: '#34d399' },
    { name: 'Failed',  count: statusCounts.failed,  fill: '#f87171' },
  ];

  // === Custom tooltip component for Recharts ===
  const StatusTooltip = ({ active, payload, label }) => {
    // payload[0]?.payload contains the data object for the hovered bar
    if (!active || !payload || !payload.length) return null;

    const row = payload[0].payload; // { name, count, fill }
    const status = row?.name || label || '';
    const list = groupedByStatus[status] || [];

    // Limit to show first N and indicate there are more
    const MAX_ITEMS = 6;
    const shown = list.slice(0, MAX_ITEMS);
    const remaining = Math.max(0, list.length - shown.length);

    return (
      <div className="tt-root">
        <div className="tt-title">{status}</div>
        <div className="tt-count">Count: {row.count}</div>

        {shown.length > 0 ? (
          <div className="tt-list">
            {shown.map((it, idx) => (
              <div key={idx} className="tt-item">
                <div className="tt-line">
                  <span className="tt-label">Material:</span>
                  <span className="tt-value">{it.materialName}</span>
                </div>
                <div className="tt-line">
                  <span className="tt-label">Inspected By:</span>
                  <span className="tt-value">{it.inspectedBy}</span>
                </div>
                {/* Optional: lot number */}
                {/* <div className="tt-line">
                  <span className="tt-label">Lot:</span>
                  <span className="tt-value">{it.lotNumber}</span>
                </div> */}
              </div>
            ))}
            {remaining > 0 && (
              <div className="tt-more">+{remaining} more…</div>
            )}
          </div>
        ) : (
          <div className="tt-empty">No lots in this status</div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Material Inspection Management System</h1>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <NavLink to="/inspectors" className="btn btn-primary">Manage Users</NavLink>
          )}
          <div className="avatar">{(localStorage.getItem('username') || 'U')[0].toUpperCase()}</div>
        </div>
      </div>

      {/* Overview cards */}
      <section className="overview-grid">
        <div className="card stat-card clickable" onClick={() => navigate('/vendor-list')} role="button">
          <div className="stat-label">Vendors</div>
          <div className="stat-value">{overview.vendors}</div>
        </div>
        <div className="card stat-card clickable" onClick={() => navigate('/plant-list')} role="button">
          <div className="stat-label">Plants</div>
          <div className="stat-value">{overview.plants}</div>
        </div>
        <div className="card stat-card clickable" onClick={() => navigate('/material-list')} role="button">
          <div className="stat-label">Materials</div>
          <div className="stat-value">{overview.materials}</div>
        </div>
        <div className="card stat-card clickable" onClick={() => navigate('/inspection-lot-list')} role="button">
          <div className="stat-label">Inspection Lots</div>
          <div className="stat-value">{overview.lots}</div>
        </div>
      </section>

      {/* Status chart (Recharts) */}
      <section className="card status-card">
        <div className="section-title">Inspection Status</div>
        {loading ? (
          <div className="skeleton skeleton-graph" />
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={80} />
                {/* use custom content for Tooltip */}
                <Tooltip
                  cursor={{ fill: 'rgba(2,8,23,0.04)' }}
                  content={<StatusTooltip />}
                  wrapperStyle={{ zIndex: 9999 }}
                />
                <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    


      {/* Activities table */}
      <section className="card table-card">
        <div className="section-title">Inspection Activities</div>
        {loading ? (
          <div className="skeleton skeleton-table" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Inspection Lot</th>
                  <th>Material</th>
                   <th>Inspected By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr><td colSpan={4} className="no-data">No recent inspections</td></tr>
                ) : (
                  activities.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.date ? new Date(row.date).toLocaleDateString() : '—'}</td>
                      <td>{row.lotNumber}</td>
                      <td>{row.materialName}</td>
                      <td>{row.uName}</td>
                      <td>
                        <span className={
                          row.status === 'Passed' ? 'badge badge-success'
                          : row.status === 'Failed' ? 'badge badge-danger'
                          : 'badge badge-warning'
                        }>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const Layout = () => {
  const [adminDetails, setAdminDetails] = useState({
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    mobileNum: localStorage.getItem('mobileNumber') || ''
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const role = useMemo(() => {
    const raw = localStorage.getItem('roles') || '';
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {}
    return raw;
  }, []);

  const isRoleUser = role === 'ROLE_USER';
  const isRoleInspector = role === 'ROLE_INSPECTOR';

  const hideUsers = isRoleUser;
  const hideMaterial = isRoleUser;
  const hideInspectionLot = isRoleUser;
  const disableUsers = isRoleInspector;

  const avatarInitial = useMemo(() => {
    const name = localStorage.getItem('username') || adminDetails.username || '';
    return name ? name[0].toUpperCase() : 'U';
  }, [adminDetails.username]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('api/v1//user/update-admin', adminDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.statusMsg || 'Profile updated successfully!', {
        position: 'top-center',
        autoClose: 1500
      });

      setTimeout(() => {
        localStorage.setItem('username', adminDetails.username);
        localStorage.setItem('email', adminDetails.email);
        localStorage.setItem('mobileNumber', adminDetails.mobileNum);
      }, 1600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to update profile', {
        position: 'top-center'
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">{(localStorage.getItem('username') || 'User') + '   DashBoard'}</h2>

        <ul className="sidebar-menu">
          {/* Dashboard link (index of root) */}
          <li>
            <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Profile */}
          <li>
            <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FaUserCircle />
              <span>Profile</span>
              <span className="sidebar-avatar-initial" title={adminDetails.username || 'User'}>
                {avatarInitial}
              </span>
            </NavLink>
          </li>

          {/* Users */}
          {!hideUsers && (
            <li>
              <NavLink
                to="/inspectors"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${disableUsers ? 'disabled' : ''}`}
                onClick={(e) => { if (disableUsers) e.preventDefault(); }}
                aria-disabled={disableUsers ? 'true' : 'false'}
                tabIndex={disableUsers ? -1 : 0}
                style={disableUsers ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
              >
                <FaUser /> <span>Users</span>
              </NavLink>
            </li>
          )}

          {/* Vendor */}
          <li>
            <NavLink to="/vendor-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FaIndustry /> <span>Vendor</span>
            </NavLink>
          </li>

          {/* Plant */}
          <li>
            <NavLink to="/plant-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FaWarehouse /> <span>Plant</span>
            </NavLink>
          </li>

          {/* Material */}
          {!hideMaterial && (
            <li>
              <NavLink to="/material-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <FaCubes /> <span>Material</span>
              </NavLink>
            </li>
          )}

          {/* Inspection Lot */}
          {!hideInspectionLot && (
            <li>
              <NavLink to="/inspection-lot-list" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <FaClipboardList /> <span>Inspection Lot</span>
              </NavLink>
            </li>
          )}
        </ul>

        <div className="logout-section" onClick={handleLogout} role="button" tabIndex={0}>
          <FaSignOutAlt /> <span>Logout</span>
        </div>
      </div>

      {/* Right-side content container */}
      <div className="main-content">
        {/* This Outlet shows dashboard by default (index route) and other pages when navigated */}
        <Outlet />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Layout;












// color change

// import React, { useEffect, useMemo, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axiosInstance from '../shared/axiosInstance';

// // Recharts
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Cell,
// } from 'recharts';

// export const DashboardInsideLayout = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   const role = useMemo(() => {
//     const raw = localStorage.getItem('roles') || '';
//     try {
//       const parsed = JSON.parse(raw);
//       if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
//     } catch {}
//     return raw;
//   }, []);

//   const isAdmin = role === 'ROLE_ADMIN';

//   const [loading, setLoading] = useState(true);
//   const [overview, setOverview] = useState({ vendors: 0, plants: 0, materials: 0, lots: 0 });
//   const [statusCounts, setStatusCounts] = useState({ pending: 0, passed: 0, failed: 0 });

//   // NEW: keep the grouped data needed for tooltip
//   const [groupedByStatus, setGroupedByStatus] = useState({
//     Pending: [],
//     Passed: [],
//     Failed: [],
//   });

//   const [activities, setActivities] = useState([]);

//   const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

//   const normalizeStatus = (value) => {
//     if (!value) return 'Pending';
//     const v = String(value).trim().toUpperCase();
//     if (v === 'PENDING') return 'Pending';
//     if (v === 'PASS' || v === 'PASSED') return 'Passed';
//     if (v === 'REJECT' || v === 'REJECTED' || v === 'FAILED' || v === 'FAIL') return 'Failed';
//     return 'Pending';
//   };

//   // Helpers to safely read material name & inspected by across API variations
//   const getMaterialName = (lot) => {
//     const m =
//       (lot.material && (lot.material.name || lot.material.materialName)) ||
//       lot.materialName ||
//       lot.materialDes || // some APIs use description
//       lot.material_code || // just in case
//       '—';
//     return m;
//   };

//   const getInspectedBy = (lot) => {
//     // your data showed userName, also inspectedBy in your request
//     return lot.inspectedBy || lot.userName || lot.inspectorName || '—';
//   };

//   const mapActivityRow = (lot) => {
//     const date = lot.inspectionStartDate || lot.date || lot.createdAt || lot.updatedAt || null;
//     const lotNumber = lot.lotNo || lot.lotNumber || lot.lotId || lot.id || '—';
//     const materialName = getMaterialName(lot);
//     const uName = getInspectedBy(lot);
//     const status = normalizeStatus(lot.result);
//     return { date, lotNumber, materialName, status, uName };
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [vendorsRes, plantsRes, materialsRes, lotsRes] = await Promise.all([
//         axiosInstance.get('api/v1/vendor/all', { headers }),
//         axiosInstance.get('api/v1/plant/get-all', { headers }),
//         axiosInstance.get('api/v1/material/get-all', { headers }),
//         axiosInstance.get('api/v1/inspection/get-all-lots', { headers }),
//       ]);

//       const vendors = Array.isArray(vendorsRes.data) ? vendorsRes.data : vendorsRes.data?.data || [];
//       const plants = Array.isArray(plantsRes.data) ? plantsRes.data : plantsRes.data?.data || [];
//       const materials = Array.isArray(materialsRes.data) ? materialsRes.data : materialsRes.data?.data || [];
//       const lots = Array.isArray(lotsRes.data) ? lotsRes.data : lotsRes.data?.data || [];

//       setOverview({
//         vendors: vendors.length,
//         plants: plants.length,
//         materials: materials.length,
//         lots: lots.length,
//       });

//       // Compute counts and grouped lists for tooltip
//       let pending = 0, passed = 0, failed = 0;
//       const groups = { Pending: [], Passed: [], Failed: [] };

//       lots.forEach((lot) => {
//         const status = normalizeStatus(lot.result);
//         const entry = {
//           materialName: getMaterialName(lot),
//           inspectedBy: getInspectedBy(lot),
//           lotNumber: lot.lotNo || lot.lotNumber || lot.lotId || lot.id || '—',
//         };

//         if (status === 'Pending') {
//           pending += 1;
//           groups.Pending.push(entry);
//         } else if (status === 'Passed') {
//           passed += 1;
//           groups.Passed.push(entry);
//         } else if (status === 'Failed') {
//           failed += 1;
//           groups.Failed.push(entry);
//         } else {
//           pending += 1;
//           groups.Pending.push(entry);
//         }
//       });

//       setStatusCounts({ pending, passed, failed });
//       setGroupedByStatus(groups);

//       const sorted = [...lots].sort((a, b) => {
//         const ad = new Date(a.inspectionDate || a.date || a.createdAt || 0).getTime();
//         const bd = new Date(b.inspectionDate || b.date || b.createdAt || 0).getTime();
//         return bd - ad;
//       });
//       const recent = sorted.slice(0, 8).map(mapActivityRow);
//       setActivities(recent);
//     } catch (error) {
//       const msg =
//         error.response?.data?.errorMessage || error.message || 'Failed to load dashboard data';
//       toast.error(msg, { position: 'top-center' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const chartData = [
//     { name: 'Pending', count: statusCounts.pending, fill: '#60a5fa' },
//     { name: 'Passed',  count: statusCounts.passed,  fill: '#34d399' },
//     { name: 'Failed',  count: statusCounts.failed,  fill: '#f87171' },
//   ];

//   // === Custom tooltip component for Recharts ===
//   const StatusTooltip = ({ active, payload, label }) => {
//     // payload[0]?.payload contains the data object for the hovered bar
//     if (!active || !payload || !payload.length) return null;

//     const row = payload[0].payload; // { name, count, fill }
//     const status = row?.name || label || '';
//     const list = groupedByStatus[status] || [];

//     // Limit to show first N and indicate there are more
//     const MAX_ITEMS = 6;
//     const shown = list.slice(0, MAX_ITEMS);
//     const remaining = Math.max(0, list.length - shown.length);

//     return (
//       <div className="tt-root">
//         <div className="tt-title">{status}</div>
//         <div className="tt-count">Count: {row.count}</div>

//         {shown.length > 0 ? (
//           <div className="tt-list">
//             {shown.map((it, idx) => (
//               <div key={idx} className="tt-item">
//                 <div className="tt-line">
//                   <span className="tt-label">Material:</span>
//                   <span className="tt-value">{it.materialName}</span>
//                 </div>
//                 <div className="tt-line">
//                   <span className="tt-label">Inspected By:</span>
//                   <span className="tt-value">{it.inspectedBy}</span>
//                 </div>
//                 {/* Optional: lot number */}
//                 {/* <div className="tt-line">
//                   <span className="tt-label">Lot:</span>
//                   <span className="tt-value">{it.lotNumber}</span>
//                 </div> */}
//               </div>
//             ))}
//             {remaining > 0 && (
//               <div className="tt-more">+{remaining} more…</div>
//             )}
//           </div>
//         ) : (
//           <div className="tt-empty">No lots in this status</div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <div>
//           <h1>Material Inspection Management System</h1>
//         </div>
//         <div className="header-actions">
//           {isAdmin && (
//             <NavLink to="/inspectors" className="btn btn-primary">Manage Users</NavLink>
//           )}
//           <div className="avatar">{(localStorage.getItem('username') || 'U')[0].toUpperCase()}</div>
//         </div>
//       </div>

//       {/* Overview cards */}
//       <section className="overview-grid">
//         <div className="card stat-card clickable" onClick={() => navigate('/vendor-list')} role="button">
//           <div className="stat-label">Vendors</div>
//           <div className="stat-value">{overview.vendors}</div>
//         </div>
//         <div className="card stat-card clickable" onClick={() => navigate('/plant-list')} role="button">
//           <div className="stat-label">Plants</div>
//           <div className="stat-value">{overview.plants}</div>
//         </div>
//         <div className="card stat-card clickable" onClick={() => navigate('/material-list')} role="button">
//           <div className="stat-label">Materials</div>
//           <div className="stat-value">{overview.materials}</div>
//         </div>
//         <div className="card stat-card clickable" onClick={() => navigate('/inspection-lot-list')} role="button">
//           <div className="stat-label">Inspection Lots</div>
//           <div className="stat-value">{overview.lots}</div>
//         </div>
//       </section>

//       {/* Status chart (Recharts) */}
//       <section className="card status-card">
//         <div className="section-title">Inspection Status</div>
//         {loading ? (
//           <div className="skeleton skeleton-graph" />
//         ) : (
//           <div className="chart-wrap">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={chartData}
//                 layout="vertical"
//                 margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" allowDecimals={false} />
//                 <YAxis type="category" dataKey="name" width={80} />
//                 {/* use custom content for Tooltip */}
//                 <Tooltip
//                   cursor={{ fill: 'rgba(2,8,23,0.04)' }}
//                   content={<StatusTooltip />}
//                   wrapperStyle={{ zIndex: 9999 }}
//                 />
//                 <Bar dataKey="count" radius={[6, 6, 6, 6]}>
//                   {chartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.fill} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };