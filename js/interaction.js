import * as THREE from 'three';
import { controls } from './scene.js'; 

const keys = { w: false, a: false, s: false, d: false };
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let interactables = [];
let currentTarget = null;

export function initControls() {
  console.log("Interactions system initialized");

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = true;
  });

  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = false;
  });

  document.addEventListener('mousedown', () => {
    if (controls && controls.isLocked) {
      if (currentTarget && currentTarget.userData.onClick) {
        currentTarget.userData.onClick();
      }
    }
  });
}

export function registerInteractable(object, callback) {
  if (!object) return;
  object.userData.onClick = callback;
  interactables.push(object);
}

export function checkInteraction(camera) {
  if (!camera) return;

  mouse.set(0, 0); 
  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(interactables, true);
  currentTarget = null;

  for (let i = 0; i < hits.length; i++) {
    let obj = hits[i].object;
    while (obj) {
      if (obj.userData && obj.userData.onClick) {
        currentTarget = obj;
        break;
      }
      obj = obj.parent;
    }
    if (currentTarget) break;
  }

  const crosshair = document.getElementById("crosshair");
  if (crosshair) {
    crosshair.style.background = currentTarget ? "yellow" : "white";
  }
}

export function updateMovement() {
  const speed = 0.8;

  if (controls && controls.isLocked) {
    if (keys.w) controls.moveForward(speed);
    if (keys.s) controls.moveForward(-speed);
    if (keys.a) controls.moveRight(-speed);
    if (keys.d) controls.moveRight(speed);
  }
}