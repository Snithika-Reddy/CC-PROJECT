import { getDemoData } from './demoData.js';
import { getSampleExperimentalData } from './sampleExperimentalData.js';
import { parseCSV, computeMetadata } from './csvParser.js';

class DataStore {
  constructor() {
    this.mode = 'DEMO'; // 'DEMO' | 'EXPERIMENTAL'
    this.records = [];
    this.metadata = {};
    this.listeners = new Set();

    this.filters = {
      architecture: 'ALL',
      runtime: 'ALL',
      concurrency: 'ALL',
      metric: 'latency_p95_ms',
      hardware: 'ALL',
      aggMode: 'mean' // 'mean' | 'median'
    };

    // Initialize with Demo data by default to honor "DEMO MODE by default" rule
    this.initializeDemo();
  }

  initializeDemo() {
    try {
      const demo = getDemoData();
      this.mode = 'DEMO';
      this.records = demo.records;
      this.metadata = demo.metadata;
    } catch (e) {
      console.error('Failed to initialize demo data:', e);
      this.records = [];
      this.metadata = computeMetadata([]);
    }
  }

  loadSampleExperimental() {
    const sample = getSampleExperimentalData();
    this.mode = 'EXPERIMENTAL';
    this.records = sample.records;
    this.metadata = sample.metadata;
    // Reset specific filters if needed
    this.filters.hardware = 'ALL';
    this.notify();
  }

  setDemoMode() {
    const demo = getDemoData();
    this.mode = 'DEMO';
    this.records = demo.records;
    this.metadata = demo.metadata;
    this.filters.hardware = 'ALL';
    this.notify();
  }

  loadCustomCSV(csvText) {
    const result = parseCSV(csvText);
    this.mode = 'EXPERIMENTAL';
    this.records = result.records;
    this.metadata = result.metadata;
    this.filters.hardware = 'ALL';
    this.notify();
    return result;
  }

  setFilter(key, value) {
    if (this.filters[key] !== value) {
      this.filters[key] = value;
      this.notify();
    }
  }

  getFilteredRecords(customOverride = {}) {
    const effectiveFilters = { ...this.filters, ...customOverride };
    return this.records.filter(r => {
      if (effectiveFilters.architecture !== 'ALL' && r.architecture !== effectiveFilters.architecture) {
        return false;
      }
      if (effectiveFilters.runtime !== 'ALL' && r.runtime !== effectiveFilters.runtime) {
        return false;
      }
      if (effectiveFilters.concurrency !== 'ALL' && r.concurrency !== Number(effectiveFilters.concurrency)) {
        return false;
      }
      if (effectiveFilters.hardware !== 'ALL' && r.hardware !== effectiveFilters.hardware) {
        return false;
      }
      return true;
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }
}

export const store = new DataStore();
