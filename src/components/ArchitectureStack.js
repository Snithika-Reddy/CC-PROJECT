/**
 * Section 15: Architecture Stack Comparison.
 * Layer-by-layer technical breakdown contrasting the OCI Container virtualization model
 * against the WebAssembly sandbox execution model.
 */

export function renderArchitectureStack(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Execution Stack Virtualization Models</h2>
          <div class="section-subtitle">
            Layer-by-layer architectural comparison of isolation primitives and execution overhead
          </div>
        </div>
        <div class="badge badge-tech">Virtualization Primitives</div>
      </div>

      <div class="grid-2" style="gap: 2rem;">
        <!-- Column 1: OCI Container Stack -->
        <div class="arch-stack-column">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 700; color: #818cf8; font-size: 0.95rem;">OCI / Docker Container Stack</span>
            <span class="badge badge-docker">OS-Level Isolation</span>
          </div>

          <div class="arch-layer active-layer" style="border-color: #818cf8; color: #818cf8;">
            AI Application Logic (Python / FastAPI Script)
          </div>
          <div class="arch-layer">
            Language Runtime &amp; Heavy Dependencies (Python 3.11, ONNX Runtime, NumPy, libc)
          </div>
          <div class="arch-layer">
            Root Filesystem &amp; Container Image Layers (~300MB - 1GB Base Image)
          </div>
          <div class="arch-layer">
            OCI Container Engine &amp; Daemon (Docker Engine, containerd, runc)
          </div>
          <div class="arch-layer">
            Host Linux Kernel Namespaces (PID, MNT, NET, IPC) &amp; cgroups v2
          </div>
          <div class="arch-layer" style="background-color: #1e293b; color: #cbd5e1;">
            Underlying Hardware Architecture (x86-64 / ARM64 CPU)
          </div>

          <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.4;">
            <strong>Pros:</strong> Universal language support, identical dev/prod environments, mature tooling.<br>
            <strong>Overhead:</strong> Hundreds of MBs image transfer, longer cold-start (namespace + Python init), higher memory baseline.
          </div>
        </div>

        <!-- Column 2: WebAssembly Stack -->
        <div class="arch-stack-column">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 700; color: #34d399; font-size: 0.95rem;">WebAssembly / WasmEdge Stack</span>
            <span class="badge badge-wasm">Capability-Based Sandbox</span>
          </div>

          <div class="arch-layer arch-layer-wasm" style="border-color: #34d399; color: #34d399;">
            Compiled Application Logic (Rust source compiled to wasm32-wasip1)
          </div>
          <div class="arch-layer">
            WASI-NN Standard Interface (Capability-based AI tensor bindings)
          </div>
          <div class="arch-layer">
            Self-Contained Wasm Module (~5MB - 20MB stripped binary)
          </div>
          <div class="arch-layer">
            Lightweight Wasm Runtime (WasmEdge AOT LLVM Engine / Host Plugin)
          </div>
          <div class="arch-layer">
            Host Operating System Kernel (Standard Linux / POSIX System Calls)
          </div>
          <div class="arch-layer" style="background-color: #1e293b; color: #cbd5e1;">
            Underlying Hardware Architecture (x86-64 / ARM64 CPU)
          </div>

          <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.4;">
            <strong>Pros:</strong> Sub-50ms cold-start, near-zero idle memory, bytecode portability across ISAs, sandboxed memory safety.<br>
            <strong>Overhead:</strong> Strict WASI ecosystem constraints, language compilation requirements, specialized neural network plugins.
          </div>
        </div>
      </div>
    </section>
  `;
}
