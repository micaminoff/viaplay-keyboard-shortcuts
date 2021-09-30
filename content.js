/* Viaplay's player injects the controls as DOM elements when mouse moves so we need to trigger that */
const showUI = () => {
  document
    .querySelector(".scene")
    .dispatchEvent(new Event("mousemove", { bubbles: true }));
};

let sessionID;
/* We append this string to use react keys*/
function setSessionID() {
  sessionID = Object.keys(document.getElementById("react-mount")).find(key=>key.startsWith("__reactContainere$")).split("$")[1];
}

/* We check if document is ready */
if (document.readyState !== "loading") {
  setSessionID();
} else {
  /* If not we execute when ready */
  document.addEventListener("DOMContentLoaded", function () {
    setSessionID()
  });
}

/* Listen to user pressing a button in the keyboard */
document.addEventListener("keyup", (event) => {
  event.preventDefault();

  /* If it's m, we want to mute/unmute */
  if (event.key === "m") {
    document.querySelector(".scene").click();
    setTimeout(() => {
      showUI();
      
      const muteButton = document.querySelector(".audio-control");
      muteButton.click();
    }, 20);
  }

  /* If it's f, we want to toggle fullscreen */
  if (event.key === "f") {
    document.querySelector(".scene").click();
    setTimeout(() => {
      showUI();

      const fullscreen = document.querySelector(".fullscreen");
      if (fullscreen) {
        fullscreen.click();
      } else {
        document.querySelector(".no-fullscreen").click();
      }
    }, 10);
  }
  
  /* If it's s, we want to skip intro/recap */
  if (event.key === "s") {
      
    const skipPreliminariesButton = document.querySelector(".skip-preliminaries-button");
    if (skipPreliminariesButton) {
      skipPreliminariesButton.click();
    }
  }
  
  /* If it's n, we want to start next episode */
  if (event.key === "n") {
    
    const nextEpisodeButton = document.querySelector(".Buttons-primary-3n82B");
    if (nextEpisodeButton) {
      nextEpisodeButton.click();
    }
  }

  /* If it's up, we want to increase volume (increments at 10%)*/
  if (event.key === "ArrowUp" && !!sessionID) {
    setTimeout(() => {
      showUI();

      /* We need to find __reactEventHandlers and __reactInternalInstance as it changes every time we load the player */
      const reactInternalInstance = "__reactInternalInstance$" + sessionID;
      const reactEventHandlers = "__reactEventHandlers$" + sessionID;

      /* We find where to trigger the audio slider*/
      const toggleAudioControl = document.querySelector(".audio-control")[reactInternalInstance].return.pendingProps;

      /* We open audio control */
      toggleAudioControl.onMouseEnter();

      /* We find where to change volume */
      const volumeLevel =  document.querySelector(".audio-slider")[reactEventHandlers].children.props;

      /* Make sure audio doesn't go above 1 (100%) */
      if ((volumeLevel.value + 0.1) > 1) {
        volumeLevel.onChange(1);
      } else {
        volumeLevel.onChange(volumeLevel.value + 0.1)
      }

      /* We close audio control */
      toggleAudioControl.onMouseLeave();

    }, 10);
  } else {

  }

    /* If it's down, we want to decrease volume (increments at 10%)*/
    if (event.key === "ArrowDown" && !!sessionID) {
      setTimeout(() => {
        showUI();

        /* We need to find __reactEventHandlers and __reactInternalInstance as it changes every time we load the player */
        const reactInternalInstance = "__reactInternalInstance$" + sessionID;
        const reactEventHandlers = "__reactEventHandlers$" + sessionID;

        /* We find where to trigger the audio slider */ 
        const toggleAudioControl = document.querySelector(".audio-control")[reactInternalInstance].return.pendingProps;

        /* We open audio control */
        toggleAudioControl.onMouseEnter();

        /* We find where to change volume */
        const volumeLevel =  document.querySelector(".audio-slider")[reactEventHandlers].children.props;
        
        /* Make sure audio doesn't go below 0 */
        if ((volumeLevel.value - 0.1) < 0) {
          volumeLevel.onChange(0);
        } else {
          volumeLevel.onChange(volumeLevel.value - 0.1)
        }
        
        /* We close audio control */
        toggleAudioControl.onMouseLeave();
  
      }, 10);
    }

  return false;
});