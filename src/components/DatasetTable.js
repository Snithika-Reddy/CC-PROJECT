import { exportToCSV } from '../data/csvParser.js';

/**
 * Section 10: Experimental Dataset Table.
 * Full data table with sorting, search, pagination, and CSV export.
 */

export function renderDatasetTable(containerId, store) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let records = store.getFilteredRecords();
  const isDemo = store.mode === 'DEMO';

  // Table internal state
  let sortColumn = 'concurrency';
  let sortDirection = 'asc';
  let searchQuery = '';
  let currentPage = 1;
  const pageSize = 15;

  function renderTableContent() {
    // 1. Search Filter
    let filtered = records.filter(r => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.run_id.toLowerCase().includes(q) ||
        r.architecture.toLowerCase().includes(q) ||
        r.runtime.toLowerCase().includes(q) ||
        r.hardware.toLowerCase().includes(q)
      );
    });

    // 2. Sort
    filtered.sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    // 3. Paginate
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * pageSize;
    const pageRecords = filtered.slice(startIndex, startIndex + pageSize);

    const columns = [
      { key: 'run_id', label: 'Run ID' },
      { key: 'architecture', label: 'Architecture' },
      { key: 'runtime', label: 'Runtime' },
      { key: 'concurrency', label: 'Load (VUs)' },
      { key: 'hardware', label: 'Hardware Node' },
      { key: 'startup_ms', label: 'Startup (ms)' },
      { key: 'latency_p50_ms', label: 'p50 (ms)' },
      { key: 'latency_p95_ms', label: 'p95 (ms)' },
      { key: 'latency_p99_ms', label: 'p99 (ms)' },
      { key: 'rps', label: 'Throughput (RPS)' },
      { key: 'memory_mb', label: 'Memory (MB)' },
      { key: 'cpu_percent', label: 'CPU (%)' },
      { key: 'energy_joules', label: 'Energy (J)' }
    ];

    container.innerHTML = `
      <section class="research-section">
        <div class="section-header">
          <div class="section-title-group">
            <h2>Complete Experimental Records (${filtered.length} of ${records.length} filtered)</h2>
            <div class="section-subtitle">
              Raw telemetry observations recorded per experimental run &bull; ${isDemo ? 'DEMO DATA' : 'MEASURED RESULTS'}
            </div>
          </div>

          <div class="section-actions">
            <button id="btn-export-table" class="btn btn-secondary">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Export Visible CSV
            </button>
          </div>
        </div>

        <div class="table-controls">
          <input
            type="text"
            id="table-search"
            class="search-input"
            placeholder="Search Run ID, Architecture, Runtime, Hardware..."
            value="${searchQuery}"
          />

          <div class="pagination">
            <button id="btn-prev-page" class="btn btn-outline btn-pill" ${currentPage === 1 ? 'disabled' : ''}>&larr; Prev</button>
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">
              Page ${currentPage} of ${totalPages}
            </span>
            <button id="btn-next-page" class="btn btn-outline btn-pill" ${currentPage === totalPages ? 'disabled' : ''}>Next &rarr;</button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="research-table">
            <thead>
              <tr>
                ${columns.map(col => `
                  <th class="${sortColumn === col.key ? (sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc') : ''}" data-col="${col.key}">
                    ${col.label}
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${pageRecords.map(r => `
                <tr>
                  <td><span class="badge ${isDemo ? 'badge-tech' : 'badge-wasm'}">${r.run_id}</span></td>
                  <td><span class="badge ${r.architecture === 'x86-64' ? 'badge-x86' : 'badge-arm'}">${r.architecture}</span></td>
                  <td><span class="badge ${r.runtime.includes('Wasm') ? 'badge-wasm' : r.runtime.includes('Docker') ? 'badge-docker' : 'badge-native'}">${r.runtime}</span></td>
                  <td style="font-weight: 700;">${r.concurrency}</td>
                  <td style="font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-secondary); max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                    ${r.hardware}
                  </td>
                  <td>${r.startup_ms !== null ? r.startup_ms : '&mdash;'}</td>
                  <td>${r.latency_p50_ms !== null ? r.latency_p50_ms : '&mdash;'}</td>
                  <td>${r.latency_p95_ms !== null ? r.latency_p95_ms : '&mdash;'}</td>
                  <td>${r.latency_p99_ms !== null ? r.latency_p99_ms : '&mdash;'}</td>
                  <td style="color: #38bdf8; font-weight: 700;">${r.rps !== null ? r.rps : '&mdash;'}</td>
                  <td>${r.memory_mb !== null ? r.memory_mb : '&mdash;'}</td>
                  <td>${r.cpu_percent !== null ? `${r.cpu_percent}%` : '&mdash;'}</td>
                  <td>${r.energy_joules !== null ? `${r.energy_joules} J` : '<span style="color: var(--text-muted);">N/A</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;

    // Reattach table event handlers
    document.getElementById('table-search')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      renderTableContent();
    });

    document.querySelectorAll('.research-table th').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-col');
        if (sortColumn === col) {
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortColumn = col;
          sortDirection = 'asc';
        }
        renderTableContent();
      });
    });

    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTableContent();
      }
    });

    document.getElementById('btn-next-page')?.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTableContent();
      }
    });

    document.getElementById('btn-export-table')?.addEventListener('click', () => {
      const csvStr = exportToCSV(filtered);
      downloadBlob(csvStr, `filtered_benchmark_data_${Date.now()}.csv`, 'text/csv');
    });
  }

  renderTableContent();
}

function downloadBlob(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
