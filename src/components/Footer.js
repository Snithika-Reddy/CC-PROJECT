/**
 * Footer Component.
 * Academic citation, project metadata, and research integrity declaration.
 */

export function renderFooter(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <footer style="border-top: 1px solid var(--border-subtle); padding: 2.5rem 0 1rem; display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 2rem;">
        <div style="max-width: 600px;">
          <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">
            Empirical Cross-Architecture Benchmark Platform
          </div>
          <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 0.35rem; line-height: 1.5;">
            Submitted for the B.Tech Degree in Computer Science &amp; Engineering &bull; Cloud Computing Specialization.<br>
            Investigating deployment trade-offs between OCI Containers (Docker) and WebAssembly (WasmEdge) for distributed edge-cloud AI inference.
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.75rem;">
          <span style="font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Scientific Integrity Pledge</span>
          <span style="color: var(--text-muted); max-width: 380px; line-height: 1.45;">
            This benchmarking platform adheres strictly to empirical reproducibility. All charts and KPIs derive directly from loaded telemetry. No performance claims or synthetic energy values are asserted without measured evidence.
          </span>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 1rem; font-size: 0.75rem; color: var(--text-muted);">
        <div>
          Repository: <a href="https://github.com/Snithika-Reddy/CC-PROJECT" target="_blank" rel="noopener" style="color: #38bdf8; text-decoration: none;">github.com/Snithika-Reddy/CC-PROJECT</a>
        </div>
        <div>
          Evaluated Workload: MobileNetV2 ONNX &bull; Runtimes: Native / Docker / WasmEdge &bull; ISAs: x86-64 / ARM64
        </div>
      </div>
    </footer>
  `;
}
