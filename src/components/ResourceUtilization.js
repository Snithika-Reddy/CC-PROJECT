/**
 * Section 9: Resource Utilization.
 * Evaluates memory footprint, CPU consumption, and energy telemetry under load.
 */

export function renderResourceUtilization(containerId, store, chartManager) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const records = store.getFilteredRecords();
  const hasEnergy = records.some(r => r.energy_joules !== null && r.energy_joules !== undefined);

  container.innerHTML = `
    <section class="research-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2>Host Resource Utilization: Memory, CPU & Energy</h2>
          <div class="section-subtitle">
            System-level footprint measured via cgroups v2, process RSS, and hardware energy sensors
          </div>
        </div>
        <div class="section-actions">
          <div class="btn-group" id="resource-toggle">
            <button class="btn-filter active" data-res="memory_mb">Memory Footprint</button>
            <button class="btn-filter" data-res="cpu_percent">CPU Utilization</button>
            ${hasEnergy ? `<button class="btn-filter" data-res="energy_joules">Energy Consumption</button>` : ''}
          </div>
        </div>
      </div>

      <div class="chart-container-wrapper" style="height: 275px;">
        <canvas id="chart-resource-utilization"></canvas>
      </div>

      <!-- Energy Telemetry Status Banner -->
      ${!hasEnergy ? `
        <div class="callout callout-warning">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <div>
            <strong>Energy Telemetry Notice:</strong> Energy telemetry is unavailable for this specific hardware environment. Hardware energy counters require Intel RAPL MSR access (restricted in hypervised AWS EC2 guest VMs) or physical INA219 current sensors on edge boards (e.g. Raspberry Pi testbeds). In compliance with research integrity standards, energy values are never fabricated or guessed.
          </div>
        </div>
      ` : `
        <div class="callout callout-info">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <div>
            <strong>Verified Hardware Telemetry:</strong> Energy values represent physical current shunt measurements on the 5V power bus (INA219 I2C sensor) during sustained 30-second inference bursts.
          </div>
        </div>
      `}
    </section>
  `;

  // Attach toggle listeners
  let activeRes = 'memory_mb';
  document.getElementById('resource-toggle')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-filter');
    if (btn) {
      document.querySelectorAll('#resource-toggle .btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRes = btn.getAttribute('data-res');
      chartManager.updateResourceChart('chart-resource-utilization', store, activeRes);
    }
  });

  // Render initial resource chart
  chartManager.updateResourceChart('chart-resource-utilization', store, activeRes);
}
