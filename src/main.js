import { store } from './data/dataStore.js';
import { ChartManager } from './charts/chartManager.js';
import { exportToCSV } from './data/csvParser.js';

// Component imports
import { renderHeader } from './components/Header.js';
import { renderPipeline } from './components/Pipeline.js';
import { renderConfigMatrix } from './components/ConfigMatrix.js';
import { renderBenchmarkControls } from './components/BenchmarkControls.js';
import { renderKeyMetrics } from './components/KeyMetrics.js';
import { renderPerformanceComparison } from './components/PerformanceComparison.js';
import { renderLoadScaling } from './components/LoadScaling.js';
import { renderCrossArchitecture } from './components/CrossArchitecture.js';
import { renderResourceUtilization } from './components/ResourceUtilization.js';
import { renderDatasetTable } from './components/DatasetTable.js';
import { renderStatisticalSummary } from './components/StatisticalSummary.js';
import { renderCloudEdgeContext } from './components/CloudEdgeContext.js';
import { renderArchitectureStack } from './components/ArchitectureStack.js';
import { renderExperimentalControls } from './components/ExperimentalControls.js';
import { renderLimitations } from './components/Limitations.js';
import { renderResearchQuestions } from './components/ResearchQuestions.js';
import { renderCsvImportModal } from './components/CsvImportModal.js';
import { renderFooter } from './components/Footer.js';

// Instantiate single chart manager instance
const chartManager = new ChartManager();

// Modal control reference
let modalController = null;

function handleOpenUpload() {
  if (modalController) {
    modalController.openModal();
  }
}

function handleExportCsv() {
  const records = store.getFilteredRecords();
  const csvContent = exportToCSV(records);
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `benchmark_export_${store.mode.toLowerCase()}_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Renders all reactive sections of the platform.
 */
function renderAll() {
  renderHeader('header-root', store, handleOpenUpload, handleExportCsv);
  renderBenchmarkControls('controls-root', store);
  renderKeyMetrics('kpi-root', store);
  renderPerformanceComparison('performance-root', store, chartManager);
  renderLoadScaling('scaling-root', store, chartManager);
  renderCrossArchitecture('architecture-root', store, chartManager);
  renderResourceUtilization('resource-root', store, chartManager);
  renderDatasetTable('table-root', store);
  renderStatisticalSummary('stats-root', store);
}

/**
 * Initializes static components and sets up subscriptions.
 */
function initializeApp() {
  // Static context sections
  renderPipeline('pipeline-root');
  renderConfigMatrix('config-root');
  renderCloudEdgeContext('cloud-edge-root');
  renderArchitectureStack('stack-root');
  renderExperimentalControls('controls-fairness-root');
  renderLimitations('limitations-root');
  renderResearchQuestions('rq-root');
  renderFooter('footer-root');

  // Initialize upload modal
  modalController = renderCsvImportModal('modal-root', store);

  // Initial reactive render
  renderAll();

  // Subscribe to state updates (filters change, dataset upload, demo toggle)
  store.subscribe(() => {
    renderAll();
  });

  console.log('[Antigravity Research Platform] Successfully mounted. Current state:', store.mode);
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
