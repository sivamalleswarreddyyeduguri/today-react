// import React, { useEffect, useMemo, useState } from 'react';
// import axiosInstance from '../shared/axiosInstance';
// import '../../styles/material-graph.css';

// const PASS_COLOR = '#22c55e';
// const FAIL_COLOR = '#ef4444';
// const SPEC_COLOR = '#cbd5e1';

// function evaluateFail(actualUpper, actualLower, reqUpper, reqLower) {
//   return (
//     actualUpper > reqUpper ||
//     actualUpper < reqLower ||
//     actualLower < reqLower ||
//     actualLower > reqUpper
//   );
// }

// export default function MaterialGraph({ lotId, onClose }) {
//   const [data, setData] = useState([]);
//   const [materialDes, setMaterialDes] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const res = await axiosInstance.get(
//           'http://localhost:8020/api/v1/inspection/lot/actu',
//           { params: { id: lotId } }
//         );
//         const json = res.data;

//         const enriched = (Array.isArray(json) ? json : []).map((item) => {
//           const reqLower = Number(item.lowerToleranceLimit ?? 0);
//           const reqUpper = Number(item.upperToleranceLimit ?? 0);
//           const actualLower = Number(item.actualLtl ?? 0);
//           const actualUpper = Number(item.actualUtl ?? 0);
//           const fail = evaluateFail(actualUpper, actualLower, reqUpper, reqLower);

//           return {
//             ...item,
//             lowerToleranceLimit: reqLower,
//             upperToleranceLimit: reqUpper,
//             actualLtl: actualLower,
//             actualUtl: actualUpper,
//             fail,
//             specPadFiller: reqLower,
//             specRange: Math.max(0, reqUpper - reqLower),
//             actualPadFiller: Math.min(actualLower, actualUpper),
//             actualRange: Math.max(0, Math.abs(actualUpper - actualLower)),
//           };
//         });

//         if (mounted) {
//           setMaterialDes(enriched[0]?.materialDes ?? '');
//           setData(enriched);
//         }
//       } catch (err) {
//         if (mounted) setError(err.message || 'Failed to load');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [lotId]);

//   const { passCount, failCount } = useMemo(() => {
//     const fail = data.filter((d) => d.fail).length;
//     const pass = data.length - fail;
//     return { passCount: pass, failCount: fail };
//   }, [data]);

//   // Normalize X so spec/actual bands can be placed proportionally
//   const xMax = useMemo(() => {
//     const vals = data.flatMap((d) => [
//       d.upperToleranceLimit,
//       d.actualUtl,
//       d.lowerToleranceLimit,
//       d.actualLtl,
//     ]);
//     const max = vals.length ? Math.max(0, ...vals) : 0;
//     return Math.ceil(max + max * 0.1); // headroom
//   }, [data]);

//   const total = Math.max(1, passCount + failCount);
//   const passPct = Math.round((passCount / total) * 100);
//   const failPct = 100 - passPct;

//   const pieStyle = {
//     '--pass': `${passPct}%`,
//     '--fail': `${failPct}%`,
//     '--passColor': PASS_COLOR,
//     '--failColor': FAIL_COLOR,
//   };

//   const toPct = (val) =>
//     xMax === 0 ? 0 : Math.max(0, Math.min(100, (val / xMax) * 100));

//   return (
//     <div className="mg-root">
//       <div className="mg-header">
//         <div>
//           <h2 className="mg-title">Material Inspection — Lot #{lotId}</h2>
//           {materialDes && (
//             <p className="mg-subtitle">
//               Material: <span className="mg-subtitle-strong">{materialDes}</span>
//             </p>
//           )}
//         </div>
//         {onClose && (
//           <button type="button" onClick={onClose} className="mg-close-btn">
//             Close
//           </button>
//         )}
//       </div>

//       {loading && <div className="mg-info">Loading…</div>}
//       {error && <div className="mg-error">Error: {error}</div>}
//       {!loading && !error && data.length === 0 && (
//         <div className="mg-info">No data found for lot #{lotId}.</div>
//       )}

//       {!loading && !error && data.length > 0 && (
//         <div className="mg-content">
//           {/* LEFT: Pie */}
//           <div className="mg-pie-card">
//             <div className="mg-card-title">Characteristics: Passed vs Failed</div>
//             <div className="mg-pie-wrapper">
//               <div className="mg-pie" style={pieStyle} />
//               <div className="mg-pie-legend">
//                 <div className="mg-legend-row">
//                   <span className="mg-dot" style={{ background: PASS_COLOR }} />
//                   <span>PASS</span>
//                   <span className="mg-legend-pct">{passPct}%</span>
//                 </div>
//                 <div className="mg-legend-row">
//                   <span className="mg-dot" style={{ background: FAIL_COLOR }} />
//                   <span>FAIL</span>
//                   <span className="mg-legend-pct">{failPct}%</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: Horizontal Bars */}
//           <div className="mg-bars-card">
//             <div className="mg-card-title">
//               Characteristics Status (green = PASS, red = FAIL)
//             </div>

//             <div className="mg-bars">
//               {data.map((d, idx) => {
//                 const barColor = d.fail ? FAIL_COLOR : PASS_COLOR;

//                 const specLeftPct = toPct(d.lowerToleranceLimit);
//                 const specRightPct = toPct(d.upperToleranceLimit);
//                 const specWidthPct = Math.max(0, specRightPct - specLeftPct);

//                 const actualLeftPct = toPct(Math.min(d.actualLtl, d.actualUtl));
//                 const actualRightPct = toPct(Math.max(d.actualLtl, d.actualUtl));
//                 const actualWidthPct = Math.max(0, actualRightPct - actualLeftPct);

//                 const labelLeft = d.characteristicDesc || d.parameterName || `Characteristic ${idx + 1}`;
//                 const statusText = d.fail ? 'FAIL' : 'PASS';
//                 const infoText = `${statusText}  •  Actual: ${Number.isFinite(d.actualUtl) ? d.actualUtl : '-'} (Spec: ${d.lowerToleranceLimit} – ${d.upperToleranceLimit})`;

//                 return (
//                   <div className="mg-row" key={idx}>
//                     <div className="mg-row-label" title={labelLeft}>
//                       {labelLeft}
//                     </div>

//                     <div className="mg-bar-wrap">
//                       {/* Whole status color */}
//                       <div className="mg-bar-bg" style={{ background: barColor }} />

//                       {/* Spec band (light gray) */}
//                       <div
//                         className="mg-spec-band"
//                         style={{
//                           left: `${specLeftPct}%`,
//                           width: `${specWidthPct}%`,
//                           background: SPEC_COLOR,
//                         }}
//                         title={`Spec: ${d.lowerToleranceLimit} – ${d.upperToleranceLimit}`}
//                       />

//                       {/* Actual band (darker overlay) */}
//                       <div
//                         className="mg-actual-band"
//                         style={{
//                           left: `${actualLeftPct}%`,
//                           width: `${actualWidthPct}%`,
//                         }}
//                         title={`Actual: ${d.actualLtl} – ${d.actualUtl}`}
//                       />

//                       {/* axis tick at start for visual parity */}
//                       <div className="mg-axis-origin" />

//                       {/* Inline status text over the bar */}
//                       <div className="mg-bar-text">
//                         {infoText}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '../shared/axiosInstance';
import '../../styles/material-graph.css';

const PASS_COLOR = '#22c55e';
const FAIL_COLOR = '#ef4444';
const SPEC_COLOR = '#cbd5e1';

function evaluateFail(actualUpper, actualLower, reqUpper, reqLower) {
  return (
    actualUpper > reqUpper ||
    actualUpper < reqLower ||
    actualLower < reqLower ||
    actualLower > reqUpper
  );
}

// Optional formatting helpers
const fmt = (v, digits = 2) => (Number.isFinite(v) ? Number(v).toFixed(digits) : '-');
const UNIT = ''; // e.g., ' mm', ' HV', etc.

export default function MaterialGraph({ lotId, onClose }) {
  const [data, setData] = useState([]);
  const [materialDes, setMaterialDes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // === Pie hover tooltip state ===
  const [hover, setHover] = useState(null); // { kind: 'pass'|'fail', x, y }
  const pieRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get(
          'http://localhost:8020/api/v1/inspection/lot/actu',
          { params: { id: lotId } }
        );
        const json = res.data;

        const enriched = (Array.isArray(json) ? json : []).map((item) => {
          const reqLower = Number(item.lowerToleranceLimit ?? 0);
          const reqUpper = Number(item.upperToleranceLimit ?? 0);
          const actualLower = Number(item.actualLtl ?? 0);
          const actualUpper = Number(item.actualUtl ?? 0);
          const fail = evaluateFail(actualUpper, actualLower, reqUpper, reqLower);

          // Normalize (in case API returns inverted limits)
          const [specL, specU] = reqLower <= reqUpper ? [reqLower, reqUpper] : [reqUpper, reqLower];
          const [actL, actU] = actualLower <= actualUpper ? [actualLower, actualUpper] : [actualUpper, actualLower];

          return {
            ...item,
            lowerToleranceLimit: specL,
            upperToleranceLimit: specU,
            actualLtl: actL,
            actualUtl: actU,
            fail,
            specPadFiller: specL,
            specRange: Math.max(0, specU - specL),
            actualPadFiller: Math.min(actL, actU),
            actualRange: Math.max(0, Math.abs(actU - actL)),
          };
        });

        if (mounted) {
          setMaterialDes(enriched[0]?.materialDes ?? '');
          setData(enriched);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lotId]);

  const { passCount, failCount } = useMemo(() => {
    const fail = data.filter((d) => d.fail).length;
    const pass = data.length - fail;
    return { passCount: pass, failCount: fail };
  }, [data]);

  // Normalize X so spec/actual bands can be placed proportionally
  const xMax = useMemo(() => {
    const vals = data.flatMap((d) => [
      d.upperToleranceLimit,
      d.actualUtl,
      d.lowerToleranceLimit,
      d.actualLtl,
    ]);
    const max = vals.length ? Math.max(0, ...vals) : 0;
    return Math.ceil(max + max * 0.1); // headroom
  }, [data]);

  const total = Math.max(1, passCount + failCount);
  const passPct = Math.round((passCount / total) * 100);
  const failPct = 100 - passPct;

  const pieStyle = {
    '--pass': `${passPct}%`,
    '--fail': `${failPct}%`,
    '--passColor': PASS_COLOR,
    '--failColor': FAIL_COLOR,
  };

  const toPct = (val) =>
    xMax === 0 ? 0 : Math.max(0, Math.min(100, (val / xMax) * 100));

  // === Hover detection over the pie (conic gradient) ===
  const handlePieMove = (e) => {
    const el = pieRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const mx = e.clientX;
    const my = e.clientY;

    const dx = mx - cx;
    const dy = my - cy;

    const r = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(rect.width, rect.height) / 2;

    // Only if pointer is inside the circle
    if (r > radius) {
      setHover(null);
      return;
    }

    // 0° at 12 o'clock, clockwise 0..360
    let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI); // -180..180, 0 at 3 o'clock
    angleDeg = (angleDeg + 90 + 360) % 360;              // shift to 12 o'clock

    const passAngle = passPct * 3.6; // degrees of the pass slice (starts at 12 o'clock)
    const kind = angleDeg < passAngle ? 'pass' : 'fail';

    const wrapperRect = el.parentElement.getBoundingClientRect();
    setHover({
      kind,
      x: mx - wrapperRect.left,
      y: my - wrapperRect.top,
    });
  };
  const handlePieLeave = () => setHover(null);

  return (
    <div className="mg-root">
      <div className="mg-header">
        <div>
          <h2 className="mg-title">Material Inspection — Lot #{lotId}</h2>
          {materialDes && (
            <p className="mg-subtitle">
              Material: <span className="mg-subtitle-strong">{materialDes}</span>
            </p>
          )}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="mg-close-btn">
            Close
          </button>
        )}
      </div>

      {loading && <div className="mg-info">Loading…</div>}
      {error && <div className="mg-error">Error: {error}</div>}
      {!loading && !error && data.length === 0 && (
        <div className="mg-info">No data found for lot #{lotId}.</div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="mg-content">
          {/* LEFT: Pie */}
          <div className="mg-pie-card">
            <div className="mg-card-title">Characteristics: Passed vs Failed</div>
            <div className="mg-pie-wrapper" onMouseLeave={handlePieLeave}>
              <div
                ref={pieRef}
                className="mg-pie"
                style={pieStyle}
                onMouseMove={handlePieMove}
                role="img"
                aria-label={`Pass ${passPct} percent, Fail ${failPct} percent`}
              />

              {/* Legend (optional) */}
              <div className="mg-pie-legend">
                <div className="mg-legend-row">
                  <span className="mg-dot" style={{ background: PASS_COLOR }} />
                  <span>PASS</span>
                  <span className="mg-legend-pct">{passPct}%</span>
                </div>
                <div className="mg-legend-row">
                  <span className="mg-dot" style={{ background: FAIL_COLOR }} />
                  <span>FAIL</span>
                  <span className="mg-legend-pct">{failPct}%</span>
                </div>
              </div>

              {/* Tooltip INSIDE the pie at the pointer location */}
              {hover && (
                <div
                  className={`mg-pie-tooltip ${
                    hover.kind === 'pass' ? 'mg-pie-tooltip-pass' : 'mg-pie-tooltip-fail'
                  }`}
                  style={{ left: hover.x, top: hover.y }}
                >
                  {hover.kind === 'pass' ? (
                    <>
                      <div>PASS</div>
                      <div className="mg-pie-tooltip-pct">{passPct}%</div>
                    </>
                  ) : (
                    <>
                      <div>FAIL</div>
                      <div className="mg-pie-tooltip-pct">{failPct}%</div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Horizontal Bars with SPEC ticks */}
          <div className="mg-bars-card">
            <div className="mg-card-title">
              Characteristics Status (green = PASS, red = FAIL)
            </div>

            <div className="mg-bars">
              {data.map((d, idx) => {
                const barColor = d.fail ? FAIL_COLOR : PASS_COLOR;

                const specLeftPct = toPct(d.lowerToleranceLimit);
                const specRightPct = toPct(d.upperToleranceLimit);
                const specWidthPct = Math.max(0, specRightPct - specLeftPct);

                const actualLeftPct = toPct(Math.min(d.actualLtl, d.actualUtl));
                const actualRightPct = toPct(Math.max(d.actualLtl, d.actualUtl));
                const actualWidthPct = Math.max(0, actualRightPct - actualLeftPct);

                const labelLeft =
                  d.characteristicDesc ||
                  d.characteristicName ||
                  d.parameterName ||
                  `Characteristic ${idx + 1}`;

                const statusText = d.fail ? 'FAIL' : 'PASS';
                const infoText = `${statusText}  •  Actual: ${fmt(d.actualUtl)}${UNIT} (Spec: ${fmt(d.lowerToleranceLimit)} – ${fmt(d.upperToleranceLimit)}${UNIT})`;

                // Optional: spec midpoint (target) line
                const specMidPct = toPct((d.lowerToleranceLimit + d.upperToleranceLimit) / 2);

                return (
                  <div className="mg-row" key={idx}>
                    <div className="mg-row-label" title={labelLeft}>
                      {labelLeft}
                    </div>

                    <div className="mg-bar-wrap">
                      {/* Full PASS/FAIL background */}
                      <div className="mg-bar-bg" style={{ background: barColor }} />

                      {/* Uniform grid ticks + horizontal midline (visual balance) */}
                      <div className="mg-gridlines" style={{ '--gridCount': 5 }} />
                      <div className="mg-midline" />

                      {/* SPEC band */}
                      <div
                        className="mg-spec-band"
                        style={{
                          left: `${specLeftPct}%`,
                          width: `${specWidthPct}%`,
                          background: SPEC_COLOR,
                        }}
                        title={`Spec: ${fmt(d.lowerToleranceLimit)} – ${fmt(d.upperToleranceLimit)}${UNIT}`}
                      />

                      {/* Actual band */}
                      <div
                        className="mg-actual-band"
                        style={{ left: `${actualLeftPct}%`, width: `${actualWidthPct}%` }}
                        title={`Actual: ${fmt(d.actualLtl)} – ${fmt(d.actualUtl)}${UNIT}`}
                      />

                      {/* Fixed origin on the left */}
                      <div className="mg-axis-origin" />

                      {/* === SPEC TICKS (exact LTL/UTL and midpoint) === */}
                      <div className="mg-spec-tick" style={{ left: `${specLeftPct}%` }} title={`Spec LTL: ${fmt(d.lowerToleranceLimit)}${UNIT}`} />
                      <div className="mg-spec-tick" style={{ left: `${specRightPct}%` }} title={`Spec UTL: ${fmt(d.upperToleranceLimit)}${UNIT}`} />
                      <div className="mg-spec-tick mg-spec-tick-mid" style={{ left: `${specMidPct}%` }} title={`Spec Mid: ${fmt((d.lowerToleranceLimit + d.upperToleranceLimit)/2)}${UNIT}`} />

                      {/* Optional numeric labels for LTL/UTL (above the bar) */}
                      <div className="mg-spec-label" style={{ left: `${specLeftPct}%` }}>
                        {fmt(d.lowerToleranceLimit)}
                      </div>
                      <div className="mg-spec-label" style={{ left: `${specRightPct}%` }}>
                        {fmt(d.upperToleranceLimit)}
                      </div>

                      {/* Text on the bar */}
                      <div className="mg-bar-text">{infoText}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}