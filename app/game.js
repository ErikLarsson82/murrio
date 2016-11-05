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

  const DEBUG_WRITE_BUTTONS = false;
  const DEBUG_DISABLE_GRAPHICS = false;
  const DEBUG_DRAW_BOXES = false;
  const DEBUG_HOTKEYS = false;
  let DEBUG_START_OFFSET = 0;

  const TILE_SIZE = 48;
  const GRAVITY = 0.3;
  const TIME_UNTIL_RESTART = 200;

  let gameObjects;
  let playSound;
  let murrio;
  let grandpa;
  let victoryTile;
  let currentMapIdx = 0;

  function debugWriteButtons(pad) {
        if (!DEBUG_WRITE_BUTTONS) return;
        _.each(pad && pad.buttons, function(button, idx) {
            if (button.pressed) console.log(idx + " pressed");
        })
    }

  class GameObject {
    constructor(config) {
      this.image = config.image;
      this.markedForRemoval = false;
      this.color = config.color || "gray"
      this.pos = config.pos;
      this.velocity = config.velocity || {x: 0, y: 0}
    }
    tick() {

    }
    draw(renderingContext) {
      if (DEBUG_DRAW_BOXES) {
        renderingContext.fillStyle = this.color;
        renderingContext.fillRect(this.pos.x, this.pos.y, TILE_SIZE, TILE_SIZE)
      } else {
        if (!this.image) return;
        renderingContext.drawImage(this.image, this.pos.x, this.pos.y)
      }
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
      var speed = (this.touchingGround) ? 0.6 : 0.14;
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

      var groundFriction = (this.touchingGround) ? 0.92 : 0.985;
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
        this.velocity.x = 0;
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
      playSound('jump')
      var jumpSpeed = -9.45 - Math.abs(this.velocity.x / 2);
      this.velocity.y = Math.max(-11, jumpSpeed);
      this.touchingGround = false;
      this.jumpButtonReleased = false;
    }
    draw(renderingContext) {
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
      this.image = images.dead;
    }
    tick() {
      this.pos.y -= 1;
    }
  }

  class MurrioWin extends GameObject {
    constructor(config) {
      super(config)
      this.color = "yellow";
      this.image = images.won;
    }
  }

  class Grandpa extends GameObject {
    constructor(config) {
      super(config);
      this.done = false;
    }
    draw(renderingContext) {
      if (this.done) {
        renderingContext.drawImage(images.grandpa_happy, this.pos.x, this.pos.y)
        renderingContext.drawImage(images.pratbubblathanks, this.pos.x - 205, this.pos.y - 210);
      } else {
        renderingContext.drawImage(images.grandpa, this.pos.x, this.pos.y)
      }
    }
  }

  class Tile extends GameObject {
    constructor(config) {
      super(config);
      this.image = config.image;
    }
  }

  class Decor extends GameObject {
    constructor(config) {
      super(config);
      this.image = config.image;
    }
  }

  class Spike extends GameObject {
    constructor(config) {
      super(config)
      this.image = images.pipe;
      this.direction = false;
      this.totalWalkDistance = config.totalWalkDistance;
      this.distance = this.totalWalkDistance;
      this.speed = 0.3;
      this.spritesheet = config.sprite;
    }
    tick() {
      this.spritesheet.tick(1000/60);
      if (!this.direction && this.distance > this.totalWalkDistance) {
        this.direction = true;
      } else if (this.direction && this.distance < 0) {
        this.direction = false;
      }
      var modifier = (this.direction) ? (this.speed*-1) : this.speed;
      this.distance += modifier;
      var nextPosition = {
        x: this.pos.x + modifier,
        y: this.pos.y
      }
      this.pos = nextPosition;
    }
    draw(renderingContext) {
      renderingContext.save();
      renderingContext.translate(this.pos.x, this.pos.y)
      if (this.direction) {
        renderingContext.scale(-1, 1)
        renderingContext.translate(-TILE_SIZE, 0)
      }
      this.spritesheet.draw(renderingContext);
      renderingContext.restore();
    }
  }

  class DeathTile extends GameObject {
    constructor(config) {
      super(config)
      this.particles = config.particles;
      this.color = "red";
      this.sprite = config.sprite;
    }
    tick() {
      if (this.sprite) {
        this.sprite.tick(1000/60)
      }
    }
    draw(renderingContext) {
      if (this.sprite) {
        renderingContext.save();
        renderingContext.translate(this.pos.x, this.pos.y)
        this.sprite.draw(renderingContext);
        renderingContext.restore();
        }
    }
  }

  class VictoryTile extends GameObject {
    constructor(config) {
      super(config)
      this.image = images.pipe
    }
    tick() {
      if (!this.done) {
        if (Math.random() > 0.0001) {
          var particleSettings = {
            pos: {
              x: victoryTile.pos.x + (Math.random() * TILE_SIZE / 2) + TILE_SIZE / 4,
              y: victoryTile.pos.y - 4,
            },
            velocity: {
              x: (Math.random() - 0.5) * 1.5,
              y: -1 - (Math.random()) * 8,
            },
            image: images.lavaparticle,
            lifetime: 90,
          }
          var particle = new Particle(particleSettings);
          gameObjects.push(particle);
        }
      }
    }
  }

  class GameRestarter {
    constructor() {
      this.amountUntilKeyPressAvailable = TIME_UNTIL_RESTART;
      this.spritesheet = images.press_any_key;
      this.pos = {
        x: 999,
        y: 999
      }
    }
    tick() {
      this.spritesheet.tick(1000/60);
      this.amountUntilKeyPressAvailable--;

      if (this.amountUntilKeyPressAvailable > TIME_UNTIL_RESTART - 90) return;

      const pad = userInput.getInput(0)
      if (pad.buttons[0].pressed || pad.buttons[14].pressed || pad.buttons[15].pressed) {
        if (this.gameIsReallyOver()) return;
        if (this.done) {
          currentMapIdx++;
        }
        init();
      }
    }
    gameIsReallyOver() {
      return (this.done && map.getMap().length - 1 <= currentMapIdx);
    }
    draw(renderingContext) {
      if (this.amountUntilKeyPressAvailable > 0) return;

      if (this.gameIsReallyOver()) {
        renderingContext.drawImage(images.youdidit, canvasWidth/2 - (images.youdidit.width/2), 10)
        return;
      }
      renderingContext.save()
      renderingContext.translate(canvasWidth/2-(320/2), canvasHeight/2-(64/2));
      this.spritesheet.draw(renderingContext);
      renderingContext.restore();
    }
  }

  class ScreenScroller {
    constructor() {
      this.screenOffset = DEBUG_START_OFFSET || 0;
    }
    tick() {
      if (murrio.pos.x > canvasWidth / 2 + this.screenOffset) {
        this.screenOffset = murrio.pos.x - canvasWidth / 2;
      }
    }
    getScreenOffset() {
      return this.screenOffset;
    }
  }

  class Particle extends GameObject {
    constructor(config) {
      super(config);
      this.image = config.image;
      this.lifetimeMax = config.lifetime;
      this.lifetime = config.lifetime;
    }
    tick() {
      const nextPosition = {
        x: this.pos.x + this.velocity.x,
        y: this.pos.y + this.velocity.y
      }
      this.velocity.x = this.velocity.x * 0.98;
      this.velocity.y = this.velocity.y * 0.98;
      this.pos = nextPosition;

      this.lifetime--;
      if (this.lifetime <= 0) this.markedForRemoval = true;
    }
    draw(renderingContext) {
      renderingContext.globalAlpha = (this.lifetime / this.lifetimeMax);
      super.draw(renderingContext);
      renderingContext.globalAlpha = 1;
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
        const condition6 = !(item instanceof Particle)
        const condition7 = !(item instanceof Grandpa)
        const condition8 = !(item instanceof Decor)
        return (condition1 && condition2 && condition3 && condition4 && condition5 && condition6 && condition7 && condition8);
      });
    }

  function resolveCollision(gameObject, other) {
    if (isOfTypes(gameObject, other, Murrio, DeathTile)) {
      var death = getOfType(gameObject, other, DeathTile);
      var murrio = getOfType(gameObject, other, Murrio);
      murrio.destroy();
      gameObjects.push(new GameRestarter());
      gameObjects.push(new MurrioDeathAnimation({ pos: murrio.pos }));
      playSound('gameMusic', true)
      playSound('gameOverMusic', false, false)

      if (death.particles) {
        _.each(new Array(20), function() {
          var particleSettings = {
            pos: {
              x: murrio.pos.x + (Math.random() * TILE_SIZE),
              y: murrio.pos.y + TILE_SIZE - (Math.random() * 2),
            },
            velocity: {
              x: (Math.random() - 0.5) * 1.2,
              y: -(Math.random() - 0.3) * 3,
            },
            image: images.lavaparticle,
            lifetime: 60
          }
          var particle = new Particle(particleSettings);
          gameObjects.push(particle);
        })
      }
    }
    if (isOfTypes(gameObject, other, Murrio, VictoryTile)) {
      var murrio = getOfType(gameObject, other, Murrio);
      murrio.destroy();
      var gr = new GameRestarter()
      gr.done = true;
      gameObjects.push(gr);
      gameObjects.push(new MurrioWin({ pos: murrio.pos }));
      playSound('gameMusic', true)
      playSound('victoryMusic', false, false)
      grandpa.done = true;
      victoryTile.done = true;
    }

    if (isOfTypes(gameObject, other, Murrio, Spike)) {
      var murrio = getOfType(gameObject, other, Murrio);
      murrio.destroy();
      gameObjects.push(new GameRestarter());
      gameObjects.push(new MurrioDeathAnimation({ pos: murrio.pos }));
      playSound('gameMusic', true)
      playSound('gameOverMusic')

      _.each(new Array(20), function() {
        var particleSettings = {
          pos: {
            x: murrio.pos.x + TILE_SIZE / 2,
            y: murrio.pos.y + TILE_SIZE / 2,
          },
          velocity: {
            x: (Math.random() - 0.5) * 5,
            y: -(Math.random() - 0.5) * 5,
          },
          image: images.particleSpike,
          lifetime: 80
        }
        var particle = new Particle(particleSettings);
        gameObjects.push(particle);
      })
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
            var verticalOffset = (DEBUG_START_OFFSET > 0) ? 50 : rowIdx * TILE_SIZE;
            murrio = new Murrio({
              pos: {
                x: colIdx * TILE_SIZE + DEBUG_START_OFFSET,
                y: verticalOffset
              },
              velocity: {
                x: 0.00001,
                y: 0
              }
            })
            gameObjects.push(murrio)
          break;
          case 2:
            var tile = new Tile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.tile
            })
            gameObjects.push(tile)
          break;
          case 3:
            var tile = new DeathTile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              sprite: SpriteSheet.new(images.lava, images.lava_blueprint),
              particles: true
            })
            gameObjects.push(tile)
          break;
          case 5:
            victoryTile = new VictoryTile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              }
            })
            gameObjects.push(victoryTile)
          break;
          case 6:
            var tile = new Tile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.tile3
            })
            gameObjects.push(tile)
          break;
          case 7:
            grandpa = new Grandpa({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.grandpa
            })
            gameObjects.push(grandpa)
          break;
          case 8:
            var cloud1 = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.cloud1
            })
            gameObjects.push(cloud1)
          break;
          case 9:
            var cloud2 = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.cloud2
            })
            gameObjects.push(cloud2)
          break;
          case 'A':
            var bush1 = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.bush1
            })
            gameObjects.push(bush1)
          break;
          case 'B':
            var bush2 = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.bush2
            })
            gameObjects.push(bush2)
          break;
          case 'C':
            var invisible = new DeathTile({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              particles: false
            })
            gameObjects.push(invisible)
          break;
          case 'D':
            var spike = new Spike({
              sprite: SpriteSheet.new(images.spike, images.spike_blueprint),
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              totalWalkDistance: 48
            })
            gameObjects.push(spike)
          break;
          case 'E':
            var spike = new Spike({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              sprite: SpriteSheet.new(images.spike, images.spike_blueprint),
              totalWalkDistance: 48 * 3
            })
            gameObjects.push(spike)
          break;
          case 'F':
            var spike = new Spike({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              sprite: SpriteSheet.new(images.spike, images.spike_blueprint),
              totalWalkDistance: 48 * 7
            })
            gameObjects.push(spike)
          break;
          case 'G':
            var egg = new Decor({
              pos: {
                x: colIdx * TILE_SIZE,
                y: rowIdx * TILE_SIZE
              },
              image: images.egg
            })
            gameObjects.push(egg)
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

  function init(_playSound) {
    grandpa = null
    murrio = null
    victoryTile = null

    canvasWidth = 1024
    canvasHeight = 768

    gameOver = false
    playSound = _playSound || playSound

    gameObjects = []

    loadMap(map.getMap()[currentMapIdx]);

    playSound('gameMusic', false, true)
    playSound('victoryMusic', true, true)
    playSound('gameOverMusic', true, true)

    scroller = new ScreenScroller();
  }

  window.addEventListener("keydown", function(e) {
    if (!DEBUG_HOTKEYS) return;
    if (e.keyCode === 83) { // s
      scroller.screenOffset = scroller.screenOffset + 1000;
      murrio.pos.x = murrio.pos.x + 1000;
    }
    if (e.keyCode === 78) { // n
      currentMapIdx++;
      init();
    }
    if (e.keyCode === 66) { // b
      currentMapIdx = 0;
      init();
    }
  })

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
      renderingContext.drawImage(images.sky,0,0)

      renderingContext.save();
      renderingContext.translate(-scroller.getScreenOffset(), 0);
      _.each(gameObjects, function (gameObject) {
        if (gameObject instanceof Decor) gameObject.draw(renderingContext)
      })
      _.each(gameObjects, function (gameObject) {
        if (!(gameObject instanceof Decor || gameObject instanceof GameRestarter))
          gameObject.draw(renderingContext)
      })
      renderingContext.restore();

      _.each(gameObjects, function (gameObject) {
        if (gameObject instanceof GameRestarter) gameObject.draw(renderingContext)
      })
    },
    destroy: function() {
      playSound('victoryMusic', true)
      playSound('gameOverMusic', true)
      playSound('gameMusic', true)
    }
  }
})
