// Tale of Dreamers — character cards and interactions
// Edit the character information in this file to expand the collection.

const characters = [
  {
    id: "yuto",
    name: "Yuto",
    title: "The Silent Moon",
    collection: "MOON COLLECTION",
    category: "moon",
    number: "TOD-001",
    symbol: "☾",
    image: "images/yuto.jpg",
    rarity: "Rare",
    colors: "Silver · Indigo",
    description: "A quiet soul beneath the silver sky. Yuto watches the world with thoughtful eyes, carrying untold stories beneath his calm expression.",
    shortStory: "A quiet soul beneath the silver sky. His story is written among the stars."
  },
  {
    id: "chiharu",
    name: "Chiharu",
    title: "The Blooming Wish",
    collection: "BLOOM COLLECTION",
    category: "bloom",
    number: "TOD-002",
    symbol: "❀",
    image: "images/chiharu.jpg",
    rarity: "Epic",
    colors: "Rose · Gold",
    description: "Gentle yet determined, Chiharu finds beauty in little things. Like cherry blossoms, she brings warmth and hope wherever she goes.",
    shortStory: "A gentle heart surrounded by blossoms. Every petal carries a wish."
  },
  {
    id: "asuka",
    name: "Asuka",
    title: "The Wandering Star",
    collection: "STAR COLLECTION",
    category: "star",
    number: "TOD-003",
    symbol: "✧",
    image: "images/asuka.jpg",
    rarity: "Rare",
    colors: "Navy · Crimson",
    description: "Curious, spirited and always ready for the next adventure. Asuka follows the lights of distant places and never stops dreaming.",
    shortStory: "A restless spirit drawn to distant horizons. His next adventure is waiting."
  }
];

const grid = document.querySelector("#card-grid");
const detailSection = document.querySelector("#character-details");
const detailName = document.querySelector("#detail-name");
const detailDescription = document.querySelector("#detail-description");
const detailTags = document.querySelector("#detail-tags");
const title = document.querySelector("#section-title");
const description = document.querySelector("#section-description");
const filters = document.querySelector("#filters");
const hint = document.querySelector("#interaction-hint");

let currentPage = "collection";
let currentFilter = "all";
let favorites = loadFavorites();

function loadFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem("tod-favorites") || "[]"));
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem("tod-favorites", JSON.stringify([...favorites]));
  } catch {
    // The gallery still works if browser storage is unavailable.
  }
}

function createCard(character) {
  const wrapper = document.createElement("article");
  wrapper.className = "card-wrap";
  wrapper.dataset.id = character.id;

  const card = document.createElement("div");
  card.className = `trading-card ${character.id}`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Flip ${character.name}'s card`);

  const front = document.createElement("div");
  front.className = "card-face card-front";
  front.innerHTML = `
    <div class="card-inner">
      <div class="card-art ${character.id}">
        <span class="art-symbol" aria-hidden="true">${character.symbol}</span>
        <span class="art-caption">${character.title.toUpperCase()}</span>
      </div>
      <div class="card-title">
        <strong>${character.name}</strong>
        <small>${character.collection}</small>
      </div>
      <span class="card-number">${character.number}</span>
    </div>`;

  const favorite = document.createElement("button");
  favorite.className = "favorite-button";
  favorite.type = "button";
  favorite.setAttribute("aria-label", `Add ${character.name} to favorites`);
  favorite.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavorite(character.id);
  });
  front.append(favorite);

  const back = document.createElement("div");
  back.className = "card-face card-back";
  back.innerHTML = `
    <div class="card-inner">
      <div class="back-symbol" aria-hidden="true">${character.symbol}</div>
      <h3>${character.name}</h3>
      <p><strong>${character.title}</strong><br><br>${character.shortStory}</p>
      <div class="serial">${character.number}</div>
    </div>`;

  if (character.image) {
    const artwork = document.createElement("img");
    artwork.src = character.image;
    artwork.alt = `${character.name} character card artwork`;
    front.querySelector(".card-art").prepend(artwork);
    front.querySelector(".art-symbol").hidden = true;
  }

  card.append(front, back);
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.classList.toggle("flipped");
    }
  });

  // Subtle 3D tilt on pointer devices.
  card.addEventListener("pointermove", (event) => {
    if (card.classList.contains("flipped") || event.pointerType !== "mouse") return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener("pointerleave", () => {
    if (!card.classList.contains("flipped")) card.style.transform = "";
  });

  wrapper.append(card);
  return wrapper;
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveFavorites();
  updateView();
}

function showCharacter(character) {
  detailName.textContent = `${character.name} — ${character.title}`;
  detailDescription.textContent = character.description;
  detailTags.replaceChildren();

  [character.number, character.category.toUpperCase(), `${character.rarity} rarity`, character.colors]
    .forEach((label) => {
      const tag = document.createElement("span");
      tag.textContent = label;
      detailTags.append(tag);
    });

  detailSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function updateView() {
  grid.replaceChildren();

  const visibleCharacters = characters.filter((character) => {
    const matchesFilter = currentFilter === "all" || character.category === currentFilter;
    const matchesPage = currentPage !== "favorites" || favorites.has(character.id);
    return matchesFilter && matchesPage;
  });

  visibleCharacters.forEach((character) => {
    const card = createCard(character);
    const favoriteButton = card.querySelector(".favorite-button");
    const isFavorite = favorites.has(character.id);
    favoriteButton.textContent = isFavorite ? "♥" : "♡";
    favoriteButton.classList.toggle("is-favorite", isFavorite);
    favoriteButton.setAttribute(
      "aria-label",
      `${isFavorite ? "Remove" : "Add"} ${character.name} ${isFavorite ? "from" : "to"} favorites`
    );
    card.addEventListener("click", (event) => {
      if (!event.target.closest(".favorite-button")) showCharacter(character);
    });
    grid.append(card);
  });

  if (visibleCharacters.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No favorite cards yet. Choose a heart on a character card!";
    grid.append(empty);
  }

  title.textContent = currentPage === "favorites"
    ? "Your Favorite Cards"
    : currentPage === "about"
      ? "About the Collection"
      : "The Character Collection";

  description.textContent = currentPage === "favorites"
    ? "Your personally selected dreamers, gathered in one place."
    : currentPage === "about"
      ? "A little universe of characters, stories and dreams."
      : "Every dream has a story. Discover the characters and their worlds.";

  filters.hidden = currentPage !== "collection";
  hint.hidden = currentPage === "about";
  grid.hidden = currentPage === "about";
  detailSection.hidden = currentPage === "about";

  if (currentPage === "about") {
    detailName.textContent = "Welcome, Dreamer";
    detailDescription.textContent =
      "Tale of Dreamers is a growing character card collection. Each card represents a character, a dream and a story waiting to unfold. This is the first chapter of the collection.";
    detailTags.replaceChildren();
    ["3 original characters", "1 shared world", "More stories to come"].forEach((label) => {
      const tag = document.createElement("span");
      tag.textContent = label;
      detailTags.append(tag);
    });
  }
}

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => {
    currentPage = button.dataset.page;
    document.querySelectorAll(".nav-button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    updateView();
  });
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    updateView();
  });
});

updateView();
