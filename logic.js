// ============================================================
// QUANTIZATION TABLE
// ============================================================
const QUANT_TABLE = {
  fp32:  { label: "FP32 (32-bit)",       bytesPerParam: 4.0   },
  fp16:  { label: "FP16 (16-bit)",       bytesPerParam: 2.0   },
  bf16:  { label: "BF16 (16-bit Brain)", bytesPerParam: 2.0   },
  q8:    { label: "Q8 (8-bit)",          bytesPerParam: 1.0   },
  q6:    { label: "Q6_K (6-bit)",        bytesPerParam: 0.75  },
  q5:    { label: "Q5_K_M (5-bit)",      bytesPerParam: 0.625 },
  q4:    { label: "Q4_K_M (4-bit)",      bytesPerParam: 0.5   },
  q3:    { label: "Q3_K_M (3-bit)",      bytesPerParam: 0.375 },
  q2:    { label: "Q2_K (2-bit)",        bytesPerParam: 0.25  },
  gguf1: { label: "1-bit (extreme)",     bytesPerParam: 0.125 },
};

// ============================================================
// LLM MODELS DATABASE
// ============================================================
const MODELS = [
  { name: "Phi-3 Mini 3.8B",          family: "phi",      params: 3.8e9,  layers: 32,  hidden: 3072  },
  { name: "Phi-3.5 Mini 3.8B",        family: "phi",      params: 3.8e9,  layers: 32,  hidden: 3072  },
  { name: "Gemma 2B",                 family: "gemma",    params: 2e9,    layers: 18,  hidden: 2048  },
  { name: "Gemma 7B",                 family: "gemma",    params: 7e9,    layers: 28,  hidden: 3072  },
  { name: "TinyLlama 1.1B",           family: "llama",    params: 1.1e9,  layers: 22,  hidden: 2048  },
  { name: "Qwen2.5 0.5B",             family: "qwen",     params: 0.5e9,  layers: 24,  hidden: 896   },
  { name: "Qwen2.5 1.5B",             family: "qwen",     params: 1.5e9,  layers: 28,  hidden: 1536  },
  { name: "Qwen2.5 3B",               family: "qwen",     params: 3e9,    layers: 36,  hidden: 2048  },
  { name: "SmolLM2 1.7B",             family: "smol",     params: 1.7e9,  layers: 24,  hidden: 2048  },
  { name: "DeepSeek-R1 Distill 1.5B", family: "deepseek", params: 1.5e9,  layers: 28,  hidden: 1536  },
  { name: "Llama 3.2 3B",             family: "llama",    params: 3e9,    layers: 28,  hidden: 3072  },
  { name: "Llama 3.1 8B",             family: "llama",    params: 8e9,    layers: 32,  hidden: 4096  },
  { name: "Llama 3 8B",               family: "llama",    params: 8e9,    layers: 32,  hidden: 4096  },
  { name: "Mistral 7B v0.3",          family: "mistral",  params: 7.24e9, layers: 32,  hidden: 4096  },
  { name: "Mistral NeMo 12B",         family: "mistral",  params: 12e9,   layers: 40,  hidden: 5120  },
  { name: "Qwen2.5 7B",               family: "qwen",     params: 7e9,    layers: 28,  hidden: 3584  },
  { name: "Qwen2.5 14B",              family: "qwen",     params: 14e9,   layers: 48,  hidden: 5120  },
  { name: "Gemma 2 9B",               family: "gemma",    params: 9e9,    layers: 42,  hidden: 3584  },
  { name: "Phi-3 Medium 14B",         family: "phi",      params: 14e9,   layers: 40,  hidden: 5120  },
  { name: "DeepSeek-R1 Distill 7B",   family: "deepseek", params: 7e9,    layers: 28,  hidden: 3584  },
  { name: "DeepSeek-R1 Distill 8B",   family: "deepseek", params: 8e9,    layers: 32,  hidden: 4096  },
  { name: "Yi 1.5 9B",                family: "yi",       params: 9e9,    layers: 48,  hidden: 4096  },
  { name: "CodeLlama 7B",             family: "llama",    params: 7e9,    layers: 32,  hidden: 4096  },
  { name: "Vicuna 7B",                family: "llama",    params: 7e9,    layers: 32,  hidden: 4096  },
  { name: "OpenHermes 7B",            family: "mistral",  params: 7e9,    layers: 32,  hidden: 4096  },
  { name: "Llama 2 13B",              family: "llama",    params: 13e9,   layers: 40,  hidden: 5120  },
  { name: "CodeLlama 13B",            family: "llama",    params: 13e9,   layers: 40,  hidden: 5120  },
  { name: "Mistral Small 22B",        family: "mistral",  params: 22e9,   layers: 56,  hidden: 6144  },
  { name: "Qwen2.5 32B",              family: "qwen",     params: 32e9,   layers: 64,  hidden: 5120  },
  { name: "Gemma 2 27B",              family: "gemma",    params: 27e9,   layers: 46,  hidden: 4608  },
  { name: "DeepSeek-R1 Distill 14B",  family: "deepseek", params: 14e9,   layers: 48,  hidden: 5120  },
  { name: "DeepSeek-R1 Distill 32B",  family: "deepseek", params: 32e9,   layers: 64,  hidden: 5120  },
  { name: "Yi 1.5 34B",               family: "yi",       params: 34e9,   layers: 60,  hidden: 7168  },
  { name: "CodeLlama 34B",            family: "llama",    params: 34e9,   layers: 48,  hidden: 8192  },
  { name: "Phi-4 14B",                family: "phi",      params: 14e9,   layers: 40,  hidden: 5120  },
  { name: "Llama 3.1 70B",            family: "llama",    params: 70e9,   layers: 80,  hidden: 8192  },
  { name: "Llama 3 70B",              family: "llama",    params: 70e9,   layers: 80,  hidden: 8192  },
  { name: "Llama 2 70B",              family: "llama",    params: 70e9,   layers: 80,  hidden: 8192  },
  { name: "Qwen2.5 72B",              family: "qwen",     params: 72e9,   layers: 80,  hidden: 8192  },
  { name: "Mistral Large 123B",       family: "mistral",  params: 123e9,  layers: 88,  hidden: 12288 },
  { name: "DeepSeek-R1 Distill 70B",  family: "deepseek", params: 70e9,   layers: 80,  hidden: 8192  },
  { name: "CodeLlama 70B",            family: "llama",    params: 70e9,   layers: 80,  hidden: 8192  },
  { name: "Yi 1.5 34B Chat",          family: "yi",       params: 34e9,   layers: 60,  hidden: 7168  },
  { name: "Llama 3.1 405B",           family: "llama",    params: 405e9,  layers: 126, hidden: 16384 },
  { name: "Mixtral 8x7B (MoE)",       family: "mistral",  params: 46.7e9, layers: 32,  hidden: 4096  },
  { name: "Mixtral 8x22B (MoE)",      family: "mistral",  params: 141e9,  layers: 56,  hidden: 6144  },
  { name: "DeepSeek-V3",              family: "deepseek", params: 671e9,  layers: 61,  hidden: 7168  },
  { name: "DeepSeek-R1",              family: "deepseek", params: 671e9,  layers: 61,  hidden: 7168  },
  { name: "Qwen2.5 72B Instruct",     family: "qwen",     params: 72e9,   layers: 80,  hidden: 8192  },
  { name: "Falcon 180B",              family: "falcon",   params: 180e9,  layers: 80,  hidden: 14848 },
];

// ============================================================
// GPU DATA
// ============================================================
let gpuData = [];

function loadGPUData(array) {
  gpuData = array.filter(g => typeof g.memorySize === "number" && g.memorySize >= 0.5);
  gpuData.sort((a, b) =>
    (a.vendor || "").localeCompare(b.vendor || "") || a.memorySize - b.memorySize
  );
  buildAdvancedFilterOptions();
  applyAllFilters();
  document.getElementById("gpuLoadingBanner").style.display = "none";
}

function getGPUById(id) { return gpuData.find(g => g.id === id) || null; }
function getVRAM(gpu)   { return gpu.memorySize; }

// ============================================================
// TOKEN-BASED SEARCH
// Every word in the query must appear somewhere — so "1080 ti"
// matches "GeForce GTX 1080 Ti" even though it's not a prefix.
// ============================================================
function tokenSearch(gpu, query) {
  if (!query.trim()) return true;
  const haystack = [
    gpu.name, gpu.vendor, gpu.architecture, gpu.generation,
    gpu.memoryType, gpu.gpuName,
    gpu.memorySize != null ? gpu.memorySize + "gb" : "",
  ].join(" ").toLowerCase();
  return query.trim().toLowerCase().split(/\s+/).every(tok => haystack.includes(tok));
}

// ============================================================
// ADVANCED FILTERS STATE
// ============================================================
const advFilters = {
  memorySize:      [],
  memoryType:      [],
  slot:            [],
  releaseYear:     [],
  memoryBus:       [],
  baseClock:       { min: "", max: "" },
  boostClock:      { min: "", max: "" },
  memoryClock:     { min: "", max: "" },
  memoryBandwidth: { min: "", max: "" },
  fp32:            { min: "", max: "" },
  fp16:            { min: "", max: "" },
  fp64:            { min: "", max: "" },
  pixelRate:       { min: "", max: "" },
  textureRate:     { min: "", max: "" },
  tmus:            { min: "", max: "" },
  rops:            { min: "", max: "" },
  rtCores:         { min: "", max: "" },
  l1Cache:         { min: "", max: "" },
  l2Cache:         { min: "", max: "" },
};

function uniq(arr) {
  return [...new Set(arr.filter(v => v != null && v !== ""))].sort((a, b) => a > b ? 1 : -1);
}

function buildAdvancedFilterOptions() {
  buildMultiCheckbox("af-memSize", uniq(gpuData.map(g => g.memorySize)),                        v => v + " GB",   "memorySize");
  buildMultiCheckbox("af-memType", uniq(gpuData.map(g => g.memoryType)),                        v => v,           "memoryType");
  buildMultiCheckbox("af-slot",    uniq(gpuData.map(g => g.slot).filter(Boolean)),              v => v,           "slot");
  buildMultiCheckbox("af-memBus",  uniq(gpuData.map(g => g.memoryBus).filter(v => v > 0)),     v => v + "-bit",  "memoryBus");
  buildMultiCheckbox("af-year",    uniq(gpuData.map(g => g.releaseDate ? g.releaseDate.slice(0,4) : null).filter(Boolean)), v => v, "releaseYear");
}

function buildMultiCheckbox(containerId, values, labelFn, filterKey) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = "";
  values.forEach(v => {
    const label = document.createElement("label");
    label.className = "af-check-label";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = v;
    cb.addEventListener("change", () => {
      advFilters[filterKey] = Array.from(el.querySelectorAll("input:checked")).map(i => i.value);
      applyAllFilters();
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(" " + labelFn(v)));
    el.appendChild(label);
  });
}

function applyAllFilters() {
  const searchTerm = document.getElementById("gpuSearch")?.value || "";
  const f = advFilters;

  const filtered = gpuData.filter(g => {
    if (!tokenSearch(g, searchTerm)) return false;
    if (f.memorySize.length  && !f.memorySize.includes(String(g.memorySize)))  return false;
    if (f.memoryType.length  && !f.memoryType.includes(g.memoryType))           return false;
    if (f.slot.length        && !f.slot.includes(g.slot))                       return false;
    if (f.memoryBus.length   && !f.memoryBus.includes(String(g.memoryBus)))    return false;
    if (f.releaseYear.length) {
      const yr = g.releaseDate ? g.releaseDate.slice(0,4) : null;
      if (!f.releaseYear.includes(yr)) return false;
    }
    // Range filters
    const ranges = [
      ["baseClock","baseClock"], ["boostClock","boostClock"],
      ["memoryClock","memoryClock"], ["memoryBandwidth","memoryBandwidth"],
      ["fp32","fp32"], ["fp16","fp16"], ["fp64","fp64"],
      ["pixelRate","pixelRate"], ["textureRate","textureRate"],
      ["tmus","tmus"], ["rops","rops"], ["rtCores","rtCores"],
      ["l1Cache","l1Cache"], ["l2Cache","l2Cache"],
    ];
    for (const [fk, gk] of ranges) {
      const {min, max} = f[fk];
      const val = g[gk];
      if (min !== "" && (val == null || val < parseFloat(min))) return false;
      if (max !== "" && (val == null || val > parseFloat(max))) return false;
    }
    return true;
  });

  populateGPUDropdown(filtered);
  updateSearchMeta(filtered.length, gpuData.length);
}

// ============================================================
// GPU DROPDOWN
// ============================================================
function populateGPUDropdown(filtered) {
  const gpuSelect = document.getElementById("gpuSelect");
  const prev = gpuSelect.value;
  gpuSelect.innerHTML = "";

  if (!filtered || filtered.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "— No GPUs match —";
    gpuSelect.appendChild(opt);
    return;
  }

  const vendors = {};
  filtered.forEach(gpu => {
    const v = (gpu.vendor || "other").toUpperCase();
    if (!vendors[v]) vendors[v] = [];
    vendors[v].push(gpu);
  });

  Object.keys(vendors).sort().forEach(vendor => {
    const group = document.createElement("optgroup");
    group.label = vendor;
    vendors[vendor].forEach(gpu => {
      const opt = document.createElement("option");
      opt.value = gpu.id;
      opt.textContent = `${gpu.name}  [${gpu.memorySize} GB]`;
      if (gpu.id === prev) opt.selected = true;
      group.appendChild(opt);
    });
    gpuSelect.appendChild(group);
  });
}

function updateSearchMeta(shown, total) {
  const el = document.getElementById("gpuSearchMeta");
  if (!el) return;
  el.textContent = shown === total
    ? `${total.toLocaleString()} GPUs loaded`
    : `${shown.toLocaleString()} of ${total.toLocaleString()} GPUs match`;
}

// ============================================================
// ADVANCED FILTER PANEL
// ============================================================
function toggleAdvancedFilters() {
  const panel = document.getElementById("advFiltersPanel");
  const btn   = document.getElementById("advFiltersBtn");
  const open  = panel.style.display === "none" || panel.style.display === "";
  panel.style.display = open ? "block" : "none";
  btn.textContent = open ? "▾ Advanced Filters" : "▸ Advanced Filters";
}

function setRangeFilter(key, bound, value) {
  advFilters[key][bound] = value;
  applyAllFilters();
}

function clearAdvancedFilters() {
  document.querySelectorAll("#advFiltersPanel input[type=checkbox]").forEach(cb => cb.checked = false);
  document.querySelectorAll("#advFiltersPanel input[type=number]").forEach(inp => inp.value = "");
  for (const key of Object.keys(advFilters)) {
    if (Array.isArray(advFilters[key])) advFilters[key] = [];
    else advFilters[key] = { min: "", max: "" };
  }
  applyAllFilters();
}

// ============================================================
// CORE MATH
// ============================================================
function calculateMemory(model, context, quant) {
  const bpp = QUANT_TABLE[quant].bytesPerParam;
  const weights  = model.params * bpp;
  const kvCache  = 2 * model.layers * model.hidden * context * 2;
  const overhead = Math.max(0.5 * (1024 ** 3), 0.08 * (weights + kvCache));
  const total    = weights + kvCache + overhead;
  return {
    weightsGB:  weights  / (1024 ** 3),
    kvCacheGB:  kvCache  / (1024 ** 3),
    overheadGB: overhead / (1024 ** 3),
    totalGB:    total    / (1024 ** 3),
  };
}

function calculateMaxContext(model, quant, gpuVram) {
  const bpp = QUANT_TABLE[quant].bytesPerParam;
  const weights  = model.params * bpp;
  const overhead = Math.max(0.5 * (1024 ** 3), 0.08 * weights);
  const avail    = (gpuVram * (1024 ** 3)) - weights - overhead;
  if (avail <= 0) return 0;
  return Math.max(0, Math.floor(avail / (2 * model.layers * model.hidden * 2)));
}

function classify(memory, gpuVram, systemRam) {
  const t = memory.totalGB;
  if (t <= gpuVram * 0.85)            return { status: "SAFE",    description: "Runs fully on GPU with headroom" };
  if (t <= gpuVram)                    return { status: "TIGHT",   description: "Fits in GPU VRAM (tight)" };
  if (t <= gpuVram + systemRam * 0.8)  return { status: "OFFLOAD", description: "Requires CPU/RAM offload (slower)" };
  return                                      { status: "NO",      description: "Insufficient memory — cannot run" };
}

// ============================================================
// MAIN CHECK
// ============================================================
function checkCompatibility() {
  const selectedId   = document.getElementById("gpuSelect").value;
  const context      = parseInt(document.getElementById("context").value);
  const quant        = document.getElementById("quantSelect").value;
  const systemRam    = parseFloat(document.getElementById("ramInput").value);
  const familyFilter = document.getElementById("familyFilter")?.value || "all";

  if (!selectedId)                  { alert("Please select a GPU");          return; }
  if (!systemRam || systemRam <= 0) { alert("Please enter your system RAM"); return; }

  const gpu     = getGPUById(selectedId);
  const gpuVram = getVRAM(gpu);
  const models  = familyFilter === "all" ? MODELS : MODELS.filter(m => m.family === familyFilter);

  const results = models.map(model => {
    const memory         = calculateMemory(model, context, quant);
    const classification = classify(memory, gpuVram, systemRam);
    const maxContext     = calculateMaxContext(model, quant, gpuVram);
    const usage          = (memory.totalGB / gpuVram) * 100;
    return {
      name: model.name, family: model.family, params: model.params, memory,
      status: classification.status, description: classification.description,
      headroomPercent: Math.max(0, 100 - usage), gpuUsagePercent: usage, maxContext,
    };
  });

  const order = { SAFE: 0, TIGHT: 1, OFFLOAD: 2, NO: 3 };
  results.sort((a, b) => (order[a.status] - order[b.status]) || (a.memory.totalGB - b.memory.totalGB));
  renderResults(results, gpuVram, systemRam, quant, gpu);
}

// ============================================================
// RENDER
// ============================================================
function renderResults(results, gpuVram, systemRam, quant, gpu) {
  const container  = document.getElementById("results");
  const quantLabel = QUANT_TABLE[quant].label;
  const safe    = results.filter(r => r.status === "SAFE");
  const tight   = results.filter(r => r.status === "TIGHT");
  const offload = results.filter(r => r.status === "OFFLOAD");
  const no      = results.filter(r => r.status === "NO");

  const badges = [gpu.vendor?.toUpperCase(), gpu.architecture, gpu.generation,
    gpu.memoryType, gpu.releaseDate ? gpu.releaseDate.slice(0,4) : null]
    .filter(Boolean).map(b => `<span class="badge">${b}</span>`).join("");

  let html = `<div class="summary-bar">
    <div class="summary-gpu"><span class="gpu-name">${gpu.name}</span><span class="gpu-vram">${gpuVram} GB VRAM</span>${badges}</div>
    <div class="summary-config">System RAM: <strong>${systemRam} GB</strong> &nbsp;|&nbsp; Quantization: <strong>${quantLabel}</strong> &nbsp;|&nbsp; Models: <strong>${results.length}</strong></div>
    <div class="summary-counts">
      <span class="count safe-count">✓ ${safe.length} SAFE</span>
      <span class="count tight-count">⚡ ${tight.length} TIGHT</span>
      <span class="count offload-count">↕ ${offload.length} OFFLOAD</span>
      <span class="count no-count">✗ ${no.length} WON'T RUN</span>
    </div></div>`;

  if (safe.length)    html += renderSection("safe-label",    "✓ SAFE TO RUN",       safe,    gpuVram);
  if (tight.length)   html += renderSection("tight-label",   "⚡ TIGHT FIT",         tight,   gpuVram);
  if (offload.length) html += renderSection("offload-label", "↕ NEEDS RAM OFFLOAD", offload, gpuVram);
  if (no.length)      html += renderSection("no-label",      "✗ CANNOT RUN",        no,      gpuVram);

  container.innerHTML = html;
  container.style.display = "block";
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderSection(labelClass, title, items, gpuVram) {
  return `<div class="result-section">
    <h3 class="section-label ${labelClass}">${title} (${items.length})</h3>
    ${items.map(r => renderModel(r, gpuVram)).join("")}
  </div>`;
}

function renderModel(r, gpuVram) {
  const sid  = r.name.replace(/[^a-zA-Z0-9]/g, "-");
  const did  = `details-${sid}`;
  const bw   = Math.min(100, r.gpuUsagePercent).toFixed(1);
  const cls  = r.status.toLowerCase();
  const pStr = r.params >= 1e12 ? (r.params/1e12).toFixed(1)+"T"
             : r.params >= 1e9  ? (r.params/1e9).toFixed(1)+"B"
             :                    (r.params/1e6).toFixed(0)+"M";
  const ctx  = r.maxContext > 0 ? `~${r.maxContext.toLocaleString()} tokens` : "Exceeds VRAM at base weights";
  return `
    <div class="model-card ${cls}">
      <div class="model-header">
        <div class="model-title">
          <span class="model-name">${r.name}</span>
          <span class="model-params">${pStr}</span>
          <span class="model-family">${r.family}</span>
        </div>
        <div class="model-status-badge ${cls}">${r.status}</div>
      </div>
      <div class="vram-bar-wrap">
        <div class="vram-bar-track"><div class="vram-bar-fill ${cls}" style="width:${bw}%"></div></div>
        <span class="vram-bar-label">${r.memory.totalGB.toFixed(2)} GB / ${gpuVram} GB</span>
      </div>
      <div class="model-meta-row">
        <span class="meta-item">GPU usage: <strong>${r.gpuUsagePercent.toFixed(1)}%</strong></span>
        <span class="meta-item">Headroom: <strong>${r.headroomPercent.toFixed(1)}%</strong></span>
        <span class="meta-item">Max context: <strong>${ctx}</strong></span>
        <span class="meta-item meta-desc">${r.description}</span>
      </div>
      <div class="technical-toggle">
        <button onclick="toggleDetails('${did}')" class="details-btn" id="btn-${sid}">▸ Show breakdown</button>
        <div id="${did}" class="technical-details" style="display:none;">
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Weights</span><span class="detail-value">${r.memory.weightsGB.toFixed(2)} GB</span></div>
            <div class="detail-item"><span class="detail-label">KV Cache</span><span class="detail-value">${r.memory.kvCacheGB.toFixed(2)} GB</span></div>
            <div class="detail-item"><span class="detail-label">Overhead</span><span class="detail-value">${r.memory.overheadGB.toFixed(2)} GB</span></div>
            <div class="detail-item total"><span class="detail-label">Total Required</span><span class="detail-value">${r.memory.totalGB.toFixed(2)} GB</span></div>
          </div>
        </div>
      </div>
    </div>`;
}

function toggleDetails(id) {
  const el  = document.getElementById(id);
  const btn = document.getElementById("btn-" + id.replace("details-", ""));
  const show = el.style.display === "none";
  el.style.display = show ? "block" : "none";
  btn.textContent  = show ? "▾ Hide breakdown" : "▸ Show breakdown";
}

// ============================================================
// DROPDOWN HELPERS
// ============================================================
function populateQuantDropdown() {
  const sel = document.getElementById("quantSelect");
  sel.innerHTML = "";
  Object.keys(QUANT_TABLE).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key; opt.textContent = QUANT_TABLE[key].label;
    sel.appendChild(opt);
  });
  sel.value = "q4";
}

function populateFamilyFilter() {
  const sel = document.getElementById("familyFilter");
  if (!sel) return;
  sel.innerHTML = '<option value="all">All families</option>';
  [...new Set(MODELS.map(m => m.family))].sort().forEach(f => {
    const opt = document.createElement("option");
    opt.value = f; opt.textContent = f.charAt(0).toUpperCase() + f.slice(1);
    sel.appendChild(opt);
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  populateQuantDropdown();
  populateFamilyFilter();

  const slider = document.getElementById("context");
  const display = document.getElementById("contextDisplay");
  if (slider && display) {
    display.textContent = parseInt(slider.value).toLocaleString();
    slider.addEventListener("input", e => {
      display.textContent = parseInt(e.target.value).toLocaleString();
    });
  }

  let debounce;
  document.getElementById("gpuSearch")?.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(applyAllFilters, 120);
  });
});
