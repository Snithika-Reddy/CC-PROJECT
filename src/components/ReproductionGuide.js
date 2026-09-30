/**
 * Page 5: Reproduction Guide & Experiment Artifacts.
 * Complete scientific reproduction instructions, command-line guides, and code viewers.
 */

export function renderReproductionGuide(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Benchmark Reproduction Guide &amp; Artifacts</h2>
          <div class="section-subtitle">
            Step-by-step technical instructions to execute the empirical harness on physical testbeds or cloud instances
          </div>
        </div>
        <div class="badge badge-tech">Artifact Evaluation Standard</div>
      </div>

      <!-- Reproduction Steps Grid -->
      <div class="grid-3" style="gap: 1rem;">
        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="badge badge-tech" style="background-color: #2563eb; color: #fff;">Phase 1</span>
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">Target Environment Setup</span>
          </div>
          <p style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.5;">
            Provision an <strong>AWS EC2 c6i.2xlarge</strong> instance (Ubuntu 22.04 LTS) for x86-64 testing, or a <strong>Raspberry Pi 4 Model B</strong> (Debian 12 Bookworm) for ARM64 testing. Ensure CPU governor is locked to <code>performance</code> mode and disable hyper-threading if isolating physical cores.
          </p>
        </div>

        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="badge badge-tech" style="background-color: #818cf8; color: #fff;">Phase 2</span>
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">Runtime Build &amp; Compile</span>
          </div>
          <p style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.5;">
            Build the OCI container image using <code>docker build -f benchmarks/docker/Dockerfile.x86 -t mobilenet-oci .</code>.<br>
            For WebAssembly, compile Rust source via <code>cargo build --target wasm32-wasip1 --release</code>, followed by WasmEdge AOT optimization: <code>wasmedgec wasm-mobilenet-bench.wasm wasm-mobilenet-aot.wasm</code>.
          </p>
        </div>

        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="badge badge-tech" style="background-color: #10b981; color: #fff;">Phase 3</span>
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">Automated Execution</span>
          </div>
          <p style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.5;">
            Execute <code>python benchmarks/runner/run_experiment.py</code>. The orchestrator triggers k6 concurrency stages (10, 50, 100, 500, 1000 VUs), samples cgroups v2 memory and CPU metrics, queries RAPL/INA219 power counters, and emits standardized CSV records.
          </p>
        </div>
      </div>

      <!-- Code Artifacts Tabs -->
      <div style="margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase;">
            Benchmark Code Artifacts
          </span>
          <div class="btn-group" id="artifact-tabs">
            <button class="btn-filter active" data-tab="runner">run_experiment.py</button>
            <button class="btn-filter" data-tab="docker">docker/app.py</button>
            <button class="btn-filter" data-tab="wasm">wasm/src/main.rs</button>
            <button class="btn-filter" data-tab="k6">k6/load_test.js</button>
          </div>
        </div>

        <div id="artifact-content" style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; overflow-x: auto; max-height: 420px;">
          <pre class="mono" style="font-size: 0.775rem; color: #cbd5e1; line-height: 1.5;"><code id="artifact-code"></code></pre>
        </div>
      </div>
    </section>
  `;

  const snippets = {
    runner: `#!/usr/bin/env python3
# Automated Research Benchmark Runner (benchmarks/runner/run_experiment.py)
import os, time, csv, psutil
CONCURRENCIES = [10, 50, 100, 500, 1000]
RUNS = 5

def read_rapl_energy():
    rapl_path = "/sys/class/powercap/intel-rapl/intel-rapl:0/energy_uj"
    if os.path.exists(rapl_path):
        with open(rapl_path) as f:
            return int(f.read().strip()) / 1_000_000.0
    return None

# Cycles through Native, Docker, and WasmEdge across all concurrency tiers...`,
    docker: `# FastAPI MobileNetV2 Inference Worker (benchmarks/docker/app.py)
from fastapi import FastAPI, File, UploadFile
import onnxruntime as ort, numpy as np

app = FastAPI(title="MobileNetV2 OCI Worker")
SESSION = ort.InferenceSession("mobilenetv2-7.onnx")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Standard 224x224 RGB ImageNet preprocessing & ONNX session run
    ...`,
    wasm: `// Rust WasmEdge WASI-NN MobileNetV2 Inference (benchmarks/wasm/src/main.rs)
use wasi_nn::{ExecutionTarget, GraphBuilder, GraphEncoding};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let model_bytes = std::fs::read("mobilenetv2-7.onnx")?;
    let graph = unsafe {
        GraphBuilder::new(GraphEncoding::Onnx, ExecutionTarget::Cpu)
            .build_from_bytes(&[&model_bytes])?
    };
    let mut context = graph.init_execution_context()?;
    context.set_input(0, wasi_nn::TensorType::F32, &[1, 3, 224, 224], &tensor_data)?;
    context.compute()?;
    ...
}`,
    k6: `// Distributed k6 Load Testing Script (benchmarks/k6/load_test.js)
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    constant_concurrency: {
      executor: 'constant-vus',
      vus: parseInt(__ENV.CONCURRENCY || '10'),
      duration: '30s',
    },
  },
};

export default function () {
  const res = http.post('http://localhost:8000/predict', payload, params);
  check(res, { 'status 200': (r) => r.status === 200 });
}`
  };

  const codeEl = document.getElementById('artifact-code');
  if (codeEl) codeEl.textContent = snippets.runner;

  document.getElementById('artifact-tabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-filter');
    if (btn) {
      document.querySelectorAll('#artifact-tabs .btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      if (codeEl && snippets[tab]) {
        codeEl.textContent = snippets[tab];
      }
    }
  });
}
