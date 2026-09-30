/**
 * Section 16: Experimental Controls & Fairness Assurance.
 * Visually communicates experimental rigor and controlled variables to faculty evaluators.
 */

export function renderExperimentalControls(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const controls = [
    { title: 'Identical AI Model Weights', desc: 'Pre-trained MobileNetV2-7 ONNX graph with verified SHA-256 hash across all targets.' },
    { title: 'Uniform Input Test Images', desc: 'Standard ImageNet validation set images fed through identical test harness.' },
    { title: 'Standardized Preprocessing', desc: 'Bilinear interpolation to 224x224 RGB with identical ImageNet mean/std scaling.' },
    { title: 'Uniform HTTP Request Schema', desc: 'Identical multipart/form-data payload with standardized JSON response schema.' },
    { title: 'Controlled Concurrency Load', desc: 'k6 load generator executing synchronized ramp-ups with identical virtual user schedules.' },
    { title: 'Warm-up & Discard Protocol', desc: '30-second initial warm-up phase executed and discarded to eliminate JIT bias.' },
    { title: 'Environment Reset Between Runs', desc: 'Complete process teardown and Linux page cache flushing (drop_caches) between trials.' },
    { title: 'Recorded System Telemetry', desc: 'Exact Linux kernel, glibc, Docker, WasmEdge, and CPU microcode versions documented.' }
  ];

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Experimental Controls &amp; Scientific Fairness Assurance</h2>
          <div class="section-subtitle">
            Controlled variables maintained across all execution models to eliminate confounding factors
          </div>
        </div>
        <div class="badge badge-tech" style="color: #10b981; border-color: rgba(16, 185, 129, 0.4);">
          Fairness Verification: Active
        </div>
      </div>

      <div class="checklist">
        ${controls.map(c => `
          <div class="check-item">
            <span class="check-icon">&#10003;</span>
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.825rem;">${c.title}</div>
              <div style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 0.15rem; line-height: 1.4;">${c.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
