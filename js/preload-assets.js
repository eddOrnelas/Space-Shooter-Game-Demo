function preload () {
  // this.load.setBaseURL('./');

  // for single or static images
  this.load.image('player', 'assets/img/player/playerx32Px.png');
  this.load.image('enemy', 'assets/img/enemies/enemyRed4x32Px.png');
  this.load.image('bullet', 'assets/img/player/playerx32.png');
  this.load.image('tileset001', 'assets/img/tileset01pxnew.png');
  this.load.image('preloadbar', 'assets/img/preloadbar.png');

  // for animations
  this.load.spritesheet('effects',  'assets/img/effects01pxnew.png', {
    frameWidth: 16,
    frameHeight: 16,
  });

  this.load.tilemapTiledJSON('map1', 'assets/maps/map1new.json');
}