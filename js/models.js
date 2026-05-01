import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { registerInteractable } from './interaction.js';
import { showDialogue } from './story.js';
import { openMenu } from './menu.js';
import * as THREE from 'three';

const loader = new GLTFLoader();

export let man, monkey, truck, menu, menuHitbox;

let manDialogueStep = -1;
let hasMetMan = false; // Flag to track if the first interaction loop is finished

const manLines = [
  "Hey there! Welcome to Ben & Jerry’s! Famous for our CHUNNNKY mix-ins!",
  "We are CRAVING for your opinion!! Here's our menu for some of our best-sellers!"
];

export function loadModels(scene) {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const totalModels = 5; 

    const checkDone = () => {
      loadedCount++;
      if (loadedCount >= totalModels) {
        resolve({ menu: menuHitbox }); 
      }
    };

    // =====================
    // MENU (Chalkboard)
    // =====================
    loader.load('assets/models/menu.glb', (gltf) => {
      menu = gltf.scene;
      menu.position.set(-60.5, 3, 138);
      menu.rotation.y = Math.PI;
      scene.add(menu);

      menuHitbox = new THREE.Mesh(
        new THREE.BoxGeometry(15, 10, 5),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      menuHitbox.position.copy(menu.position);
      menuHitbox.position.y += 5; 
      scene.add(menuHitbox);

      console.log("MENU Hitbox Ready");
      checkDone();
    });

    // =====================
    // ICE CREAM MAN
    // =====================
    loader.load('assets/models/man.glb', (gltf) => {
      man = gltf.scene;
      man.scale.set(2, 2, 2);
      man.position.set(-30, 1, 120);
      man.rotation.y = -Math.PI / 2;
      scene.add(man);

      const hitbox = new THREE.Mesh(
        new THREE.BoxGeometry(10, 55, 10),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitbox.position.copy(man.position);
      hitbox.position.y += 3;
      scene.add(hitbox);

      registerInteractable(hitbox, () => {
        if (!hasMetMan) {
          // First time: Start the dialogue sequence
          manDialogueStep = 0;
          showDialogue(manLines[manDialogueStep]);
        } else {
          // Every time AFTER the first meeting: Open menu instantly
          openMenu(); 
        }
      });

      checkDone();
    });

    // =====================
    // TRUCK
    // =====================
    loader.load('assets/models/truck.glb', (gltf) => {
      truck = gltf.scene;
      truck.scale.set(15, 15, 15);
      truck.position.set(0, 1.5, 110);
      truck.rotation.y = Math.PI;
      scene.add(truck);
      checkDone();
    });

    // =====================
    // MONKEY
    // =====================
    loader.load('assets/models/monkey.glb', (gltf) => {
      monkey = gltf.scene;
      monkey.scale.set(500, 500, 500);
      monkey.position.set(-12, 42, 155);
      monkey.rotation.y = -Math.PI/ 2;
      scene.add(monkey);
      checkDone();
    });

    // =====================
    // CLOUDS
    // =====================
    loader.load('assets/models/clouds.glb', (gltf) => {
      const cloud = gltf.scene;
      cloud.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0x888888); 
          child.material.emissiveIntensity = 0.05; 
        }
      });
      cloud.scale.set(500, 500, 500);
      cloud.position.set(0, 150, 500);
      scene.add(cloud);

      const c2 = cloud.clone();
      c2.position.set(0, 150, -500);
      scene.add(c2);

      const c3 = cloud.clone();
      c3.position.set(400, 150, 0);
      c3.rotation.y = -Math.PI / 2;
      scene.add(c3);

      const c4 = cloud.clone();
      c4.position.set(-400, 150, 0);
      c4.rotation.y = -Math.PI / 2;
      scene.add(c4);

      checkDone();
    });

    // =====================
    // PARK
    // =====================
    loader.load('assets/models/park.glb', (gltf) => {
      const park = gltf.scene;
      park.scale.set(10, 10, 10);
      park.position.set(0, 0, 0);
      scene.add(park);
      checkDone();
    });
  });
}

// =====================
// DIALOGUE CONTROLLER
// =====================
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  if (manDialogueStep >= 0) {
    // Logic for repeat visits (State 99)
    if (manDialogueStep === 99) {
      showDialogue(""); 
      manDialogueStep = -1; // Reset state so he can be clicked again
      openMenu();
      return;
    }

    manDialogueStep++;

    if (manDialogueStep < manLines.length) {
      showDialogue(manLines[manDialogueStep]);
    } else {
      // First interaction finished
      showDialogue(""); 
      manDialogueStep = -1; // Reset state
      
      if (!hasMetMan) {
        hasMetMan = true; // Install the loop for future clicks
        console.log("Loop installed"); 
      }
      
      openMenu(); 
    }
  }
});