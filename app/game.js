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
      this.markedForRemoval = false;
      this.color = config.color || "black"
      this.pos = config.pos;
      this.velocity = config.velocity || {x: 0, y: 0}
    }
    tick() {
      
    }
    draw(renderingContext) {
      renderingContext.fillStyle = this.color;
      renderingContext.fillRect(this.pos.x, this.pos.y, TILE_SIZE, TILE_SIZE)
    }
    destroy() {
      this.markedForRemoval = true;
    }
  }

  class Murrio extends GameObject {
    constructor(config) {
      super(config)
      this.jumpAvailable = 2;
      this.jumpButtonReleased = true;
      this.touchingGround = false;
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

      var groundFriction = (this.touchingGround) ? 0.98 : 1;
      this.velocity = {
        x: (this.velocity.x + acceleration.x) * groundFriction,
        y: this.velocity.y + acceleration.y + GRAVITY
      }
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      var callbackX = function() {
        this.velocity.x = 0;
      }
      var callbackY = function() {
        this.velocity.y = 0;
        this.jumpAvailable = 2;
        this.touchingGround = true;
      }
      this.touchingGround = false;
      handleMove(this, nextPosition, callbackX.bind(this), callbackY.bind(this));

      super.tick();
    }
    jump() {
      if (this.jumpAvailable === 0 || !this.jumpButtonReleased) return;
      this.velocity.y = -6;
      this.jumpAvailable--;
      this.jumpButtonReleased = false;
    }
    draw(renderingContext) {
      var color = (this.touchingGround) ? this.color : "purple"
      renderingContext.fillStyle = color;
      renderingContext.fillRect(this.pos.x, this.pos.y, TILE_SIZE, TILE_SIZE)
    }
  }

  class MurrioDeathAnimation extends GameObject {
    constructor(config) {
      super(config)
      this.color = "yellow";
    }
    tick() {
      this.pos.y -= 1;
    }
  }

  class Tile extends GameObject {
    constructor(config) {
      super(config)
    }
  }

  class DeathTile extends GameObject {
    constructor(config) {
      super(config)
      this.color = "red"
    }
  }

  class VictoryTile extends GameObject {
    constructor(config) {
      super(config)
      this.color = "blue"
    }
  }

  class GameRestarter {
    constructor() {
      this.pos = {
        x: 999,
        y: 999
      }
    }
    tick() {
      const pad = userInput.getInput(0)
      if (pad.buttons[0].pressed) {
        init();
      }
    }
    draw() {}
  }

  class ScreenScroller {
    constructor() {
      this.screenOffset = 0;
      this.momentum = 0;
    }
    tick() {
      var treshold_one = Math.round(canvasWidth * 0.4);
      var treshold_two = Math.round(canvasWidth * 0.6);
      var treshold_three = Math.round(canvasWidth * 0.8);
      if (murrio.pos.x - this.screenOffset > treshold_one) this.screenOffset += 1;
      if (murrio.pos.x - this.screenOffset > treshold_two) this.screenOffset += 2;
      if (murrio.pos.x - this.screenOffset > treshold_three) {
        this.momentum = 40;
      }
      if (this.momentum > 0) {
        this.screenOffset += this.momentum;
        this.momentum -= 1;
      }
    }
    getScreenOffset() {
      return this.screenOffset;
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
      //console.log('kollide with tile');
    }
    if (isOfTypes(gameObject, other, Murrio, DeathTile)) {
      var murrio = getOfType(gameObject, other, Murrio);
      murrio.destroy();
      gameObjects.push(new GameRestarter());
      gameObjects.push(new MurrioDeathAnimation({ pos: murrio.pos }));

    }
    if (isOfTypes(gameObject, other, Murrio, VictoryTile)) {
      var murrio = getOfType(gameObject, other, Murrio);
      murrio.destroy();
      gameObjects.push(new GameRestarter());
      gameObjects.push(new MurrioDeathAnimation({ pos: murrio.pos }));
    }
  }

  function handleMove(gameObject, newPos, callbackX, callbackY) {
    var originalX = gameObject.pos.x;
    gameObject.pos.x = newPos.x;
    var collisions = detectCollision(gameObject);
    if (collisions.length > 0) {
      _.each(collisions, function(collision) { resolveCollision(gameObject, collision) });
      gameObject.pos.x = originalX;
      callbackX();
    }

    var originalY = gameObject.pos.y;
    gameObject.pos.y = newPos.y;
    var collisions = detectCollision(gameObject);
    if (collisions.length > 0) {
      _.each(collisions, function(collision) { resolveCollision(gameObject, collision) });
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
          case 3:
            var tile = new DeathTile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              }
            })
            gameObjects.push(tile)
          break;
          case 5:
            var tile = new VictoryTile({
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

  function init() {
    canvasWidth = 1024
    canvasHeight = 768

    gameOver = false
    
    gameObjects = []

    loadMap(map);

    scroller = new ScreenScroller();
  }

  return {
    init: init,
    tick: function() {
      endConditions();
      _.each(gameObjects, function (gameObject) {
        gameObject.tick();
      });
      scroller.tick();

      gameObjects = gameObjects.filter(function (gameObject) {
        return !gameObject.markedForRemoval
      });
    },
    draw: function (renderingContext) {
      renderingContext.fillStyle = "white";
      renderingContext.fillRect(0,0, canvasWidth, canvasHeight)
      
      renderingContext.save();
      renderingContext.translate(-scroller.getScreenOffset(), 0);
      _.each(gameObjects, function (gameObject) {
        gameObject.draw(renderingContext)
      })
      renderingContext.restore();

      if (!playerAlive()) {
        renderingContext.fillStyle = "red";
        renderingContext.fillRect(100, 100, 10, 10)
      }
    }
  }
})
