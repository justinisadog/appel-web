const fullscreenButton = document.getElementById("fullscreen-button");
const gameContainer = document.getElementById("game-container");
const gameFrame = document.getElementById("game-frame");
const loadingScreen = document.getElementById("loading-screen");
const gameStatus = document.getElementById("game-status");
const stopButton = document.getElementById("stop-button");

let loadingTimeout;

function getFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    null
  );
}

async function enterFullscreen(element) {
  if (element.requestFullscreen) {
    await element.requestFullscreen();
    return;
  }

  if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
    return;
  }

  throw new Error(
    "Fullscreen is not supported by this browser."
  );
}

async function exitFullscreen() {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }

  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function updateFullscreenButton() {
  const isFullscreen = Boolean(getFullscreenElement());
  const label = fullscreenButton.querySelector("span:last-child");

  label.textContent = isFullscreen
    ? "Exit fullscreen"
    : "Enter fullscreen";

  fullscreenButton.setAttribute(
    "aria-pressed",
    String(isFullscreen)
  );
}

fullscreenButton.addEventListener("click", async () => {
  try {
    if (getFullscreenElement()) {
      await exitFullscreen();
    } else {
      await enterFullscreen(gameContainer);
    }
  } catch (error) {
    gameStatus.textContent = error.message;
    console.error(error);
  }
});

stopButton.addEventListener("click", () => {
  loadingScreen.classList.remove("is-hidden");
  gameStatus.textContent = "Reloading game…";
  gameFrame.src = "appel web.html";

  // Set a timeout of 10 seconds for the game to load
  clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(() => {
    loadingScreen.classList.add("is-hidden");
    gameStatus.textContent =
      "The game took too long to load. Try reloading the page.";
  }, 5000);
});

gameFrame.addEventListener("load", () => {
  clearTimeout(loadingTimeout);
  loadingScreen.classList.add("is-hidden");
  gameStatus.textContent = "Game ready";
});

gameFrame.addEventListener("error", () => {
  clearTimeout(loadingTimeout);
  loadingScreen.classList.add("is-hidden");
  gameStatus.textContent =
    "The game could not be loaded. Try opening it in a new tab or reloading the page.";
});

document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

updateFullscreenButton();

// Hide loading screen on initial page load
window.addEventListener("load", () => {
  clearTimeout(loadingTimeout);
  loadingScreen.classList.add("is-hidden");
  gameStatus.textContent = "Game ready";
});
