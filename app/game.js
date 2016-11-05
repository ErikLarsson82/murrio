define('app/game', [
  'underscore',
  'userInput',
  'utils',
  'SpriteSheet',
  'app/images',
  'app/map'
], function (
  _,
  userInput,
  utils,
  SpriteSheet,
  images,
  map
) {
  /*
    PLAYER: 1,
    TILE: 2,
    ENEMY1: 3,
    ENEMY2: 4,
    VICTORY: 5
  */

  let canvasWidth
  let canvasHeight

  const DEBUG_WRITE_BUTTONS = !false;
  const DEBUG_DISABLE_GRAPHICS = false;

  const TILE_SIZE = 48;
  const GRAVITY = 0.3;

  let gameObjects;
  let murrio;

  function debugWriteButtons(pad) {
        if (!DEBUG_WRITE_BUTTONS) return;
        _.each(pad && pad.buttons, function(button, idx) {
            if (button.pressed) console.log(idx + " pressed");
        })
    }

  class GameObject {
    constructor(config) {
      this.pos = config.pos;
      this.velocity = config.velocity || {x: 0, y: 0}
    }
    tick() {
      
    }
    draw(renderingContext) {
      renderingContext.fillStyle = "black";
      renderingContext.fillRect(this.pos.x, this.pos.y, TILE_SIZE, TILE_SIZE)
    }
    
  }

  class Murrio extends GameObject {
    constructor(config) {
      super(config)
      this.jumpAvailable = 2;
      this.jumpButtonReleased = true;
    }
    tick() {
      const pad = userInput.getInput(0)
      var acceleration = {
        x: 0,
        y: 0
      }
      if (pad.buttons[14].pressed) { // left
        acceleration.x -= 0.1;
      }
      if (pad.buttons[15].pressed) { // right
        acceleration.x += 0.1;
      }

      if (pad.buttons[0].pressed) { // up
        this.jump();
      }
      if (!pad.buttons[0].pressed) { // up
        this.jumpButtonReleased = true;
      }

      this.velocity = {
        x: this.velocity.x + acceleration.x,
        y: this.velocity.y + acceleration.y + GRAVITY
      }
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      //this.pos = nextPosition;
      var callbackX = function() {
        this.velocity.x = 0;
      }
      var callbackY = function() {
        this.velocity.y = 0;
        this.jumpAvailable = 2;
      }
      handleMove(this, nextPosition, callbackX.bind(this), callbackY.bind(this));

      super.tick();
    }
    jump() {
      if (this.jumpAvailable === 0 || !this.jumpButtonReleased) return;
      this.velocity.y = -6;
      this.jumpAvailable--;
      this.jumpButtonReleased = false;
    }
  }

  class Tile extends GameObject {
    constructor(config) {
      super(config)
    }
  }

  function isOfTypes(gameObject, other, type1, type2) {
    return (gameObject instanceof type1 && other instanceof type2) ||
        (gameObject instanceof type2 && other instanceof type1)
  }

  function getOfType(gameObject, other, type) {
    if (gameObject instanceof type && other instanceof type) {
      console.warn(`Both ${gameObject} and ${other} were of type ${type}`)
    }
    if (gameObject instanceof type) {
      return gameObject
    } else if (other instanceof type) {
      return other
    }
    console.error(`None of type ${type}, ${gameObject} - ${other}`)
  }

  function detectCollision(who) {
      return _.filter(gameObjects, function(item) {
        if (item === who) return;

        const condition1 = who.pos.x + TILE_SIZE > item.pos.x;
        const condition2 = who.pos.x < item.pos.x + TILE_SIZE;
        const condition3 = who.pos.y + TILE_SIZE > item.pos.y;
        const condition4 = who.pos.y < item.pos.y + TILE_SIZE;
        const condition5 = !item.markedForRemoval
        return (condition1 && condition2 && condition3 && condition4 && condition5);
      });
    }

  function resolveCollision(gameObject, other) {
    if (isOfTypes(gameObject, other, Murrio, Tile)) {
      console.log('kollide with tile');
    }
    
  }

  function handleMove(gameObject, newPos, callbackX, callbackY) {
    var originalX = gameObject.pos.x;
    gameObject.pos.x = newPos.x;
    var collisions = detectCollision(gameObject);
    if (collisions.length > 0) {
      gameObject.pos.x = originalX;
      callbackX();
    }

    var originalY = gameObject.pos.y;
    gameObject.pos.y = newPos.y;
    var collisions = detectCollision(gameObject);
    if (collisions.length > 0) {
      gameObject.pos.y = originalY;
      callbackY();
    }
  }

  function loadMap(map) {

    _.each(map, function(row, rowIdx) {
      _.each(row, function(column, colIdx) {
        switch(column) {
          case 1:
            murrio = new Murrio({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              }
            })
            gameObjects.push(murrio)
          break;
          case 2:
            var tile = new Tile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              }
            })
            gameObjects.push(tile)
          break;
        }
      })
    })
  }

  function playerAlive() {
    var playerDead = _.filter(gameObjects, function(item) {
        return item instanceof Murrio;
      }).length;
    return (playerDead !== 0);
  }

  function endConditions() {
    return false;
  }

  return {
    init: function() {
      canvasWidth = 1024
      canvasHeight = 768

      gameOver = false
      
      gameObjects = []

      loadMap(map);
    },
    tick: function() {

      endConditions();
      _.each(gameObjects, function (gameObject) {
        gameObject.tick();
      });

      gameObjects = gameObjects.filter(function (gameObject) {
        return !gameObject.markedForRemoval
      });
    },
    draw: function (renderingContext) {
      renderingContext.fillStyle = "white";
      renderingContext.fillRect(0,0, canvasWidth, canvasHeight)
          
      _.each(gameObjects, function (gameObject) {
        gameObject.draw(renderingContext)
      })
    }
  }
})
