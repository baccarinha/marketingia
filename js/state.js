/* ─── STATE ─────────────────────────────────────────────────────────────────── */
let campaigns = [
  { id:1, nome:"Lançamento Verão", inicio:"2026-03-01", fim:"2026-03-31", status:"Ativa", canal:"Instagram", objetivo:"Gerar vendas", orcamento:5000, investido:3200, receita:9800, leads:210, conversoes:48, descricao:"Campanha de lançamento coleção verão", cor:COLS[0], publico:"25-35 anos", tags:["verão","moda"] },
  { id:2, nome:"Dia das Mães", inicio:"2026-04-25", fim:"2026-05-11", status:"Planejada", canal:"Multi-canal", objetivo:"Gerar vendas", orcamento:8000, investido:0, receita:0, leads:0, conversoes:0, descricao:"Campanha especial Dia das Mães", cor:COLS[1], publico:"30-55 anos", tags:["datas","mães"] },
  { id:3, nome:"Black Friday", inicio:"2026-11-20", fim:"2026-11-30", status:"Planejada", canal:"E-mail Marketing", objetivo:"Gerar vendas", orcamento:12000, investido:0, receita:0, leads:0, conversoes:0, descricao:"Promoções especiais Black Friday", cor:COLS[2], publico:"Geral", tags:["black friday","desconto"] },
  { id:4, nome:"Retenção Q1", inicio:"2026-01-10", fim:"2026-02-28", status:"Encerrada", canal:"WhatsApp", objetivo:"Retenção de clientes", orcamento:2500, investido:2500, receita:6200, leads:0, conversoes:30, descricao:"Campanha de retenção de clientes do Q1", cor:COLS[4], publico:"Clientes ativos", tags:["retenção"] },
];

let currentTab    = "dashboard";
let editingId     = null;
let selectedColor = COLS[0];
let calYear       = T.getFullYear();
let calMonth      = T.getMonth();
let campFilter    = "Todas";
let campSearch    = "";
let iaMode        = "sugestoes";
