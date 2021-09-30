/* Viaplay's player injects the controls as DOM elements when mouse moves so we need to trigger that */
const showUI = () => {
  document
    .querySelector(".scene")
    .dispatchEvent(new Event("mousemove", { bubbles: true }));
};

const showAudioSlider = () => {
  document
    .querySelector(".audio-control")
    .dispatchEvent(new Event("mouseover", { bubbles: true }));
}

const hideAudioSlider = () => {
  document
    .querySelector(".audio-control")
    .dispatchEvent(new Event("mouseout", { bubbles: true }));
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
  if (event.key === "ArrowUp") {
    setTimeout(() => {
      showUI();
      showAudioSlider();
      
      /* We need to find __reactEventHandlers and __reactInternalInstance as it changes every time we load the player */
      var audioSlider = document.querySelector(".audio-slider");
      var reactHandlerKey = Object.keys(audioSlider).filter(function(item){
        return item.indexOf('__reactEventHandlers') >= 0
      });
      var reactHandler = audioSlider[reactHandlerKey[0]];
      console.log(reactHandler);

      /* We find where to change volume */
      const volumeLevel =  reactHandler.children.props;

      /* Make sure audio doesn't go above 1 (100%) */
      if ((volumeLevel.value + 0.1) > 1) {
        volumeLevel.onChange(1);
      } else {
        volumeLevel.onChange(volumeLevel.value + 0.1)
      }

      hideAudioSlider();

    }, 10);
  }

  /* If it's down, we want to decrease volume (increments at 10%)*/
  if (event.key === "ArrowDown") {
    setTimeout(() => {
      showUI();
      showAudioSlider();

      /* We need to find __reactEventHandlers and __reactInternalInstance as it changes every time we load the player */
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

    }, 10);
  }

  return false;
});