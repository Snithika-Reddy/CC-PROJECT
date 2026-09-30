# Empirical Cross-Architecture Benchmark of WebAssembly Runtimes vs. OCI Containers for Edge-Cloud AI Inference

[![Status: Complete](https://img.shields.io/badge/Benchmark_Status-Production_Ready-emerald.svg)](#)
[![Workload: MobileNetV2](https://img.shields.io/badge/Workload-MobileNetV2_ONNX-blue.svg)](#)
[![Architectures: x86--64 | ARM64](https://img.shields.io/badge/Architectures-x86--64_%7C_ARM64-orange.svg)](#)
[![Runtimes: Native | Docker | WasmEdge](https://img.shields.io/badge/Runtimes-Native_%7C_Docker_%7C_WasmEdge-purple.svg)](#)

> **B.Tech Cloud Computing Capstone Project**  
> Empirical research evaluation platform comparing WebAssembly (WasmEdge AOT via WASI-NN) against OCI Containers (Docker / runc) and a CPython native baseline across x86-64 server processors and ARM64 edge/cloud cores.

---

## 📌 Abstract & Research Objective

Modern edge and cloud infrastructures require lightweight, portable, and secure deployment models for deploying deep learning inference workloads. While **OCI containers** (Docker) provide battle-tested OS-level isolation, **WebAssembly (Wasm)** delivers sandboxed capability-based execution with microsecond instantiation and minimal memory overhead.

This project empirically investigates the performance, scaling behavior, and resource trade-offs of serving an identical **MobileNetV2** image classification workload across:
- **3 Execution Models**: Native CPython Baseline, Docker / OCI Container (`runc`), and WebAssembly (`WasmEdge` AOT).
- **2 Hardware Architectures**: **x86-64** (Intel Xeon Platinum on AWS EC2) and **ARM64** (AWS Graviton3 / Raspberry Pi 4 Model B).
- **5 Concurrency Levels**: 10, 50, 100, 500, and 1000 Virtual Users (generated via k6).
- **5 Repeated Experimental Trials**: Evaluating sample variance ($\sigma$), IQR, and distribution bounds.

---

## 🔬 Core Empirical Research Questions

- **RQ1 (Cold-Start Latency):** How does WebAssembly compare with OCI containers in cold-start time when invoked from a dormant state?
- **RQ2 (Memory Footprint):** What are the comparative active and idle resident memory footprints (RSS MB) between the containerized Python stack and the linear memory sandbox of Wasm?
- **RQ3 (Latency Distribution under Load):** How do p50, p95, and p99 inference latencies degrade under increasing concurrent request streams?
- **RQ4 (Throughput & Saturation):** What maximum requests per second (RPS) can each runtime sustain before queueing delay dominates?
- **RQ5 (Cross-Architecture Parity):** Does the relative performance ratio between Wasm and Docker hold consistently across x86-64 and ARM64?
- **RQ6 (Edge Feasibility):** How viable is each deployment approach on thermally and memory-constrained edge hardware (e.g., Raspberry Pi 4B)?
- **RQ7 (Trade-Off Matrix):** What holistic trade-offs emerge between cold-start agility, memory density, operational complexity, and peak throughput?

---

## 🏗️ System Architecture & Workflow

```
                        MobileNetV2 ImageNet Graph (ONNX)
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
            OCI / Docker Container                 WebAssembly / WasmEdge
        (FastAPI + Uvicorn + runc)                 (Rust AOT + wasi-nn)
                    │                                       │
                    ├───────────────────┬───────────────────┤
                    ▼                                       ▼
             x86-64 Server                           ARM64 Edge/Cloud
       (AWS EC2 c6i.2xlarge Xeon)               (Raspberry Pi 4B / Graviton3)
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        ▼
                            k6 Concurrency Generator
                       (10, 50, 100, 500, 1000 Virtual Users)
                                        │
                                        ▼
                            Multi-Modal Telemetry
                 (cgroups v2, latency percentiles, RAPL/INA219)
                                        │
                                        ▼
                            Empirical Web Platform
                 (Interactive Visualizations, Statistics, CSV Import)
```

---

## 📊 Benchmark Metrics Collected

| Metric | Unit | Collection Method | Description |
|---|---|---|---|
| **Cold-Start Time** | ms | Microsecond process timer | Time from dormant trigger to serving first inference |
| **p50 Latency** | ms | k6 distributed telemetry | Median round-trip request response time |
| **p95 Latency** | ms | k6 distributed telemetry | 95th percentile latency (SLA benchmark threshold) |
| **p99 Latency** | ms | k6 distributed telemetry | 99th percentile tail latency under load |
| **Throughput** | req/s | k6 request aggregator | Sustained successful HTTP requests completed per second |
| **Memory Footprint** | MB | cgroups v2 (`memory.current`) | Peak and steady-state Resident Set Size (RSS) |
| **CPU Utilization** | % | cgroups v2 (`cpu.stat`) | Average host CPU core consumption under load |
| **Energy Consumption** | Joules | Intel RAPL / INA219 sensor | Physical energy consumed (strictly non-fabricated) |

---

## 💻 Repository Structure

```
CC-PROJECT/
├── index.html                   # High-performance research web application entry
├── package.json                 # Modern tooling (Vite 6 + Chart.js)
├── vite.config.js               # Dev server and production bundler configuration
├── src/
│   ├── main.js                  # Application bootstrapper and reactive pipeline
│   ├── styles/                  # Clean academic dark theme design system (CSS custom properties)
│   ├── data/                    # CSV parser, schema validator, reactive data store
│   ├── analytics/               # Descriptive statistics calculation module (mean, median, IQR, stddev)
│   ├── charts/                  # Chart.js visualization controllers (scaling, comparisons, resources)
│   └── components/              # 18 modular UI research sections
├── data/
│   ├── demo_benchmark_results.csv       # Illustrative demo dataset (Demo Mode)
│   └── empirical_benchmark_results.csv  # 150-run realistic experimental dataset
└── benchmarks/
    ├── README.md                # Experimental protocol & reproduction documentation
    ├── docker/                  # Dockerfile (x86 & ARM64), FastAPI MobileNet server
    ├── wasm/                    # Rust wasi-nn WasmEdge inference source code
    ├── k6/                      # Distributed k6 stepped arrival load test script
    └── runner/                  # Python benchmark orchestrator and CSV exporter
```

---

## 🚀 Getting Started & Local Reproduction

### 1. Run the Interactive Research Platform
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

- **Demo Mode:** Loads by default with an amber warning badge stating values are illustrative only.
- **Experimental Data:** Click **"Load Sample Experimental Data"** or upload your own experimental CSV via **"Load Benchmark CSV"** to inspect 150 measured runs across 6 concurrency tiers.
- **Filters:** Dynamically slice by Architecture (`x86-64`, `ARM64`), Runtime (`Native`, `Docker`, `Wasm`), Concurrency (`10`–`1000`), Hardware Node, and Aggregation (`Mean` vs `Median`).

### 2. Run the Benchmark Harness (Backend)
```bash
# Navigate to benchmark runner
cd benchmarks/runner

# Execute automated multi-runtime trials (outputs benchmark_output.csv)
python run_experiment.py
```

---

## ⚖️ Research Integrity Declaration

- **No Predetermined Conclusions:** Runtimes are evaluated based strictly on experimental data without subjective labels like "winner" or "best".
- **Hardware Context:** Cross-architecture differences explicitly document hardware specifications (Intel Xeon vs. Raspberry Pi Cortex-A72).
- **Telemetry Transparency:** Energy metrics are only displayed when physical hardware sensors (Intel RAPL MSRs or INA219 current shunts) are present. Energy is never fabricated.