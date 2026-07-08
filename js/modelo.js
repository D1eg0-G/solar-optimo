// ══════════════════════════════════════
// MODELO MATEMÁTICO SOLAR
// js/modelo.js
// ══════════════════════════════════════

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const MES_DIA = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];

function declinacion(diaMes) {
  return 23.45 * Math.sin(2 * Math.PI / 365 * (diaMes - 81));
}

function anguloOptimo(lat, mes) {
  const d     = MES_DIA[mes - 1];
  const delta = declinacion(d);
  const alpha = 90 - Math.abs(lat - delta);
  const theta = Math.abs(lat - delta);
  return {
    theta: parseFloat(theta.toFixed(1)),
    delta: parseFloat(delta.toFixed(2)),
    alpha: parseFloat(alpha.toFixed(1))
  };
}

function irradiancia(theta, alpha) {
  const E0  = 7.5;
  const rad = x => x * Math.PI / 180;
  return Math.max(0, parseFloat((E0 * Math.cos(rad(theta - alpha))).toFixed(2)));
}

function eficienciaRelativa(theta, alpha) {
  const rad = x => x * Math.PI / 180;
  return parseFloat((100 * Math.cos(rad(theta - alpha))).toFixed(1));
}

function irradianciaFijo30(alpha) {
  const rad = x => x * Math.PI / 180;
  return Math.max(0, parseFloat((7.5 * Math.cos(rad(30 - alpha))).toFixed(2)));
}

function hemisurTemporada(mes, lat) {
  if (lat < 0) {
    if ([12,1,2].includes(mes))  return 'Verano';
    if ([3,4,5].includes(mes))   return 'Otoño';
    if ([6,7,8].includes(mes))   return 'Invierno';
    return 'Primavera';
  } else {
    if ([12,1,2].includes(mes))  return 'Invierno';
    if ([3,4,5].includes(mes))   return 'Primavera';
    if ([6,7,8].includes(mes))   return 'Verano';
    return 'Otoño';
  }
}

// Devuelve irradiancia hora a hora para un día (h=6..18)
function radDiaria(alpha, Emax) {
  const puntos = [];
  for (let h = 6; h <= 18; h += 0.5) {
    const t = h - 12;
    const v = Math.max(0, (Emax / 8) * Math.cos(t * Math.PI / 6));
    puntos.push({ h, v: parseFloat(v.toFixed(3)) });
  }
  return puntos;
}
