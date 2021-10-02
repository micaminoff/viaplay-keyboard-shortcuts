/* We need to keep track of the player */
let isPlayer = getIsPlayer();

/* We use react-mount as parent */
function getReactMount() {
  return document.getElementById("react-mount");
}

/* We see if current child is player */
function getChildNodeName() {
  return getReactMount().children[0].className.toString();
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
const config = { attributes: false, childList: true, subtree: false };
/* Callback function to execute when mutations are observed */
const callback = function(mutationsList, observer) {
    /* Check when leave player */
    for(const mutation of mutationsList) {
        mutationClass = mutation["addedNodes"][0]
        if (!!mutationClass) {
            if (mutationClass.className === "Player-container-3Ekyi") {
              isPlayer = true;
            } else {
              isPlayer = false;
            }
        }
    }
};

/* Create an observer instance linked to the callback function */
const observer = new MutationObserver(callback);
/* Start observing the target node for configured mutations */
const reactMount = getReactMount();
observer.observe(reactMount, config);

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
document.addEventListener('dblclick', function (event) {
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
  /* If it's m, we want to mute/unmute */
  if (event.key === "m" && isPlayer === true) {
    document.querySelector(".scene").click();
    setTimeout(() => {
      showUI();
      
      const muteButton = document.querySelector(".audio-control");
      muteButton.click();
    }, 20);
  }

  /* If it's f, we want to toggle fullscreen */
  if (event.key === "f" && isPlayer === true) {
    showUI();
    const fullscreen = document.querySelector(".fullscreen");
    if (fullscreen) {
      fullscreen.click();
    } else {
      document.querySelector(".no-fullscreen").click();
    }
    setTimeout(() => {
      /* We click play if possible after fullscreen toggle */
      if (document.querySelector(".play")) {
        document.querySelector(".play").click();
      }
    }, 10);
  }
  
  /* If it's s, we want to skip intro/recap */
  if (event.key === "s" && isPlayer === true) {
      
    const skipPreliminariesButton = document.querySelector(".skip-preliminaries-button");
    if (skipPreliminariesButton) {
      skipPreliminariesButton.click();
    }
  }
  
  /* If it's n, we want to start next episode */
  if (event.key === "n" && isPlayer === true) {
    
    const nextEpisodeButton = document.querySelector(".Buttons-primary-3n82B");
    if (nextEpisodeButton) {
      nextEpisodeButton.click();
    }
  }
  return false;
});

/* Listen to user pressing/holding down a button on the keyboard */
document.addEventListener("keydown", (event) => {
  /* If it's up, we want to increase volume (increments at 10%)*/
  if (event.key === "ArrowUp" && isPlayer === true) {
    showUI();
    showAudioSlider();
    /* We need to find __reactEventHandlers as it changes every time we load the player */
    var audioSlider = document.querySelector(".audio-slider");
    var reactHandlerKey = Object.keys(audioSlider).filter(function(item){
      return item.indexOf('__reactEventHandlers') >= 0
    });
    var reactHandler = audioSlider[reactHandlerKey[0]];
    /* We find where to change volume */
    const volumeLevel =  reactHandler.children.props;
    /* Make sure audio doesn't go above 1 (100%) */
    if ((volumeLevel.value + 0.1) > 1) {
      volumeLevel.onChange(1);
    } else {
      volumeLevel.onChange(volumeLevel.value + 0.1)
    }
    hideAudioSlider();
  }

  /* If it's down, we want to decrease volume (increments at 10%)*/
  if (event.key === "ArrowDown" && isPlayer === true) {
    showUI();
    showAudioSlider();
    /* We need to find __reactEventHandlers as it changes every time we load the player */
    var audioSlider = document.querySelector(".audio-slider");
    var reactHandlerKey = Object.keys(audioSlider).filter(function(item){
      return item.indexOf('__reactEventHandlers') >= 0
    });
    var reactHandler = audioSlider[reactHandlerKey[0]];
    /* We find where to change volume */
    const volumeLevel =  reactHandler.children.props;
    /* Make sure audio doesn't go below 0 */
    if ((volumeLevel.value - 0.1) < 0) {
      volumeLevel.onChange(0);
    } else {
      volumeLevel.onChange(volumeLevel.value - 0.1)
    }
    hideAudioSlider();
  }
});
