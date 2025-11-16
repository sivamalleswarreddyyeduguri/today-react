// import { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axiosInstance from '../shared/axiosInstance';
// import '../../styles/dashboard.css';

// const Dashboard = () => {
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
//   const isInspector = role === 'ROLE_INSPECTOR';
//   const isUser = role === 'ROLE_USER';

//   const [loading, setLoading] = useState(true);
//   const [overview, setOverview] = useState({
//     vendors: 0,
//     plants: 0,
//     materials: 0,
//     lots: 0,
//   });

//   const [statusCounts, setStatusCounts] = useState({
//     pending: 0,
//     passed: 0,
//     failed: 0,
//   });

//   const [activities, setActivities] = useState([]); 

//   const headers = useMemo(
//     () => ({
//       Authorization: `Bearer ${token}`,
//     }),
//     [token]
//   );

//   const normalizeStatus = (value) => {
//     if (!value) return 'Pending';
//     const v = String(value).trim().toUpperCase();
//     if (v === 'PENDING') return 'Pending';
//     if (v === 'PASS' || v === 'PASSED') return 'Passed';
//     if (v === 'REJECT' || v === 'REJECTED' || v === 'FAILED' || v === 'FAIL') return 'Failed';
//     return 'Pending'; 
//   };

//   const mapActivityRow = (lot) => {
//     const date =
//       lot.inspectionStartDate ||
//       lot.date ||
//       lot.createdAt ||
//       lot.updatedAt ||
//       null;

//     const lotNumber =
//       lot.lotNo || lot.lotNumber || lot.lotId || lot.id || '—';

//     const materialName =
//       (lot.material && (lot.material.name || lot.material.materialName)) ||
//       lot.materialName ||
//       '—';

//     const status = normalizeStatus(lot.result);

//     return {
//       date,
//       lotNumber,
//       materialName,
//       status,
//     };
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
//         const ad = new Date(a.inspectionStartDate || a.date || a.createdAt || 0).getTime();
//         const bd = new Date(b.inspectionStartDate || b.date || b.createdAt || 0).getTime();
//         return bd - ad;
//       });
//       const recent = sorted.slice(0, 8).map(mapActivityRow);
//       setActivities(recent);
//     } catch (error) {
//       console.error(error);
//       const msg = error.response?.data?.errorMessage || error.message || 'Failed to load dashboard data';
//       toast.error(msg, { position: 'top-center' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const totalLots = overview.lots || 0;
//   const pct = (n) => (totalLots > 0 ? Math.round((n / totalLots) * 100) : 0);

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <div>
//           <h1>Material Inspection Management System</h1>
//           <p className="subheading">Overview & Activity</p>
//         </div>

//         <div className="header-actions">
//           {isAdmin && (
//             <button
//               className="btn btn-primary"
//               onClick={() => navigate('/inspectors')}
//               title="Manage Users"
//             >
//               Manage Users
//             </button>
//           )}
//           {/* Avatar bubble */}
//           <div className="avatar">
//             {(localStorage.getItem('username') || 'U')[0].toUpperCase()}
//           </div>
//         </div>
//       </div>

//       {/* Overview cards */}
//       <section className="overview-grid">
//         <div className="card stat-card">
//           <div className="stat-label">Vendors</div>
//           <div className="stat-value">{overview.vendors}</div>
//         </div>
//         <div className="card stat-card">
//           <div className="stat-label">Plants</div>
//           <div className="stat-value">{overview.plants}</div>
//         </div>
//         <div className="card stat-card">
//           <div className="stat-label">Materials</div>
//           <div className="stat-value">{overview.materials}</div>
//         </div>
//         <div className="card stat-card">
//           <div className="stat-label">Inspection Lots</div>
//           <div className="stat-value">{overview.lots}</div>
//         </div>
//       </section>

//       {/* Status graph */}
//       <section className="card status-card">
//         <div className="section-title">Inspection Status</div>

//         {loading ? (
//           <div className="skeleton skeleton-graph" />
//         ) : (
//           <>
//             <div className="status-row">
//               <span className="status-name">Pending</span>
//               <div className="status-bar">
//                 <div
//                   className="bar pending"
//                   style={{ width: `${pct(statusCounts.pending)}%` }}
//                 />
//               </div>
//               <span className="status-count">{statusCounts.pending}</span>
//             </div>

//             <div className="status-row">
//               <span className="status-name">Passed</span>
//               <div className="status-bar">
//                 <div
//                   className="bar passed"
//                   style={{ width: `${pct(statusCounts.passed)}%` }}
//                 />
//               </div>
//               <span className="status-count">{statusCounts.passed}</span>
//             </div>

//             <div className="status-row">
//               <span className="status-name">Failed</span>
//               <div className="status-bar">
//                 <div
//                   className="bar failed"
//                   style={{ width: `${pct(statusCounts.failed)}%` }}
//                 />
//               </div>
//               <span className="status-count">{statusCounts.failed}</span>
//             </div>

//             <div className="legend">
//               <span className="legend-item">
//                 <span className="legend-dot pending" /> Pending
//               </span>
//               <span className="legend-item">
//                 <span className="legend-dot passed" /> Passed
//               </span>
//               <span className="legend-item">
//                 <span className="legend-dot failed" /> Failed
//               </span>
//             </div>
//           </>
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
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {activities.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="no-data">No recent inspections</td>
//                   </tr>
//                 ) : (
//                   activities.map((row, idx) => (
//                     <tr key={idx}>
//                       <td>
//                         {row.date
//                           ? new Date(row.date).toLocaleDateString()
//                           : '—'}
//                       </td>
//                       <td>{row.lotNumber}</td>
//                       <td>{row.materialName}</td>
//                       <td>
//                         <span
//                           className={
//                             row.status === 'Passed'
//                               ? 'badge badge-success'
//                               : row.status === 'Failed'
//                               ? 'badge badge-danger'
//                               : 'badge badge-warning'
//                           }
//                         >
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

// export default Dashboard;