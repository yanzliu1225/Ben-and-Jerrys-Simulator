import { initScene, scene, camera, renderer, controls } from "./js/scene.js";
import { updateMovement, initControls, checkInteraction, registerInteractable } from "./js/interaction.js";
import { loadModels } from "./js/models.js";
import { initUI } from "./js/ui.js";
import { initStory } from "./js/story.js";
import { loadFlavors } from "./js/dataLoader.js";
import { initMenuControls, openMenu } from "./js/menu.js";
import * as Tone from "https://cdn.skypack.dev/tone";

// --- AUDIO ---
const player = new Tone.Player({
  url: "assets/audio/music.mp3",
  loop: true,
  volume: -8,
}).toDestination();

// --- RESUME GAMEPLAY & AUDIO ON CLICK ---
document.addEventListener("mousedown", async () => {
  if (Tone.context.state !== 'running') {
    await Tone.start();
  }
  
  if (player.state !== 'started' && player.loaded) {
    player.start();
  }

  const menu = document.getElementById("menuOverlay");
  const isMenuOpen = menu && menu.classList.contains("show");
  
  // Only lock if the menu isn't open and controls exist
  if (!isMenuOpen && controls && !controls.isLocked) {
    controls.lock();
  }
});

async function init() {
  const flavors = await loadFlavors();

  initScene();
  initControls(); 
  initUI(flavors);
  initStory();

  const models = await loadModels(scene);

  if (models && models.menu) {
    registerInteractable(models.menu, () => {
      openMenu(); 
    });
  }

  // This must be called to allow the ESC key to reset the state
  initMenuControls();
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const menu = document.getElementById("menuOverlay");
  const isMenuOpen = menu && (menu.classList.contains("show") || menu.style.display === 'flex');

  // If menu is closed, we update movement and raycasting
  if (!isMenuOpen) {
    updateMovement();
    checkInteraction(camera);
  }

  renderer.render(scene, camera);
}

init();