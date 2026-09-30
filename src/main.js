import { store } from './data/dataStore.js';
import { ChartManager } from './charts/chartManager.js';
import { exportToCSV } from './data/csvParser.js';
import { Router } from './router.js';

// Component imports
import { renderSidebar } from './components/Sidebar.js';
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
import { renderReproductionGuide } from './components/ReproductionGuide.js';
import { renderCsvImportModal } from './components/CsvImportModal.js';
import { renderFooter } from './components/Footer.js';

// Singletons
const chartManager = new ChartManager();
const router = new Router(['overview', 'performance', 'data', 'methodology', 'reproduction'], 'overview');
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
 * Renders the active page based on the current route.
 */
function renderActivePage(route) {
  const content = document.getElementById('page-content');
  if (!content) return;

  // Clean previous chart instances to prevent memory leaks
  chartManager.destroyAll();

  // Render Left Sidebar Navigation
  renderSidebar('sidebar-root', store, route, (target) => router.setRoute(target), handleOpenUpload, handleExportCsv);

  if (route === 'overview') {
    content.innerHTML = `
      <div id="header-root"></div>
      <div id="pipeline-root" style="margin-top: 1.5rem;"></div>
      <div id="config-root" style="margin-top: 1.5rem;"></div>
      <div id="controls-root" style="margin-top: 1.5rem;"></div>
      <div id="kpi-root" style="margin-top: 1.5rem;"></div>
      <div id="cloud-edge-root" style="margin-top: 1.5rem;"></div>
    `;
    renderHeader('header-root', store, handleOpenUpload, handleExportCsv);
    renderPipeline('pipeline-root');
    renderConfigMatrix('config-root');
    renderBenchmarkControls('controls-root', store);
    renderKeyMetrics('kpi-root', store);
    renderCloudEdgeContext('cloud-edge-root');
  } else if (route === 'performance') {
    content.innerHTML = `
      <div class="section-header" style="margin-bottom: 1rem;">
        <div class="section-title-group">
          <h1>Empirical Performance &amp; Scaling Analysis</h1>
          <div class="section-subtitle">
            Systematic latency, throughput, and hardware response curves across execution runtimes
          </div>
        </div>
      </div>
      <div id="controls-root"></div>
      <div id="performance-root" style="margin-top: 1.5rem;"></div>
      <div id="scaling-root" style="margin-top: 1.5rem;"></div>
      <div id="architecture-root" style="margin-top: 1.5rem;"></div>
      <div id="resource-root" style="margin-top: 1.5rem;"></div>
    `;
    renderBenchmarkControls('controls-root', store);
    renderPerformanceComparison('performance-root', store, chartManager);
    renderLoadScaling('scaling-root', store, chartManager);
    renderCrossArchitecture('architecture-root', store, chartManager);
    renderResourceUtilization('resource-root', store, chartManager);
  } else if (route === 'data') {
    content.innerHTML = `
      <div class="section-header" style="margin-bottom: 1rem;">
        <div class="section-title-group">
          <h1>Experimental Dataset &amp; Statistical Aggregation</h1>
          <div class="section-subtitle">
            Complete telemetry logs, multi-run sample metrics, and dynamic CSV export
          </div>
        </div>
      </div>
      <div id="controls-root"></div>
      <div id="table-root" style="margin-top: 1.5rem;"></div>
      <div id="stats-root" style="margin-top: 1.5rem;"></div>
    `;
    renderBenchmarkControls('controls-root', store);
    renderDatasetTable('table-root', store);
    renderStatisticalSummary('stats-root', store);
  } else if (route === 'methodology') {
    content.innerHTML = `
      <div class="section-header" style="margin-bottom: 1rem;">
        <div class="section-title-group">
          <h1>Research Methodology, Controls &amp; Limitations</h1>
          <div class="section-subtitle">
            Rigorous experimental setup, virtualization primitives, and open academic disclosures
          </div>
        </div>
      </div>
      <div id="stack-root"></div>
      <div id="controls-fairness-root" style="margin-top: 1.5rem;"></div>
      <div id="limitations-root" style="margin-top: 1.5rem;"></div>
      <div id="rq-root" style="margin-top: 1.5rem;"></div>
    `;
    renderArchitectureStack('stack-root');
    renderExperimentalControls('controls-fairness-root');
    renderLimitations('limitations-root');
    renderResearchQuestions('rq-root');
  } else if (route === 'reproduction') {
    content.innerHTML = `
      <div class="section-header" style="margin-bottom: 1rem;">
        <div class="section-title-group">
          <h1>Artifact Evaluation &amp; Reproduction Guide</h1>
          <div class="section-subtitle">
            Instructions to reproduce the MobileNetV2 benchmarks on physical hardware or cloud testbeds
          </div>
        </div>
      </div>
      <div id="reproduction-root"></div>
    `;
    renderReproductionGuide('reproduction-root');
  }

  // Render Footer
  renderFooter('footer-root');
}

/**
 * Initializes the application.
 */
function initializeApp() {
  // Mount modal controller
  modalController = renderCsvImportModal('modal-root', store);

  // Initial page render
  renderActivePage(router.currentRoute);

  // Re-render when route changes
  router.subscribe((route) => {
    renderActivePage(route);
  });

  // Re-render active page when data or filters update
  store.subscribe(() => {
    renderActivePage(router.currentRoute);
  });

  console.log('[Antigravity Research Platform] Multi-page architecture active. Current route:', router.currentRoute);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
