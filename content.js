/** Viaplay's player injects the controls as DOM elements when mouse moves so we need to trigger that */
const showUI = () => {
  document
    .querySelector(".scene")
    .dispatchEvent(new Event("mousemove", { bubbles: true }));
};

/** Listen to user pressing a button in the keyboard */
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
  if (event.key === "ArrowUp") {
    setTimeout(() => {
      showUI();

      /* We need to find __reactEventHandlers and __reactInternalInstance as it changes every time we load the player */
      const reactInternalInstance = Object.keys(document.querySelector(".scene")).find(key=>key.startsWith("__reactInternalInstance$"));
      const reactEventHandler = Object.keys(document.querySelector(".scene")).find(key=>key.startsWith("__reactEventHandlers$"));
      
      /* We find where to trigger the audio slider*/
      const toggleAudioControl = document.querySelector(".audio-control")[reactInternalInstance].return.pendingProps;

      /* We open audio control */
      toggleAudioControl.onMouseEnter();

      /* We find where to change volume */
      const volume =  document.querySelector(".audio-slider")[reactEventHandler].children.props;

      /* Make sure audio doesn't go above 1 (100%) */
      if ((volume.value + 0.1) > 1) {
        volume.onChange(1);
      } else {
        volume.onChange(volume.value + 0.1)
      }

      /* We close audio control */
      toggleAudioControl.onMouseLeave();

    }, 10);
  }

    /* If it's down, we want to decrease volume (increments at 10%)*/
    if (event.key === "ArrowDown") {
      setTimeout(() => {
        showUI();
  
        /* We need to find __reactEventHandlers and __reactInternalInstance as it changes every time we load the player */
        const reactInternalInstance = Object.keys(document.querySelector(".scene")).find(key=>key.startsWith("__reactInternalInstance$"));
        const reactEventHandler = Object.keys(document.querySelector(".scene")).find(key=>key.startsWith("__reactEventHandlers$"));

        /* We find where to trigger the audio slider */
        const toggleAudioControl = document.querySelector(".audio-control")[reactInternalInstance].return.pendingProps;

        /* We open audio control */
        toggleAudioControl.onMouseEnter();

        /* We find where to change volume */
        const volume =  document.querySelector(".audio-slider")[reactEventHandler].children.props;
        
        /* Make sure audio doesn't go below 0 */
        if ((volume.value - 0.1) < 0) {
          volume.onChange(0);
        } else {
          volume.onChange(volume.value - 0.1)
        }
        
        /* We close audio control */
        toggleAudioControl.onMouseLeave();
  
      }, 10);
    }

  return false;
});
