import { Chart, registerables } from 'chart.js';
import { calculateStats, groupRecords } from '../analytics/statistics.js';

Chart.register(...registerables);

// Configure Chart.js global research dark theme
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.plugins.tooltip.backgroundColor = '#0f172a';
Chart.defaults.plugins.tooltip.titleColor = '#f8fafc';
Chart.defaults.plugins.tooltip.bodyColor = '#cbd5e1';
Chart.defaults.plugins.tooltip.borderColor = '#334155';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 6;
Chart.defaults.plugins.tooltip.usePointStyle = true;

const COLORS = {
  'Native': { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.65)' },
  'Docker / OCI': { border: '#818cf8', bg: 'rgba(129, 140, 248, 0.65)' },
  'WebAssembly': { border: '#34d399', bg: 'rgba(52, 211, 153, 0.65)' },
  'x86-64': { border: '#60a5fa', bg: 'rgba(96, 165, 250, 0.65)' },
  'ARM64': { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.65)' }
};

export class ChartManager {
  constructor() {
    this.comparisonChart = null;
    this.scalingChart = null;
    this.architectureChart = null;
    this.resourceChart = null;
  }

  destroyAll() {
    if (this.comparisonChart) this.comparisonChart.destroy();
    if (this.scalingChart) this.scalingChart.destroy();
    if (this.architectureChart) this.architectureChart.destroy();
    if (this.resourceChart) this.resourceChart.destroy();
  }

  /**
   * Render or update Performance Comparison Chart (Bar)
   */
  updateComparisonChart(canvasId, store) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { metric, concurrency, aggMode } = store.filters;
    const records = store.getFilteredRecords();

    // Group by runtime
    const groupedByRuntime = groupRecords(records, 'runtime');
    const runtimes = Object.keys(groupedByRuntime).sort();

    const labels = runtimes.map(r => r);
    const dataValues = [];
    const stdDevs = [];
    const backgroundColors = [];
    const borderColors = [];

    runtimes.forEach(rt => {
      const rtRecords = groupedByRuntime[rt] || [];
      const values = rtRecords.map(r => r[metric]).filter(v => v !== null && v !== undefined);
      const stats = calculateStats(values);
      const val = aggMode === 'median' ? stats.median : stats.mean;
      dataValues.push(val);
      stdDevs.push(stats.stdDev);

      const c = COLORS[rt] || { border: '#94a3b8', bg: 'rgba(148, 163, 184, 0.5)' };
      backgroundColors.push(c.bg);
      borderColors.push(c.border);
    });

    const metricLabel = formatMetricName(metric);

    if (this.comparisonChart) {
      this.comparisonChart.destroy();
    }

    this.comparisonChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `${metricLabel} (${aggMode.toUpperCase()})`,
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => {
                const idx = item.dataIndex;
                const sd = stdDevs[idx];
                return `${item.dataset.label}: ${item.raw} ${getMetricUnit(metric)} ${sd ? `(±${sd})` : ''}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: `${metricLabel} (${getMetricUnit(metric)})`,
              color: '#94a3b8'
            },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }
          }
        }
      }
    });
  }

  /**
   * Render or update Load Scaling Chart (Line)
   */
  updateScalingChart(canvasId, store) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { metric, aggMode, architecture } = store.filters;

    // Filter by active architecture but keep all concurrencies to see full scaling curve
    const records = store.getFilteredRecords({ concurrency: 'ALL' });
    const concurrencies = [...new Set(records.map(r => r.concurrency))].sort((a, b) => a - b);
    const runtimes = ['Native', 'Docker / OCI', 'WebAssembly'];

    const datasets = runtimes.map(rt => {
      const rtRecords = records.filter(r => r.runtime === rt);
      const points = concurrencies.map(c => {
        const cRecords = rtRecords.filter(r => r.concurrency === c);
        const vals = cRecords.map(r => r[metric]).filter(v => v !== null && v !== undefined);
        const stats = calculateStats(vals);
        return aggMode === 'median' ? stats.median : stats.mean;
      });

      const color = COLORS[rt] || { border: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.2)' };

      return {
        label: rt,
        data: points,
        borderColor: color.border,
        backgroundColor: color.bg,
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.2,
        fill: false
      };
    });

    if (this.scalingChart) {
      this.scalingChart.destroy();
    }

    const metricLabel = formatMetricName(metric);

    this.scalingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: concurrencies.map(c => `${c} VUs`),
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 14, font: { weight: 600 } }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (item) => `${item.dataset.label}: ${item.raw} ${getMetricUnit(metric)}`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Concurrent Request Load (k6 Virtual Users)',
              color: '#94a3b8'
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: `${metricLabel} (${getMetricUnit(metric)})`,
              color: '#94a3b8'
            },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }
          }
        }
      }
    });
  }

  /**
   * Render or update Cross-Architecture Chart (Grouped Bar: x86-64 vs ARM64)
   */
  updateArchitectureChart(canvasId, store) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { metric, aggMode } = store.filters;
    const records = store.getFilteredRecords({ architecture: 'ALL' });
    const runtimes = ['Native', 'Docker / OCI', 'WebAssembly'];
    const architectures = ['x86-64', 'ARM64'];

    const datasets = architectures.map(arch => {
      const archRecords = records.filter(r => r.architecture === arch);
      const data = runtimes.map(rt => {
        const rtRecords = archRecords.filter(r => r.runtime === rt);
        const vals = rtRecords.map(r => r[metric]).filter(v => v !== null && v !== undefined);
        const stats = calculateStats(vals);
        return aggMode === 'median' ? stats.median : stats.mean;
      });

      const color = COLORS[arch] || { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.6)' };

      return {
        label: arch,
        data,
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 1.5,
        borderRadius: 4
      };
    });

    if (this.architectureChart) {
      this.architectureChart.destroy();
    }

    const metricLabel = formatMetricName(metric);

    this.architectureChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: runtimes,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 14 }
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: ${item.raw} ${getMetricUnit(metric)}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: `${metricLabel} (${getMetricUnit(metric)})`,
              color: '#94a3b8'
            },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }
          }
        }
      }
    });
  }

  /**
   * Render or update Resource Utilization Chart (Memory & CPU)
   */
  updateResourceChart(canvasId, store, resourceType = 'memory_mb') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const records = store.getFilteredRecords({ concurrency: 'ALL' });
    const concurrencies = [...new Set(records.map(r => r.concurrency))].sort((a, b) => a - b);
    const runtimes = ['Native', 'Docker / OCI', 'WebAssembly'];

    const datasets = runtimes.map(rt => {
      const rtRecords = records.filter(r => r.runtime === rt);
      const points = concurrencies.map(c => {
        const cRecords = rtRecords.filter(r => r.concurrency === c);
        const vals = cRecords.map(r => r[resourceType]).filter(v => v !== null && v !== undefined);
        const stats = calculateStats(vals);
        return stats.mean;
      });

      const color = COLORS[rt] || { border: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.2)' };

      return {
        label: rt,
        data: points,
        borderColor: color.border,
        backgroundColor: color.bg,
        borderWidth: 2,
        pointRadius: 4,
        tension: 0.2
      };
    });

    if (this.resourceChart) {
      this.resourceChart.destroy();
    }

    const titleText = resourceType === 'memory_mb' ? 'Memory Footprint (MB)' :
                      resourceType === 'cpu_percent' ? 'CPU Utilization (%)' :
                      'Energy Telemetry (Joules)';

    this.resourceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: concurrencies.map(c => `${c} VUs`),
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Request Concurrency' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: titleText },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }
          }
        }
      }
    });
  }
}

export function formatMetricName(key) {
  const map = {
    startup_ms: 'Cold-Start Time',
    latency_p50_ms: 'p50 Latency',
    latency_p95_ms: 'p95 Latency',
    latency_p99_ms: 'p99 Latency',
    rps: 'Throughput (RPS)',
    memory_mb: 'Memory Footprint',
    cpu_percent: 'CPU Utilization',
    energy_joules: 'Energy Consumption'
  };
  return map[key] || key;
}

export function getMetricUnit(key) {
  if (key.includes('_ms')) return 'ms';
  if (key === 'rps') return 'req/s';
  if (key === 'memory_mb') return 'MB';
  if (key === 'cpu_percent') return '%';
  if (key === 'energy_joules') return 'J';
  return '';
}
