/**
 * Multi-Page Navigation Bar.
 * Sticky header with client-side routed tabs, benchmark status indicator,
 * and quick dataset action buttons.
 */

export function renderNavbar(containerId, store, activeRoute, onNavigate, onOpenUpload) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isDemo = store.mode === 'DEMO';
  const meta = store.metadata;

  const routes = [
    { id: 'overview', label: '📊 Overview', title: 'Executive Dashboard' },
    { id: 'performance', label: '📈 Performance & Scaling', title: 'Empirical Charts' },
    { id: 'data', label: '📋 Dataset & Statistics', title: 'Raw Telemetry & Stats' },
    { id: 'methodology', label: '🔬 Methodology & Fairness', title: 'Research Framework' },
    { id: 'reproduction', label: '🛠️ Reproduction Guide', title: 'Harness & Artifacts' }
  ];

  container.innerHTML = `
    <nav class="research-navbar">
      <div class="nav-brand-area">
        <a href="#overview" class="nav-brand-title">
          <span class="badge badge-tech" style="background-color: #2563eb; color: #fff;">CC-BENCH</span>
          <span>WebAssembly vs. OCI Benchmark</span>
        </a>
      </div>

      <!-- Navigation Tabs -->
      <div class="nav-tabs" id="nav-tabs-group">
        ${routes.map(r => `
          <button class="nav-tab-btn ${activeRoute === r.id ? 'active' : ''}" data-route="${r.id}" title="${r.title}">
            ${r.label}
          </button>
        `).join('')}
      </div>

      <!-- Right Action Items -->
      <div class="nav-actions">
        <!-- Status Indicator Pill -->
        <div class="benchmark-status-badge ${isDemo ? 'status-demo' : 'status-experimental'}" style="padding: 0.3rem 0.75rem; font-size: 0.725rem;">
          <span class="pulse-dot"></span>
          ${isDemo ? 'DEMO MODE' : `EXPERIMENTAL (${meta.totalRecords || store.records.length})`}
        </div>

        <button id="nav-btn-upload" class="btn btn-primary btn-pill">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          Load CSV
        </button>

        <button id="nav-btn-sample" class="btn ${isDemo ? 'btn-success' : 'btn-outline'} btn-pill">
          ${isDemo ? 'Sample Data' : 'Reload'}
        </button>
      </div>
    </nav>
  `;

  // Attach tab navigation listeners
  document.getElementById('nav-tabs-group')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-tab-btn');
    if (btn) {
      const route = btn.getAttribute('data-route');
      onNavigate(route);
    }
  });

  document.getElementById('nav-btn-upload')?.addEventListener('click', onOpenUpload);
  document.getElementById('nav-btn-sample')?.addEventListener('click', () => {
    store.loadSampleExperimental();
  });
}
