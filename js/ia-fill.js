/* ─── IA FILL ────────────────────────────────────────────────────────────────── */
async function gerarIA() {
  const nome = document.getElementById("f-nome").value.trim();
  if (!nome) { alert("Preencha o nome da campanha primeiro."); return; }
  const btn = document.getElementById("ai-fill-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="spin-inline">◌</span> IA preenchendo campos...`;

  try {
    const canal     = document.getElementById("f-canal").value;
    const objetivo  = document.getElementById("f-objetivo").value;
    const publico   = document.getElementById("f-publico").value;
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

    if (parsed.descricao)                        document.getElementById("f-descricao").value = parsed.descricao;
    if (parsed.resultado_esperado_leads)         document.getElementById("f-leads").value = parsed.resultado_esperado_leads;
    if (parsed.resultado_esperado_conversoes)    document.getElementById("f-conversoes").value = parsed.resultado_esperado_conversoes;
    if (parsed.receita_esperada)                 document.getElementById("f-receita").value = parsed.receita_esperada;
    if (parsed.publico_refinado)                 document.getElementById("f-publico").value = parsed.publico_refinado;
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
