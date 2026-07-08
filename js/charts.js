// ══════════════════════════════════════
// GRÁFICOS PRINCIPALES
// js/charts.js
// ══════════════════════════════════════

let dailyChart  = null;
let annualChart = null;
let eThetaChart = null;
let showAvg     = false;

// ── Gráfico radiación diaria ────────────────────────

function buildDailyChart(alpha, Emax) {
  const puntos = radDiaria(alpha, Emax);
  const labels = puntos.map(p => p.h % 1 === 0 ? p.h + ':00' : '');
  const vals   = puntos.map(p => p.v);
  const avg    = vals.map(() => parseFloat((Emax / 8 * 0.72).toFixed(3)));

  if (dailyChart) dailyChart.destroy();
  dailyChart = new Chart(
    document.getElementById('daily-chart').getContext('2d'),
    {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Radiación (kWh/m²)',
            data: vals,
            borderColor: '#1a6fd4',
            backgroundColor: 'rgba(26,111,212,.12)',
            fill: true, tension: 0.45,
            pointRadius: (ctx) => ctx.dataIndex % 4 === 0 ? 3 : 0,
            pointBackgroundColor: '#1a6fd4',
          },
          {
            label: 'Promedio mensual',
            data: showAvg ? avg : vals.map(() => null),
            borderColor: '#f5a623', borderDash: [6,4], borderWidth: 1.5,
            pointRadius: 0, fill: false, tension: 0,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => ` ${c.parsed.y.toFixed(3)} kWh/m²` } }
        },
        scales: {
          x: { grid: { color: '#e8edf5' }, ticks: { color: '#8b9dc3', font: { size: 11 } } },
          y: { min: 0, grid: { color: '#e8edf5' }, ticks: { color: '#8b9dc3', font: { size: 11 } },
               title: { display: true, text: 'kWh/m²', color: '#8b9dc3', font: { size: 11 } } }
        }
      }
    }
  );
}

function toggleAvg() {
  showAvg = document.getElementById('show-avg').checked;
  if (state.resultado) buildDailyChart(state.resultado.alpha, state.resultado.E);
}

// ── Gráfico anual de ángulos ────────────────────────

function buildAnnualChart(lat, angulos) {
  if (annualChart) annualChart.destroy();
  annualChart = new Chart(
    document.getElementById('annual-chart').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: MESES,
        datasets: [{
          label: 'Ángulo óptimo (°)',
          data: angulos,
          borderColor: '#1a6fd4',
          backgroundColor: 'rgba(26,111,212,.1)',
          fill: true, tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#f5a623',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => ` ${c.parsed.y}° (ángulo óptimo)` } }
        },
        scales: {
          x: { grid: { color: '#e8edf5' }, ticks: { color: '#8b9dc3' } },
          y: { grid: { color: '#e8edf5' },
               ticks: { color: '#8b9dc3', callback: v => v + '°' },
               title: { display: true, text: 'Ángulo (°)', color: '#8b9dc3' } }
        }
      }
    }
  );
}

// ── Gráfico E(θ) ────────────────────────────────────

function buildEthetaChart() {
  const res      = state.resultado || anguloOptimo(state.lat, state.mes);
  const alpha    = res.alpha || anguloOptimo(state.lat, state.mes).alpha;
  const thetaOpt = Math.round(res.theta || anguloOptimo(state.lat, state.mes).theta);

  const thetas = [], vals = [];
  for (let t = 0; t <= 90; t++) {
    thetas.push(t);
    vals.push(parseFloat(Math.max(0, 1000 * Math.cos((t - alpha) * Math.PI / 180)).toFixed(1)));
  }

  if (eThetaChart) eThetaChart.destroy();
  eThetaChart = new Chart(
    document.getElementById('eTheta-chart').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: thetas,
        datasets: [
          {
            label: 'E(θ) W/m²',
            data: vals,
            borderColor: '#1a6fd4',
            backgroundColor: 'rgba(26,111,212,.08)',
            fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2,
          },
          {
            label: 'Máximo θ*',
            data: thetas.map((t, i) => t === thetaOpt ? vals[i] : null),
            pointRadius: 10,
            pointBackgroundColor: '#f5a623',
            pointBorderColor: '#fff', pointBorderWidth: 3,
            borderColor: 'transparent', showLine: false,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: c => c.datasetIndex === 0
                ? ` E(${c.label}°) = ${c.parsed.y} W/m²`
                : ` Máximo: θ* = ${c.label}° → ${c.parsed.y} W/m²`
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Ángulo θ (°)', color: '#8b9dc3' },
               ticks: { color: '#8b9dc3', callback: (v, i) => i % 10 === 0 ? thetas[i] + '°' : '' },
               grid: { color: '#e8edf5' } },
          y: { title: { display: true, text: 'E(θ) [W/m²]', color: '#8b9dc3' },
               ticks: { color: '#8b9dc3' }, grid: { color: '#e8edf5' }, min: 0 }
        }
      }
    }
  );
}
