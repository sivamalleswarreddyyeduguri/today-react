// src/components/InspectionLot/LotStatusDashboard.jsx
import React, { useState } from 'react';
import axiosInstance from '../shared/axiosInstance';
import './lot-status.css'; // create the CSS below

const STATUS = {
  PASS: 'PASS',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
};

const StatusBox = ({ label, count, active, color, onClick, loading }) => {
  return (
    <div
      className={`status-box ${active ? 'active' : ''}`}
      style={{ '--accent': color }}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="status-box-bg" />
      <div className="status-box-content">
        <span className="status-title">{label}</span>
        <span className="status-count">{loading ? '...' : count ?? '-'}</span>
      </div>
      <div className="status-glow" />
    </div>
  );
};

const LotCard = ({ lot }) => {
  const {
    lotId,
    creationDate,
    inspectionStartDate,
    inspectionEndDate,
    result,
    remarks,
    userName,
  } = lot;

  const badgeClass =
    result === STATUS.PASS
      ? 'badge-pass'
      : result === STATUS.PENDING
      ? 'badge-pending'
      : 'badge-rejected';

  return (
    <div className="lot-card">
      <div className="lot-card-header">
        <h4>Lot #{lotId}</h4>
        <span className={`badge ${badgeClass}`}>{result}</span>
      </div>
      <div className="lot-card-body">
        <div className="row">
          <div>
            <label>Created On</label>
            <div>{creationDate || '-'}</div>
          </div>
          <div>
            <label>Start Date</label>
            <div>{inspectionStartDate || '-'}</div>
          </div>
          <div>
            <label>End Date</label>
            <div>{inspectionEndDate || '-'}</div>
          </div>
        </div>
        <div className="row">
          <div className="remarks">
            <label>Remarks</label>
            <div title={remarks || ''}>
              {remarks ? remarks : <em>No remarks</em>}
            </div>
          </div>
          <div className="user">
            <label>User</label>
            <div>{userName || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LotStatusDashboard = () => {
  const [activeStatus, setActiveStatus] = useState(null); // PASS | PENDING | REJECTED
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Store separated lists once fetched
  const [passLots, setPassLots] = useState([]);
  const [pendingLots, setPendingLots] = useState([]);
  const [rejectedLots, setRejectedLots] = useState([]);

  const counts = {
    [STATUS.PASS]: passLots.length,
    [STATUS.PENDING]: pendingLots.length,
    [STATUS.REJECTED]: rejectedLots.length,
  };

  const fetchAndSplit = async (statusToActivate) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axiosInstance.get(
        'http://localhost:8020/api/v1/inspection/get-all-lots'
      );

      // Normalize and split
      const normalized = Array.isArray(data)
        ? data.map((d) => ({
            lotId: d.lotId,
            creationDate: d.creationDate,
            inspectionStartDate: d.inspectionStartDate,
            inspectionEndDate: d.inspectionEndDate,
            result: (d.result || '').toUpperCase(),
            remarks: d.remarks,
            userName: d.userName,
          }))
        : [];

      setPassLots(normalized.filter((l) => l.result === STATUS.PASS));
      setPendingLots(normalized.filter((l) => l.result === STATUS.PENDING));
      setRejectedLots(normalized.filter((l) => l.result === STATUS.REJECTED));

      setActiveStatus(statusToActivate);
    } catch (err) {
      console.error('Failed to fetch lots:', err);
      setError('Failed to fetch lots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const displayed =
    activeStatus === STATUS.PASS
      ? passLots
      : activeStatus === STATUS.PENDING
      ? pendingLots
      : activeStatus === STATUS.REJECTED
      ? rejectedLots
      : [];

  return (
    <div className="lot-status-dashboard">
      <div className="status-boxes">
        <StatusBox
          label="PASS"
          color="#22c55e" // green
          count={counts[STATUS.PASS]}
          active={activeStatus === STATUS.PASS}
          onClick={() => fetchAndSplit(STATUS.PASS)}
          loading={loading && activeStatus === STATUS.PASS}
        />
        <StatusBox
          label="PENDING"
          color="#f59e0b" // amber
          count={counts[STATUS.PENDING]}
          active={activeStatus === STATUS.PENDING}
          onClick={() => fetchAndSplit(STATUS.PENDING)}
          loading={loading && activeStatus === STATUS.PENDING}
        />
        <StatusBox
          label="REJECTED"
          color="#ef4444" // red
          count={counts[STATUS.REJECTED]}
          active={activeStatus === STATUS.REJECTED}
          onClick={() => fetchAndSplit(STATUS.REJECTED)}
          loading={loading && activeStatus === STATUS.REJECTED}
        />
      </div>

      {error && <div className="error">{error}</div>}

      {activeStatus && (
        <div className="cards-section">
          <div className="cards-header">
            <h3>
              {activeStatus} Lots ({displayed.length})
            </h3>
          </div>

          {loading ? (
            <div className="loader">Loading...</div>
          ) : displayed.length === 0 ? (
            <div className="empty">No lots found for {activeStatus}.</div>
          ) : (
            <div className="cards-grid">
              {displayed.map((lot) => (
                <LotCard key={lot.lotId} lot={lot} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LotStatusDashboard;