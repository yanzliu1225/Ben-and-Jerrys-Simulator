let flavors = [];
let currentFlavorIndex = 0;

export function initUI(data) {
  // Check if flavors.json was loaded as { Flavors: [] } or just []
  flavors = data.Flavors || data; 
  console.log("Data Synced:", flavors.length, "flavors ready.");
  setupNav();
}

export function displayFlavor(index) {
  const flavor = flavors[index];
  if (!flavor) return;

  const card = document.getElementById("flavor-card");

  // ALTERNATING COLORS: If index is odd, add 'alt-color' class
  if (index % 2 !== 0) {
    card.classList.add("alt-color");
  } else {
    card.classList.remove("alt-color");
  }

  // Update Content
  document.getElementById("flavor-img").src = `assets/images/${flavor.image}`;
  document.getElementById("flavor-title").textContent = flavor.Flavor;
  document.getElementById("flavor-rating").textContent = `${flavor.Ratings} ★`;
  document.getElementById("flavor-calories").textContent = flavor["Calories per Serving"];
  document.getElementById("flavor-desc").textContent = flavor["About this Flavor"];
  document.getElementById("flavor-allergens").textContent = flavor.Allergens;
}

function setupNav() {
  document.getElementById("next-flavor").onclick = () => {
    currentFlavorIndex = (currentFlavorIndex + 1) % flavors.length;
    displayFlavor(currentFlavorIndex);
  };
  document.getElementById("prev-flavor").onclick = () => {
    currentFlavorIndex = (currentFlavorIndex - 1 + flavors.length) % flavors.length;
    displayFlavor(currentFlavorIndex);
  };
}