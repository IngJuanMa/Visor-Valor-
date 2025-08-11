
var municipios = {
    san_pedro: {
        nombre: "San Pedro de Urabá",
        center: [8.27734150243366, -76.37789593969427],
        marcador: [8.27734150243366, -76.37789593969427],
        zoom: 4
    },
    san_juan: {
        nombre: "San Juan de Urabá",
        center: [8.763490746205745, -76.52745024868837],
        marcador: [8.763490746205745, -76.52745024868837],
        zoom: 4
    },
    necocli: {
        nombre: "Necoclí",
        center: [8.425657605794195, -76.7840894732451],
        marcador: [8.428257040547226, -76.78418306462325],
        zoom: 3
    }
};


const param = new URLSearchParams(window.location.search);
let nombreMunicipio = param.get('mapa') || 'san_juan'; // valor por defecto
let configMunicipio = municipios[nombreMunicipio];

if (!configMunicipio) {
  nombreMunicipio = 'san_juan';
  configMunicipio = municipios[nombreMunicipio];
}

const layerVial = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Tiles © Esri',
    subdomains: 'abcd',
    opacity: 0.8,  // Más transparente para destacar tu GeoJSON
});

const mapita = L.map('mapa2', {
  renderer: L.canvas(),
  center: configMunicipio.center,
  zoom: configMunicipio.zoom,
  layers: [layerVial],
  zoomControl: false, // Oculta el control de zoom
  dragging: false, // Bloquea el arrastre
  scrollWheelZoom: false, // Bloquea zoom con rueda
  doubleClickZoom: false, // Bloquea zoom con doble clic
  boxZoom: false, // Bloquea zoom con caja
  keyboard: false, // Bloquea navegación con teclado
  touchZoom: false
});

 mapita.flyTo(configMunicipio.marcador, configMunicipio.zoom + 10, {
   animate: true,
   duration: 2 // duración en segundos
 });

// Marcador con el logotipo de arbitrium
 var Icono = L.icon({
     iconUrl: 'assets/img/Group 24.png'
 });

 var marcador = L.marker(configMunicipio.marcador, { icon: Icono }).addTo(mapita);


//  actualizar dinámica mente la ubicación debajo del mapita
 document.getElementById('ubicacion-municipio').innerHTML =
  `<i class="bi bi-crosshair mx-2"></i>Ubicación: ${configMunicipio.nombre} - Antioquia`;

// Actualizar dinámicamente el título de la ubicación
  document.getElementById('ubicacion-municipioTitulo').innerHTML =
  `Visor de: ${configMunicipio.nombre}`
