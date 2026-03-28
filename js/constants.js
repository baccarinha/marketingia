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
