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
    } catch { }
    return raw;
  }, []);

  const isAdmin = role === 'ROLE_ADMIN';

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ vendors: 0, plants: 0, materials: 0, lots: 0 });
  const [statusCounts, setStatusCounts] = useState({ pending: 0, passed: 0, failed: 0 });
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

  const getMaterialName = (lot) => {
    const m =
      (lot.material && (lot.material.name || lot.material.materialName)) ||
      lot.materialName ||
      lot.materialDes ||
      lot.material_code ||
      '—';
    return m;
  };

  const getInspectedBy = (lot) => {
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
    { name: 'Passed', count: statusCounts.passed, fill: '#34d399' },
    { name: 'Failed', count: statusCounts.failed, fill: '#f87171' },
  ];

  const StatusTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const row = payload[0].payload;
    const status = row?.name || '';
    const list = groupedByStatus[status] || [];

    const MAX_ITEMS = 6;
    const shown = list.slice(0, MAX_ITEMS);
    const remaining = Math.max(0, list.length - shown.length);

    return (
      <div className="p-2 border bg-white shadow-sm" style={{ minWidth: '220px' }}>
        <div className="fw-bold mb-1">{status}</div>
        <div className="mb-2">Count: {row.count}</div>

        {shown.length > 0 ? (
          <div>
            {shown.map((it, idx) => (
              <div key={idx} className="mb-2">
                <div><strong>Material:</strong> {it.materialName}</div>
                <div><strong>Inspected By:</strong> {it.inspectedBy}</div>
              </div>
            ))}
            {remaining > 0 && <div className="text-muted">+{remaining} more…</div>}
          </div>
        ) : (
          <div className="text-muted fst-italic">No lots in this status</div>
        )}
      </div>
    );
  };

  return (
    <div className="container-fluid">
      {/* Dashboard Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom mb-4 ">
        <h1 className="h3 m-0">Material Inspection Management System</h1>
        <div className="d-flex align-items-center">
          {isAdmin && (
            <NavLink to="/home/inspectors" className="btn btn-primary me-3">
              Manage Users
            </NavLink>
          )}
          <div
            className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
            style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}
          >
            {(localStorage.getItem('username') || 'U')[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="row row-cols-1 row-cols-md-4 g-4 mb-4">
        <div className="col">
          <div className="card h-100 clickable show-card" role="button" onClick={() => navigate('/home/vendor-list')}>
            <div className="card-body text-center">
              <h5 className="card-title">Vendors</h5>
              <p className="display-6 m-0">{overview.vendors}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 clickable show-card" role="button" onClick={() => navigate('/home/plant-list')}>
            <div className="card-body text-center">
              <h5 className="card-title">Plants</h5>
              <p className="display-6 m-0">{overview.plants}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 clickable show-card" role="button" onClick={() => navigate('/home/material-list')}>
            <div className="card-body text-center">
              <h5 className="card-title">Materials</h5>
              <p className="display-6 m-0">{overview.materials}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 clickable show-card" role="button" onClick={() => navigate('/home/inspection-lot-list')}>
            <div className="card-body text-center">
              <h5 className="card-title">Inspection Lots</h5>
              <p className="display-6 m-0">{overview.lots}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Chart */}
      <div className="card mb-4">
        <div className="card-header">Inspection Status</div>
        <div className="card-body" style={{ height: '300px' }}>
          {loading ? (
            <div className="bg-light rounded w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={80} />
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
          )}
        </div>
      </div>

      {/* Activities Table */}
      <div className="card">
        <div className="card-header">Inspection Activities</div>
        <div className="card-body p-0">
          <table className="table table-hover m-0">
            <thead className="table-light">
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
                <tr>
                  <td colSpan={5} className="text-center py-3">No recent inspections</td>
                </tr>
              ) : (
                activities.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.date ? new Date(row.date).toLocaleDateString() : '—'}</td>
                    <td>{row.lotNumber}</td>
                    <td>{row.materialName}</td>
                    <td>{row.uName}</td>
                    <td>
                      <span className={`badge ${
                        row.status === 'Passed' ? 'bg-success' :
                          row.status === 'Failed' ? 'bg-danger' :
                            'bg-warning text-dark'
                        }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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
    } catch { }
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
    <div className="d-flex ">
      {/* Sidebar */}
      <div className="d-flex flex-column vh-100 p-3 fixed-sidebar text-white" style={{ width: '280px' }}>
        <h2 className="fs-4 mb-4">{(localStorage.getItem('username') || 'User') + ' DashBoard'}</h2>

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item ">
            <NavLink to="/home" end className={({ isActive }) => `nav-link ${isActive ? 'active' : 'text-dark'}`}>
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item ">
            <NavLink to="/home/profile" className={({ isActive }) => `nav-link d-flex align-items-center ${isActive ? 'active' : 'text-dark'}`}>
              <FaUserCircle className="me-2" />
              Profile
              <span className="badge bg-secondary ms-auto rounded-circle" title={adminDetails.username || 'User'}>
                {avatarInitial}
              </span>
            </NavLink>
          </li>

          {!hideUsers && (
            <li className="nav-item ">
              <NavLink
                to="/home/inspectors"
                className={({ isActive }) => `nav-link d-flex align-items-center ${isActive ? 'active' : 'text-dark'} ${disableUsers ? 'disabled' : ''}`}
                onClick={(e) => { if (disableUsers) e.preventDefault(); }}
                aria-disabled={disableUsers ? 'true' : 'false'}
                tabIndex={disableUsers ? -1 : 0}
                style={disableUsers ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
              >
                <FaUser className="me-2" /> Users
              </NavLink>
            </li>
          )}

        <li className="nav-item ">
            <NavLink to="/home/vendor-list" className={({ isActive }) => `nav-link d-flex align-items-center ${isActive ? 'active' : 'text-dark'}`}>
              <FaIndustry className="me-2" /> Vendor
            </NavLink>
          </li>

          <li className="nav-item ">
            <NavLink to="/home/plant-list" className={({ isActive }) => `nav-link d-flex align-items-center ${isActive ? 'active' : 'text-dark'}`}>
              <FaWarehouse className="me-2" /> Plant
            </NavLink>
          </li>

          {!hideMaterial && (
            <li className="nav-item ">
              <NavLink to="/home/material-list" className={({ isActive }) => `nav-link d-flex align-items-center ${isActive ? 'active' : 'text-dark'}`}>
                <FaCubes className="me-2" /> Material
              </NavLink>
            </li>
          )}

          {!hideInspectionLot && (
            <li className="nav-item ">
              <NavLink to="/home/inspection-lot-list" className={({ isActive }) => `nav-link d-flex align-items-center ${isActive ? 'active' : 'text-dark'}`}>
                <FaClipboardList className="me-2" /> Inspection Lot
              </NavLink>
            </li>
          )}
        </ul>

        <div
  role="button"
  tabIndex={0}
  onClick={handleLogout}
  className="logout-button"
>
  <FaSignOutAlt /> <div className='ms-3'>Log Out</div>
</div>

      </div>

      {/* Right-side content container */}
      <div className="flex-grow-1 p-4 scrollable-content" >
        <Outlet />
      </div>

      <ToastContainer />
    </div >
  );
};

export default Layout;
