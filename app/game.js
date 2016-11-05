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
  const DEBUG_DRAW_BOXES = true;

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
      this.color = config.color || "gray"
      this.pos = config.pos;
      this.velocity = config.velocity || {x: 0, y: 0}
    }
    tick() {

    }
    draw(renderingContext) {
      if (!DEBUG_DRAW_BOXES) return;
      renderingContext.fillStyle = this.color;
      renderingContext.fillRect(this.pos.x, this.pos.y, TILE_SIZE, TILE_SIZE)
    }
    destroy() {
      this.markedForRemoval = true;
    }
  }

  class Murrio extends GameObject {
    constructor(config) {
      super(config);
      this.jumpButtonReleased = true;
      this.touchingGround = false;
      this.walk_animation = images.walk_animation;
      this.direction = false; //True is left, false is right
    }
    tick() {
      const pad = userInput.getInput(0)
      var acceleration = {
        x: 0,
        y: 0
      }
      var speed = (this.touchingGround) ? 0.2 : 0.08;
      if (pad.buttons[14].pressed) { // left
        acceleration.x -= speed;
      }
      if (pad.buttons[15].pressed) { // right
        acceleration.x += speed;
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
      let nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }

      //Collision with edge of map
      if (nextPosition.x <= scroller.getScreenOffset() + 10) {
        nextPosition.x = scroller.getScreenOffset() + 10;
        this.velocity.x = 1;
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

      this.walk_animation.tick(Math.round(1000/60 * Math.abs(this.velocity.x)));

      this.direction = (this.velocity.x > 0);
      super.tick();
    }
    jump() {
      if (!this.touchingGround || !this.jumpButtonReleased) return;
      this.velocity.y = -10;
      this.touchingGround = false;
      this.jumpButtonReleased = false;
    }
    draw(renderingContext) {
      super.draw(renderingContext);

      if (Math.abs(this.velocity.x) > 1 && this.touchingGround) {
        renderingContext.save()
        renderingContext.translate(this.pos.x, this.pos.y);
        if (!this.direction) {
          renderingContext.scale(-1, 1);
          renderingContext.translate(-TILE_SIZE, 0);
        }
        this.walk_animation.draw(renderingContext);
        renderingContext.restore();
      }  else {
        renderingContext.save();
        renderingContext.translate(this.pos.x, this.pos.y);
        if (!this.direction) {
          renderingContext.scale(-1, 1);
          renderingContext.translate(-TILE_SIZE, 0);
        }
        if (this.touchingGround) {
          renderingContext.drawImage(images.idle, 0, 0)
        } else {
          renderingContext.drawImage(images.jump, 0, 0)
        }
        renderingContext.restore();
      }
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
      this.amountUntilKeyPressAvailable = 200;
      this.pos = {
        x: 999,
        y: 999
      }
    }
    tick() {
      this.amountUntilKeyPressAvailable--;

      if (this.amountUntilKeyPressAvailable > 0) return;

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
    var fromLeft = newPos.x > gameObject.pos.x;
    var fromTop = newPos.y > gameObject.pos.y;
    gameObject.pos.x = newPos.x;
    var collisions = detectCollision(gameObject);
    if (collisions.length > 0) {
      _.each(collisions, function(collision) { resolveCollision(gameObject, collision) });
      if (fromLeft) {
        gameObject.pos.x = collisions[0].pos.x - TILE_SIZE;
      } else {
        gameObject.pos.x = collisions[0].pos.x + TILE_SIZE;
      }
      callbackX();
    }

    gameObject.pos.y = newPos.y;
    var collisions = detectCollision(gameObject);
    if (collisions.length > 0) {
      _.each(collisions, function(collision) { resolveCollision(gameObject, collision) });
      if (fromTop) {
        gameObject.pos.y = collisions[0].pos.y - TILE_SIZE;
      } else {
        gameObject.pos.y = collisions[0].pos.y + TILE_SIZE;
      }
      callbackY(collisions);
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

    loadMap(map.getMap(0));

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
