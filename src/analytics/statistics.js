/**
 * Statistical calculations for academic benchmarking analysis.
 * Adheres strictly to scientific neutrality: calculates descriptive statistics
 * without assuming winners or fabricating values.
 */

/**
 * Calculates mean, median, standard deviation, min, max, count, IQR, and CV.
 */
export function calculateStats(values) {
  const clean = values
    .filter(v => v !== null && v !== undefined && !isNaN(v))
    .map(Number)
    .sort((a, b) => a - b);

  if (clean.length === 0) {
    return {
      count: 0,
      mean: null,
      median: null,
      stdDev: null,
      variance: null,
      min: null,
      max: null,
      iqr: null,
      cv: null
    };
  }

  const count = clean.length;
  const sum = clean.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;

  // Median
  const mid = Math.floor(count / 2);
  const median = (count % 2 !== 0) ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2.0;

  // Min & Max
  const min = clean[0];
  const max = clean[count - 1];

  // Variance & Standard Deviation (Sample)
  let variance = 0;
  if (count > 1) {
    const squareDiffs = clean.map(val => Math.pow(val - mean, 2));
    variance = squareDiffs.reduce((acc, val) => acc + val, 0) / (count - 1);
  }
  const stdDev = Math.sqrt(variance);

  // Percentiles for IQR
  const q1 = calculatePercentile(clean, 25);
  const q3 = calculatePercentile(clean, 75);
  const iqr = (q3 !== null && q1 !== null) ? q3 - q1 : null;

  // Coefficient of Variation
  const cv = (mean !== 0 && stdDev !== null) ? (stdDev / mean) * 100.0 : 0.0;

  return {
    count,
    mean: round(mean, 2),
    median: round(median, 2),
    stdDev: round(stdDev, 2),
    variance: round(variance, 2),
    min: round(min, 2),
    max: round(max, 2),
    iqr: round(iqr, 2),
    cv: round(cv, 2)
  };
}

/**
 * Calculates the p-th percentile of a sorted numeric array using linear interpolation.
 */
export function calculatePercentile(sortedValues, p) {
  if (!sortedValues || sortedValues.length === 0) return null;
  if (p <= 0) return sortedValues[0];
  if (p >= 100) return sortedValues[sortedValues.length - 1];

  const index = (p / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) return sortedValues[lower];
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

/**
 * Computes neutral relative difference between a measured value and a baseline.
 * Example: target = 45ms, baseline = 50ms => delta = -10.0%
 */
export function calculateDelta(targetVal, baselineVal) {
  if (targetVal === null || targetVal === undefined || baselineVal === null || baselineVal === undefined || baselineVal === 0) {
    return { text: 'N/A', percent: 0, direction: 'neutral' };
  }

  const diff = targetVal - baselineVal;
  const pct = (diff / baselineVal) * 100.0;
  const sign = pct > 0 ? '+' : '';
  const text = `${sign}${round(pct, 1)}%`;

  let direction = 'neutral';
  if (Math.abs(pct) > 0.5) {
    direction = pct < 0 ? 'positive' : 'negative'; // For latency/memory, lower is typically preferred
  }

  return {
    text,
    percent: round(pct, 1),
    difference: round(diff, 2),
    direction
  };
}

/**
 * Groups an array of objects by a property.
 */
export function groupRecords(records, property) {
  return records.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) acc[key] = [];
    acc[key].push(obj);
    return acc;
  }, {});
}

/**
 * Rounds a number safely to specified decimals.
 */
export function round(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Number(Math.round(Number(val + 'e' + decimals)) + 'e-' + decimals);
}
