/* ─── CAMPANHAS ──────────────────────────────────────────────────────────────── */
function renderCampanhas() {
  const el = document.getElementById("tab-campanhas");
  const filtered = campaigns.filter(c => {
    const matchS = campFilter === "Todas" || c.status === campFilter;
    const matchQ = c.nome.toLowerCase().includes(campSearch.toLowerCase()) || c.canal.toLowerCase().includes(campSearch.toLowerCase());
    return matchS && matchQ;
  });

  el.innerHTML = `
    <div class="page-header-row">
      <div>
        <h1 style="color:#fff;font-weight:800;font-size:24px">Campanhas</h1>
        <p style="color:rgba(255,255,255,.35);font-size:13px;margin-top:3px">${campaigns.length} campanhas cadastradas</p>
      </div>
      <button class="btn-primary" onclick="openNewModal()">+ Nova Campanha</button>
    </div>
    <div class="filter-row">
      <input class="inp" style="width:220px;flex:none" placeholder="🔍 Buscar campanha..." oninput="setCampSearch(this.value)" value="${campSearch}" />
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${["Todas", ...STATUS_LIST].map(s => `
          <button class="filter-btn${campFilter === s ? " active" : ""}" onclick="setCampFilter('${s}')">${s}</button>
        `).join("")}
      </div>
    </div>
    <div id="camp-list">
      ${filtered.length === 0
        ? `<div style="text-align:center;padding:60px;color:rgba(255,255,255,.2)">Nenhuma campanha encontrada</div>`
        : filtered.map(c => campCardHTML(c)).join("")}
    </div>
  `;
}

function setCampFilter(f) { campFilter = f; renderCampanhas(); }
function setCampSearch(v) { campSearch = v; renderCampanhas(); }

function campCardHTML(c) {
  const start = parseD(c.inicio), end = parseD(c.fim);
  const total = (end - start) / 86400000;
  const elapsed = Math.max(0, Math.min(total, (T - start) / 86400000));
  const pct = total > 0 ? Math.round((elapsed / total) * 100) : 0;
  const cfg = statusCfg(c.status);
  const roi = Number(c.investido) > 0 ? (((Number(c.receita) - Number(c.investido)) / Number(c.investido)) * 100).toFixed(1) : null;
  const tags = (c.tags || []).map(t => `<span class="tag">#${t}</span>`).join("");

  return `
    <div class="card campaign-card">
      <div class="camp-bar" style="background:${c.cor}"></div>
      <div>
        <div class="camp-badges">
          <span class="camp-name">${c.nome}</span>
          <span class="status-badge" style="background:${cfg.bg};color:${cfg.color}">${c.status}</span>
          ${tags}
        </div>
        ${c.descricao ? `<div class="camp-desc">${c.descricao}</div>` : ""}
        <div class="camp-meta">
          <span>📅 ${fmt(start)} → ${fmt(end)}</span>
          <span>📡 ${c.canal}</span>
          <span>🎯 ${c.objetivo}</span>
          ${c.publico ? `<span>👥 ${c.publico}</span>` : ""}
        </div>
        <div class="camp-financials">
          <span>Orçamento: <b>${currency(c.orcamento)}</b></span>
          <span>Investido: <b style="color:#3B82F6">${currency(c.investido)}</b></span>
          <span>Receita: <b style="color:#10B981">${currency(c.receita)}</b></span>
          ${roi ? `<span>ROI: <b style="color:${Number(roi) >= 0 ? "#10B981" : "#EF4444"}">${roi}%</b></span>` : ""}
          ${Number(c.leads) > 0 ? `<span>Leads: <b style="color:#7C3AED">${c.leads}</b></span>` : ""}
        </div>
        <div class="progress-track" style="max-width:300px">
          <div class="progress-fill" style="width:${pct}%;background:${c.cor};opacity:.8"></div>
        </div>
        <div class="camp-pct">${pct}% do período</div>
      </div>
      <div class="camp-actions">
        <button class="btn-edit" onclick="openEditModal(${c.id})">✎</button>
        <button class="btn-del"  onclick="deleteCampaign(${c.id})">✕</button>
      </div>
    </div>`;
}

function deleteCampaign(id) {
  if (confirm("Remover esta campanha?")) {
    campaigns = campaigns.filter(c => c.id !== id);
    renderTab(currentTab);
  }
}
