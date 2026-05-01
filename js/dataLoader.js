let flavorData = [];

export async function loadFlavors() {
  try {
    // Note: Use 'flavors.json' if the file is in your main folder.
    const res = await fetch('flavors.json');

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    // Your JSON has a top-level key called "Flavors"
    flavorData = data.Flavors || [];

    console.log("FLAVORS LOADED:", flavorData.length, "flavors found.");
    return flavorData;
  } catch (err) {
    console.error("Failed to load flavors:", err);
    return [];
  }
}

export function getFlavors() {
  return flavorData;
}