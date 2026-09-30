import { calculateStats, calculateDelta } from '../analytics/statistics.js';

/**
 * Section 5: Key Performance Indicators (KPIs).
 * Displays 8 core empirical metrics with neutral delta comparisons against baselines.
 */

export function renderKeyMetrics(containerId, store) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const records = store.getFilteredRecords();
  const isDemo = store.mode === 'DEMO';
  const aggMode = store.filters.aggMode;

  // Retrieve baseline records for delta calculations
  const nativeRecords = store.getFilteredRecords({ runtime: 'Native' });
  const dockerRecords = store.getFilteredRecords({ runtime: 'Docker / OCI' });

  const metricsConfig = [
    { key: 'startup_ms', label: 'Cold-Start Time', unit: 'ms', lowerIsBetter: true },
    { key: 'latency_p50_ms', label: 'p50 Latency', unit: 'ms', lowerIsBetter: true },
    { key: 'latency_p95_ms', label: 'p95 Latency', unit: 'ms', lowerIsBetter: true },
    { key: 'latency_p99_ms', label: 'p99 Latency', unit: 'ms', lowerIsBetter: true },
    { key: 'rps', label: 'Throughput', unit: 'req/s', lowerIsBetter: false },
    { key: 'memory_mb', label: 'Active Memory', unit: 'MB', lowerIsBetter: true },
    { key: 'cpu_percent', label: 'CPU Utilization', unit: '%', lowerIsBetter: true },
    { key: 'energy_joules', label: 'Energy Telemetry', unit: 'J', lowerIsBetter: true }
  ];

  const cardsHtml = metricsConfig.map(m => {
    const vals = records.map(r => r[m.key]).filter(v => v !== null && v !== undefined);
    const stats = calculateStats(vals);
    const currentVal = aggMode === 'median' ? stats.median : stats.mean;

    // Baseline comparisons
    const nativeVals = nativeRecords.map(r => r[m.key]).filter(v => v !== null && v !== undefined);
    const nativeStats = calculateStats(nativeVals);
    const nativeVal = aggMode === 'median' ? nativeStats.median : nativeStats.mean;

    const dockerVals = dockerRecords.map(r => r[m.key]).filter(v => v !== null && v !== undefined);
    const dockerStats = calculateStats(dockerVals);
    const dockerVal = aggMode === 'median' ? dockerStats.median : dockerStats.mean;

    const deltaVsDocker = calculateDelta(currentVal, dockerVal);
    const deltaVsNative = calculateDelta(currentVal, nativeVal);

    // Energy availability check
    const isEnergyUnavailable = m.key === 'energy_joules' && (currentVal === null || stats.count === 0);

    return `
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">${m.label}</span>
          <span class="kpi-tag">${isDemo ? 'Demo Value' : `N=${stats.count} Runs`}</span>
        </div>

        <div class="kpi-value-row">
          ${isEnergyUnavailable ? `
            <span style="font-size: 0.95rem; font-weight: 600; color: var(--text-muted); line-height: 1.3;">
              Telemetry Unavailable
            </span>
          ` : `
            <span class="kpi-value">${currentVal !== null ? currentVal : '&mdash;'}</span>
            <span class="kpi-unit">${m.unit}</span>
          `}
        </div>

        <div class="kpi-footer">
          ${isEnergyUnavailable ? `
            <span class="kpi-subtext" style="color: #94a3b8;">
              Power telemetry requires physical RAPL MSR or INA219 sensor. Not fabricated.
            </span>
          ` : `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="kpi-subtext">&plusmn;${stats.stdDev || '0.0'} ${m.unit} (std dev)</span>
              <span class="kpi-subtext">[${stats.min || '0'} - ${stats.max || '0'}]</span>
            </div>

            <div style="display: flex; gap: 0.75rem; margin-top: 0.2rem; font-size: 0.7rem;">
              ${dockerVal !== null && dockerVal !== currentVal ? `
                <span class="kpi-delta ${deltaVsDocker.percent > 0 ? (m.lowerIsBetter ? 'delta-negative' : 'delta-positive') : (m.lowerIsBetter ? 'delta-positive' : 'delta-negative')}">
                  vs Docker: ${deltaVsDocker.text}
                </span>
              ` : ''}

              ${nativeVal !== null && nativeVal !== currentVal ? `
                <span class="kpi-delta ${deltaVsNative.percent > 0 ? (m.lowerIsBetter ? 'delta-negative' : 'delta-positive') : (m.lowerIsBetter ? 'delta-positive' : 'delta-negative')}">
                  vs Native: ${deltaVsNative.text}
                </span>
              ` : ''}
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <section class="research-section" style="padding-bottom: 1.5rem;">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Key Empirical Metrics & Measured Baselines</h2>
          <div class="section-subtitle">
            Aggregation mode: ${aggMode.toUpperCase()} &bull; Compared against baseline deployment models
          </div>
        </div>
        <div class="badge badge-tech">Evaluated at Concurrency: ${store.filters.concurrency}</div>
      </div>

      <div class="grid-8-kpi">
        ${cardsHtml}
      </div>
    </section>
  `;
}
