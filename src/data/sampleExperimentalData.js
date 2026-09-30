import rawEmpiricalCsv from '../../data/empirical_benchmark_results.csv?raw';
import { parseCSV } from './csvParser.js';

let parsedData = null;

export function getSampleExperimentalData() {
  if (!parsedData) {
    parsedData = parseCSV(rawEmpiricalCsv);
  }
  return parsedData;
}
