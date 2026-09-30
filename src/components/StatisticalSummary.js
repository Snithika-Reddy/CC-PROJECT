import { calculateStats, groupRecords } from '../analytics/statistics.js';
import { formatMetricName, getMetricUnit } from '../charts/chartManager.js';

/**
 * Section 12 & 13: Multiple Experiment Runs & Statistical Summary.
 * Research-grade descriptive statistics table across repeated trials.
 */

export function renderStatisticalSummary(containerId, store) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentMetric = store.filters.metric;
  const unit = getMetricUnit(currentMetric);
  const records = store.getFilteredRecords();
  const grouped = groupRecords(records, 'runtime');
  const runtimes = ['Native', 'Docker / OCI', 'WebAssembly'];

  const rows = runtimes.map(rt => {
    const rtRecs = grouped[rt] || [];
    const vals = rtRecs.map(r => r[currentMetric]).filter(v => v !== null && v !== undefined);
    const s = calculateStats(vals);

    return {
      runtime: rt,
      ...s
    };
  });

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Statistical Summary & Variance Across Repeated Trials</h2>
          <div class="section-subtitle">
            Descriptive statistics computed across multiple experimental run IDs (run_001 &ndash; run_005) &bull; Metric: ${formatMetricName(currentMetric)}
          </div>
        </div>
        <div class="badge badge-tech">Sample Size: N = ${records.length} Observations</div>
      </div>

      <div class="table-wrapper">
        <table class="research-table">
          <thead>
            <tr>
              <th>Execution Model</th>
              <th>Sample Size (N)</th>
              <th>Mean (&mu;)</th>
              <th>Median (Q2)</th>
              <th>Std Dev (&sigma;)</th>
              <th>Min &rarr; Max Range</th>
              <th>IQR (Q3 &minus; Q1)</th>
              <th>Coeff of Variation (CV)</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td style="font-weight: 700; color: var(--text-primary);">${r.runtime}</td>
                <td>${r.count} runs</td>
                <td style="font-weight: 700; color: #38bdf8;">${r.mean !== null ? `${r.mean} ${unit}` : '&mdash;'}</td>
                <td>${r.median !== null ? `${r.median} ${unit}` : '&mdash;'}</td>
                <td>${r.stdDev !== null ? `&plusmn;${r.stdDev} ${unit}` : '&mdash;'}</td>
                <td>${r.min !== null ? `[${r.min} &ndash; ${r.max}] ${unit}` : '&mdash;'}</td>
                <td>${r.iqr !== null ? `${r.iqr} ${unit}` : '&mdash;'}</td>
                <td>${r.cv !== null ? `${r.cv}%` : '&mdash;'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="callout callout-neutral">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        <div>
          <strong>Statistical Rigor Disclaimer:</strong> Values displayed are descriptive sample metrics. In compliance with empirical research standards, statistical significance (p-value &lt; 0.05) cannot be claimed without formal hypothesis testing (e.g. Welch's two-sample t-test or one-way ANOVA) accounting for degrees of freedom and normality assumptions.
        </div>
      </div>
    </section>
  `;
}
