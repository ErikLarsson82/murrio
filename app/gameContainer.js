requirejs.config({
  waitSeconds: 200,
  baseUrl: 'lib',
  paths: {
    'app': '../app',
  }
})

requirejs([
  'app/game',
  'userInput',
], function (game, userInput) {

  let running = true
  let muted = false

  const canvas = document.getElementById('canvas')
  const renderingContext = canvas.getContext('2d')

  var FPS = 1000/60;

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 80) { // P - pause
      running = !running
    } else if (e.keyCode === 77) { // M - mute
      muted = !muted
      if (muted) {
        gameMusic.pause()
        victoryMusic.pause();
        gameOverMusic.pause();
      } else {
        gameMusic.play()
      }
    } else if (e.keyCode === 82) { // R - restart
      game.destroy();
      game.init(playSound);
    }
  })


  const gameMusic = new Audio('assets/sounds/Mariohappy.ogg')
  gameMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);

  const victoryMusic = new Audio('assets/sounds/Mariowon.ogg')

  const gameOverMusic = new Audio('assets/sounds/Mariosad.ogg')
  gameOverMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);

  const sfxs = {
    gameMusic: gameMusic,
    victoryMusic: victoryMusic,
    gameOverMusic: gameOverMusic,
    jump: new Audio('assets/sounds/Mariojump.ogg')
  }

  function playSound(soundString, shouldPause, reset) {
    if (reset) {
      sfxs[soundString].currentTime = 0;
    }
    if (!muted) {
      if (shouldPause) {
        sfxs[soundString].pause()
      } else {
        sfxs[soundString].play()
      }
    }
  }

  game.init(playSound)

  setInterval(function() {
    if (!running) return;
    const pad = userInput.getInput(0);
    if (!pad.buttons[9].pressed) {
      restartButtonReleased = true;
    }
    if (pad.buttons[9].pressed && restartButtonReleased) {
      restartButtonReleased = false;
      game.destroy();
      game.init(playSound);
    }
    game.tick(FPS);
    game.draw(renderingContext);
  }, FPS);
})
