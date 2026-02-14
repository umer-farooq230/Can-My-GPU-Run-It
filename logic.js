function calculateMemory(model, context, quant, gpuVram, systemRam) {
  const bytesPerParam = QUANT_TABLE[quant].bytesPerParam;
  const weights = model.params * bytesPerParam;
  
  // KV cache: 2 (key+value) × layers × hidden × context × 2 bytes (FP16)
  const kvCache = 2 * model.layers * model.hidden * context * 2;
  
  // Overhead: at least 0.5GB or 8% of total
  const overhead = Math.max(0.5 * (1024 ** 3), 0.08 * (weights + kvCache));
  
  const totalGpuRequired = weights + kvCache + overhead;
  
  // Convert to GB
  const weightsGB = weights / (1024 ** 3);
  const kvCacheGB = kvCache / (1024 ** 3);
  const overheadGB = overhead / (1024 ** 3);
  const totalGB = totalGpuRequired / (1024 ** 3);
  
  return {
    weightsGB,
    kvCacheGB,
    overheadGB,
    totalGB
  };
}

function calculateMaxContext(model, quant, gpuVram) {
  const bytesPerParam = QUANT_TABLE[quant].bytesPerParam;
  const weights = model.params * bytesPerParam;
  const overhead = Math.max(0.5 * (1024 ** 3), 0.08 * weights);
  
  // Available VRAM for KV cache
  const availableForKV = (gpuVram * (1024 ** 3)) - weights - overhead;
  
  if (availableForKV <= 0) return 0;
  
  // Solve for context: kv = 2 × layers × hidden × context × 2
  const kvPerToken = 2 * model.layers * model.hidden * 2;
  const maxContext = Math.floor(availableForKV / kvPerToken);
  
  return Math.max(0, maxContext);
}

function classify(memory, gpuVram, systemRam) {
  const totalGB = memory.totalGB;
  const gpuVramGB = gpuVram;
  const systemRamGB = systemRam;
  
  if (totalGB <= gpuVramGB * 0.85) {
    return {
      status: "SAFE",
      description: "Runs entirely on GPU"
    };
  } else if (totalGB <= gpuVramGB) {
    return {
      status: "TIGHT",
      description: "Uses full GPU VRAM"
    };
  } else if (totalGB <= gpuVramGB + systemRamGB) {
    return {
      status: "TIGHT",
      description: "Requires RAM offload"
    };
  } else {
    return {
      status: "NO",
      description: "Cannot run"
    };
  }
}

function checkCompatibility() {
  const selectedGPU = document.getElementById("gpuSelect").value;
  const context = parseInt(document.getElementById("context").value);
  const quant = document.getElementById("quantSelect").value;
  const systemRam = parseInt(document.getElementById("ramInput").value);
  
  if (!selectedGPU) {
    alert("Please select a GPU");
    return;
  }
  
  if (!systemRam || systemRam <= 0) {
    alert("Please enter your system RAM");
    return;
  }
  
  const gpuVram = GPUS[selectedGPU].vram;
  
  const results = MODELS.map(model => {
    const memory = calculateMemory(model, context, quant, gpuVram, systemRam);
    const classification = classify(memory, gpuVram, systemRam);
    const maxContext = calculateMaxContext(model, quant, gpuVram);
    
    // Calculate headroom percentage
    const gpuUsagePercent = (memory.totalGB / gpuVram) * 100;
    const headroomPercent = Math.max(0, 100 - gpuUsagePercent);
    
    return {
      name: model.name,
      memory: memory,
      status: classification.status,
      description: classification.description,
      headroomPercent: headroomPercent,
      gpuUsagePercent: gpuUsagePercent,
      maxContext: maxContext
    };
  });
  
  // Sort by total memory required (ascending)
  results.sort((a, b) => a.memory.totalGB - b.memory.totalGB);
  
  renderResults(results, gpuVram, systemRam, quant);
}

function renderResults(results, gpuVram, systemRam, quant) {
  const container = document.getElementById("results");
  
  const safe = results.filter(r => r.status === "SAFE");
  const tight = results.filter(r => r.status === "TIGHT");
  const no = results.filter(r => r.status === "NO");
  
  const quantLabel = QUANT_TABLE[quant].label;
  
  let html = `
    <div class="summary">
      <div>GPU VRAM: ${gpuVram} GB | System RAM: ${systemRam} GB | Quantization: ${quantLabel}</div>
    </div>
  `;
  
  if (safe.length > 0) {
    html += `<div class="section">
      <h3 class="safe-label">✓ SAFE (${safe.length})</h3>
      ${safe.map(r => renderModel(r)).join('')}
    </div>`;
  }
  
  if (tight.length > 0) {
    html += `<div class="section">
      <h3 class="tight-label">⚠ TIGHT (${tight.length})</h3>
      ${tight.map(r => renderModel(r)).join('')}
    </div>`;
  }
  
  if (no.length > 0) {
    html += `<div class="section">
      <h3 class="no-label">✗ WON'T RUN (${no.length})</h3>
      ${no.map(r => renderModel(r)).join('')}
    </div>`;
  }
  
  container.innerHTML = html;
  container.style.display = 'block';
}

function renderModel(result) {
  const detailsId = `details-${result.name.replace(/\s+/g, '-')}`;
  
  return `
    <div class="model-result ${result.status.toLowerCase()}">
      <div class="model-header">
        <div class="model-name">${result.name}</div>
        <div class="model-stats">
          <span><strong>Required:</strong> ${result.memory.totalGB.toFixed(2)} GB</span>
          <span><strong>GPU Usage:</strong> ${result.gpuUsagePercent.toFixed(1)}%</span>
          <span><strong>Headroom:</strong> ${result.headroomPercent.toFixed(1)}%</span>
        </div>
        <div class="model-meta">
          <span>${result.description}</span>
          ${result.maxContext > 0 ? `<span>Max context: ~${result.maxContext.toLocaleString()} tokens</span>` : '<span>Exceeds GPU capacity at base weights</span>'}
        </div>
      </div>
      <div class="technical-toggle">
        <button onclick="toggleDetails('${detailsId}')" class="details-btn">Show Technical Details</button>
        <div id="${detailsId}" class="technical-details" style="display: none;">
          <div class="detail-row"><strong>Weights:</strong> ${result.memory.weightsGB.toFixed(2)} GB</div>
          <div class="detail-row"><strong>KV Cache:</strong> ${result.memory.kvCacheGB.toFixed(2)} GB</div>
          <div class="detail-row"><strong>Overhead:</strong> ${result.memory.overheadGB.toFixed(2)} GB</div>
          <div class="detail-row"><strong>Total Required:</strong> ${result.memory.totalGB.toFixed(2)} GB</div>
        </div>
      </div>
    </div>
  `;
}

function toggleDetails(id) {
  const element = document.getElementById(id);
  const isHidden = element.style.display === 'none';
  element.style.display = isHidden ? 'block' : 'none';
  
  // Update button text
  const button = element.previousElementSibling;
  button.textContent = isHidden ? 'Hide Technical Details' : 'Show Technical Details';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const gpuSelect = document.getElementById('gpuSelect');
  const quantSelect = document.getElementById('quantSelect');
  
  // Populate GPU dropdown
  Object.keys(GPUS).forEach(gpu => {
    const option = document.createElement('option');
    option.value = gpu;
    option.textContent = gpu;
    gpuSelect.appendChild(option);
  });
  
  // Populate quantization dropdown
  Object.keys(QUANT_TABLE).forEach(quant => {
    const option = document.createElement('option');
    option.value = quant;
    option.textContent = QUANT_TABLE[quant].label;
    quantSelect.appendChild(option);
  });
  
  // Set default quantization to 4-bit
  quantSelect.value = "4bit";
  
  // Update context display
  const contextSlider = document.getElementById('context');
  const contextDisplay = document.getElementById('contextDisplay');
  contextSlider.addEventListener('input', (e) => {
    contextDisplay.textContent = e.target.value;
  });
});