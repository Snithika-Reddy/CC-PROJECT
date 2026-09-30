/**
 * Robust CSV parser, schema validator, and serializer for the
 * Antigravity Empirical Benchmark Platform.
 */

export const REQUIRED_COLUMNS = [
  'architecture',
  'runtime',
  'concurrency',
  'startup_ms',
  'latency_p50_ms',
  'latency_p95_ms',
  'latency_p99_ms',
  'rps',
  'memory_mb',
  'cpu_percent'
];

export const OPTIONAL_COLUMNS = [
  'run_id',
  'hardware',
  'os',
  'runtime_version',
  'energy_joules',
  'timestamp'
];

/**
 * Parses raw CSV text into an array of validated record objects.
 * Throws a descriptive Error if the format or required columns are invalid.
 */
export function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string' || !csvText.trim()) {
    throw new Error('CSV text is empty or not a valid string.');
  }

  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  // Parse header
  const rawHeaders = splitCSVLine(lines[0]);
  const headers = rawHeaders.map(h => h.trim().toLowerCase());

  // Check required columns
  const missing = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(`Schema validation failed. Missing required columns: ${missing.join(', ')}`);
  }

  const headerIndices = {};
  headers.forEach((h, idx) => {
    headerIndices[h] = idx;
  });

  const records = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const values = splitCSVLine(lines[i]);
    if (values.length < headers.length) {
      errors.push(`Row ${rowNum}: Expected ${headers.length} columns, found ${values.length}.`);
      continue;
    }

    try {
      const getVal = (col) => {
        const idx = headerIndices[col];
        if (idx !== undefined && idx < values.length) {
          return values[idx].trim();
        }
        return '';
      };

      const parseNum = (col, required = true) => {
        const str = getVal(col);
        if (str === '' || str === null || str === undefined) {
          if (required) throw new Error(`Missing value for '${col}'`);
          return null;
        }
        const n = parseFloat(str);
        if (isNaN(n)) {
          if (required) throw new Error(`Invalid numeric value '${str}' for '${col}'`);
          return null;
        }
        return n;
      };

      const energyStr = getVal('energy_joules');
      const energy = (energyStr !== '' && energyStr !== null && !isNaN(parseFloat(energyStr)))
        ? parseFloat(energyStr)
        : null;

      const record = {
        run_id: getVal('run_id') || `run_${String(i).padStart(3, '0')}`,
        architecture: normalizeArch(getVal('architecture')),
        runtime: normalizeRuntime(getVal('runtime')),
        concurrency: parseInt(getVal('concurrency'), 10) || 10,
        hardware: getVal('hardware') || 'Recorded Host System',
        os: getVal('os') || 'Linux',
        runtime_version: getVal('runtime_version') || 'v1.0.0',
        startup_ms: parseNum('startup_ms'),
        latency_p50_ms: parseNum('latency_p50_ms'),
        latency_p95_ms: parseNum('latency_p95_ms'),
        latency_p99_ms: parseNum('latency_p99_ms'),
        rps: parseNum('rps'),
        memory_mb: parseNum('memory_mb'),
        cpu_percent: parseNum('cpu_percent'),
        energy_joules: energy,
        timestamp: getVal('timestamp') || new Date().toISOString()
      };

      records.push(record);
    } catch (rowErr) {
      errors.push(`Row ${rowNum}: ${rowErr.message}`);
    }
  }

  if (records.length === 0) {
    throw new Error(`Failed to parse any valid rows. Errors:\n${errors.slice(0, 5).join('\n')}`);
  }

  return {
    records,
    errors: errors.slice(0, 10),
    metadata: computeMetadata(records)
  };
}

/**
 * Standardizes architecture labels.
 */
function normalizeArch(arch) {
  const a = (arch || '').trim().toLowerCase();
  if (a.includes('arm') || a.includes('aarch64')) return 'ARM64';
  if (a.includes('x86') || a.includes('amd64') || a.includes('x64')) return 'x86-64';
  return arch;
}

/**
 * Standardizes runtime labels.
 */
function normalizeRuntime(rt) {
  const r = (rt || '').trim().toLowerCase();
  if (r.includes('wasm') || r.includes('wasmedge')) return 'WebAssembly';
  if (r.includes('docker') || r.includes('oci') || r.includes('container')) return 'Docker / OCI';
  if (r.includes('native') || r.includes('host') || r.includes('baseline')) return 'Native';
  return rt;
}

/**
 * Robust CSV line splitter taking quotes into account.
 */
function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

/**
 * Computes summary metadata for a set of records.
 */
export function computeMetadata(records) {
  const architectures = [...new Set(records.map(r => r.architecture))];
  const runtimes = [...new Set(records.map(r => r.runtime))];
  const concurrencies = [...new Set(records.map(r => r.concurrency))].sort((a, b) => a - b);
  const runIds = [...new Set(records.map(r => r.run_id))];
  const hardwares = [...new Set(records.map(r => r.hardware))];
  const hasEnergy = records.some(r => r.energy_joules !== null && r.energy_joules !== undefined);

  return {
    totalRecords: records.length,
    architectures,
    runtimes,
    concurrencies,
    runIds,
    hardwares,
    hasEnergy
  };
}

/**
 * Serializes an array of records to clean CSV text for download.
 */
export function exportToCSV(records) {
  const cols = [
    'run_id', 'architecture', 'runtime', 'concurrency', 'hardware',
    'startup_ms', 'latency_p50_ms', 'latency_p95_ms', 'latency_p99_ms',
    'rps', 'memory_mb', 'cpu_percent', 'energy_joules', 'timestamp'
  ];

  const headerRow = cols.join(',');
  const rows = records.map(r => {
    return cols.map(c => {
      const val = r[c];
      if (val === null || val === undefined) return '';
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
      return val;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
}
