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

  var won = new Image();
  won.src = "./assets/images/won.png";

  var dead = new Image();
  dead.src = "./assets/images/dead.png";

  return {
    idle: idle,
    walk_animation: walk_animation,
    jump: jump,
    tile: tile,
    won: won,
    dead: dead
  }
})