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
  
  const canvas = document.getElementById('canvas')
  const renderingContext = canvas.getContext('2d')

  game.init()

  var FPS = 1000/60;

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 80) { // P - pause
      running = !running
    }
  })

  setInterval(function() {
    if (!running) return;
    const pad = userInput.getInput(0);
    if (!pad.buttons[9].pressed) {
      restartButtonReleased = true;
    }
    if (pad.buttons[9].pressed && restartButtonReleased) {
      restartButtonReleased = false;
      game.destroy();
      game.init();
    }
    game.tick(FPS);
    game.draw(renderingContext);
  }, FPS);
})
