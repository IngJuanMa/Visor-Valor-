// ==========================
// MODAL DE ALERTA PARA FILTROS
// ==========================
function mostrarAlertaFiltro(mensaje) {
  document.getElementById('modalAlertaFiltroBody').textContent = mensaje;
  const modal = new bootstrap.Modal(document.getElementById('modalAlertaFiltro'));
  modal.show();
}
// =========================================================================
// FILTRO  PARA MÓVIL
// ========================================================================
function actualizarCamposMovil() {
  const capa = document.getElementById('filtro-capa-movil').value;
  const campoSelect = document.getElementById('filtro-campo-movil');
  campoSelect.innerHTML = '';
  if (!geojsonOriginal[capa]) {
    setTimeout(actualizarCamposMovil, 200);
    return;
  }
  completarCamposMovil(capa);
  actualizarValoresMovil();
}

function completarCamposMovil(capa) {
  const campoSelect = document.getElementById('filtro-campo-movil');
  campoSelect.innerHTML = '';
  (camposPorCapa[capa] || []).forEach(campo => {
    const opt = document.createElement('option');
    opt.value = campo;
    opt.textContent = aliasCampos[campo] || campo;
    campoSelect.appendChild(opt);
  });
  if (campoSelect.options.length > 0) {
    campoSelect.selectedIndex = 0;
  }
}

function actualizarValoresMovil() {
  const capa = document.getElementById('filtro-capa-movil').value;
  const campo = document.getElementById('filtro-campo-movil').value;
  const lista = document.getElementById('lista-valores-movil');
  lista.innerHTML = '';
  const valores = new Set();
  const datos = geojsonOriginal[capa]?.features || [];
  datos.forEach(f => {
    if (f.properties && Object.prototype.hasOwnProperty.call(f.properties, campo)) {
      const valor = f.properties[campo];
      if (valor !== undefined && valor !== null && valor !== "") valores.add(valor);
    }
  });
  [...valores].sort().forEach(valor => {
    const opt = document.createElement('option');
    opt.value = valor;
    lista.appendChild(opt);
  });
}

function filtrarCapaMovil() {
  const capaNombre = document.getElementById('filtro-capa-movil').value;
  const campo = document.getElementById('filtro-campo-movil').value;
  const valor = document.getElementById('filtro-valor-movil').value.toLowerCase();
  if (!capaNombre || !campo || !valor) {
    mostrarAlertaFiltro('Por favor selecciona capa, campo y valor para filtrar.');
    return;
  }
  // Activar la capa correspondiente si no está activa
  const checkbox = document.getElementById('capa' + capaNombre);
  if (checkbox && !checkbox.checked) {
    checkbox.checked = true;
    toggleCapa(capaNombre);
  }

  const base = geojsonOriginal[capaNombre]?.features || [];
  const filtradas = base.filter(f => (f.properties?.[campo] || '').toString().toLowerCase() === valor);
  if (window.capaFiltradaMovil) map.removeLayer(window.capaFiltradaMovil);
  window.capaFiltradaMovil = L.geoJSON({ type: 'FeatureCollection', features: filtradas }, {
    style: { color: 'yellow', weight: 2, fillOpacity: 0.6 },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(generarPopup(feature, capaNombre));
    }
  }).addTo(map);
  if (filtradas.length > 0) map.fitBounds(window.capaFiltradaMovil.getBounds());
  else mostrarAlertaFiltro('No se encontraron resultados para el filtro.');
}

function limpiarFiltroMovil() {
  document.getElementById('filtro-valor-movil').value = '';
  if (window.capaFiltradaMovil) map.removeLayer(window.capaFiltradaMovil);
  window.capaFiltradaMovil = null;
  map.setView(configVisor.center, configVisor.zoom);
}

// ===================================================================================================
// FILTRO DE CAPAS Desktop
// ==================================================================================================
const camposPorCapa = {
  "Terreno": ["fid", "area_terreno", "Predio_numero_predial"],
  "Unidades": [ "T_Id", "area_construida", "planta_ubicacion", "altura", "etiqueta", "fid"],
  "Barrios": ["nombre", "fid", "codigo"],
  "Construccion": ["fid", "total_pisos", "area_total_construccion"]
};

const aliasCampos = {
  "area_terreno": "Área de Terreno",
  "fid": "Identificador",
  "Predio_numero_predial": "Número Predial",
  "T_Id": "Identificador",
  "area_construida": "Área Construida",
  "planta_ubicacion": "Planta de Ubicación",
  "altura": "Altura",
  "etiqueta": "Etiqueta",
  "nombre": "Nombre",
  "codigo": "Código",
  "total_pisos": "Total Pisos",
  "area_total_construccion": "Área Total Construcción"
};

function actualizarCampos() {
  const capa = document.getElementById('filtro-capa').value;
  const campoSelect = document.getElementById('filtro-campo');
  campoSelect.innerHTML = '';
  if (!geojsonOriginal[capa]) {
    // Esperar a que los datos estén cargados
    setTimeout(actualizarCampos, 200);
    return;
  }
  completarCampos(capa);
  actualizarValores();
}

function completarCampos(capa) {
  const campoSelect = document.getElementById('filtro-campo');
  campoSelect.innerHTML = '';
  (camposPorCapa[capa] || []).forEach(campo => {
    const opt = document.createElement('option');
    opt.value = campo;
    opt.textContent = aliasCampos[campo] || campo;
    campoSelect.appendChild(opt);
  });
  // Selecciona el primer campo por defecto
  if (campoSelect.options.length > 0) {
    campoSelect.selectedIndex = 0;
  }
}

function actualizarValores() {
  const capa = document.getElementById('filtro-capa').value;
  const campo = document.getElementById('filtro-campo').value;
  const lista = document.getElementById('lista-valores');
  lista.innerHTML = '';
  const valores = new Set();
  const datos = geojsonOriginal[capa]?.features || [];
  datos.forEach(f => {
    const valor = f.properties?.[campo];
    if (valor !== undefined && valor !== null && valor !== "") valores.add(valor);
  });
  [...valores].sort().forEach(valor => {
    const opt = document.createElement('option');
    opt.value = valor;
    lista.appendChild(opt);
  });
}

function filtrarCapa() {
  const capaNombre = document.getElementById('filtro-capa').value;
  const campo = document.getElementById('filtro-campo').value;
  const valor = document.getElementById('filtro-valor').value.toLowerCase();
  if (!capaNombre || !campo || !valor) {
    mostrarAlertaFiltro('Por favor selecciona capa, campo y valor para filtrar.');
    return;
  }

  // Activar la capa correspondiente si no está activa
  const checkbox = document.getElementById('capa' + capaNombre);
  if (checkbox && !checkbox.checked) {
    checkbox.checked = true;
    toggleCapa(capaNombre);
  }

  const base = geojsonOriginal[capaNombre]?.features || [];
  const filtradas = base.filter(f => (f.properties?.[campo] || '').toString().toLowerCase() === valor);

  if (window.capaFiltrada) map.removeLayer(window.capaFiltrada);

  window.capaFiltrada = L.geoJSON({ type: 'FeatureCollection', features: filtradas }, {
    style: { color: 'yellow', weight: 2, fillOpacity: 0.6 },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(generarPopup(feature, capaNombre));
    }
  }).addTo(map);

  if (filtradas.length > 0) map.fitBounds(window.capaFiltrada.getBounds());
  else mostrarAlertaFiltro('No se encontraron resultados para el filtro.');
}

function limpiarFiltro() {
  document.getElementById('filtro-valor').value = '';
  if (window.capaFiltrada) map.removeLayer(window.capaFiltrada);
  window.capaFiltrada = null;
  // Centrar el mapa en la vista inicial
  map.setView(configVisor.center, configVisor.zoom);
}
// ==========================
// CONFIGURACIÓN DE VISORES
// ==========================
const visores = {

  san_juan: {
    nombre: "Visor San Juan",
    center: [8.760177017235593, -76.52986694020356],
    zoom: 15,
    capas: {
      Terreno: { archivo: "./data/san_juan/CR_Terreno_Predio.geojson", estilo: { color: 'orange', weight: 0.6, fillOpacity: 0.2 }, minZoom: 18, maxZoom: 22 },
      Barrios: { archivo: "./data/san_juan/CC_Barrio.geojson", estilo: { color: 'green', weight: 0.6, fillOpacity: 0.2 }, minZoom: 16, maxZoom: 17 },
      Construccion: { archivo: "./data/san_juan/CR_Construccion.geojson", estilo: { color: 'blue', weight: 0.6, fillOpacity: 0.2 }, minZoom: 0, maxZoom: 15 },
      Unidades: { archivo: "./data/san_juan/CR_UnidadConstruccion.geojson", estilo: { color: 'purple', weight: 0.6, fillOpacity: 0.2 }, minZoom: 0, maxZoom: 15 }
    }
  },

  san_pedro: {
    nombre: "Visor San Pedro",
    center: [8.27734150243366, -76.37789593969427],
    zoom: 15,
    capas: {
      Terreno: { archivo: "./data/san_pedro/CR_Terreno_Predio.geojson", estilo: { color: 'orange', weight: 0.6, fillOpacity: 0.2 }, minZoom: 18, maxZoom: 22 },
      Barrios: { archivo: "./data/san_pedro/CC_Barrio.geojson", estilo: { color: 'green', weight: 0.6, fillOpacity: 0.2 }, minZoom: 16, maxZoom: 17 },
      Construccion: { archivo: "./data/san_pedro/CR_Construccion.geojson", estilo: { color: 'blue', weight: 0.6, fillOpacity: 0.2 }, minZoom: 0, maxZoom: 15 },
      Unidades: { archivo: "./data/san_pedro/CR_UnidadConstruccion.geojson", estilo: { color: 'purple', weight: 0.6, fillOpacity: 0.2 }, minZoom: 0, maxZoom: 15 }
    }
  },

  necocli: {
    nombre: "Visor Necoclí",
    center: [8.425657605794195, -76.7840894732451],
    zoom: 14,
    capas: {
      Terreno: { archivo: "./data/necocli/CR_Terreno_Predio.geojson", estilo: { color: 'orange', weight: 0.6, fillOpacity: 0.2 }, minZoom: 18, maxZoom: 22 },
      Barrios: { archivo: "./data/necocli/CC_Barrio.geojson", estilo: { color: 'green', weight: 0.6, fillOpacity: 0.2 }, minZoom: 16, maxZoom: 17 },
      Construccion: { archivo: "./data/necocli/CR_Construccion.geojson", estilo: { color: 'blue', weight: 0.6, fillOpacity: 0.2 }, minZoom: 0, maxZoom: 15 },
      Unidades: { archivo: "./data/necocli/CR_UnidadConstruccion.geojson", estilo: { color: 'purple', weight: 0.6, fillOpacity: 0.2 }, minZoom: 0, maxZoom: 15 }
    }
  }
};

// ==========================
// SELECCIÓN DE VISOR POR URL
// ==========================
const params = new URLSearchParams(window.location.search);
let nombreVisor = params.get('mapa') || 'san_juan'; // valor por defecto
let configVisor = visores[nombreVisor];

if (!configVisor) {
  mostrarAlertaFiltro("Visor no encontrado, usando San Juan por defecto");
  nombreVisor = 'san_juan';
  configVisor = visores[nombreVisor];
}

// ==========================
// INICIALIZAR MAPA
// ==========================
const vial = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
});

const satelital = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: '&copy; Esri &mdash; Maxar &mdash; Earthstar Geographics'
});

const hibrido = L.layerGroup([
  satelital,
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, opacity: 0.3 })
]);

const map = L.map('map', {
  renderer: L.canvas(),
  center: configVisor.center,
  zoom: configVisor.zoom,
  layers: [vial]
});

L.control.scale({ position: 'bottomleft' }).addTo(map);

let capasVisibles = {};
let geojsonOriginal = {};


// ==========================
// CARGA DE CAPAS GEOJSON
// ==========================
// for (const nombre in configVisor.capas) {
//   const { archivo } = configVisor.capas[nombre];
//   fetch(archivo)
//     .then(res => res.json())
//     .then(data => geojsonOriginal[nombre] = data);
// }

// Nueva forma: cargar todas las capas y mostrar Barrios por defecto

const cargarCapas = [];
for (const nombre in configVisor.capas) {
  const { archivo } = configVisor.capas[nombre];
  cargarCapas.push(
    fetch(archivo)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el archivo: ' + archivo);
        return res.json();
      })
      .then(data => geojsonOriginal[nombre] = data)
      .catch(err => mostrarAlertaFiltro(err.message))
  );
}

Promise.all(cargarCapas).then(() => {
  // Marcar el checkbox de Barrios (por si acaso)
  const checkboxBarrios = document.getElementById('capaBarrios');
  if (checkboxBarrios) checkboxBarrios.checked = true;
  // Mostrar la capa de Barrios
  toggleCapa('Barrios');
});



// ==========================
// FUNCIÓN POPUP
// ==========================
// function generarPopup(feature, nombreCapa) {
//   let popup = "";
//   for (let key in feature.properties) {
//     popup += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
//   }
//   return popup || "Sin información";
// }


function generarPopup(feature, nombreCapa) {
  if (nombreCapa === 'Terreno') {
    return `<h6 style="border-bottom: 1px solid grey; padding-bottom: 5px;"><strong>Info. Terreno</strong></h6>
             <strong>Identificador:</strong> ${feature.properties.fid}<br>
            <strong>Área de terreno:</strong> ${feature.properties.area_terreno} m² <br>
            <strong>Número predial:</strong> ${feature.properties.Predio_numero_predial}`;
  } else if (nombreCapa === 'Unidades') {
    return `<h6 style="border-bottom: 1px solid grey; padding-bottom: 5px;"><strong>Info. Unidades de contrucción</strong></h6>
            <strong>Identificador:</strong> ${feature.properties.fid}<br>
            <strong>Área construida:</strong> ${feature.properties.area_construida} m² <br>
            <strong>Planta de ubicación:</strong> ${feature.properties.planta_ubicacion} <br>
            <strong>Altura:</strong> ${feature.properties.altura} <br>
            <strong>Etiqueta: </strong> ${feature.properties.etiqueta}`;
  } else if (nombreCapa === 'Barrios') {
    return `<h6 style="border-bottom: 1px solid grey; padding-bottom: 5px;"><strong>Info. Barrios</strong></h6>
            <strong>Nombre:</strong> ${feature.properties.nombre}<br>        
            <strong>Identificador:</strong> ${feature.properties.fid}<br>
            <strong>Código:</strong> ${feature.properties.codigo}`;
  } else if (nombreCapa === 'Construccion') {
    return `<h6 style="border-bottom: 1px solid grey; padding-bottom: 5px;"><strong>Info. Construcción</strong></h6>
            <strong>Identificador :</strong> ${feature.properties.fid}<br>
            <strong>Pisos:</strong> ${feature.properties.total_pisos} <br>
            <strong>Área de construcción:</strong> ${feature.properties.area_total_construccion} m² <br>`;
  }
  else {
    // Popup genérico para otras capas
    return Object.entries(feature.properties)
      .map(([key, value]) => `<strong>${key}:</strong>${value}`)
      .join('<br>')

  }
}

// ==========================
// TOGGLE DE CAPAS
// ==========================
function toggleCapa(nombre) {
  const checkbox = document.getElementById('capa' + nombre);
  const config = configVisor.capas[nombre];
  const geojson = geojsonOriginal[nombre];
  if (!config || !geojson) return;

  if (checkbox.checked) {
    if (!capasVisibles[nombre]) {
      capasVisibles[nombre] = L.geoJSON(geojson, {
        style: (feature) => {
          if (nombre === 'Barrios') {
            // Asigna un color según el fid 
            const colores = ['#4F9DFF', '#67C587', '#F9C74F', '#F8965D', 
              '#E36464', '#9B6BDB', '#4CCED9', '#A3B84F', '#F28FB2', '#bcbddc', 
              '#756bb1', '#3B7D84', '#B48A78', '#7E9AA6','#E31A1C'];
            // Por ejemplo, usa el módulo para rotar colores
            const color = colores[feature.properties.fid % colores.length];
            return { color: 'Black', fillColor: color, weight: 0.8, fillOpacity: 0.5, dashArray: '2' };
          } else {
            return config.estilo;
          }
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(generarPopup(feature, nombre));
        }
      }).addTo(map);
    }
  } else {
    if (capasVisibles[nombre]) {
      map.removeLayer(capasVisibles[nombre]);
      capasVisibles[nombre] = null;
    }
  }
}

// ==========================
// FILTRO SIMPLE
// ==========================
// function filtrarCapa() {
//   const capaNombre = document.getElementById('filtro-capa').value;
//   const campo = document.getElementById('filtro-campo').value;
//   const valor = document.getElementById('filtro-valor').value.toLowerCase();
//   if (!capaNombre || !campo || !valor) return;

//   const base = geojsonOriginal[capaNombre]?.features || [];
//   const filtradas = base.filter(f => (f.properties?.[campo] || '').toString().toLowerCase() === valor);

//   if (window.capaFiltrada) map.removeLayer(window.capaFiltrada);

//   window.capaFiltrada = L.geoJSON({ type: 'FeatureCollection', features: filtradas }, {
//     style: { color: 'yellow', weight: 2, fillOpacity: 0.6 },
//     onEachFeature: (feature, layer) => {
//       layer.bindPopup(generarPopup(feature, capaNombre));
//     }
//   }).addTo(map);

//   if (filtradas.length > 0) map.fitBounds(window.capaFiltrada.getBounds());
// }


const baseMaps = {
  "vial": vial,
  "satelital": satelital,
  "hibrido": hibrido
};

let capaBaseActual = satelital;

function cambiarMapaBase(tipoMapa) {
  // Validación y cambio de capa
  const nuevaCapa = baseMaps[tipoMapa];
  if (!nuevaCapa) {
    console.warn(`La capa "${tipoMapa}" no está definida en baseMaps.`);
    return;
  }
  if (capaBaseActual) {
    map.removeLayer(capaBaseActual);
  }
  capaBaseActual = nuevaCapa;
  map.addLayer(capaBaseActual);
  actualizarEstadoVisualCapas(tipoMapa);
  //console.log(`Capa base cambiada a: ${tipoMapa}`);
}



// función para regresar al punto de inicio de vista

function resetView() {
  map.setView(configVisor.center, configVisor.zoom);
}
