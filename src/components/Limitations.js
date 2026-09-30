/**
 * Section 17: Research Limitations & Threats to Validity.
 * Openly acknowledges methodological boundaries and experimental constraints.
 */

export function renderLimitations(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const limitations = [
    {
      num: '01',
      title: 'Hardware Microarchitecture Disparity',
      text: 'x86-64 cloud nodes (Intel Xeon 8375C @ 2.9GHz) and ARM64 edge nodes (Raspberry Pi Cortex-A72 @ 1.5GHz) possess divergent clock frequencies, cache hierarchies, and thermal thresholds. Cross-architecture differences reflect whole-system disparities rather than pure ISA efficiency.'
    },
    {
      num: '02',
      title: 'Language & Ecosystem Asymmetry',
      text: 'The OCI container uses Python 3.11 with FastAPI and ONNX Runtime C++ bindings, whereas WebAssembly uses Rust compiled to wasm32-wasip1. Some performance variation arises from language runtime semantics rather than containerization vs. Wasm isolation alone.'
    },
    {
      num: '03',
      title: 'WASI-NN Backend Maturity',
      text: 'WASI-NN is an evolving standard. The underlying WasmEdge backend delegates tensor operations to host shared libraries (OpenVINO / ONNX / TFLite), which introduces host glue layer overhead not present in native C++ builds.'
    },
    {
      num: '04',
      title: 'Extreme Concurrency Saturation',
      text: 'At concurrency loads &gt; 1000 VUs, single-host network socket exhaustion (TIME_WAIT saturation) and OS thread pool contention can induce artificial queueing delays that distort runtime comparisons.'
    },
    {
      num: '05',
      title: 'Energy Telemetry Measurement Granularity',
      text: 'Cloud hypervisors restrict direct MSR RAPL energy register reads on multi-tenant virtual machines. Physical power measurement is only available on bare-metal testbeds with physical current sensing (INA219 shunts).'
    },
    {
      num: '06',
      title: 'Run-to-Run Cloud Multi-Tenant Jitter',
      text: 'Cloud-hosted benchmarks are subject to noisy-neighbor effects and hypervisor CPU throttling. Repeated runs (N=5) and standard deviation reporting mitigate but do not fully eliminate virtualized variance.'
    }
  ];

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Methodological Limitations &amp; Threats to Validity</h2>
          <div class="section-subtitle">
            Transparent academic disclosure of experimental boundaries, hardware constraints, and runtime asymmetries
          </div>
        </div>
        <div class="badge badge-tech">Academic Disclosure</div>
      </div>

      <div class="grid-3" style="gap: 1rem;">
        ${limitations.map(lim => `
          <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="mono" style="font-size: 0.75rem; font-weight: 700; color: #f59e0b;">${lim.num}</span>
              <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Constraint</span>
            </div>
            <div style="font-weight: 700; font-size: 0.825rem; color: var(--text-primary);">${lim.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.45;">${lim.text}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
