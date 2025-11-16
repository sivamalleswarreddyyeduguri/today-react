import React, { useEffect, useState } from "react";
import {
  LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer,
} from "recharts";
import "../../styles/VendorDashboard.css";
import axiosInstance from "../shared/axiosInstance";
import Logout from "../../auth/Logout";

export default function VendorDashboard() {
  const [analytics, setAnalytics] = useState({
    statusSummary: null,              // { total, passed, failed, pending }
    passFailTrend: [],                // [{ month, passed, failed }]
    materialQuality: [],              // [{ materialName, passPercentage }]
    characteristicFailures: [],       // [{ characteristicName, failureCount }]
    lotsOverTime: [],                 // [{ month, lotCount }]
    avgInspectionDuration: [],        // [{ month, avgDays }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const vendorId = 5001;

  // Colors chosen to match the screenshot
  const COLORS = {
    blue: "#4E79A7",        // bars (Material & Lots), pie "Passed"
    green: "#59A14F",       // line Passed, inspection line
    red: "#E15759",         // line Failed, pie "Fail"
    orange: "#F28E2B",      // bars for characteristic failures
    teal: "#76B7B2",        // secondary teal (not heavily used)
    grayBorder: "#E5E7EB",  // panel border
    grid: "#f0f0f0",        // chart grid lines
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchVendorAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchVendorAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = { Authorization: `Bearer ${token}` };

      const [
        statusSummaryRes,
        passFailTrendRes,
        materialQualityRes,
        characteristicFailuresRes,
        lotsOverTimeRes,
        avgDurationRes
      ] = await Promise.all([
        axiosInstance.get(`/api/v1/vendor/analytics/${vendorId}/status-summary`, { headers }),
        axiosInstance.get(`/api/v1/vendor/analytics/${vendorId}/pass-fail-trend`, { headers }),
        axiosInstance.get(`/api/v1/vendor/analytics/${vendorId}/material-quality`, { headers }),
        axiosInstance.get(`/api/v1/vendor/analytics/${vendorId}/characteristic-failures`, { headers }),
        axiosInstance.get(`/api/v1/vendor/analytics/${vendorId}/lots-over-time`, { headers }),
        axiosInstance.get(`/api/v1/vendor/analytics/${vendorId}/avg-inspection-duration`, { headers }),
      ]);

      // 1) Status summary → add total
      const ss = statusSummaryRes.data || { passed: 0, failed: 0, pending: 0 };
      const statusSummary = {
        total: Number(ss.passed || 0) + Number(ss.failed || 0) + Number(ss.pending || 0),
        passed: Number(ss.passed || 0),
        failed: Number(ss.failed || 0),
        pending: Number(ss.pending || 0),
      };

      // 2) Pass/Fail Trend
      const passFailTrend = (passFailTrendRes.data || []).map((item) => ({
        month: item.month,
        passed: Number(item.passed || 0),
        failed: Number(item.failed || 0),
      }));

      // 3) Material Quality → passRate (0..1?) to passPercentage (0..100)
      const materialQuality = (materialQualityRes.data || []).map((m) => {
        const rate = Number(m.passRate ?? 0);
        // If your backend already returns percent (0..100), replace the next line with: const percent = rate;
        const percent = rate <= 1 ? rate * 100 : rate;
        return {
          materialName: m.materialName,
          passPercentage: Number(percent.toFixed(0)), // integer for a clean bar label look
        };
      });

      // 4) Characteristic Failures
      const characteristicFailures = (characteristicFailuresRes.data || []).map((c) => ({
        characteristicName: c.characteristic,
        failureCount: Number(c.failures || 0),
      }));

      // 5) Lots Over Time
      const lotsOverTime = (lotsOverTimeRes.data || []).map((l) => ({
        month: l.month,
        lotCount: Number(l.count || 0),
      }));

      // 6) Average Inspection Duration — map backend DTO → chart keys
      const avgInspectionDuration = (avgDurationRes.data || []).map((d) => ({
        month: d.month,                                  // "YYYY-MM"
        avgDays: Number(d.avgDurationDays ?? 0),         // numeric series key the chart uses
      }));

      setAnalytics({
        statusSummary,
        passFailTrend,
        materialQuality,
        characteristicFailures,
        lotsOverTime,
        avgInspectionDuration, // ✅ use mapped data (not [])
      });
    } catch (err) {
      console.error("Vendor analytics fetch error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load vendor analytics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Pie segments for Lot Status Summary
  const pieData = analytics.statusSummary
    ? [
        { name: "Passed", value: analytics.statusSummary.passed, color: COLORS.blue },
        { name: "Fail", value: analytics.statusSummary.failed, color: COLORS.red },
        { name: "Pending", value: analytics.statusSummary.pending, color: COLORS.orange },
      ]
    : [];

  // Helper: format month like "2025-11" -> "Nov" (for axis)
  const formatMonthShort = (m) => {
    if (!m) return "";
    const parts = m.split("-");
    if (parts.length === 2) {
      const monthNum = parseInt(parts[1], 10);
      const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return names[monthNum - 1] || m;
    }
    return m.length > 3 ? m.slice(0,3) : m;
  };

  return (
    <div className="vd-container">
      {/* Header */}
      <div className="vd-top">
        <h2 className="vd-title">VENDOR DASHBOARD</h2>
        <Logout />
      </div>

      {/* Loading / Error */}
      {loading && <div className="vd-info">Loading analytics…</div>}
      {!loading && error && <div className="vd-error">{error}</div>}

      {/* Grid: 2 rows × 3 columns */}
      <div className="vd-grid">
        {/* Lot Status Summary (Pie) */}
        <div className="vd-panel">
          <div className="vd-panel-title">Lot Status Summary</div>
          {analytics.statusSummary ? (
            <div className="vd-panel-body">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="45%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    label={({ percent }) => `${Math.round(percent * 100)}%`}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="vd-empty">No status summary available.</div>
          )}
        </div>

        {/* Pass/Fail Trend (Line) */}
        <div className="vd-panel">
          <div className="vd-panel-title">Pass/Fail Trend</div>
          <div className="vd-axis-labels">
            <span className="vd-ylabel">Number of lots</span>
            <span className="vd-xlabel">Month</span>
          </div>
          {analytics.passFailTrend.length > 0 ? (
            <div className="vd-panel-body">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={analytics.passFailTrend}>
                  <CartesianGrid stroke={COLORS.grid} />
                  <XAxis dataKey="month" tickFormatter={formatMonthShort} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="passed" name="Passed" stroke={COLORS.green} strokeWidth={3} dot />
                  <Line type="monotone" dataKey="failed" name="Fail" stroke={COLORS.red} strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="vd-empty">No trend data available.</div>
          )}
        </div>

        {/* Material-Wise Quality (Bar) */}
        <div className="vd-panel">
          <div className="vd-panel-title">Material-Wise Quality</div>
          <div className="vd-axis-labels">
            <span className="vd-ylabel">Pass Rate</span>
          </div>
          {analytics.materialQuality.length > 0 ? (
            <div className="vd-panel-body">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics.materialQuality}>
                  <CartesianGrid stroke={COLORS.grid} />
                  <XAxis dataKey="materialName" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="passPercentage" name="Pass Rate" fill={COLORS.blue} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="vd-empty">No material quality data available.</div>
          )}
        </div>

        {/* Characteristic Failures (Bar - orange) */}
        <div className="vd-panel">
          <div className="vd-panel-title">Characteristic Failures</div>
          <div className="vd-axis-labels">
            <span className="vd-ylabel">Failure Count</span>
          </div>
          {analytics.characteristicFailures.length > 0 ? (
            <div className="vd-panel-body">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics.characteristicFailures}>
                  <CartesianGrid stroke={COLORS.grid} />
                  <XAxis dataKey="characteristicName" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="failureCount" name="Failures" fill={COLORS.orange} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="vd-empty">No characteristic failures recorded.</div>
          )}
        </div>

        {/* Lots Over Time (Bar - blue) */}
        <div className="vd-panel">
          <div className="vd-panel-title">Lots Over Time</div>
          <div className="vd-axis-labels">
            <span className="vd-ylabel">Number of lots</span>
          </div>
          {analytics.lotsOverTime.length > 0 ? (
            <div className="vd-panel-body">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics.lotsOverTime}>
                  <CartesianGrid stroke={COLORS.grid} />
                  <XAxis dataKey="month" tickFormatter={formatMonthShort} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="lotCount" name="Lots" fill={COLORS.blue} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="vd-empty">No lots data available.</div>
          )}
        </div>

        {/* Average Inspection Duration (Line - green) */}
        <div className="vd-panel">
          <div className="vd-panel-title">Average Inspection Duration</div>
          <div className="vd-axis-labels">
            <span className="vd-ylabel">Average Inspection Days</span>
            <span className="vd-xlabel">Month</span>
          </div>
          {analytics.avgInspectionDuration.length > 0 ? (
            <div className="vd-panel-body">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={analytics.avgInspectionDuration}>
                  <CartesianGrid stroke={COLORS.grid} />
                  <XAxis dataKey="month" tickFormatter={formatMonthShort} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgDays" name="Avg Days" stroke={COLORS.green} strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="vd-empty">Average inspection data not available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
