/**
 * Left Sidebar Navigation Component.
 * Professional engineering sidebar with page routing, live status indicator,
 * action buttons, and project metadata.
 */

export function renderSidebar(containerId, store, activeRoute, onNavigate, onOpenUpload, onExportCsv) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isDemo = store.mode === 'DEMO';
  const meta = store.metadata;

  const routes = [
    {
      id: 'overview',
      icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h7v9H3V3zm11 0h7v5h-7V3zm0 9h7v9h-7v-9zM3 16h7v5H3v-5z"/></svg>`,
      label: 'Overview',
      desc: 'Executive Summary & Pipeline'
    },
    {
      id: 'performance',
      icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
      label: 'Performance & Scaling',
      desc: 'Latency, Throughput & Load Curves'
    },
    {
      id: 'data',
      icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`,
      label: 'Dataset & Statistics',
      desc: 'Telemetry Logs & Run Variance'
    },
    {
      id: 'methodology',
      icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
      label: 'Methodology & Controls',
      desc: 'Fairness, Limitations & RQ1-7'
    },
    {
      id: 'reproduction',
      icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
      label: 'Reproduction Guide',
      desc: 'Test Harness & Source Code'
    }
  ];

  container.innerHTML = `
    <div class="sidebar-wrapper">
      <!-- Brand & Title -->
      <div class="sidebar-brand">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="badge badge-tech" style="background-color: #2563eb; color: #fff; font-size: 0.7rem; padding: 0.2rem 0.5rem;">
            CC-BENCH
          </span>
          <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">
            Research Platform
          </span>
        </div>
        <div style="font-size: 1rem; font-weight: 800; color: var(--text-primary); line-height: 1.25; margin-top: 0.4rem;">
          WebAssembly vs. OCI
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.15rem;">
          Cross-Architecture AI Benchmark
        </div>
      </div>

      <!-- Live Benchmark Status Card -->
      <div class="sidebar-status-card ${isDemo ? 'sidebar-status-demo' : 'sidebar-status-exp'}">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
            ${isDemo ? 'Demo Mode' : 'Experimental Data'}
          </span>
          <span class="pulse-dot"></span>
        </div>
        <div style="font-size: 0.75rem; margin-top: 0.25rem; line-height: 1.35; color: ${isDemo ? '#fde68a' : '#a7f3d0'};">
          ${isDemo 
            ? 'Illustrative placeholder values. Not experimental findings.' 
            : `<strong>${meta.totalRecords || store.records.length}</strong> measured observations across 5 runs.`
          }
        </div>
      </div>

      <!-- Left Navigation Menu -->
      <div class="sidebar-nav-section">
        <div class="sidebar-nav-heading">Navigation Pages</div>
        <div class="sidebar-nav-list" id="sidebar-nav-list">
          ${routes.map(r => `
            <button class="sidebar-nav-item ${activeRoute === r.id ? 'active' : ''}" data-route="${r.id}">
              <div class="sidebar-item-icon">${r.icon}</div>
              <div class="sidebar-item-text">
                <span class="sidebar-item-label">${r.label}</span>
                <span class="sidebar-item-desc">${r.desc}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="sidebar-actions-section">
        <div class="sidebar-nav-heading">Dataset Actions</div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <button id="sb-btn-upload" class="btn btn-primary" style="width: 100%; justify-content: flex-start; font-size: 0.775rem;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            Load Benchmark CSV
          </button>

          <button id="sb-btn-sample" class="btn ${isDemo ? 'btn-success' : 'btn-outline'}" style="width: 100%; justify-content: flex-start; font-size: 0.775rem;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            ${isDemo ? 'Load 150-Run Data' : 'Reload Dataset'}
          </button>

          <button id="sb-btn-demo" class="btn btn-outline" style="width: 100%; justify-content: flex-start; font-size: 0.775rem;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ${isDemo ? 'Demo Mode Active' : 'Switch to Demo'}
          </button>

          <button id="sb-btn-export" class="btn btn-secondary" style="width: 100%; justify-content: flex-start; font-size: 0.775rem;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export Filtered CSV
          </button>
        </div>
      </div>

      <!-- Footer Metadata -->
      <div class="sidebar-footer">
        <div style="font-size: 0.7rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.2rem;">
          <div><strong>Workload:</strong> MobileNetV2 (ONNX)</div>
          <div><strong>ISAs:</strong> x86-64 &bull; ARM64</div>
          <div><strong>Repository:</strong> <a href="https://github.com/Snithika-Reddy/CC-PROJECT" target="_blank" rel="noopener" style="color: #38bdf8; text-decoration: none;">GitHub CC-PROJECT</a></div>
        </div>
      </div>
    </div>
  `;

  // Attach nav item clicks
  document.getElementById('sidebar-nav-list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.sidebar-nav-item');
    if (btn) {
      const route = btn.getAttribute('data-route');
      onNavigate(route);
    }
  });

  // Attach action buttons
  document.getElementById('sb-btn-upload')?.addEventListener('click', onOpenUpload);
  document.getElementById('sb-btn-sample')?.addEventListener('click', () => store.loadSampleExperimental());
  document.getElementById('sb-btn-demo')?.addEventListener('click', () => store.setDemoMode());
  document.getElementById('sb-btn-export')?.addEventListener('click', onExportCsv);
}
