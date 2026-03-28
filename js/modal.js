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
