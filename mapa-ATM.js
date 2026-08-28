// ==========================================================
// COLORES POR BANCO
// ==========================================================
const BANK_COLORS = {
  "Banco General": "#2dd4bf",
  "Banistmo": "#f97316",
  "Banco Nacional de Panamá": "#60a5fa",
  "Scotiabank": "#ef4444",
  "BAC Credomatic": "#a78bfa",
  "Caja de Ahorros": "#facc15",
  "Global Bank": "#22c55e",
  "Credicorp Bank": "#f472b6",
  "CanalBank": "#38bdf8",
  "Otro": "#94a3b8"
};
 
// ==========================================================
// DATOS DE ATMs (Ciudad de Panamá + David, Chiriquí)
// Cada objeto: name, bank, city, lat, lng, addr, hours
// ==========================================================
const atms = [
 
  // ================= CIUDAD DE PANAMÁ =================
  { name:"ATM Banco General", bank:"Banco General", city:"Ciudad de Panamá", lat:8.9891103, lng:-79.5229442, addr:"Vía España, Panamá", hours:"7:00 AM - 10:00 PM" },
  { name:"Banco General ATM", bank:"Banco General", city:"Ciudad de Panamá", lat:8.9947074, lng:-79.5586701, addr:"Av. Demetrio Basilio Lakas, Panamá", hours:"24 horas" },
  { name:"Banco General ATM", bank:"Banco General", city:"Ciudad de Panamá", lat:8.9981449, lng:-79.5330880, addr:"Panamá", hours:"24 horas" },
  { name:"Banco General ATM", bank:"Banco General", city:"Ciudad de Panamá", lat:9.0007027, lng:-79.5166752, addr:"Panamá", hours:"" },
  { name:"Banco General ATM", bank:"Banco General", city:"Ciudad de Panamá", lat:9.0085741, lng:-79.5369279, addr:"Av. 17B Nte., Panamá", hours:"24 horas" },
  { name:"Banco General ATM", bank:"Banco General", city:"Ciudad de Panamá", lat:9.0136239, lng:-79.5222809, addr:"San Miguelito, Panamá", hours:"24 horas" },
  { name:"Banistmo ATM | Super 99 - Río Abajo", bank:"Banistmo", city:"Ciudad de Panamá", lat:9.0129536, lng:-79.5000244, addr:"Super 99, Río Abajo, Panamá", hours:"24 horas" },
  { name:"Banistmo ATM | Super 99 - Albrook", bank:"Banistmo", city:"Ciudad de Panamá", lat:8.9770154, lng:-79.5508434, addr:"Albrook Mall, Panamá", hours:"24 horas" },
  { name:"Banistmo ATM | Terminal Albrook #3", bank:"Banistmo", city:"Ciudad de Panamá", lat:8.9736210, lng:-79.5516480, addr:"Terminal de Albrook, Panamá", hours:"24 horas" },
  { name:"Banistmo ATM | Hotel Hilton", bank:"Banistmo", city:"Ciudad de Panamá", lat:8.9760974, lng:-79.5226619, addr:"Frente al Hotel Hilton, Panamá", hours:"24 horas" },
  { name:"Banistmo ATM | Multicentro", bank:"Banistmo", city:"Ciudad de Panamá", lat:8.9766092, lng:-79.5176613, addr:"Multicentro, Av. Balboa, Panamá", hours:"" },
  { name:"Banistmo ATM | Terminal Albrook #1", bank:"Banistmo", city:"Ciudad de Panamá", lat:8.9743630, lng:-79.5516450, addr:"Terminal de Albrook, Panamá", hours:"24 horas" },
  { name:"ATM Banco Nacional de Panamá", bank:"Banco Nacional de Panamá", city:"Ciudad de Panamá", lat:9.0338021, lng:-79.4998886, addr:"Calle de Circunvalación, Panamá", hours:"24 horas" },
  { name:"ATM Banco Nacional", bank:"Banco Nacional de Panamá", city:"Ciudad de Panamá", lat:9.0198339, lng:-79.5325533, addr:"Av. Universidad Tecnológica, Panamá", hours:"24 horas" },
  { name:"ATM Banco Nacional", bank:"Banco Nacional de Panamá", city:"Ciudad de Panamá", lat:8.9902720, lng:-79.5162535, addr:"Panamá", hours:"" },
  { name:"ATM Banco Nacional", bank:"Banco Nacional de Panamá", city:"Ciudad de Panamá", lat:9.0031403, lng:-79.5163506, addr:"Vía España, Panamá", hours:"24 horas" },
  { name:"ATM Scotiabank - Sucursal Bella Vista", bank:"Scotiabank", city:"Ciudad de Panamá", lat:8.9780633, lng:-79.5230257, addr:"Calle Aquilino de la Guardia, Panamá", hours:"24 horas" },
  { name:"ATM Scotiabank - Branch Dorado", bank:"Scotiabank", city:"Ciudad de Panamá", lat:9.0074751, lng:-79.5367163, addr:"Av. 17B Nte., Panamá", hours:"24 horas" },
  { name:"Credomatic | Terminal de Albrook", bank:"BAC Credomatic", city:"Ciudad de Panamá", lat:8.9744106, lng:-79.5513740, addr:"Terminal de Albrook, Panamá", hours:"24 horas" },
  { name:"BAC ATM", bank:"BAC Credomatic", city:"Ciudad de Panamá", lat:9.0112110, lng:-79.5341448, addr:"Calle 74 Oeste, Panamá", hours:"No 24h" },
 
  // ================= DAVID, CHIRIQUÍ =================
  { name:"Cajero Banco Nacional de Panamá | Super Extra", bank:"Banco Nacional de Panamá", city:"David, Chiriquí", lat:8.4288088, lng:-82.4442848, addr:"Super Extra, David", hours:"" },
  { name:"General Bank ATM", bank:"Banco General", city:"David, Chiriquí", lat:8.4286773, lng:-82.4443573, addr:"David centro", hours:"7:00 AM - 11:00 PM" },
  { name:"ATM 24h (David Sur)", bank:"Otro", city:"David, Chiriquí", lat:8.4242708, lng:-82.4312159, addr:"David Sur", hours:"24 horas" },
  { name:"Cajero (Savings Bank)", bank:"Caja de Ahorros", city:"David, Chiriquí", lat:8.4345368, lng:-82.4219254, addr:"David", hours:"24 horas" },
  { name:"ATM Banco General", bank:"Banco General", city:"David, Chiriquí", lat:8.4454928, lng:-82.4194547, addr:"El Terronal, David", hours:"24 horas" },
  { name:"Banco General David (C. F Sur)", bank:"Banco General", city:"David, Chiriquí", lat:8.4284802, lng:-82.4384242, addr:"Calle F Sur, David", hours:"8:00 AM - 3:00 PM" },
  { name:"Cajero ATM Banistmo", bank:"Banistmo", city:"David, Chiriquí", lat:8.4353061, lng:-82.4400801, addr:"Carr. Interamericana, David", hours:"24 horas" },
  { name:"BAC ATM (Av. Obaldía)", bank:"BAC Credomatic", city:"David, Chiriquí", lat:8.4410716, lng:-82.4236017, addr:"Av. Obaldía, David", hours:"24 horas" },
  { name:"Banistmo ATM | Xtra David", bank:"Banistmo", city:"David, Chiriquí", lat:8.4287571, lng:-82.4442518, addr:"Xtra David, Terminal, Calle 19 de Octubre", hours:"24 horas" },
  { name:"Cajero Global Bank | Hospital Chiriquí", bank:"Global Bank", city:"David, Chiriquí", lat:8.4311618, lng:-82.4324109, addr:"Sala de espera, Hosp. Chiriquí, David", hours:"24 horas" },
  { name:"Banco General David (C. B Nte)", bank:"Banco General", city:"David, Chiriquí", lat:8.4302111, lng:-82.4271248, addr:"Calle B Nte., David", hours:"8:00 AM - 3:00 PM" },
  { name:"Banco General San Mateo", bank:"Banco General", city:"David, Chiriquí", lat:8.4284265, lng:-82.4387562, addr:"Av. 6a Oeste, David", hours:"8:00 AM - 3:00 PM" },
  { name:"ATMs BAC | Banco General | Global", bank:"Otro", city:"David, Chiriquí", lat:8.4443407, lng:-82.4212954, addr:"David (dentro de Super 99)", hours:"" },
  { name:"Banco General David Terronal", bank:"Banco General", city:"David, Chiriquí", lat:8.4454507, lng:-82.4194956, addr:"Carr. Panamericana, El Terronal", hours:"11:30 AM - 6:00 PM" },
  { name:"Banistmo ATM (Av. Bolívar)", bank:"Banistmo", city:"David, Chiriquí", lat:8.4292230, lng:-82.4245580, addr:"Av. Bolívar, David centro", hours:"24 horas" },
  { name:"Banistmo | David Centro", bank:"Banistmo", city:"David, Chiriquí", lat:8.4292212, lng:-82.4245751, addr:"Av. Bolívar, David centro", hours:"8:00 AM - 3:30 PM" },
  { name:"Banistmo ATM | Suc. David Terronal", bank:"Banistmo", city:"David, Chiriquí", lat:8.4460355, lng:-82.4210321, addr:"Plaza Terronal, detrás de Friday's", hours:"24 horas" },
  { name:"Banistmo ATM (Av. 5a Este)", bank:"Banistmo", city:"David, Chiriquí", lat:8.4253968, lng:-82.4254649, addr:"Av. 5a Este, David", hours:"24 horas" },
  { name:"Banistmo ATM (Calle F Sur)", bank:"Banistmo", city:"David, Chiriquí", lat:8.4278900, lng:-82.4371000, addr:"Calle F Sur, David", hours:"24 horas" },
  { name:"Banistmo ATM (Pan-American Hwy)", bank:"Banistmo", city:"David, Chiriquí", lat:8.4351166, lng:-82.4416933, addr:"Carretera Interamericana, David", hours:"24 horas" },
  { name:"Banco Nacional (Calle B Nte)", bank:"Banco Nacional de Panamá", city:"David, Chiriquí", lat:8.4286610, lng:-82.4250400, addr:"Calle B Nte., David", hours:"8:00 AM - 3:00 PM" },
  { name:"Banco Nacional de Panamá (C. H Nte)", bank:"Banco Nacional de Panamá", city:"David, Chiriquí", lat:8.4373064, lng:-82.4256750, addr:"Calle H Nte., David", hours:"8:00 AM - 3:00 PM" },
  { name:"Auto Banco Nacional Doleguita", bank:"Banco Nacional de Panamá", city:"David, Chiriquí", lat:8.4377992, lng:-82.4259061, addr:"Av. 3a Oeste, David", hours:"9:00 AM - 4:00 PM" },
  { name:"ATM Banco Nacional Revilla", bank:"Banco Nacional de Panamá", city:"David, Chiriquí", lat:8.4283240, lng:-82.4248394, addr:"Av. Obaldía, David", hours:"" },
  { name:"Banco Nacional (Av. 1a Este)", bank:"Banco Nacional de Panamá", city:"David, Chiriquí", lat:8.4242710, lng:-82.4311362, addr:"Av. 1a Este, David Sur", hours:"8:00 AM - 3:00 PM" },
  { name:"Cajero Banco Nacional | Fcia. YADI", bank:"Banco Nacional de Panamá", city:"David, Chiriquí", lat:8.4322339, lng:-82.4616083, addr:"San Pablo Viejo, Chiriquí", hours:"" },
  { name:"Scotiabank ATM", bank:"Scotiabank", city:"David, Chiriquí", lat:8.4306635, lng:-82.4281140, addr:"David centro", hours:"" },
  { name:"Caja de Ahorros | David Centro", bank:"Caja de Ahorros", city:"David, Chiriquí", lat:8.4290722, lng:-82.4265844, addr:"Av. 2a Este, David", hours:"8:00 AM - 3:00 PM" },
  { name:"Cajero Caja de Ahorros (Av. 2a Este)", bank:"Caja de Ahorros", city:"David, Chiriquí", lat:8.4291379, lng:-82.4264368, addr:"Av. 2a Este, David", hours:"24 horas" },
  { name:"Caja de Ahorros | David Interamericana", bank:"Caja de Ahorros", city:"David, Chiriquí", lat:8.4446791, lng:-82.4209316, addr:"Vía Interamericana y Av. Francisco Clark", hours:"8:00 AM - 3:00 PM" },
  { name:"Caja de Ahorros #2710", bank:"Caja de Ahorros", city:"David, Chiriquí", lat:8.4282259, lng:-82.4298324, addr:"Central, David", hours:"" },
  { name:"BAC Panamá | Metro Plaza", bank:"BAC Credomatic", city:"David, Chiriquí", lat:8.4409052, lng:-82.4236665, addr:"PH Metro Plaza, Av. Obaldía", hours:"9:00 AM - 4:30 PM" },
  { name:"ATM Global Bank", bank:"Global Bank", city:"David, Chiriquí", lat:8.4448292, lng:-82.4193344, addr:"David", hours:"" },
  { name:"ATM Global Bank | Super 99 Corotú", bank:"Global Bank", city:"David, Chiriquí", lat:8.4458671, lng:-82.4197928, addr:"Plaza Corotú, Carr. Panamericana", hours:"" },
  { name:"ATM Global Bank | Super 99 David", bank:"Global Bank", city:"David, Chiriquí", lat:8.4278868, lng:-82.4371711, addr:"Super 99, Calle F Sur", hours:"" },
  { name:"Cajero Global Bank", bank:"Global Bank", city:"David, Chiriquí", lat:8.4449174, lng:-82.4194534, addr:"David", hours:"" },
  { name:"ATM Global Bank | FETRATEDA", bank:"Global Bank", city:"David, Chiriquí", lat:8.4337022, lng:-82.4232765, addr:"Terminal de Transporte de David, Av. Obaldía", hours:"" },
  { name:"ATM Global Bank | Hospital Chiriquí", bank:"Global Bank", city:"David, Chiriquí", lat:8.4219383, lng:-82.4380785, addr:"Torre nueva, Av. 4a Oeste", hours:"" },
  { name:"ATM Global Bank | Farmacias Arrocha San Mateo", bank:"Global Bank", city:"David, Chiriquí", lat:8.4274124, lng:-82.4386845, addr:"Plaza PH 507, Calle F Sur", hours:"" },
  { name:"ATM Global Bank | Cinépolis Federal Mall", bank:"Global Bank", city:"David, Chiriquí", lat:8.4550744, lng:-82.4266716, addr:"Federal Mall, Av. Belisario Porras", hours:"" },
  { name:"CanalBank", bank:"CanalBank", city:"David, Chiriquí", lat:8.4296510, lng:-82.4268469, addr:"Calle B Nte., David", hours:"8:30 AM - 3:30 PM" },
  { name:"BAC Panamá | Edificio Multibank", bank:"BAC Credomatic", city:"David, Chiriquí", lat:8.4298921, lng:-82.4280623, addr:"Urb. Aristides Romero, David", hours:"8:00 AM - 6:00 PM" },
  { name:"Credicorp Bank | Chiriquí Mall", bank:"Credicorp Bank", city:"David, Chiriquí", lat:8.4315261, lng:-82.4612286, addr:"Vía Interamericana, Chiriquí Mall", hours:"9:30 AM - 5:00 PM" },
  { name:"Centro de Préstamos David", bank:"Credicorp Bank", city:"David, Chiriquí", lat:8.4312807, lng:-82.4276854, addr:"Calle C Nte., David", hours:"8:00 AM - 4:00 PM" },
  { name:"Cajero Credicorp", bank:"Credicorp Bank", city:"David, Chiriquí", lat:8.4319400, lng:-82.4610169, addr:"San Pablo Viejo, Chiriquí", hours:"24 horas" },
   // --- Veraguas (Santiago) ---
  { name:"Plaza Banconal (Banco Nacional)", bank:"Banco Nacional de Panamá", province:"Veraguas", lat:8.1058598, lng:-80.9710236, addr:"Carr. Interamericana, Santiago, Veraguas", hours:"8:00 AM - 4:00 PM" },
  { name:"Banco General Santiago", bank:"Banco General", province:"Veraguas", lat:8.0975318, lng:-80.9792816, addr:"Av. Central y Calle 8, Santiago, Veraguas", hours:"8:00 AM - 3:00 PM" },
  { name:"BAC Credomatic | Santiago", bank:"BAC Credomatic", province:"Veraguas", lat:8.0991686, lng:-80.9641484, addr:"Plaza Corotú, Carr. Interamericana, Santiago", hours:"8:00 AM - 3:00 PM" },
  { name:"Banco Nacional | Avenida Central", bank:"Banco Nacional de Panamá", province:"Veraguas", lat:8.0972738, lng:-80.9828160, addr:"Av. Héctor A. Santacoloma, Santiago, Veraguas", hours:"8:00 AM - 3:00 PM" },

  // --- Coclé (Penonomé) ---
  { name:"ATM Banco Nacional | Plaza Esmeralda", bank:"Banco Nacional de Panamá", province:"Coclé", lat:8.5099932, lng:-80.3630150, addr:"Plaza Esmeralda, Penonomé, Coclé", hours:"24 horas" },
  { name:"Banistmo ATM | Suc. Penonomé", bank:"Banistmo", province:"Coclé", lat:8.5160085, lng:-80.3523854, addr:"Av. Juan D. Arosemena, Penonomé, Coclé", hours:"24 horas" },
  { name:"ATM Caja de Ahorros", bank:"Caja de Ahorros", province:"Coclé", lat:8.5207384, lng:-80.3583730, addr:"Penonomé, Coclé", hours:"24 horas" },
  { name:"Banco General Penonomé", bank:"Banco General", province:"Coclé", lat:8.5028527, lng:-80.3645685, addr:"Boulevard Penonomé, Carr. Panamericana, Coclé", hours:"8:00 AM - 3:00 PM" },
  { name:"Banistmo ATM", bank:"Banistmo", province:"Coclé", lat:8.5155273, lng:-80.3525440, addr:"Calle Manuel Amador Guerrero, Penonomé, Coclé", hours:"24 horas" },

  // --- Colón ---
  { name:"Banco Nacional de Panamá | Colón", bank:"Banco Nacional de Panamá", province:"Colón", lat:9.3567233, lng:-79.9037645, addr:"Colón centro", hours:"8:00 AM - 3:00 PM" },
  { name:"Banco General Colón", bank:"Banco General", province:"Colón", lat:9.3558538, lng:-79.9044134, addr:"Av. del Frente, Colón", hours:"8:00 AM - 3:00 PM" },
  { name:"Banco General Plaza La Rotonda", bank:"Banco General", province:"Colón", lat:9.3378989, lng:-79.8796146, addr:"Av. Randolph, Colón", hours:"8:00 AM - 3:00 PM" },
  { name:"Credicorp Bank | Cuatro Altos", bank:"Credicorp Bank", province:"Colón", lat:9.3387467, lng:-79.8858941, addr:"Plaza Cuatro Altos, Colón", hours:"8:00 AM - 3:00 PM" },

  // --- Herrera (Chitré) ---
  { name:"ATM Banco General", bank:"Banco General", province:"Herrera", lat:7.9641571, lng:-80.4318590, addr:"Calle Melitón Martín, Chitré, Herrera", hours:"7:00 AM - 9:00 PM" },
  { name:"Cajeros Banco General | Sede BG", bank:"Banco General", province:"Herrera", lat:7.9656370, lng:-80.4337155, addr:"Plaza Carola, Chitré, Herrera", hours:"24 horas" },
  { name:"ATM Caja de Ahorros", bank:"Caja de Ahorros", province:"Herrera", lat:7.9623487, lng:-80.4286746, addr:"Chitré, Herrera", hours:"24 horas" },
  { name:"ATM Caja de Ahorros", bank:"Caja de Ahorros", province:"Herrera", lat:7.9540270, lng:-80.4308609, addr:"Chitré, Herrera", hours:"24 horas" },
  { name:"ATM Banco General", bank:"Banco General", province:"Herrera", lat:7.9537799, lng:-80.4241775, addr:"Chitré, Herrera", hours:"" },

  // --- Los Santos (Las Tablas) ---
  { name:"Banistmo ATM", bank:"Banistmo", province:"Los Santos", lat:7.7662027, lng:-80.2774600, addr:"Av. Dr. Belisario Porras, Las Tablas, Los Santos", hours:"24 horas" },
  { name:"Banco Nacional de Panamá | Las Tablas", bank:"Banco Nacional de Panamá", province:"Los Santos", lat:7.7694892, lng:-80.2763700, addr:"Calle Ramón Mora, Las Tablas, Los Santos", hours:"8:00 AM - 3:00 PM" },
  { name:"Banco General Las Tablas", bank:"Banco General", province:"Los Santos", lat:7.7676787, lng:-80.2774897, addr:"Frente al Parque Belisario Porras, Las Tablas", hours:"8:00 AM - 3:00 PM" },
  { name:"ATM Scotiabank / Caja de Ahorros / BAC", bank:"Scotiabank", province:"Los Santos", lat:7.7654842, lng:-80.2725338, addr:"Las Tablas, Los Santos", hours:"" },

  // --- Panamá Oeste (La Chorrera) ---
  { name:"ATM Banco General", bank:"Banco General", province:"Panamá Oeste", lat:8.8794763, lng:-79.7815503, addr:"La Chorrera, Panamá Oeste", hours:"24 horas" },
  { name:"Banistmo ATM | Xtra La Chorrera, El Coco", bank:"Banistmo", province:"Panamá Oeste", lat:8.8705367, lng:-79.8003624, addr:"Xtra El Coco, La Chorrera, Panamá Oeste", hours:"24 horas" },
  { name:"Banco Nacional | Cajero Automático", bank:"Banco Nacional de Panamá", province:"Panamá Oeste", lat:8.8764034, lng:-79.7873052, addr:"Las Américas, La Chorrera, Panamá Oeste", hours:"24 horas" },
  { name:"Banco General La Chorrera", bank:"Banco General", province:"Panamá Oeste", lat:8.8794171, lng:-79.7815662, addr:"Carr. Panamericana, La Chorrera", hours:"8:00 AM - 3:00 PM" },
  { name:"National Bank ATM | Policlínica Dr. Santiago Barraza", bank:"Banco Nacional de Panamá", province:"Panamá Oeste", lat:8.8897804, lng:-79.7606342, addr:"Policlínica, La Chorrera, Panamá Oeste", hours:"24 horas" },

  // --- Bocas del Toro ---
  { name:"ATM (frente a banco)", bank:"Caja de Ahorros", province:"Bocas del Toro", lat:9.3410502, lng:-82.2414436, addr:"Calle 4ta, Bocas del Toro", hours:"24 horas" },

  // --- Darién ---
  { name:"Banco Nacional de Panamá | Metetí", bank:"Banco Nacional de Panamá", province:"Darién", lat:8.5170661, lng:-77.9804048, addr:"Metetí, Darién", hours:"8:00 AM - 3:00 PM" },
  { name:"ATM Banco Nacional", bank:"Banco Nacional de Panamá", province:"Darién", lat:8.5175365, lng:-77.9806713, addr:"Metetí, Darién", hours:"" },
  { name:"ATM Caja de Ahorros", bank:"Caja de Ahorros", province:"Darién", lat:8.6577710, lng:-78.1544705, addr:"Darién", hours:"" }
];
 
// ==========================================================
// INICIALIZAR MAPA (vista general que abarca ambas ciudades)
// ==========================================================
const map = L.map('map', { zoomControl: false }).setView([8.75, -80.9], 7.4);
L.control.zoom({ position: 'bottomright' }).addTo(map);
 
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);
 
// Si el mapa no aparece, forzamos que Leaflet recalcule su tamaño
// (esto soluciona el bug más común al incrustar el mapa en otra página)
setTimeout(() => { map.invalidateSize(); }, 300);
window.addEventListener('resize', () => { map.invalidateSize(); });
 
// ==========================================================
// ÍCONO PERSONALIZADO (gota de color según banco)
// ==========================================================
function makeIcon(color){
  return L.divIcon({
    className: '',
    html: `<div style="
      width:16px;height:16px;border-radius:50% 50% 50% 0;
      background:${color};
      transform: rotate(-45deg);
      border:2px solid #0f1720;
      box-shadow:0 0 6px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -14]
  });
}
 
// ==========================================================
// FILTRO: CIUDAD / ZONA
// ==========================================================
const cities = [...new Set(atms.map(a => a.city))].sort();
const citySelect = document.getElementById('citySelect');
cities.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c;
  opt.textContent = c;
  citySelect.appendChild(opt);
});
citySelect.addEventListener('change', () => {
  renderMarkers(document.getElementById('searchInput').value.toLowerCase());
  zoomToCity(citySelect.value);
});
 
// Zoom automático al elegir una ciudad
function zoomToCity(city){
  if (city === "all"){
    map.setView([8.75, -80.9], 7.4, { animate: true });
    return;
  }
  const cityAtms = atms.filter(a => a.city === city);
  if (cityAtms.length === 0) return;
  const bounds = L.latLngBounds(cityAtms.map(a => [a.lat, a.lng]));
  map.fitBounds(bounds, { padding: [40, 40] });
}
 
// ==========================================================
// ESTADO DE FILTROS
// ==========================================================
let activeBanks = new Set(Object.keys(BANK_COLORS));
let markers = [];
 
// ==========================================================
// RENDERIZAR MARCADORES Y LISTA
// ==========================================================
function renderMarkers(filterText = ""){
  markers.forEach(m => map.removeLayer(m.marker));
  markers = [];
 
  const list = document.getElementById('atmList');
  list.innerHTML = "";
 
  const selectedCity = citySelect.value;
 
  const filtered = atms.filter(a =>
    activeBanks.has(a.bank) &&
    (selectedCity === "all" || a.city === selectedCity) &&
    (
      a.name.toLowerCase().includes(filterText) ||
      a.addr.toLowerCase().includes(filterText) ||
      a.bank.toLowerCase().includes(filterText) ||
      a.city.toLowerCase().includes(filterText)
    )
  );
 
  filtered.forEach(a => {
    const color = BANK_COLORS[a.bank] || "#94a3b8";
    const marker = L.marker([a.lat, a.lng], { icon: makeIcon(color) }).addTo(map);
 
    marker.bindPopup(`
      <div class="popup-bank-tag" style="background:${color}22;color:${color};border:1px solid ${color}55;">${a.bank}</div>
      <div class="popup-title">${a.name}</div>
      <div class="popup-addr">${a.addr} · ${a.city}</div>
      ${a.hours ? `<div class="popup-hours">🕐 ${a.hours}</div>` : ''}
    `);
 
    markers.push({ marker, data: a });
 
    const card = document.createElement('div');
    card.className = 'atm-card';
    card.innerHTML = `
      <div class="name"><span class="sw" style="background:${color}"></span>${a.name}</div>
      <div class="addr">${a.addr}</div>
      <div class="city-tag">📍 ${a.city}</div>
      ${a.hours ? `<div class="hours">🕐 ${a.hours}</div>` : ''}
    `;
    card.addEventListener('click', () => {
      map.setView([a.lat, a.lng], 16, { animate: true });
      marker.openPopup();
    });
    list.appendChild(card);
  });
 
  document.getElementById('countShown').textContent = filtered.length;
  document.getElementById('countTotal').textContent = atms.length;
}
 
// ==========================================================
// FILTROS DE BANCO (chips)
// ==========================================================
const filtersDiv = document.getElementById('bankFilters');
Object.keys(BANK_COLORS).forEach(bank => {
  const chip = document.createElement('div');
  chip.className = 'bank-chip active';
  chip.style.setProperty('--chip-color', BANK_COLORS[bank]);
  chip.innerHTML = `<span class="sw"></span>${bank}`;
  chip.addEventListener('click', () => {
    if (activeBanks.has(bank)) {
      activeBanks.delete(bank);
      chip.classList.remove('active');
    } else {
      activeBanks.add(bank);
      chip.classList.add('active');
    }
    renderMarkers(document.getElementById('searchInput').value.toLowerCase());
  });
  filtersDiv.appendChild(chip);
});
 
// ==========================================================
// BÚSQUEDA
// ==========================================================
document.getElementById('searchInput').addEventListener('input', (e) => {
  renderMarkers(e.target.value.toLowerCase());
});
 
// ==========================================================
// RENDER INICIAL
// ==========================================================
renderMarkers();