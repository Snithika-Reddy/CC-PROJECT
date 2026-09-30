import { formatMetricName, getMetricUnit } from '../charts/chartManager.js';
import { calculateStats, calculateDelta } from '../analytics/statistics.js';

/**
 * Section 8: Cross-Architecture Analysis (x86-64 vs. ARM64).
 * Compares execution models across processor microarchitectures with explicit hardware context.
 */

export function renderCrossArchitecture(containerId, store, chartManager) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentMetric = store.filters.metric;
  const unit = getMetricUnit(currentMetric);
  const aggMode = store.filters.aggMode;

  const runtimes = ['Native', 'Docker / OCI', 'WebAssembly'];
  const allRecords = store.getFilteredRecords({ architecture: 'ALL' });

  // Calculate comparison rows
  const comparisonRows = runtimes.map(rt => {
    const x86Recs = allRecords.filter(r => r.runtime === rt && r.architecture === 'x86-64');
    const armRecs = allRecords.filter(r => r.runtime === rt && r.architecture === 'ARM64');

    const x86Vals = x86Recs.map(r => r[currentMetric]).filter(v => v !== null && v !== undefined);
    const armVals = armRecs.map(r => r[currentMetric]).filter(v => v !== null && v !== undefined);

    const x86Stats = calculateStats(x86Vals);
    const armStats = calculateStats(armVals);

    const x86Val = aggMode === 'median' ? x86Stats.median : x86Stats.mean;
    const armVal = aggMode === 'median' ? armStats.median : armStats.mean;

    const delta = calculateDelta(armVal, x86Val);

    return {
      runtime: rt,
      x86Val,
      armVal,
      delta
    };
  });

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Cross-Architecture Comparison: x86-64 vs. ARM64</h2>
          <div class="section-subtitle">
            Evaluating execution models on server-grade Intel Xeon vs. power-optimized ARM64 hardware
          </div>
        </div>
        <div class="badge badge-tech">Metric: ${formatMetricName(currentMetric)}</div>
      </div>

      <!-- Hardware Attribution Context Cards -->
      <div class="grid-2">
        <div style="background-color: var(--bg-primary); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: var(--radius-md); padding: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
            <span class="badge badge-x86">Target Node A</span>
            <span style="font-weight: 700; color: #60a5fa;">x86-64 Server Architecture</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-primary); font-family: var(--font-mono);">
            AWS EC2 c6i.2xlarge (8 vCPUs &bull; Intel Xeon Platinum 8375C @ 2.9GHz / 3.5GHz Turbo &bull; 16GB RAM)
          </div>
          <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 0.25rem;">
            Vector extensions: AVX-512, VNNI &bull; Ubuntu 22.04 LTS &bull; High TDP cloud node
          </div>
        </div>

        <div style="background-color: var(--bg-primary); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-md); padding: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
            <span class="badge badge-arm">Target Node B</span>
            <span style="font-weight: 700; color: #f59e0b;">ARM64 Edge/Cloud Architecture</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-primary); font-family: var(--font-mono);">
            Raspberry Pi 4 Model B (Quad-core Cortex-A72 @ 1.5GHz &bull; 4GB LPDDR4) / AWS Graviton3
          </div>
          <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 0.25rem;">
            Vector extensions: ARM NEON &bull; Debian 12 / Bookworm &bull; Constrained TDP edge/embedded node
          </div>
        </div>
      </div>

      <div class="chart-container-wrapper" style="height: 275px; margin-top: 0.5rem;">
        <canvas id="chart-cross-arch"></canvas>
      </div>

      <!-- Comparative Architecture Table -->
      <div class="table-wrapper" style="margin-top: 0.5rem;">
        <table class="research-table">
          <thead>
            <tr>
              <th>Execution Model</th>
              <th>x86-64 Measured (${aggMode})</th>
              <th>ARM64 Measured (${aggMode})</th>
              <th>Observed Architecture Ratio</th>
              <th>Telemetry Interpretation</th>
            </tr>
          </thead>
          <tbody>
            ${comparisonRows.map(row => `
              <tr>
                <td style="font-weight: 700; color: var(--text-primary);">${row.runtime}</td>
                <td>${row.x86Val !== null ? `${row.x86Val} ${unit}` : 'N/A'}</td>
                <td>${row.armVal !== null ? `${row.armVal} ${unit}` : 'N/A'}</td>
                <td>
                  <span class="mono" style="font-weight: 600; color: ${row.delta.percent > 0 ? '#f59e0b' : '#38bdf8'};">
                    ${row.delta.text} (ARM vs x86)
                  </span>
                </td>
                <td style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-sans);">
                  ${row.x86Val && row.armVal ? `Ratio: ${(row.armVal / row.x86Val).toFixed(2)}x` : 'Insufficient paired data'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Essential Faculty Disclaimer Note -->
      <div class="callout callout-warning">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
        <div>
          <strong>Methodological Context Notice:</strong> Cross-architecture comparisons should be interpreted in the context of the underlying hardware configuration. Architectural ISA differences (x86-64 CISC vs. ARM64 RISC) interact directly with CPU frequency, cache hierarchy, memory bandwidth, and SIMD instruction sets (AVX-512 vs. NEON). Neither architecture is universally superior without hardware context.
        </div>
      </div>
    </section>
  `;

  // Render cross-architecture grouped bar chart
  chartManager.updateArchitectureChart('chart-cross-arch', store);
}
