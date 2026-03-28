/* ─── CONSTANTS ─────────────────────────────────────────────────────────────── */
const T = new Date();
const pad = n => String(n).padStart(2, "0");
const fmt = d => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const fmtI = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseD = s => { const [y, m, d] = s.split("-"); return new Date(+y, +m - 1, +d); };
const currency = v => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDay = (y, m) => new Date(y, m, 1).getDay();

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS   = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const CANAIS = ["Instagram","Facebook","Google Ads","TikTok","YouTube","E-mail Marketing","WhatsApp","LinkedIn","Multi-canal","Outros"];
const STATUS_LIST = ["Planejada","Ativa","Pausada","Encerrada"];
const OBJETIVOS = ["Gerar vendas","Aumentar seguidores","Gerar leads","Reconhecimento de marca","Lançamento de produto","Retenção de clientes","Outro"];
const COLS = ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#06B6D4","#84CC16","#F97316","#6366F1"];

const BR_DATES = {
  "01-01":"🎆 Ano Novo","02-12":"🎭 Carnaval","02-13":"🎭 Carnaval","04-18":"✝ Sexta Santa",
  "04-20":"🐣 Páscoa","05-01":"👷 Dia do Trabalho","05-11":"💐 Dia das Mães",
  "06-12":"❤️ Dia dos Namorados","08-10":"👔 Dia dos Pais","09-07":"🇧🇷 Independência",
  "10-12":"👑 N.Sra.Aparecida","10-31":"🎃 Halloween","11-02":"🕯 Finados",
  "11-15":"🇧🇷 Proclamação","11-28":"🛍 Black Friday","12-24":"🎄 Véspera Natal","12-25":"🎁 Natal","12-31":"🥂 Réveillon"
};

const statusCfg = s => ({
  Ativa:     { bg:"rgba(16,185,129,.15)",  color:"#10B981", dot:"#10B981" },
  Planejada: { bg:"rgba(59,130,246,.15)",  color:"#3B82F6", dot:"#3B82F6" },
  Pausada:   { bg:"rgba(245,158,11,.15)",  color:"#F59E0B", dot:"#F59E0B" },
  Encerrada: { bg:"rgba(100,100,120,.15)", color:"#888",    dot:"#666"    },
}[s] || { bg:"rgba(100,100,120,.15)", color:"#888", dot:"#666" });

/* ─── STATE ─────────────────────────────────────────────────────────────────── */
let campaigns = [
  { id:1, nome:"Lançamento Verão", inicio:"2026-03-01", fim:"2026-03-31", status:"Ativa", canal:"Instagram", objetivo:"Gerar vendas", orcamento:5000, investido:3200, receita:9800, leads:210, conversoes:48, descricao:"Campanha de lançamento coleção verão", cor:COLS[0], publico:"25-35 anos", tags:["verão","moda"] },
  { id:2, nome:"Dia das Mães", inicio:"2026-04-25", fim:"2026-05-11", status:"Planejada", canal:"Multi-canal", objetivo:"Gerar vendas", orcamento:8000, investido:0, receita:0, leads:0, conversoes:0, descricao:"Campanha especial Dia das Mães", cor:COLS[1], publico:"30-55 anos", tags:["datas","mães"] },
  { id:3, nome:"Black Friday", inicio:"2026-11-20", fim:"2026-11-30", status:"Planejada", canal:"E-mail Marketing", objetivo:"Gerar vendas", orcamento:12000, investido:0, receita:0, leads:0, conversoes:0, descricao:"Promoções especiais Black Friday", cor:COLS[2], publico:"Geral", tags:["black friday","desconto"] },
  { id:4, nome:"Retenção Q1", inicio:"2026-01-10", fim:"2026-02-28", status:"Encerrada", canal:"WhatsApp", objetivo:"Retenção de clientes", orcamento:2500, investido:2500, receita:6200, leads:0, conversoes:30, descricao:"Campanha de retenção de clientes do Q1", cor:COLS[4], publico:"Clientes ativos", tags:["retenção"] },
];

let currentTab = "dashboard";
let editingId  = null;
let selectedColor = COLS[0];
let calYear = T.getFullYear();
let calMonth = T.getMonth();
let campFilter = "Todas";
let campSearch = "";
let iaMode = "sugestoes";

/* ─── SIDEBAR ────────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id:"dashboard",  icon:"⊞", label:"Dashboard" },
  { id:"campanhas",  icon:"◈", label:"Campanhas" },
  { id:"calendario", icon:"◫", label:"Calendário" },
  { id:"financeiro", icon:"◎", label:"Financeiro" },
  { id:"ia",         icon:"✦", label:"IA Estratégica" },
];

function buildSidebar() {
  const nav = document.getElementById("sidebar-nav");
  nav.innerHTML = NAV_ITEMS.map(it => `
    <button class="nav-btn${currentTab === it.id ? " active" : ""}" onclick="setTab('${it.id}')">
      <span class="nav-icon">${it.icon}</span>${it.label}
    </button>
  `).join("");
}

function setTab(id) {
  currentTab = id;
  document.querySelectorAll(".tab-section").forEach(el => el.classList.add("hidden"));
  document.getElementById(`tab-${id}`).classList.remove("hidden");
  buildSidebar();
  renderTab(id);
}

function renderTab(id) {
  if (id === "dashboard")  renderDashboard();
  if (id === "campanhas")  renderCampanhas();
  if (id === "calendario") renderCalendario();
  if (id === "financeiro") renderFinanceiro();
  if (id === "ia")         renderIA();
}

/* ─── DASHBOARD ──────────────────────────────────────────────────────────────── */
function renderDashboard() {
  const el = document.getElementById("tab-dashboard");
  const ativas = campaigns.filter(c => c.status === "Ativa");
  const totalOrc = campaigns.reduce((a, c) => a + Number(c.orcamento || 0), 0);
  const totalInv = campaigns.reduce((a, c) => a + Number(c.investido  || 0), 0);
  const totalRec = campaigns.reduce((a, c) => a + Number(c.receita    || 0), 0);
  const totalLeads = campaigns.reduce((a, c) => a + Number(c.leads || 0), 0);
  const totalConv  = campaigns.reduce((a, c) => a + Number(c.conversoes || 0), 0);
  const roi = totalInv > 0 ? (((totalRec - totalInv) / totalInv) * 100).toFixed(1) : 0;
  const roiPos = Number(roi) >= 0;

  const kpis = [
    { label:"Total Investido",   value:currency(totalInv), sub:`Orçado: ${currency(totalOrc)}`, color:"#2563EB",                               icon:"💰" },
    { label:"Receita Gerada",    value:currency(totalRec), sub:`ROI: ${roi}%`,                  color:roiPos ? "#10B981" : "#EF4444",           icon:"📈" },
    { label:"Leads Gerados",     value:totalLeads.toLocaleString(), sub:`${totalConv} conversões`, color:"#7C3AED",                             icon:"👥" },
    { label:"Campanhas Ativas",  value:ativas.length,      sub:`de ${campaigns.length} total`,  color:"#F59E0B",                               icon:"🚀" },
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

/* ─── MODAL ──────────────────────────────────────────────────────────────────── */
function populateSelects() {
  const canal = document.getElementById("f-canal");
  canal.innerHTML = CANAIS.map(c => `<option>${c}</option>`).join("");
  const obj = document.getElementById("f-objetivo");
  obj.innerHTML = OBJETIVOS.map(o => `<option>${o}</option>`).join("");
  const st = document.getElementById("f-status");
  st.innerHTML = STATUS_LIST.map(s => `<option>${s}</option>`).join("");
  buildColorPicker();
}

function buildColorPicker() {
  const picker = document.getElementById("color-picker");
  picker.innerHTML = COLS.map(c => `
    <button class="color-swatch${selectedColor === c ? " selected" : ""}" style="background:${c}" onclick="selectColor('${c}')"></button>
  `).join("");
}

function selectColor(c) {
  selectedColor = c;
  buildColorPicker();
}

function openNewModal() {
  editingId = null;
  selectedColor = COLS[Math.floor(Math.random() * COLS.length)];
  document.getElementById("modal-title").textContent = "Nova Campanha";
  document.getElementById("btn-save").textContent = "Criar Campanha";
  document.getElementById("f-nome").value = "";
  document.getElementById("f-inicio").value = fmtI(T);
  const endD = new Date(T); endD.setDate(endD.getDate() + 30);
  document.getElementById("f-fim").value = fmtI(endD);
  document.getElementById("f-canal").value = "Instagram";
  document.getElementById("f-objetivo").value = "Gerar vendas";
  document.getElementById("f-status").value = "Planejada";
  document.getElementById("f-publico").value = "";
  document.getElementById("f-orcamento").value = "";
  document.getElementById("f-investido").value = "";
  document.getElementById("f-receita").value = "";
  document.getElementById("f-leads").value = "";
  document.getElementById("f-conversoes").value = "";
  document.getElementById("f-descricao").value = "";
  document.getElementById("ai-tip-box").classList.add("hidden");
  document.getElementById("roi-preview").classList.add("hidden");
  buildColorPicker();
  document.getElementById("campaign-modal").classList.remove("hidden");
}

function openEditModal(id) {
  const c = campaigns.find(x => x.id === id);
  if (!c) return;
  editingId = id;
  selectedColor = c.cor;
  document.getElementById("modal-title").textContent = "Editar Campanha";
  document.getElementById("btn-save").textContent = "Salvar Alterações";
  document.getElementById("f-nome").value = c.nome;
  document.getElementById("f-inicio").value = c.inicio;
  document.getElementById("f-fim").value = c.fim;
  document.getElementById("f-canal").value = c.canal;
  document.getElementById("f-objetivo").value = c.objetivo;
  document.getElementById("f-status").value = c.status;
  document.getElementById("f-publico").value = c.publico || "";
  document.getElementById("f-orcamento").value = c.orcamento || "";
  document.getElementById("f-investido").value = c.investido || "";
  document.getElementById("f-receita").value = c.receita || "";
  document.getElementById("f-leads").value = c.leads || "";
  document.getElementById("f-conversoes").value = c.conversoes || "";
  document.getElementById("f-descricao").value = c.descricao || "";
  document.getElementById("ai-tip-box").classList.add("hidden");
  document.getElementById("roi-preview").classList.add("hidden");
  buildColorPicker();
  updateROI();
  document.getElementById("campaign-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("campaign-modal").classList.add("hidden");
  editingId = null;
}

function updateROI() {
  const orc = Number(document.getElementById("f-orcamento").value);
  const rec = Number(document.getElementById("f-receita").value);
  const box = document.getElementById("roi-preview");
  if (orc && rec) {
    const roi = (((rec - orc) / orc) * 100).toFixed(1);
    const pos = Number(roi) >= 0;
    box.classList.remove("hidden");
    box.style.background = pos ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)";
    box.style.color = pos ? "#10B981" : "#EF4444";
    box.textContent = `ROI estimado: ${roi}%`;
  } else {
    box.classList.add("hidden");
  }
}

function saveCampaign() {
  const nome = document.getElementById("f-nome").value.trim();
  if (!nome) { alert("Preencha o nome da campanha."); return; }
  const form = {
    nome,
    inicio:     document.getElementById("f-inicio").value,
    fim:        document.getElementById("f-fim").value,
    canal:      document.getElementById("f-canal").value,
    objetivo:   document.getElementById("f-objetivo").value,
    status:     document.getElementById("f-status").value,
    publico:    document.getElementById("f-publico").value,
    orcamento:  Number(document.getElementById("f-orcamento").value) || 0,
    investido:  Number(document.getElementById("f-investido").value) || 0,
    receita:    Number(document.getElementById("f-receita").value) || 0,
    leads:      Number(document.getElementById("f-leads").value) || 0,
    conversoes: Number(document.getElementById("f-conversoes").value) || 0,
    descricao:  document.getElementById("f-descricao").value,
    cor: selectedColor,
    tags: [],
  };
  if (editingId) {
    campaigns = campaigns.map(c => c.id === editingId ? { ...form, id: editingId } : c);
  } else {
    campaigns.push({ ...form, id: Date.now() });
  }
  closeModal();
  renderTab(currentTab);
}

/* ─── IA FILL ────────────────────────────────────────────────────────────────── */
async function gerarIA() {
  const nome = document.getElementById("f-nome").value.trim();
  if (!nome) { alert("Preencha o nome da campanha primeiro."); return; }
  const btn = document.getElementById("ai-fill-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spin-inline">◌</span> IA preenchendo campos...`;

  try {
    const canal    = document.getElementById("f-canal").value;
    const objetivo = document.getElementById("f-objetivo").value;
    const publico  = document.getElementById("f-publico").value;
    const orcamento = document.getElementById("f-orcamento").value;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 900,
        messages: [{ role: "user", content: `Você é especialista em marketing digital. Preencha os campos desta campanha com base nas informações fornecidas.

Nome: ${nome}
Canal: ${canal}
Objetivo: ${objetivo}
Público: ${publico || "não informado"}
Orçamento: ${orcamento ? "R$" + orcamento : "não informado"}

Responda APENAS em JSON válido, sem markdown:
{
  "descricao": "descrição completa da campanha (3 linhas)",
  "resultado_esperado_leads": número estimado de leads,
  "resultado_esperado_conversoes": número estimado de conversões,
  "receita_esperada": valor em reais estimado,
  "publico_refinado": "público-alvo refinado e detalhado",
  "tags": ["tag1","tag2","tag3"],
  "dica_estrategica": "dica prática para essa campanha (2 linhas)"
}` }],
      }),
    });
    const data = await res.json();
    const txt = data.content?.[0]?.text || "{}";
    const clean = txt.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    if (parsed.descricao)                document.getElementById("f-descricao").value = parsed.descricao;
    if (parsed.resultado_esperado_leads) document.getElementById("f-leads").value = parsed.resultado_esperado_leads;
    if (parsed.resultado_esperado_conversoes) document.getElementById("f-conversoes").value = parsed.resultado_esperado_conversoes;
    if (parsed.receita_esperada)         document.getElementById("f-receita").value = parsed.receita_esperada;
    if (parsed.publico_refinado)         document.getElementById("f-publico").value = parsed.publico_refinado;
    updateROI();

    if (parsed.dica_estrategica) {
      const tipBox = document.getElementById("ai-tip-box");
      tipBox.classList.remove("hidden");
      tipBox.innerHTML = `<div class="ai-tip-title">💡 Dica da IA</div><div class="ai-tip-text">${parsed.dica_estrategica}</div>`;
    }
  } catch (e) { console.error(e); }

  btn.disabled = false;
  btn.innerHTML = `<span>✦</span> Completar com IA (preencha nome, canal e objetivo antes)`;
}

/* ─── CALENDÁRIO ─────────────────────────────────────────────────────────────── */
function renderCalendario() {
  const el = document.getElementById("tab-calendario");

  const days = daysInMonth(calYear, calMonth);
  const startDay = firstDay(calYear, calMonth);
  const cells = Array.from({ length: startDay + days }, (_, i) => i < startDay ? null : i - startDay + 1);
  while (cells.length % 7 !== 0) cells.push(null);

  const visible = campaigns.filter(c => {
    const s = parseD(c.inicio), e = parseD(c.fim);
    return s <= new Date(calYear, calMonth + 1, 0) && e >= new Date(calYear, calMonth, 1);
  });

  const campsFor = day => {
    if (!day) return [];
    const d = new Date(calYear, calMonth, day);
    return campaigns.filter(c => { const s = parseD(c.inicio), e = parseD(c.fim); return d >= s && d <= e; });
  };

  const cellsHTML = cells.map((day, idx) => {
    if (!day) return `<div class="cal-cell empty"></div>`;
    const camps = campsFor(day);
    const isToday = day === T.getDate() && calMonth === T.getMonth() && calYear === T.getFullYear();
    const hkey = `${pad(calMonth + 1)}-${pad(day)}`;
    const holiday = BR_DATES[hkey];
    const hasCamps = camps.length > 0;
    return `
      <div class="cal-cell${isToday ? " today" : ""}${hasCamps ? " has-camps" : ""}"
           onclick="${hasCamps ? `showCalPopup(${day})` : ""}">
        <div class="cal-day-num${isToday ? " today" : holiday ? " holiday" : ""}">${day}</div>
        ${holiday ? `<div class="cal-holiday-name">${holiday}</div>` : ""}
        ${camps.slice(0, 3).map(c => `<div class="cal-camp-bar" style="background:${c.cor}"></div>`).join("")}
        ${camps.length > 3 ? `<div class="cal-more">+${camps.length - 3}</div>` : ""}
      </div>`;
  }).join("");

  el.innerHTML = `
    <div class="page-header-row">
      <div>
        <h1 style="color:#fff;font-weight:800;font-size:24px">Calendário</h1>
        <p style="color:rgba(255,255,255,.35);font-size:13px;margin-top:3px">Visualize campanhas e datas comemorativas</p>
      </div>
      <button class="btn-primary" onclick="openNewModal()">+ Nova Campanha</button>
    </div>
    <div class="card" style="padding:24px">
      <div class="cal-header-row">
        <div class="cal-nav">
          <button class="cal-btn" onclick="calPrev()">‹</button>
          <span class="cal-title">${MONTHS[calMonth]} ${calYear}</span>
          <button class="cal-btn" onclick="calNext()">›</button>
        </div>
        <div class="cal-legend">
          ${visible.slice(0, 6).map(c => `
            <div class="cal-legend-item">
              <div class="cal-legend-dot" style="background:${c.cor}"></div>
              <span class="cal-legend-text">${c.nome}</span>
            </div>`).join("")}
        </div>
      </div>
      <div class="cal-weekdays">
        ${DAYS.map(d => `<div class="cal-day-name">${d}</div>`).join("")}
      </div>
      <div class="cal-grid">${cellsHTML}</div>
      <div id="cal-popup"></div>
    </div>
  `;
}

function calPrev() {
  if (calMonth === 0) { calMonth = 11; calYear--; } else calMonth--;
  renderCalendario();
}
function calNext() {
  if (calMonth === 11) { calMonth = 0; calYear++; } else calMonth++;
  renderCalendario();
}

function showCalPopup(day) {
  const d = new Date(calYear, calMonth, day);
  const camps = campaigns.filter(c => { const s = parseD(c.inicio), e = parseD(c.fim); return d >= s && d <= e; });
  const popup = document.getElementById("cal-popup");
  if (!camps.length) { popup.innerHTML = ""; return; }
  popup.innerHTML = `
    <div class="cal-popup">
      <div class="cal-popup-title">DIA ${day} DE ${MONTHS[calMonth].toUpperCase()}</div>
      <div class="cal-popup-camps">
        ${camps.map(c => {
          const cfg = statusCfg(c.status);
          return `
            <div class="cal-popup-camp" style="border-left-color:${c.cor}">
              <div class="cal-popup-camp-name">${c.nome}</div>
              <div class="cal-popup-camp-dates">${c.canal} · ${fmt(parseD(c.inicio))} → ${fmt(parseD(c.fim))}</div>
              <div class="cal-popup-camp-meta">
                <span class="status-badge" style="background:${cfg.bg};color:${cfg.color}">${c.status}</span>
                ${Number(c.orcamento) > 0 ? `<span style="color:rgba(255,255,255,.4);font-size:11px">${currency(c.orcamento)}</span>` : ""}
              </div>
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

/* ─── FINANCEIRO ─────────────────────────────────────────────────────────────── */
function renderFinanceiro() {
  const el = document.getElementById("tab-financeiro");

  const rows = campaigns.map(c => {
    const inv = Number(c.investido || 0);
    const rec = Number(c.receita   || 0);
    const orc = Number(c.orcamento || 0);
    const lucro = rec - inv;
    const roi = inv > 0 ? (((rec - inv) / inv) * 100).toFixed(1) : null;
    const cpl = Number(c.leads)     > 0 ? (inv / Number(c.leads)).toFixed(2)     : null;
    const cpp = Number(c.conversoes) > 0 ? (inv / Number(c.conversoes)).toFixed(2) : null;
    const gap = orc - inv;
    return { ...c, inv, rec, orc, lucro, roi, cpl, cpp, gap };
  });

  const totOrc   = rows.reduce((a, r) => a + r.orc, 0);
  const totInv   = rows.reduce((a, r) => a + r.inv, 0);
  const totRec   = rows.reduce((a, r) => a + r.rec, 0);
  const totLucro = totRec - totInv;
  const totRoi   = totInv > 0 ? (((totRec - totInv) / totInv) * 100).toFixed(1) : 0;

  const summaries = [
    { label:"Orçamento Total", v:currency(totOrc),   color:"#3B82F6" },
    { label:"Total Investido", v:currency(totInv),   color:"#7C3AED" },
    { label:"Receita Total",   v:currency(totRec),   color:"#10B981" },
    { label:"Lucro / Prejuízo",v:currency(totLucro), color: totLucro >= 0 ? "#10B981" : "#EF4444" },
    { label:"ROI Geral",       v:`${totRoi}%`,        color: Number(totRoi) >= 0 ? "#10B981" : "#EF4444" },
  ];

  el.innerHTML = `
    <div class="page-header">
      <h1>Financeiro</h1>
      <p>Custos, investimentos, receitas e ROI por campanha</p>
    </div>
    <div class="grid-5" style="margin-bottom:22px">
      ${summaries.map(k => `
        <div class="card" style="padding:16px 18px">
          <div style="color:rgba(255,255,255,.35);font-size:10px;font-weight:700;letter-spacing:1.4px;margin-bottom:6px">${k.label.toUpperCase()}</div>
          <div style="color:${k.color};font-weight:800;font-size:18px">${k.v}</div>
        </div>`).join("")}
    </div>
    <div class="card fin-table-wrap">
      <table>
        <thead>
          <tr>${["Campanha","Status","Orçamento","Investido","Saldo","Receita","Lucro","ROI","CPL","CPConv"].map(h => `<th>${h.toUpperCase()}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map(r => {
            const cfg = statusCfg(r.status);
            return `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div style="width:8px;height:8px;border-radius:2px;background:${r.cor};flex-shrink:0"></div>
                    <span style="color:#fff;font-weight:600;white-space:nowrap">${r.nome}</span>
                  </div>
                </td>
                <td><span class="status-badge" style="background:${cfg.bg};color:${cfg.color}">${r.status}</span></td>
                <td style="color:rgba(255,255,255,.6)">${currency(r.orc)}</td>
                <td style="color:#3B82F6;font-weight:600">${currency(r.inv)}</td>
                <td style="color:${r.gap >= 0 ? "#10B981" : "#EF4444"};font-weight:600">${currency(r.gap)}</td>
                <td style="color:#10B981;font-weight:600">${currency(r.rec)}</td>
                <td style="color:${r.lucro >= 0 ? "#10B981" : "#EF4444"};font-weight:700">${currency(r.lucro)}</td>
                <td style="color:${r.roi === null ? "rgba(255,255,255,.2)" : Number(r.roi) >= 0 ? "#10B981" : "#EF4444"};font-weight:700">${r.roi !== null ? `${r.roi}%` : "—"}</td>
                <td style="color:rgba(255,255,255,.5)">${r.cpl ? `R$ ${r.cpl}` : "—"}</td>
                <td style="color:rgba(255,255,255,.5)">${r.cpp ? `R$ ${r.cpp}` : "—"}</td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* ─── IA ESTRATÉGICA ─────────────────────────────────────────────────────────── */
function renderIA() {
  const el = document.getElementById("tab-ia");
  const MODES = [
    { id:"sugestoes", label:"💡 Sugestões", sub:"Próximas campanhas" },
    { id:"analise",   label:"📊 Análise",   sub:"Performance atual" },
    { id:"consulta",  label:"💬 Consultor", sub:"Tire dúvidas" },
  ];

  el.innerHTML = `
    <div class="page-header">
      <h1>IA Estratégica</h1>
      <p>Inteligência artificial para otimizar suas campanhas</p>
    </div>
    <div class="ia-mode-grid">
      ${MODES.map(m => `
        <button class="ia-mode-btn${iaMode === m.id ? " active" : ""}" onclick="setIAMode('${m.id}')">
          <div class="ia-mode-label">${m.label}</div>
          <div class="ia-mode-sub">${m.sub}</div>
        </button>`).join("")}
    </div>
    <div class="card" style="padding:24px">
      <div id="ia-input-area">
        ${iaMode !== "consulta" ? `
          <div class="ia-input-row">
            <label class="lbl" style="margin-top:0">SEU SEGMENTO (opcional)</label>
            <div class="flex-row">
              <input id="ia-segmento" class="inp" style="flex:1" placeholder="Ex: moda, restaurante, tecnologia, educação..." />
              <button class="btn-ia" onclick="runIA()">✦ ${iaMode === "sugestoes" ? "Gerar Sugestões" : "Analisar Campanhas"}</button>
            </div>
          </div>` : `
          <div class="ia-input-row">
            <label class="lbl" style="margin-top:0">FAÇA SUA PERGUNTA</label>
            <div class="flex-row">
              <input id="ia-pergunta" class="inp" style="flex:1" placeholder="Ex: Como melhorar meu ROI? Qual canal usar para lançamento?" onkeydown="if(event.key==='Enter') runIA()" />
              <button class="btn-ia" onclick="runIA()">✦ Perguntar</button>
            </div>
          </div>`}
      </div>
      <div id="ia-output">
        <div class="ia-empty">
          <div class="ia-empty-icon">✦</div>
          <div class="ia-empty-title">IA Pronta</div>
          <div class="ia-empty-sub">${iaMode === "sugestoes" ? "Clique em Gerar Sugestões para receber ideias de campanhas" : iaMode === "analise" ? "Clique em Analisar para receber insights das suas campanhas" : "Digite sua dúvida sobre marketing e a IA responderá"}</div>
        </div>
      </div>
    </div>
  `;
}

function setIAMode(m) {
  iaMode = m;
  renderIA();
}

async function runIA() {
  const campResumo = campaigns.map(c => `• ${c.nome} | ${c.status} | ${c.canal} | Invest: R$${c.investido || 0} | Receita: R$${c.receita || 0} | Leads: ${c.leads || 0}`).join("\n");
  const segmento = document.getElementById("ia-segmento")?.value || "";
  const pergunta = document.getElementById("ia-pergunta")?.value || "";

  if (iaMode === "consulta" && !pergunta.trim()) return;

  let prompt = "";
  if (iaMode === "sugestoes") {
    prompt = `Você é um especialista em marketing digital estratégico brasileiro.\n\nData atual: ${fmt(T)}\n${segmento ? `Segmento: ${segmento}` : ""}\n\nCampanhas existentes:\n${campResumo || "Nenhuma campanha ainda."}\n\nSugira 4 oportunidades de campanha para os próximos 3 meses com base em datas comemorativas brasileiras, tendências e lacunas no calendário.\n\nPara cada uma use EXATAMENTE este formato:\n\n---\n📅 NOME DA CAMPANHA\n📆 Período: [data início] a [data fim]  \n🎯 Oportunidade: [por que agora — data/tendência]\n💡 Conceito: [ideia criativa detalhada — 3 linhas]\n📣 Canal: [canal recomendado e por quê]\n💰 Investimento sugerido: [faixa de valor]\n📊 Resultado esperado: [leads/conversões/ROI estimado]\n⚡ Urgência: Alta / Média / Baixa\n---`;
  } else if (iaMode === "analise") {
    prompt = `Você é um analista de marketing. Analise as campanhas abaixo e gere um relatório estratégico completo.\n\nCampanhas:\n${campResumo || "Nenhuma campanha ainda."}\n\nResponda com:\n\n## 🏆 MELHORES CAMPANHAS\n[analise as 3 melhores por ROI/resultado]\n\n## ⚠️ PONTOS DE ATENÇÃO\n[campanhas com baixo desempenho e o que fazer]\n\n## 💡 RECOMENDAÇÕES ESTRATÉGICAS\n[5 ações práticas e prioritárias para melhorar resultados]\n\n## 📊 INSIGHTS DE DADOS\n[padrões, canais que mais convertem, público mais eficiente]\n\n## 🚀 PRÓXIMOS PASSOS\n[plano de ação para as próximas 4 semanas]`;
  } else {
    prompt = `Você é um especialista em marketing digital. Responda de forma clara, prática e detalhada.\n\nContexto das campanhas atuais:\n${campResumo || "Nenhuma campanha ainda."}\n${segmento ? `Segmento: ${segmento}` : ""}\n\nPergunta do usuário: ${pergunta}\n\nDê uma resposta completa, com exemplos práticos e passos concretos quando necessário.`;
  }

  const output = document.getElementById("ia-output");
  output.innerHTML = `<div class="ia-loading"><div class="ia-spinner"></div><div class="ia-loading-text">IA processando...</div></div>`;

  // Disable button
  const btn = document.querySelector("#ia-input-area .btn-ia");
  if (btn) { btn.disabled = true; btn.innerHTML = `<span class="spin-inline">◌</span> Analisando...`; }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 1400,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const result = data.content?.[0]?.text || "Erro.";

    if (iaMode === "sugestoes") {
      const blocks = result.split("---").filter(s => s.trim());
      output.innerHTML = blocks.map((bloco, i) => `
        <div class="ia-suggestion-card" style="border-left-color:${COLS[i % COLS.length]}">
          <div class="ia-suggestion-text">${bloco.trim()}</div>
        </div>`).join("");
    } else {
      output.innerHTML = `<div class="ia-result">${result}</div>`;
    }
  } catch {
    output.innerHTML = `<div class="ia-result" style="color:#EF4444">Erro de conexão com a IA.</div>`;
  }

  if (btn) { btn.disabled = false; btn.innerHTML = `✦ ${iaMode === "sugestoes" ? "Gerar Sugestões" : iaMode === "analise" ? "Analisar Campanhas" : "Perguntar"}`; }
}

/* ─── INIT ───────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  populateSelects();
  buildSidebar();
  renderTab("dashboard");
});
