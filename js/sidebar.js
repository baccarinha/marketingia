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
