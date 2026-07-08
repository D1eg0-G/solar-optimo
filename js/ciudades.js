// ══════════════════════════════════════
// BASE DE DATOS DE CIUDADES
// js/ciudades.js
// ══════════════════════════════════════

const CIUDADES = [
  // Chile
  { name:'Arica',         country:'Chile',        flag:'🇨🇱', lat:-18.47 },
  { name:'Iquique',       country:'Chile',        flag:'🇨🇱', lat:-20.21 },
  { name:'Antofagasta',   country:'Chile',        flag:'🇨🇱', lat:-23.65 },
  { name:'Copiapó',       country:'Chile',        flag:'🇨🇱', lat:-27.37 },
  { name:'La Serena',     country:'Chile',        flag:'🇨🇱', lat:-29.90 },
  { name:'Coquimbo',      country:'Chile',        flag:'🇨🇱', lat:-29.95 },
  { name:'Valparaíso',    country:'Chile',        flag:'🇨🇱', lat:-33.05 },
  { name:'Santiago',      country:'Chile',        flag:'🇨🇱', lat:-33.46 },
  { name:'Rancagua',      country:'Chile',        flag:'🇨🇱', lat:-34.17 },
  { name:'Talca',         country:'Chile',        flag:'🇨🇱', lat:-35.43 },
  { name:'Chillán',       country:'Chile',        flag:'🇨🇱', lat:-36.61 },
  { name:'Concepción',    country:'Chile',        flag:'🇨🇱', lat:-36.82 },
  { name:'Los Ángeles',   country:'Chile',        flag:'🇨🇱', lat:-37.47 },
  { name:'Temuco',        country:'Chile',        flag:'🇨🇱', lat:-38.74 },
  { name:'Valdivia',      country:'Chile',        flag:'🇨🇱', lat:-39.81 },
  { name:'Osorno',        country:'Chile',        flag:'🇨🇱', lat:-40.57 },
  { name:'Puerto Montt',  country:'Chile',        flag:'🇨🇱', lat:-41.47 },
  { name:'Coyhaique',     country:'Chile',        flag:'🇨🇱', lat:-45.57 },
  { name:'Punta Arenas',  country:'Chile',        flag:'🇨🇱', lat:-53.15 },
  // Argentina
  { name:'Buenos Aires',  country:'Argentina',    flag:'🇦🇷', lat:-34.61 },
  { name:'Córdoba',       country:'Argentina',    flag:'🇦🇷', lat:-31.42 },
  { name:'Mendoza',       country:'Argentina',    flag:'🇦🇷', lat:-32.89 },
  { name:'Rosario',       country:'Argentina',    flag:'🇦🇷', lat:-32.95 },
  { name:'Bariloche',     country:'Argentina',    flag:'🇦🇷', lat:-41.13 },
  { name:'Ushuaia',       country:'Argentina',    flag:'🇦🇷', lat:-54.80 },
  // Perú
  { name:'Lima',          country:'Perú',         flag:'🇵🇪', lat:-12.05 },
  { name:'Arequipa',      country:'Perú',         flag:'🇵🇪', lat:-16.41 },
  { name:'Cusco',         country:'Perú',         flag:'🇵🇪', lat:-13.53 },
  // Colombia / Ecuador / Venezuela
  { name:'Bogotá',        country:'Colombia',     flag:'🇨🇴', lat:4.71  },
  { name:'Medellín',      country:'Colombia',     flag:'🇨🇴', lat:6.25  },
  { name:'Quito',         country:'Ecuador',      flag:'🇪🇨', lat:-0.23 },
  { name:'Guayaquil',     country:'Ecuador',      flag:'🇪🇨', lat:-2.17 },
  { name:'Caracas',       country:'Venezuela',    flag:'🇻🇪', lat:10.48 },
  // México
  { name:'Ciudad de México', country:'México',    flag:'🇲🇽', lat:19.43 },
  { name:'Guadalajara',   country:'México',       flag:'🇲🇽', lat:20.67 },
  { name:'Monterrey',     country:'México',       flag:'🇲🇽', lat:25.67 },
  // Brasil
  { name:'São Paulo',     country:'Brasil',       flag:'🇧🇷', lat:-23.55 },
  { name:'Río de Janeiro',country:'Brasil',       flag:'🇧🇷', lat:-22.91 },
  { name:'Brasília',      country:'Brasil',       flag:'🇧🇷', lat:-15.78 },
  { name:'Fortaleza',     country:'Brasil',       flag:'🇧🇷', lat:-3.72  },
  // España
  { name:'Madrid',        country:'España',       flag:'🇪🇸', lat:40.42 },
  { name:'Barcelona',     country:'España',       flag:'🇪🇸', lat:41.39 },
  { name:'Sevilla',       country:'España',       flag:'🇪🇸', lat:37.39 },
  // Europa / Mundo
  { name:'París',         country:'Francia',      flag:'🇫🇷', lat:48.86 },
  { name:'Londres',       country:'Reino Unido',  flag:'🇬🇧', lat:51.51 },
  { name:'Berlín',        country:'Alemania',     flag:'🇩🇪', lat:52.52 },
  { name:'Roma',          country:'Italia',       flag:'🇮🇹', lat:41.90 },
  { name:'Tokio',         country:'Japón',        flag:'🇯🇵', lat:35.69 },
  { name:'Sídney',        country:'Australia',    flag:'🇦🇺', lat:-33.87 },
  { name:'Nueva York',    country:'EE.UU.',       flag:'🇺🇸', lat:40.71 },
  { name:'Los Ángeles',   country:'EE.UU.',       flag:'🇺🇸', lat:34.05 },
  { name:'Miami',         country:'EE.UU.',       flag:'🇺🇸', lat:25.77 },
  { name:'Ciudad del Cabo',country:'Sudáfrica',   flag:'🇿🇦', lat:-33.93 },
  { name:'Nairobi',       country:'Kenia',        flag:'🇰🇪', lat:-1.29  },
  { name:'Mumbai',        country:'India',        flag:'🇮🇳', lat:19.08  },
  { name:'Dubái',         country:'EAU',          flag:'🇦🇪', lat:25.20  },
];

// ── Lógica del buscador ──────────────────────────────

let _cityIdx = -1;
let _cityTimeout = null;

function onCityInput() {
  clearTimeout(_cityTimeout);
  _cityTimeout = setTimeout(() => {
    const q  = document.getElementById('city-input').value.trim().toLowerCase();
    const dd = document.getElementById('city-dropdown');
    _cityIdx = -1;
    if (q.length < 2) { dd.style.display = 'none'; return; }

    const results = CIUDADES.filter(c =>
      c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!results.length) { dd.style.display = 'none'; return; }

    dd.innerHTML = results.map((c, i) => `
      <li onclick="selectCity(${i})" data-idx="${i}">
        <span class="city-flag">${c.flag}</span>
        <span class="city-name">${c.name}</span>
        <span style="font-size:.75rem;color:var(--muted)">${c.country}</span>
        <span class="city-lat">${c.lat > 0 ? '+' : ''}${c.lat}°</span>
      </li>`).join('');

    dd._results = results;
    dd.style.display = 'block';
  }, 150);
}

function onCityKey(e) {
  const dd    = document.getElementById('city-dropdown');
  const items = dd.querySelectorAll('li');
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _cityIdx = Math.min(_cityIdx + 1, items.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _cityIdx = Math.max(_cityIdx - 1, 0);
  } else if (e.key === 'Enter' && _cityIdx >= 0) {
    e.preventDefault(); selectCity(_cityIdx); return;
  } else if (e.key === 'Escape') {
    dd.style.display = 'none'; return;
  }
  items.forEach((li, i) => li.classList.toggle('active', i === _cityIdx));
}

function selectCity(idx) {
  const dd   = document.getElementById('city-dropdown');
  const city = dd._results[idx];
  if (!city) return;

  document.getElementById('lat-input').value = city.lat;
  document.getElementById('city-input').value = '';
  dd.style.display = 'none';

  const tag = document.getElementById('city-tag');
  document.getElementById('city-tag-text').textContent =
    `${city.flag} ${city.name}, ${city.country} — Latitud: ${city.lat}°`;
  tag.style.display = 'flex';
  state.lat = city.lat;
}

function useMyLocation() {
  if (!navigator.geolocation) return alert('Geolocalización no disponible.');
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = parseFloat(pos.coords.latitude.toFixed(2));
    document.getElementById('lat-input').value = lat;
    document.getElementById('city-tag-text').textContent = `📍 GPS — Latitud: ${lat}°`;
    document.getElementById('city-tag').style.display = 'flex';
    state.lat = lat;
  }, () => alert('No se pudo obtener la ubicación. Ingresa la latitud manualmente.'));
}

document.addEventListener('click', e => {
  if (!e.target.closest('#city-input') && !e.target.closest('#city-dropdown'))
    document.getElementById('city-dropdown').style.display = 'none';
});
