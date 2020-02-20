function preload() {
  // this.load.setBaseURL('./');

  // for single or static images
  this.load.image('player', 'assets/img/player/playerx32Px.png');
  this.load.image('enemy', 'assets/img/enemies/enemyRed4x32Px.png');
  this.load.image('bullet', 'assets/img/player/playerx32.png');
  this.load.image('tileset001', 'assets/img/tileset01pxnew.png');
  this.load.image('preloadbar', 'assets/img/preloadbar.png');

  // for music
  this.load.audio('music', 'assets/music/blue_beat.mp3');

  // for fxs
  this.load.audio('crash1', 'assets/sound/Explosion3.wav');
  this.load.audio('crash2', 'assets/sound/Hit1.wav');
  this.load.audio('fire', 'assets/sound/Shoot3.wav');

  // for animations
  this.load.spritesheet('effects', 'assets/img/effects01pxnew.png', {
    frameWidth: 16,
    frameHeight: 16,
  });

  // for maps
  this.load.tilemapTiledJSON('map1', 'assets/maps/map1new.json');
}