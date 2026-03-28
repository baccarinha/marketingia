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

  const cellsHTML = cells.map((day) => {
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
