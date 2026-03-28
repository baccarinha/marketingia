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
          <div class="ia-empty-sub">${
            iaMode === "sugestoes"
              ? "Clique em Gerar Sugestões para receber ideias de campanhas"
              : iaMode === "analise"
              ? "Clique em Analisar para receber insights das suas campanhas"
              : "Digite sua dúvida sobre marketing e a IA responderá"
          }</div>
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
  const campResumo = campaigns.map(c =>
    `• ${c.nome} | ${c.status} | ${c.canal} | Invest: R$${c.investido || 0} | Receita: R$${c.receita || 0} | Leads: ${c.leads || 0}`
  ).join("\n");

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

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `✦ ${iaMode === "sugestoes" ? "Gerar Sugestões" : iaMode === "analise" ? "Analisar Campanhas" : "Perguntar"}`;
  }
}
