import { REQUIRED_COLUMNS } from '../data/csvParser.js';

/**
 * Section 11: CSV Import & Dataset Validator Modal.
 * Supports drag-and-drop file upload, live schema validation, and automatic dataset activation.
 */

export function renderCsvImportModal(containerId, store, onClose) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="modal-overlay" id="csv-modal-overlay">
      <div class="modal-content">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div>
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">Load Experimental Benchmark Dataset</h3>
            <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 0.15rem;">
              Upload empirical CSV telemetry to transition the platform from DEMO MODE to EXPERIMENTAL DATA
            </div>
          </div>
          <button id="modal-close-btn" class="btn btn-outline btn-pill">&times;</button>
        </div>

        <!-- Dropzone -->
        <div class="dropzone" id="csv-dropzone">
          <svg width="40" height="40" fill="none" stroke="#3b82f6" stroke-width="1.5" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">
            Drag and drop benchmark CSV here, or <span style="color: #38bdf8; text-decoration: underline;">browse files</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">
            UTF-8 encoded CSV with headers conforming to the research schema
          </div>
          <input type="file" id="file-input" accept=".csv" style="display: none;" />
        </div>

        <!-- Expected Schema Reference -->
        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; font-size: 0.75rem;">
          <div style="font-weight: 700; color: var(--text-secondary); margin-bottom: 0.35rem;">Expected CSV Schema:</div>
          <div class="mono" style="color: #38bdf8; word-break: break-all; line-height: 1.5;">
            ${REQUIRED_COLUMNS.join(', ')}, run_id*, hardware*, os*, runtime_version*, energy_joules*
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.35rem;">
            *Optional columns. Missing numeric values will be validated and handled gracefully. Energy telemetry is optional and strictly non-fabricated.
          </div>
        </div>

        <!-- Status & Feedback Area -->
        <div id="upload-status-area" style="display: none;"></div>

        <!-- Action Footer -->
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <button id="modal-cancel-btn" class="btn btn-outline">Cancel</button>
          <button id="modal-load-sample-btn" class="btn btn-success">
            Load Included 150-Run Experimental Dataset
          </button>
        </div>
      </div>
    </div>
  `;

  const overlay = document.getElementById('csv-modal-overlay');
  const dropzone = document.getElementById('csv-dropzone');
  const fileInput = document.getElementById('file-input');
  const statusArea = document.getElementById('upload-status-area');

  function openModal() {
    overlay.classList.add('open');
    statusArea.style.display = 'none';
  }

  function closeModal() {
    overlay.classList.remove('open');
    if (onClose) onClose();
  }

  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  document.getElementById('modal-load-sample-btn')?.addEventListener('click', () => {
    store.loadSampleExperimental();
    displaySuccess({
      records: store.records,
      metadata: store.metadata
    });
    setTimeout(closeModal, 1200);
  });

  function handleFile(file) {
    if (!file.name.endsWith('.csv')) {
      displayError('Invalid file type. Please select a .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const result = store.loadCustomCSV(text);
        displaySuccess(result);
        setTimeout(closeModal, 1400);
      } catch (err) {
        displayError(`Validation Error: ${err.message}`);
      }
    };
    reader.onerror = () => {
      displayError('Failed to read the uploaded file.');
    };
    reader.readAsText(file);
  }

  function displaySuccess(result) {
    statusArea.style.display = 'block';
    statusArea.innerHTML = `
      <div class="callout callout-info" style="border-left-color: #10b981; background-color: rgba(16, 185, 129, 0.1);">
        <svg width="24" height="24" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
        <div>
          <div style="font-weight: 700; color: #34d399; font-size: 0.9rem;">Dataset Loaded Successfully!</div>
          <div style="font-size: 0.775rem; color: #cbd5e1; margin-top: 0.25rem;">
            Total Experiments: <strong>${result.records.length}</strong> &bull;
            Architectures: <strong>${result.metadata.architectures.join(', ')}</strong> &bull;
            Runtimes: <strong>${result.metadata.runtimes.join(', ')}</strong> &bull;
            Load Levels: <strong>${result.metadata.concurrencies.join(', ')} VUs</strong>
          </div>
          <div style="font-size: 0.725rem; color: #94a3b8; margin-top: 0.25rem;">
            Platform transitioned to <strong>EXPERIMENTAL DATA</strong> state. All metrics and charts updated.
          </div>
        </div>
      </div>
    `;
  }

  function displayError(msg) {
    statusArea.style.display = 'block';
    statusArea.innerHTML = `
      <div class="callout callout-warning" style="border-left-color: #ef4444; background-color: rgba(239, 68, 68, 0.1);">
        <svg width="24" height="24" fill="none" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <div style="color: #fca5a5; font-size: 0.8rem; line-height: 1.45;">
          ${msg}
        </div>
      </div>
    `;
  }

  return { openModal, closeModal };
}
