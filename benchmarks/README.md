# Empirical Cross-Architecture Benchmark: WebAssembly vs. OCI Containers for Edge-Cloud AI Inference

## Research Overview
This directory contains the experimental harnesses, container definitions, WebAssembly compilation artifacts, load testing configurations, and automated telemetry collectors for evaluating:
1. **Native (Baseline)**: CPython 3.11 + ONNX Runtime on host OS
2. **Docker / OCI**: Containerized FastAPI service via `runc` / Docker 26.1
3. **WebAssembly**: Rust AOT-compiled module running under WasmEdge v0.13.5 with `wasi-nn`

Workload: **MobileNetV2** Image Classification (224x224 RGB, 1000 ImageNet categories).
Architectures Evaluated: **x86-64** (Intel Xeon Platinum) and **ARM64** (AWS Graviton3 / Raspberry Pi 4 Model B).

---

## Directory Structure
- `docker/`: FastAPI prediction server, Dockerfile for x86-64 and ARM64.
- `wasm/`: Rust source code utilizing `wasi-nn` compiled to `wasm32-wasip1`.
- `k6/`: Distributed load testing script modeling 10, 50, 100, 500, and 1000 concurrent Virtual Users.
- `runner/`: Orchestration script to cycle through runs and generate dashboard-compatible CSVs.

---

## Experimental Protocol & Fairness Controls
- **Model Consistency**: All engines ingest identical pre-trained MobileNetV2 ONNX weights (`mobilenetv2-7.onnx`).
- **Input Pipeline**: Uniform bilinear resize to $224 \times 224$ and ImageNet z-score normalization.
- **Warm-Up Protocol**: 30 seconds of sustained low-rate requests prior to telemetry recording.
- **Teardown**: Complete process termination and OS page cache purge (`echo 3 > /proc/sys/vm/drop_caches`) between runs.
- **Telemetry Integrity**: CPU and memory collected via cgroups v2 (`cpu.stat`, `memory.current`). Energy is recorded only when physical hardware telemetry (Intel RAPL MSR or INA219 current sensor) is verified.
