import { formatMetricName, getMetricUnit } from '../charts/chartManager.js';
import { calculateStats, groupRecords } from '../analytics/statistics.js';

/**
 * Section 6: Performance Comparison.
 * Interactive bar chart and comparison matrix across execution runtimes.
 */

export function renderPerformanceComparison(containerId, store, chartManager) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentMetric = store.filters.metric;
  const metrics = [
    { key: 'startup_ms', label: 'Cold-Start' },
    { key: 'latency_p50_ms', label: 'p50 Latency' },
    { key: 'latency_p95_ms', label: 'p95 Latency' },
    { key: 'latency_p99_ms', label: 'p99 Latency' },
    { key: 'rps', label: 'Throughput' },
    { key: 'memory_mb', label: 'Memory' },
    { key: 'cpu_percent', label: 'CPU' },
    { key: 'energy_joules', label: 'Energy' }
  ];

  // Calculate quick stats for active runtimes
  const records = store.getFilteredRecords();
  const grouped = groupRecords(records, 'runtime');
  const runtimes = ['Native', 'Docker / OCI', 'WebAssembly'];

  const statBoxes = runtimes.map(rt => {
    const rtRecs = grouped[rt] || [];
    const vals = rtRecs.map(r => r[currentMetric]).filter(v => v !== null && v !== undefined);
    const s = calculateStats(vals);
    const unit = getMetricUnit(currentMetric);

    return `
      <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; flex: 1; min-width: 180px;">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">${rt}</div>
        <div style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary); margin: 0.25rem 0;">
          ${s.mean !== null ? `${s.mean} ${unit}` : 'N/A'}
        </div>
        <div style="font-size: 0.7rem; color: var(--text-muted);">
          Median: ${s.median !== null ? s.median : 'N/A'} ${unit} &bull; &sigma; = ${s.stdDev !== null ? s.stdDev : '0.0'}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Direct Runtime Performance Comparison</h2>
          <div class="section-subtitle">
            Evaluating execution models at ${store.filters.concurrency} concurrent requests &bull; Metric: ${formatMetricName(currentMetric)}
          </div>
        </div>

        <!-- Metric Switcher Pills -->
        <div class="btn-group" id="comp-metric-pills">
          ${metrics.map(m => `
            <button class="btn-filter ${currentMetric === m.key ? 'active' : ''}" data-metric="${m.key}">
              ${m.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="chart-container-wrapper">
        <canvas id="chart-performance-comparison"></canvas>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem;">
        ${statBoxes}
      </div>

      <div class="callout callout-neutral">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        <div>
          <strong>Interpretation Note:</strong> Performance metrics reflect aggregate measurements under controlled concurrency. Runtimes must be evaluated across multiple dimensions (e.g., startup latency vs. sustained throughput) rather than isolated single-point comparisons.
        </div>
      </div>
    </section>
  `;

  // Attach pill event listeners
  document.getElementById('comp-metric-pills')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-filter');
    if (btn) {
      const metric = btn.getAttribute('data-metric');
      store.setFilter('metric', metric);
    }
  });

  // Render chart
  chartManager.updateComparisonChart('chart-performance-comparison', store);
}
