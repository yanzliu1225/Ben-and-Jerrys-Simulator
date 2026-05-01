let dialogueBox;

export function initStory() {
  console.log("Story running");

  dialogueBox = document.getElementById("dialogue");

  if (!dialogueBox) {
    console.warn("Dialogue box not found");
    return;
  }

  dialogueBox.textContent = "Welcome to Ben & Jerry's Simulator! Go talk to the ice cream man!";
}

export function showDialogue(text) {
  if (!dialogueBox) return;
  dialogueBox.textContent = text;
}