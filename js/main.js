// ══════════════════════════════════════
// MAIN — Estado global y lógica de páginas
// js/main.js
// ══════════════════════════════════════

const state = {
  lat: -38.7,
  mes: 5,
  anio: 2025,
  resultado: null
};

// ── Navegación ───────────────────────────────────────

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    const page = item.dataset.page;
    document.getElementById('page-' + page).classList.add('active');

    if (page === 'analisis') buildAnalysisPage();
    if (page === 'grafica')  buildEthetaChart();
  });
});

// ── Calcular (página Inicio) ─────────────────────────

function calcular() {
  state.lat  = parseFloat(document.getElementById('lat-input').value) || -38.7;
  state.mes  = parseInt(document.getElementById('month-sel').value);
  state.anio = parseInt(document.getElementById('year-sel').value);

  const { theta, delta, alpha } = anguloOptimo(state.lat, state.mes);
  const E   = irradiancia(theta, alpha);
  const eff = eficienciaRelativa(theta, alpha);
  const E30 = irradianciaFijo30(alpha);

  state.resultado = { theta, delta, alpha, E, eff, E30 };

  document.getElementById('res-label').textContent = MESES[state.mes - 1] + ' ' + state.anio;
  animateNum('res-angle', theta, 1, '°');
  animateNum('res-rad',   E,     2, '');
  animateNum('res-eff',   eff,   1, '%');

  const diff = (E - E30).toFixed(2);
  const pct  = ((E - E30) / Math.max(E30, 0.01) * 100).toFixed(1);
  document.getElementById('res-tip').innerHTML =
    `El ángulo <strong>${theta}°</strong> maximiza la captación para ${MESES[state.mes - 1]}
     en latitud ${state.lat}°.
     ${diff > 0
       ? `Ganás un <strong>${pct}%</strong> más de energía vs. ángulo fijo 30°.`
       : 'En este mes el ángulo fijo de 30° ya es cercano al óptimo.'}`;

  updateDiagram(theta);
  buildDailyChart(alpha, E);

  const maxE = Math.max(E, E30, 0.01);
  document.getElementById('cmp-opt').style.width = (E   / maxE * 90) + '%';
  document.getElementById('cmp-opt').textContent = E   + ' kWh/m²/día';
  document.getElementById('cmp-fix').style.width = (E30 / maxE * 90) + '%';
  document.getElementById('cmp-fix').textContent = E30 + ' kWh/m²/día';
  document.getElementById('cmp-note').textContent =
    `Con el ángulo óptimo (${theta}°) captás ${E} vs. ${E30} kWh/m²/día con ángulo fijo 30°.`;
}

function animateNum(id, target, decimals, suffix) {
  const el = document.getElementById(id);
  let step = 0;
  const frames = 30;
  const inc = target / frames;
  let cur = 0;
  const t = setInterval(() => {
    step++;
    cur += inc;
    if (step >= frames) { cur = target; clearInterval(t); }
    el.textContent = cur.toFixed(decimals) + suffix;
  }, 16);
}

// ── Diagrama SVG del panel ───────────────────────────

function updateDiagram(theta) {
  const g   = document.getElementById('d-panel-group');
  const lbl = document.getElementById('d-angle-label');
  const arc = document.getElementById('d-arc');

  g.setAttribute('transform', `translate(150,145) rotate(${-theta})`);
  lbl.textContent = theta + '°';

  const r    = 40;
  const endX = 150 + r * Math.sin(theta * Math.PI / 180);
  const endY = 175 - r * (1 - Math.cos(theta * Math.PI / 180));
  arc.setAttribute('d', `M150,175 A${r},${r} 0 0,0 ${endX.toFixed(1)},${endY.toFixed(1)}`);
  lbl.setAttribute('x', (endX + 6).toFixed(1));
  lbl.setAttribute('y', (endY + 4).toFixed(1));

  document.getElementById('diagram-note').innerHTML =
    `✅ Ángulo <strong>${theta}°</strong> — mayor captación de radiación solar.`;
}

// ── Página Análisis ──────────────────────────────────

function buildAnalysisPage() {
  const lat = state.lat;
  document.getElementById('tabla-lat').textContent = lat;

  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';
  const angulos = [];

  MESES.forEach((mes, i) => {
    const { theta, delta, alpha } = anguloOptimo(lat, i + 1);
    const E   = irradiancia(theta, alpha);
    const eff = eficienciaRelativa(theta, alpha);
    angulos.push(theta);

    const temporada = hemisurTemporada(i + 1, lat);
    const badge     = eff > 85 ? 'high' : eff > 65 ? 'mid' : 'low';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${mes}</strong></td>
      <td>${delta}°</td>
      <td><strong>${theta}°</strong></td>
      <td>${E} kWh/m²/día</td>
      <td>
        <div class="bar-cell">
          <div class="bar-track">
            <div class="bar-fill" style="width:${eff}%"></div>
          </div>
          <span>${eff}%</span>
        </div>
      </td>
      <td><span class="badge ${badge}">${temporada}</span></td>
    `;
    tbody.appendChild(tr);
  });

  buildAnnualChart(lat, angulos);
}

// ── Init ─────────────────────────────────────────────

calcular();
