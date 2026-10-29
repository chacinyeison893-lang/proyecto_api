const API_URL = 'https://dragonball-api.com/api/characters';

const charactersGrid = document.getElementById('characters-grid');
const loadingText = document.getElementById('loading');
const inputSearch = document.getElementById('input-search');
const selectRace = document.getElementById('select-race');

let allCharacters = [];

// 1. Obtener personajes de la API (ampliamos el límite para capturar a los dioses)
async function fetchCharacters() {
  try {
    loadingText.style.display = 'block';
    charactersGrid.innerHTML = '';

    // Solicitamos 58 personajes para asegurar que aparezcan dioses como Bills (Beerus), Whis, etc.
    const response = await fetch(`${API_URL}?limit=58`);
    const data = await response.json();

    allCharacters = data.items || data;

    loadingText.style.display = 'none';
    displayCharacters(allCharacters);
  } catch (error) {
    console.error('Error al consumir la API:', error);
    loadingText.textContent = '❌ Error al conectar con el servidor de Capsule Corp.';
  }
}

// 2. Renderizar las cartas con estética arcade estilo DB Heroes
function displayCharacters(characters) {
  charactersGrid.innerHTML = '';

  if (characters.length === 0) {
    charactersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ffd700; font-size: 1.2rem;">No se encontró ningún guerrero con ese poder.</p>';
    return;
  }

  characters.forEach((character, index) => {
    const card = document.createElement('div');
    card.classList.add('hero-card');

    // Asignar un número de carta aleatorio estilo colección arcade
    const cardNum = (index + 1).toString().padStart(3, '0');

    card.innerHTML = `
      <div class="card-header-badge">
        <span>NO. DBH-${cardNum}</span>
        <span>★ ULTRA RARE</span>
      </div>
      <div class="card-img-container">
        <img src="${character.image}" alt="${character.name}">
      </div>
      <h3>${character.name}</h3>
      <div class="hud-stats">
        <p>Raza: <span>${character.race || 'Desconocida'}</span></p>
        <p>Ki Base: <span>${character.ki}</span></p>
        <p>Ki Máx: <span>${character.maxKi}</span></p>
      </div>
      <div class="card-footer">
        <span class="type-badge">${character.affiliation || 'Z Fighter'}</span>
        <span class="power-level">LVL 9999</span>
      </div>
    `;

    charactersGrid.appendChild(card);
  });
}

// 3. Filtrar por nombre en tiempo real
inputSearch.addEventListener('input', () => {
  filtrarPersonajes();
});

// 4. Filtrar por raza o categoría de dios
selectRace.addEventListener('change', () => {
  filtrarPersonajes();
});

// Función de filtrado combinado
function filtrarPersonajes() {
  const searchTerm = inputSearch.value.toLowerCase();
  const selectedRace = selectRace.value;

  const filtered = allCharacters.filter(character => {
    const matchesName = character.name.toLowerCase().includes(searchTerm);
    
    // Si selecciona "God", filtramos por raza o si en su descripción/nombre incluye términos divinos
    let matchesRace = true;
    if (selectedRace !== '') {
      if (selectedRace === 'God') {
        matchesRace = character.race === 'God' || character.name.toLowerCase().includes('beerus') || character.name.toLowerCase().includes('whis') || character.name.toLowerCase().includes('bills') || character.name.toLowerCase().includes('dios');
      } else {
        matchesRace = character.race === selectedRace;
      }
    }

    return matchesName && matchesRace;
  });

  displayCharacters(filtered);
}

// Inicializar aplicación
fetchCharacters();