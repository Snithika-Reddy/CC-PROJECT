/**
 * Section 18: Research Questions (RQ1 - RQ7).
 * Formulates the empirical research questions driving the benchmark study without predetermined bias.
 */

export function renderResearchQuestions(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const questions = [
    {
      id: 'RQ1',
      title: 'Startup & Cold-Start Latency',
      desc: 'How does WebAssembly (WasmEdge AOT) compare with OCI containers (Docker / runc) in end-to-end initialization and cold-start latency when serving an AI inference request from a dormant state?'
    },
    {
      id: 'RQ2',
      title: 'Active & Idle Memory Footprint',
      desc: 'What is the comparative resident set size (RSS) and active memory consumption of the containerized Python/ONNX stack versus the linear memory sandbox of WebAssembly?'
    },
    {
      id: 'RQ3',
      title: 'Latency Behavior Under Increasing Concurrency',
      desc: 'How do p50, p95, and p99 inference latencies degrade across execution models as request concurrency scales from low load (10 VUs) to high stress (1000 VUs)?'
    },
    {
      id: 'RQ4',
      title: 'Throughput & Saturation Thresholds',
      desc: 'What maximum sustained request throughput (RPS) can each runtime deliver before hitting queue saturation or thread contention limits on identical host cores?'
    },
    {
      id: 'RQ5',
      title: 'Cross-Architecture Parity (x86-64 vs. ARM64)',
      desc: 'Does the relative performance ratio between WebAssembly and OCI containers remain invariant when transitioning from x86-64 server processors to ARM64 cloud/edge cores?'
    },
    {
      id: 'RQ6',
      title: 'Edge Constraint Suitability',
      desc: 'How viable are the respective deployment models on thermally and memory-constrained edge hardware (e.g. Raspberry Pi 4B) where host daemons impose non-trivial resource penalties?'
    },
    {
      id: 'RQ7',
      title: 'Multi-Dimensional Deployment Trade-Offs',
      desc: 'What holistic trade-offs emerge when balancing startup speed, raw throughput, ecosystem maturity, memory density, and operational complexity for production AI serving?'
    }
  ];

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Core Research Questions (RQ1 &ndash; RQ7)</h2>
          <div class="section-subtitle">
            Open empirical inquiries guiding data collection and benchmark interpretation without predetermined conclusions
          </div>
        </div>
        <div class="badge badge-tech">Inquiry Framework</div>
      </div>

      <div class="grid-3" style="gap: 1rem;">
        ${questions.map(q => `
          <div class="rq-card">
            <span class="rq-badge">${q.id}</span>
            <div class="rq-title">${q.title}</div>
            <div class="rq-desc">${q.desc}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
