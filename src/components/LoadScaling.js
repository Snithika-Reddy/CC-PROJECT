import { formatMetricName } from '../charts/chartManager.js';

/**
 * Section 7: Load-Scaling Analysis (Crucial Research Section).
 * Visualizes runtime behavior under increasing concurrency workloads (10 -> 1000+ VUs).
 */

export function renderLoadScaling(containerId, store, chartManager) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentMetric = store.filters.metric;
  const loadMetrics = [
    { key: 'latency_p95_ms', label: 'Concurrency &rarr; p95 Latency' },
    { key: 'latency_p50_ms', label: 'Concurrency &rarr; p50 Latency' },
    { key: 'latency_p99_ms', label: 'Concurrency &rarr; p99 Latency' },
    { key: 'rps', label: 'Concurrency &rarr; Throughput (RPS)' },
    { key: 'memory_mb', label: 'Concurrency &rarr; Memory (MB)' },
    { key: 'cpu_percent', label: 'Concurrency &rarr; CPU (%)' }
  ];

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Load-Scaling & Concurrency Behavior Analysis</h2>
          <div class="section-subtitle">
            Systematic response curve showing latency degradation, throughput saturation, and memory expansion as concurrent Virtual Users increase
          </div>
        </div>

        <!-- Metric Switcher Pills -->
        <div class="btn-group" id="scaling-metric-pills">
          ${loadMetrics.map(m => `
            <button class="btn-filter ${currentMetric === m.key ? 'active' : ''}" data-metric="${m.key}">
              ${m.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="chart-container-wrapper" style="height: 280px;">
        <canvas id="chart-load-scaling"></canvas>
      </div>

      <div class="grid-3" style="margin-top: 0.5rem;">
        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.8rem; color: #38bdf8; margin-bottom: 0.35rem;">Native Baseline Dynamics</div>
          <div style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.45;">
            Direct OS thread execution avoids virtualization overhead at low concurrency, but experiences memory pressure and GIL contention under high concurrent request streams.
          </div>
        </div>

        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.8rem; color: #818cf8; margin-bottom: 0.35rem;">Docker / OCI Scaling Dynamics</div>
          <div style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.45;">
            Multi-process container workers handle parallel connections efficiently, but baseline memory footprint remains substantially higher due to the guest OS userland and runtime stack.
          </div>
        </div>

        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.8rem; color: #34d399; margin-bottom: 0.35rem;">WasmEdge AOT Scaling Dynamics</div>
          <div style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.45;">
            Ultra-compact linear memory and instant sandbox instantiation deliver rapid request turnaround; scaling curves reveal queuing inflection points depending on host thread pool limits.
          </div>
        </div>
      </div>
    </section>
  `;

  // Attach pill listeners
  document.getElementById('scaling-metric-pills')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-filter');
    if (btn) {
      const metric = btn.getAttribute('data-metric');
      store.setFilter('metric', metric);
    }
  });

  // Render scaling line chart
  chartManager.updateScalingChart('chart-load-scaling', store);
}
