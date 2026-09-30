/**
 * Section 4: Benchmark Controls.
 * Sticky interactive control bar filtering the entire dashboard dynamically.
 */

export function renderBenchmarkControls(containerId, store) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const filters = store.filters;
  const hardwares = store.metadata.hardwares || [];
  const concurrencies = store.metadata.concurrencies || [10, 50, 100, 500, 1000];

  const metrics = [
    { key: 'latency_p95_ms', label: 'p95 Latency' },
    { key: 'latency_p50_ms', label: 'p50 Latency' },
    { key: 'latency_p99_ms', label: 'p99 Latency' },
    { key: 'startup_ms', label: 'Cold-Start' },
    { key: 'rps', label: 'Throughput (RPS)' },
    { key: 'memory_mb', label: 'Memory (MB)' },
    { key: 'cpu_percent', label: 'CPU (%)' },
    { key: 'energy_joules', label: 'Energy (J)' }
  ];

  container.innerHTML = `
    <div class="sticky-controls-wrapper">
      <div class="control-bar">
        <!-- Architecture Filter -->
        <div class="control-group">
          <span class="control-label">Architecture:</span>
          <div class="btn-group" id="group-arch">
            <button class="btn-filter ${filters.architecture === 'ALL' ? 'active' : ''}" data-val="ALL">All</button>
            <button class="btn-filter ${filters.architecture === 'x86-64' ? 'active' : ''}" data-val="x86-64">x86-64</button>
            <button class="btn-filter ${filters.architecture === 'ARM64' ? 'active' : ''}" data-val="ARM64">ARM64</button>
          </div>
        </div>

        <!-- Runtime Filter -->
        <div class="control-group">
          <span class="control-label">Runtime:</span>
          <div class="btn-group" id="group-runtime">
            <button class="btn-filter ${filters.runtime === 'ALL' ? 'active' : ''}" data-val="ALL">All</button>
            <button class="btn-filter ${filters.runtime === 'Native' ? 'active' : ''}" data-val="Native">Native</button>
            <button class="btn-filter ${filters.runtime === 'Docker / OCI' ? 'active' : ''}" data-val="Docker / OCI">Docker / OCI</button>
            <button class="btn-filter ${filters.runtime === 'WebAssembly' ? 'active' : ''}" data-val="WebAssembly">WebAssembly</button>
          </div>
        </div>

        <!-- Concurrency Filter -->
        <div class="control-group">
          <span class="control-label">Concurrency:</span>
          <div class="btn-group" id="group-concurrency">
            <button class="btn-filter ${filters.concurrency === 'ALL' ? 'active' : ''}" data-val="ALL">All</button>
            ${concurrencies.map(c => `
              <button class="btn-filter ${filters.concurrency === String(c) || filters.concurrency === c ? 'active' : ''}" data-val="${c}">
                ${c}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Metric Selector Dropdown -->
        <div class="control-group">
          <span class="control-label">Metric:</span>
          <select id="select-metric" class="select-input">
            ${metrics.map(m => `
              <option value="${m.key}" ${filters.metric === m.key ? 'selected' : ''}>
                ${m.label}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Dynamic Hardware Filter -->
        <div class="control-group">
          <span class="control-label">Hardware:</span>
          <select id="select-hardware" class="select-input">
            <option value="ALL">All Hardware (${hardwares.length})</option>
            ${hardwares.map(hw => `
              <option value="${hw}" ${filters.hardware === hw ? 'selected' : ''}>
                ${hw.length > 28 ? hw.substring(0, 26) + '...' : hw}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Statistical Aggregation Mode -->
        <div class="control-group">
          <span class="control-label">Aggregation:</span>
          <div class="btn-group" id="group-agg">
            <button class="btn-filter ${filters.aggMode === 'mean' ? 'active' : ''}" data-val="mean">Mean</button>
            <button class="btn-filter ${filters.aggMode === 'median' ? 'active' : ''}" data-val="median">Median</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  attachFilterGroup('group-arch', val => store.setFilter('architecture', val));
  attachFilterGroup('group-runtime', val => store.setFilter('runtime', val));
  attachFilterGroup('group-concurrency', val => store.setFilter('concurrency', val === 'ALL' ? 'ALL' : Number(val)));
  attachFilterGroup('group-agg', val => store.setFilter('aggMode', val));

  document.getElementById('select-metric')?.addEventListener('change', (e) => {
    store.setFilter('metric', e.target.value);
  });

  document.getElementById('select-hardware')?.addEventListener('change', (e) => {
    store.setFilter('hardware', e.target.value);
  });
}

function attachFilterGroup(groupId, callback) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-filter');
    if (btn) {
      const val = btn.getAttribute('data-val');
      callback(val);
    }
  });
}
