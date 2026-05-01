import { displayFlavor } from './ui.js';
import { controls } from './scene.js'; 

export function openMenu() {
  const menu = document.getElementById("menuOverlay");
  if (!menu) return;

  menu.classList.add("show");
  document.exitPointerLock(); 
  
  if (controls) {
    controls.unlock(); 
    controls.enabled = false; 
  }
  displayFlavor(0); 
}

export function closeMenu() {
  const menu = document.getElementById("menuOverlay");
  if (!menu) return;
  menu.classList.remove("show");
  
  if (controls) {
    controls.enabled = true;
  }

  const dialogue = document.getElementById("dialogue");
  if (dialogue) {
    dialogue.innerText = "";
    dialogue.style.display = "none";
  }
}

export function initMenuControls() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const menu = document.getElementById("menuOverlay");
      if (menu && menu.classList.contains("show")) {
        closeMenu();
      }
    }
  });
}