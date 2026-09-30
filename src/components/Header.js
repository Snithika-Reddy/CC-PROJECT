/**
 * Section 1: Header with Research Titles, Technology Badges,
 * and Benchmark Status Indicator (DEMO MODE vs EXPERIMENTAL DATA).
 */

export function renderHeader(containerId, store, onOpenUpload, onExportCsv) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isDemo = store.mode === 'DEMO';
  const meta = store.metadata;

  container.innerHTML = `
    <header class="research-header">
      <div class="header-top">
        <div class="header-title-area">
          <div class="header-meta">
            <span class="badge badge-tech">Cloud Computing Research</span>
            <span class="badge badge-tech">B.Tech Capstone</span>
            <span class="badge badge-tech">Comparative Benchmarking</span>
          </div>
          <h1>Empirical Cross-Architecture Benchmark</h1>
          <div class="header-subtitle">
            WebAssembly Runtimes vs. OCI Containers for Edge-Cloud AI Inference
          </div>
        </div>

        <div class="header-actions">
          <!-- Benchmark Status Indicator -->
          <div class="benchmark-status-badge ${isDemo ? 'status-demo' : 'status-experimental'}" id="status-indicator">
            <span class="pulse-dot"></span>
            ${isDemo 
              ? `<span>DEMO MODE &mdash; Illustrative Values (NOT Experimental)</span>`
              : `<span>EXPERIMENTAL DATA &mdash; ${meta.totalRecords || store.records.length} Measured Records</span>`
            }
          </div>

          <button id="btn-open-upload" class="btn btn-primary">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            Load Benchmark CSV
          </button>

          <button id="btn-load-sample-exp" class="btn ${isDemo ? 'btn-success' : 'btn-outline'}">
            ${isDemo ? 'Load Sample Experimental Data' : 'Reload Experimental Dataset'}
          </button>

          <button id="btn-toggle-demo" class="btn btn-outline">
            ${isDemo ? 'Reset Demo' : 'Switch to Demo Mode'}
          </button>

          <button id="btn-export-csv" class="btn btn-secondary">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export Filtered CSV
          </button>
        </div>
      </div>

      <!-- Technology Badges Row -->
      <div class="header-meta" style="margin-top: 0.25rem;">
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Benchmark Dimensions:</span>
        <span class="badge badge-tech">MobileNetV2 (ONNX)</span>
        <span class="badge badge-native">Native (CPython / ONNX)</span>
        <span class="badge badge-docker">Docker / OCI (runc)</span>
        <span class="badge badge-wasm">WebAssembly (WasmEdge AOT)</span>
        <span class="badge badge-x86">x86-64 (Intel Xeon / AWS EC2)</span>
        <span class="badge badge-arm">ARM64 (Graviton3 / Raspberry Pi 4B)</span>
      </div>
    </header>
  `;

  // Attach button event handlers
  document.getElementById('btn-open-upload')?.addEventListener('click', onOpenUpload);
  document.getElementById('btn-load-sample-exp')?.addEventListener('click', () => {
    store.loadSampleExperimental();
  });
  document.getElementById('btn-toggle-demo')?.addEventListener('click', () => {
    store.setDemoMode();
  });
  document.getElementById('btn-export-csv')?.addEventListener('click', onExportCsv);
}
