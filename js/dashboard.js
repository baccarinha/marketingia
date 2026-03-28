/* ─── DASHBOARD ──────────────────────────────────────────────────────────────── */
function renderDashboard() {
  const el = document.getElementById("tab-dashboard");
  const ativas = campaigns.filter(c => c.status === "Ativa");
  const totalOrc  = campaigns.reduce((a, c) => a + Number(c.orcamento  || 0), 0);
  const totalInv  = campaigns.reduce((a, c) => a + Number(c.investido   || 0), 0);
  const totalRec  = campaigns.reduce((a, c) => a + Number(c.receita     || 0), 0);
  const totalLeads = campaigns.reduce((a, c) => a + Number(c.leads       || 0), 0);
  const totalConv  = campaigns.reduce((a, c) => a + Number(c.conversoes  || 0), 0);
  const roi    = totalInv > 0 ? (((totalRec - totalInv) / totalInv) * 100).toFixed(1) : 0;
  const roiPos = Number(roi) >= 0;

  const kpis = [
    { label:"Total Investido",  value:currency(totalInv), sub:`Orçado: ${currency(totalOrc)}`, color:"#2563EB",                     icon:"💰" },
    { label:"Receita Gerada",   value:currency(totalRec), sub:`ROI: ${roi}%`,                  color:roiPos ? "#10B981" : "#EF4444", icon:"📈" },
    { label:"Leads Gerados",    value:totalLeads.toLocaleString(), sub:`${totalConv} conversões`, color:"#7C3AED",                   icon:"👥" },
    { label:"Campanhas Ativas", value:ativas.length,      sub:`de ${campaigns.length} total`,  color:"#F59E0B",                     icon:"🚀" },
  ];

  const top = [...campaigns].filter(c => Number(c.receita) > 0)
    .sort((a, b) => Number(b.receita) - Number(a.receita)).slice(0, 4);

  const topHTML = top.length === 0
    ? `<div class="empty-state">Nenhuma campanha com receita ainda</div>`
    : top.map(c => {
        const pct = totalRec > 0 ? ((Number(c.receita) / totalRec) * 100).toFixed(0) : 0;
        const cfg = statusCfg(c.status);
        return `
          <div class="top-campaign-item">
            <div class="top-camp-header">
              <div class="top-camp-left">
                <div class="top-camp-swatch" style="background:${c.cor}"></div>
                <span class="top-camp-name">${c.nome}</span>
              </div>
              <div class="top-camp-right">
                <span class="top-camp-value">${currency(c.receita)}</span>
                <span class="status-badge" style="background:${cfg.bg};color:${cfg.color}">${c.status}</span>
              </div>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${pct}%;background:${c.cor}"></div>
            </div>
            <div class="top-camp-meta">
              <span>${c.canal}</span><span>${pct}% da receita total</span>
            </div>
          </div>`;
      }).join("");

  const resumoRows = [
    { label:"Orçamento Total", value:totalOrc,            color:"#2563EB" },
    { label:"Total Investido", value:totalInv,            color:"#7C3AED" },
    { label:"Receita Total",   value:totalRec,            color:"#10B981" },
    { label:"Lucro / Prejuízo",value:totalRec - totalInv, color:(totalRec - totalInv) >= 0 ? "#10B981" : "#EF4444" },
  ];

  const activasHTML = ativas.length === 0 ? "" : `
    <div class="card" style="padding:22px;margin-top:0" id="dash-active">
      <div class="section-title"><span class="live-dot"></span>Campanhas em Andamento</div>
      <div class="active-camps-grid">
        ${ativas.map(c => {
          const start = parseD(c.inicio), end = parseD(c.fim);
          const total = (end - start) / 86400000;
          const elapsed = Math.max(0, Math.min(total, (T - start) / 86400000));
          const pct = total > 0 ? Math.round((elapsed / total) * 100) : 0;
          return `
            <div class="active-card" style="border-color:${c.cor};border-left-color:${c.cor}">
              <div class="active-card-name">${c.nome}</div>
              <div class="active-card-meta">${c.canal} · até ${fmt(end)}</div>
              <div class="progress-track">
                <div class="progress-fill" style="width:${pct}%;background:${c.cor}"></div>
              </div>
              <div class="active-card-pct">${pct}% do período</div>
            </div>`;
        }).join("")}
      </div>
    </div>`;

  el.innerHTML = `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Visão geral de todas as campanhas · ${fmt(T)}</p>
    </div>
    <div class="grid-4" id="dash-kpis" style="margin-bottom:24px">
      ${kpis.map(k => `
        <div class="card kpi-card">
          <div class="kpi-icon">${k.icon}</div>
          <div class="kpi-label">${k.label.toUpperCase()}</div>
          <div class="kpi-value">${k.value}</div>
          <div class="kpi-sub" style="color:${k.color}">${k.sub}</div>
          <div class="kpi-bar" style="background:linear-gradient(90deg,${k.color}40,${k.color})"></div>
        </div>`).join("")}
    </div>
    <div id="dash-mid" style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card" style="padding:22px">
        <div class="section-title-row">
          <div class="section-title" style="margin-bottom:0">Top Campanhas por Receita</div>
          <button class="btn-link" onclick="setTab('campanhas')">Ver todas →</button>
        </div>
        ${topHTML}
      </div>
      <div class="card" style="padding:22px">
        <div class="section-title">Resumo Financeiro</div>
        ${resumoRows.map(r => `
          <div class="dash-row">
            <div class="dash-row-left">
              <div class="dash-row-bar" style="background:${r.color}"></div>
              <span class="dash-row-label">${r.label}</span>
            </div>
            <span style="color:${r.color};font-weight:700;font-size:14px">${currency(r.value)}</span>
          </div>`).join("")}
        <div style="margin-top:16px;padding:12px 14px;background:${roiPos ? "rgba(16,185,129,.08)" : "rgba(239,68,68,.08)"};border:1px solid ${roiPos ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)"};border-radius:10px;text-align:center">
          <div style="color:rgba(255,255,255,.4);font-size:11px;font-weight:700;letter-spacing:1px;margin-bottom:4px">ROI GERAL</div>
          <div style="color:${roiPos ? "#10B981" : "#EF4444"};font-weight:800;font-size:28px">${roi}%</div>
        </div>
      </div>
    </div>
    ${activasHTML}
  `;
}
