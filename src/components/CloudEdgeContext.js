/**
 * Section 14: Cloud & Edge Computing Relevance.
 * Visually communicates the cloud-to-edge continuum and why this is a core Cloud Computing research project.
 */

export function renderCloudEdgeContext(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Cloud & Edge Computing Continuum: Deployment Paradigms</h2>
          <div class="section-subtitle">
            Analyzing runtime suitability across centralized cloud datacenters and decentralized resource-constrained edge tiers
          </div>
        </div>
        <div class="badge badge-tech">Cloud Architecture Context</div>
      </div>

      <!-- Cloud to Edge Architectural Diagram -->
      <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem;">
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1.5rem; text-align: center;">
          <!-- Cloud Tier -->
          <div style="background-color: rgba(30, 41, 59, 0.4); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">☁️</div>
            <div style="font-weight: 700; color: #60a5fa; font-size: 1rem;">Centralized Cloud Tier</div>
            <div style="font-size: 0.8rem; color: var(--text-primary); margin: 0.25rem 0;">AWS EC2 (x86-64 / Graviton)</div>
            <div style="font-size: 0.725rem; color: var(--text-muted); line-height: 1.4;">
              High throughput &bull; Elastic autoscaling &bull; Serverless FaaS<br>
              Multi-tenant density &bull; Cold-start sensitivity
            </div>
          </div>

          <!-- Network Link -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; color: var(--text-muted); font-size: 0.75rem;">
            <span>WAN / 5G Link</span>
            <div style="width: 120px; height: 2px; background: dashed #475569;"></div>
            <span>Offloading Trade-off</span>
          </div>

          <!-- Edge Tier -->
          <div style="background-color: rgba(30, 41, 59, 0.4); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">📡</div>
            <div style="font-weight: 700; color: #f59e0b; font-size: 1rem;">Distributed Edge Tier</div>
            <div style="font-size: 0.8rem; color: var(--text-primary); margin: 0.25rem 0;">Raspberry Pi / ARM64 Gateways</div>
            <div style="font-size: 0.725rem; color: var(--text-muted); line-height: 1.4;">
              Low latency &bull; Zero network dependency &bull; Privacy preserving<br>
              Strict RAM (1-4GB) &bull; Passive thermal & power budgets
            </div>
          </div>
        </div>
      </div>

      <!-- 4 Pillars of Cloud Computing Relevance -->
      <div class="grid-4" style="margin-top: 0.5rem;">
        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.825rem; color: #38bdf8; margin-bottom: 0.35rem;">1. Serverless & FaaS Cold Starts</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
            Cloud functions scale to zero. Container initialization requires spawning namespaces and Python interpreters (~900ms), whereas WebAssembly modules instantiate in sub-50ms intervals.
          </div>
        </div>

        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.825rem; color: #818cf8; margin-bottom: 0.35rem;">2. Cloud Multi-Tenancy & Density</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
            Datacenter operators maximize model instances per host. A ~50MB Wasm footprint allows 6-8x higher tenant packing density compared to full ~350MB container images.
          </div>
        </div>

        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.825rem; color: #f59e0b; margin-bottom: 0.35rem;">3. ARM Cloud & Edge Migration</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
            Cloud providers (AWS Graviton) offer 20-40% better price-performance on ARM64. Benchmarking evaluates whether Wasm and OCI maintain consistent performance parity across ISAs.
          </div>
        </div>

        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.825rem; color: #34d399; margin-bottom: 0.35rem;">4. Edge Resource Boundaries</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
            Edge micro-servers lack swap space and heavy container engines. Light WasmEdge binaries bypass dockerd daemons, enabling localized on-device AI inference within milliwatt power budgets.
          </div>
        </div>
      </div>
    </section>
  `;
}
