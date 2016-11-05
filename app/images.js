define('app/images', ['SpriteSheet'], function(SpriteSheet) {
  var idle = new Image();
  idle.src = "./assets/images/idle.png";

  var walk_animation_sprite = new Image();
  walk_animation_sprite.src = "./assets/images/walk_animation.png";

  var walk_animation = SpriteSheet.new(walk_animation_sprite, {
    frames: [200, 200, 200],
    x: 0,
    y: 0,
    width: 48,
    height: 48,
    restart: true,
    autoPlay: true,
  });

  var jump = new Image();
  jump.src = "./assets/images/jump.png";

  var tile = new Image();
  tile.src = "./assets/images/tile.png";

  var lava = new Image();
  lava.src = "./assets/images/lava.png";

  var won = new Image();
  won.src = "./assets/images/won.png";

  var dead = new Image();
  dead.src = "./assets/images/dead.png";

  var sky = new Image();
  sky.src = "./assets/images/sky.png";

  return {
    idle: idle,
    walk_animation: walk_animation,
    jump: jump,
    tile: tile,
    lava: lava,
    won: won,
    dead: dead,
    sky: sky
  }
})