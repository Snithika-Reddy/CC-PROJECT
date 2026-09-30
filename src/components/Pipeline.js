/**
 * Section 2: Experiment Pipeline Overview.
 * Visual interactive flow diagram illustrating the controlled benchmark architecture.
 */

export function renderPipeline(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Experimental Workflow & Pipeline Architecture</h2>
          <div class="section-subtitle">
            Controlled empirical execution model comparing WebAssembly and OCI containers for identical AI inference workloads
          </div>
        </div>
        <div class="badge badge-tech">Methodology: Controlled Repeated Trials</div>
      </div>

      <div class="pipeline-container">
        <div class="pipeline-flow">
          <!-- Step 1: Workload -->
          <div class="pipeline-node highlight">
            <div style="font-size: 0.7rem; color: #38bdf8; text-transform: uppercase; font-weight: 700;">Uniform Workload</div>
            <div style="font-size: 1rem;">MobileNetV2 ImageNet Classification</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">224x224x3 FP32 Tensor &bull; 3.4M Parameters &bull; Identical Weights</div>
          </div>

          <div class="pipeline-connector">&darr;</div>

          <!-- Step 2: Dual Execution Paths -->
          <div class="pipeline-branches">
            <!-- Path A: Docker / OCI -->
            <div class="pipeline-branch-col">
              <span class="badge badge-docker">Execution Model A</span>
              <div class="pipeline-node" style="border-color: rgba(129, 140, 248, 0.4); width: 100%;">
                <div style="font-weight: 700; color: var(--color-docker);">Docker / OCI Container</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                  FastAPI &bull; Uvicorn &bull; ONNX Runtime<br>
                  Linux Namespaces &bull; cgroups v2 &bull; runc
                </div>
              </div>
              <div class="pipeline-connector">&darr;</div>
              <div style="display: flex; gap: 0.5rem; width: 100%; justify-content: center;">
                <span class="badge badge-x86">x86-64</span>
                <span class="badge badge-arm">ARM64</span>
              </div>
            </div>

            <!-- Path B: WebAssembly / WasmEdge -->
            <div class="pipeline-branch-col">
              <span class="badge badge-wasm">Execution Model B</span>
              <div class="pipeline-node" style="border-color: rgba(52, 211, 153, 0.4); width: 100%;">
                <div style="font-weight: 700; color: var(--color-wasm);">WebAssembly / WasmEdge</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                  Rust Bytecode &bull; wasm32-wasip1<br>
                  WASI-NN &bull; LLVM AOT Ahead-of-Time Sandbox
                </div>
              </div>
              <div class="pipeline-connector">&darr;</div>
              <div style="display: flex; gap: 0.5rem; width: 100%; justify-content: center;">
                <span class="badge badge-x86">x86-64</span>
                <span class="badge badge-arm">ARM64</span>
              </div>
            </div>
          </div>

          <div class="pipeline-connector">&darr;</div>

          <!-- Step 3: Load Testing -->
          <div class="pipeline-node">
            <div style="font-size: 0.7rem; color: #f59e0b; text-transform: uppercase; font-weight: 700;">Synthetic Load Injection</div>
            <div style="font-size: 0.95rem;">Distributed k6 Workload Generator</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Stepped Arrival Concurrency: 10 &rarr; 50 &rarr; 100 &rarr; 500 &rarr; 1000 VUs (with 30s warm-up discarded)
            </div>
          </div>

          <div class="pipeline-connector">&darr;</div>

          <!-- Step 4: Telemetry & Metrics -->
          <div class="pipeline-node">
            <div style="font-size: 0.7rem; color: #a855f7; text-transform: uppercase; font-weight: 700;">Multi-Modal Telemetry</div>
            <div style="font-size: 0.95rem;">Metrics & Telemetry Capture</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Cold Start (ms) &bull; Latency (p50/p95/p99) &bull; RPS &bull; RSS Memory (MB) &bull; CPU % &bull; RAPL/INA219 Power (J)
            </div>
          </div>

          <div class="pipeline-connector">&darr;</div>

          <!-- Step 5: Analysis & Findings -->
          <div class="pipeline-node highlight" style="border-color: #10b981;">
            <div style="font-size: 0.7rem; color: #10b981; text-transform: uppercase; font-weight: 700;">Empirical Analysis</div>
            <div style="font-size: 0.95rem;">Statistical Aggregation & Trade-off Characterization</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Descriptive Statistics (Mean, Median, &sigma;, IQR) &bull; Cloud vs. Edge Deployment Fit
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
