/* We need to keep track of the player */
let isPlayer = getIsPlayer();

/* We use react-mount as parent */
function getReactMountElement() {
  return document.getElementById("react-mount");
}

/* We see if current child is player */
function getChildNodeName() {
  return getReactMountElement().children[0].className.toString();
}

/* If player exists, isPlayer = true */
function getIsPlayer() {
  if (getChildNodeName() === "Player-container-3Ekyi") {
    return true;
  } else {
    return false;
  }
}

/* Options for the observer (which mutations to observe) */
const reactMountConfig = { attributes: false, childList: true, subtree: false };
/* Callback function to execute when mutations are observed */
const reactMountCallback = function(mutationsList, observer) {
    /* Check when leave player */
    for(const mutation of mutationsList) {
        mutationClass = mutation["addedNodes"][0]
        if (!!mutationClass) {
            if (mutationClass.className === "Player-container-3Ekyi") {
              isPlayer = true;
              observeScene(true);
            } else {
              isPlayer = false;
              observeScene(false);
            }
        }
    }
};

/* Create an observer instance linked to the callback function */
const reactMountObserver = new MutationObserver(reactMountCallback);
/* Start observing the target node for configured mutations */
const reactMountElement = getReactMountElement();
reactMountObserver.observe(reactMountElement, reactMountConfig);

/* Options for the observer (which mutations to observe) */
const sceneConfig = { attributes: true, childList: false, subtree: false };
/* Callback function to execute when mutations are observed */
const sceneCallback = function(mutationsList, observer) {
    /* Check when UI hides/is shown */
    for(const mutation of mutationsList) {
        mutationClassName = mutation["target"]["className"];
        if (mutationClassName === "scene hide") {
            /* If UI hides, we hide mouse */
            document.querySelector(".scene").style.cursor = "none";
        } else {
            /* If UI is shown, we show mouse */
            document.querySelector(".scene").style.cursor = "auto";
        }
    }
};

/* Create an observer instance linked to the callback function */
const sceneObserver = new MutationObserver(sceneCallback);
/* Start observing the target node for configured mutations */
if (isPlayer) {
  observeScene(true);
}

function observeScene(canObserve) {
  if (canObserve === true) {
    sceneObserver.observe(document.querySelector(".scene"), sceneConfig);
  } else {
    sceneObserver.disconnect();
  }
  
}

/* Viaplay's player injects the controls as DOM elements when mouse moves so we need to trigger that */
const showUI = () => {
  document
    .querySelector(".scene")
    .dispatchEvent(new Event("mousemove", { bubbles: true }));
};

/* Event to open audio slider */
const showAudioSlider = () => {
  document
    .querySelector(".audio-control")
    .dispatchEvent(new Event("mouseover", { bubbles: true }));
}

/* Event to close audio slider */
const hideAudioSlider = () => {
  document
    .querySelector(".audio-control")
    .dispatchEvent(new Event("mouseout", { bubbles: true }));
}

/* Listen to user double-clicking */
document.addEventListener("dblclick", function (event) {
  if (isPlayer === true) {
    showUI();
    /* We ignore double-clicks on player controls */
    var ignoreClickOnMeElement = document.querySelector(".playback-controls");
    var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
    if (!isClickInsideElement) {
      /* We trigger the f (fullscreen) button */
      document.dispatchEvent(new KeyboardEvent("keyup", { key : "f" }));
    }
  }
});

/* Listen to user pressing a button on the keyboard */
document.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (isPlayer === true) {
    switch (event.key) {

      /* If it's m, we want to mute/unmute */
      case "m":
        showUI();
        const muteButton = document.querySelector(".audio-control");
        muteButton.click();
        setTimeout(() => {
          if (document.querySelector(".play")) {
            document.querySelector(".play").click();
          }
        }, 10);
        break;

      /* If it's f, we want to toggle fullscreen */
      case "f":
        showUI();
        const fullscreen = document.querySelector(".fullscreen");
        if (fullscreen) {
          fullscreen.click();
        } else if (document.querySelector(".no-fullscreen")) {
          document.querySelector(".no-fullscreen").click();
        }
        setTimeout(() => {
          if (document.querySelector(".play")) {
            document.querySelector(".play").click();
          }
        }, 10);
        break;

      /* If it's s, we want to skip intro/recap */
      case "s":
        const skipPreliminariesButton = document.querySelector(".skip-preliminaries-button");
        if (skipPreliminariesButton) {
          skipPreliminariesButton.click();
        }
        break;
        
      /* If it's n, we want to start next episode */
      case "n":
        const nextEpisodeButton = document.querySelector(".Buttons-primary-3n82B");
        if (nextEpisodeButton) {
          nextEpisodeButton.click();
        }
    }
  }
  return false;
});

/* Function to change volume */
function changeVolume(changeAmount) {
  showUI();
  showAudioSlider();
  /* We need to find __reactEventHandlers as it changes every time we go to Viaplay */
  const audioSlider = document.querySelector(".audio-slider");
  const reactHandlerKey = Object.keys(audioSlider).filter(function(item){
    return item.indexOf('__reactEventHandlers') >= 0
  });
  const reactHandler = audioSlider[reactHandlerKey[0]];
  /* We find where to change volume */
  const volumeLevel =  reactHandler.children.props;
  /* Make sure audio stays within 0 and 1 */
  const max = 1;
  const min = 0;
  let num = volumeLevel.value + changeAmount;
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  let newVolume = clamp(num,min,max);
  /* We change the volume */
  volumeLevel.onChange(newVolume);
  hideAudioSlider();
}

/* Listen to user pressing/holding down a button on the keyboard */
document.addEventListener("keydown", (event) => {
  if (isPlayer === true) {
    switch(event.key) {
      case "ArrowUp":
        changeVolume(0.1);
        break;
      case "ArrowDown":
        changeVolume(-0.1);
    }
  }
});
