import rawDemoCsv from '../../data/demo_benchmark_results.csv?raw';
import { parseCSV } from './csvParser.js';

let parsedData = null;

export function getDemoData() {
  if (!parsedData) {
    parsedData = parseCSV(rawDemoCsv);
  }
  return parsedData;
}
