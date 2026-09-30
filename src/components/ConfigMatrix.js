/**
 * Section 3: Experiment Configuration Matrix.
 * Displays hardware, operating system, and software versions for reproducible benchmarking.
 */

export function renderConfigMatrix(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const configs = [
    { label: 'AI Workload', value: 'MobileNetV2 ImageNet-1k Classification', detail: '224x224x3 Tensor, 3.4M Parameters (FP32 precision)' },
    { label: 'Inference API', value: 'FastAPI / REST HTTP/1.1', detail: 'Synchronous multipart prediction endpoint' },
    { label: 'Container Runtime', value: 'Docker 26.1.1 / runc 1.1.12', detail: 'OCI v1.0.2 specification, Linux cgroups v2' },
    { label: 'Wasm Runtime', value: 'WasmEdge v0.13.5 (AOT mode)', detail: 'WASI-NN plugin with ONNX/TFLite backend' },
    { label: 'Wasm Implementation', value: 'Rust 1.78.0', detail: 'Compiled to wasm32-wasip1 target via LLVM 18' },
    { label: 'Load Testing Engine', value: 'k6 v0.49.0', detail: 'Distributed virtual user concurrency generator' },
    { label: 'Cloud Environment', value: 'AWS EC2 c6i.2xlarge (x86-64)', detail: '8 vCPUs (Intel Xeon 8375C @ 2.9GHz), 16GB RAM, Ubuntu 22.04' },
    { label: 'ARM64 Environment', value: 'AWS Graviton3 & Raspberry Pi 4B', detail: 'Graviton3 (Neoverse-V1) / Pi 4 (Cortex-A72 @ 1.5GHz), Debian 12' },
    { label: 'Telemetry Tools', value: 'cgroups v2, perf stat, RAPL / INA219', detail: 'Hardware MSRs on bare metal / current shunt on Pi 4' },
    { label: 'Data Processing', value: 'Python 3.11 + pandas 2.2.1', detail: 'Sample mean, median, IQR, and variance aggregation' }
  ];

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Experimental Configuration Matrix</h2>
          <div class="section-subtitle">
            Recorded hardware specifications, software toolchains, and runtime environments
          </div>
        </div>
        <div class="badge badge-tech">Reproducibility Standard</div>
      </div>

      <div class="grid-2" style="gap: 1rem;">
        ${configs.map(c => `
          <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem 1.15rem; display: flex; flex-direction: column; gap: 0.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-size: 0.725rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">${c.label}</span>
              <span class="mono" style="font-size: 0.825rem; font-weight: 600; color: #38bdf8;">${c.value}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">${c.detail}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
