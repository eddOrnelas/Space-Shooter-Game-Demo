var config = {
  type: Phaser.AUTO,
  width: 352,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

var game = new Phaser.Game(config);

var player = undefined;
var enemies = undefined;
var playerBullets = undefined;
var enemyBullets = undefined;
var score = 0;
var scoreText = undefined;
var debugText = undefined;
var cursosrs = undefined;
var gameState = 'loading';
var canScrollMap = false;
var playerState = 'starting';
var thisTimestep = 0;
var thisDeltaTime = 0;
var thisCalcDeltaTime = 0;
var bulletTime = 0;
var shootButtonLocked = false;
var map;
var map2;
var mapOrder = 0;
var tileset;
var mapLayers = {};
var mapLayers2 = {};
var startButton = undefined;
var startText = undefined;
var gameOverText = undefined;
var enemySpawnCoolDown = 0;
var enemySpawnDelay = 0;
var enemySpawnLevel = 0;
var enemyMovements = [
  'linear_down',
  'sin_down',
];

function create() {
  // set game world
  // this.world.setBounds(0, 0, 360, 640);
  map = this.make.tilemap({ key: 'map1' });
  map2 = this.make.tilemap({ key: 'map1' });

  createMap(this, map, mapLayers, -2816);
  createMap(this, map2, mapLayers2, -5632);
  

  // set player
  player = this.physics.add.image(160, 500, 'player');
  player.setCollideWorldBounds(true);
  playerState = 'alive';

  // set enemies
  enemies = this.physics.add.group();
  // createEnemies();

  // set bullets
  playerBullets = this.physics.add.group();
  enemyBullets = this.physics.add.group();

  // set score
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '20px',
    fill: '#FFF',
    stroke: '#000',
    strokeThickness: 4,
  });

  debugText = this.add.text(16, 200, '', {
    fontSize: '20px',
    fill: '#FFF',
  });

  gameOverText = this.add.text(10, 285, '', {
    fontSize: '20px',
    fill: '#FFF',
    align: 'center',
    stroke: '#000',
    strokeThickness: 4,
  });

  // set controller
  cursors = this.input.keyboard.createCursorKeys();

  // set bullet animation
  game.anims.create({
    key: 'bulletAnim1',
    frames: game.anims.generateFrameNumbers('effects', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  game.anims.create({
    key: 'bulletAnim2',
    frames: game.anims.generateFrameNumbers('effects', { start: 13, end: 17 }),
    frameRate: 10,
    repeat: -1
  });

  // set start screen
  initStartScreen(this);

  gameState = 'initial';
  canScrollMap = false;
}

function initStartScreen(self) {
  startButton = self.add.sprite(180, 400, 'preloadbar').setInteractive({ useHandCursor: true })
  startButton.on('pointerup', function (pointer) {
    startGame();
  });

  startText = self.add.text(150, 385, 'Start', {
    fontSize: '20px',
    fill: '#FFF',
    align: 'center',
    stroke: '#000',
    strokeThickness: 4,
  });
}

function startGame() {
  gameState = 'playing';
  canScrollMap = true;
  startButton.destroy();
  startText.destroy();
}

function update(timestep, dt) {
  thisTimestep = timestep;
  thisDeltaTime = dt;
  thisCalcDeltaTime = dt / 1000;

  checkCollides(this);
  checkInputs();
  scrollMap();
  createRandomEnemies();
  moveEnemies();
  destroyOutboundsEnemies();
  destroyOutboundsBullets();
  enemiesAttack();

  // update score text
  scoreText.setText('Score: ' + score);
}

function createMap(self, mapN, mapLayersN, initialYPosition) {
  // set map
  // load the tiles for the tile set name
  // from tiled with local tiles loaded
  tileset = map.addTilesetImage('tileset01', 'tileset001');
  var mapsScale = 1;

  // load and show layers from tiled for rendering
  mapLayersN.Ground = mapN.createStaticLayer('Ground', tileset);
  mapLayersN.Water = mapN.createStaticLayer('Water', tileset);
  mapLayersN.WaterObjs = mapN.createStaticLayer('Water objs', tileset);
  mapLayersN.Ground2 = mapN.createStaticLayer('Ground2', tileset);
  mapLayersN.Ground3 = mapN.createStaticLayer('Ground3', tileset);
  mapLayersN.Woods = mapN.createStaticLayer('Woods', tileset);
  mapLayersN.Woods2 = mapN.createStaticLayer('Woods2', tileset);

  mapLayersN.Ground.scale = mapsScale;
  mapLayersN.Water.scale = mapsScale;
  mapLayersN.WaterObjs.scale = mapsScale;
  mapLayersN.Ground2.scale = mapsScale;
  mapLayersN.Ground3.scale = mapsScale;
  mapLayersN.Woods.scale = mapsScale;
  mapLayersN.Woods2.scale = mapsScale;

  mapLayersN.Ground.y = initialYPosition;
  mapLayersN.Water.y = initialYPosition;
  mapLayersN.WaterObjs.y = initialYPosition;
  mapLayersN.Ground2.y = initialYPosition;
  mapLayersN.Ground3.y = initialYPosition;
  mapLayersN.Woods.y = initialYPosition;
  mapLayersN.Woods2.y = initialYPosition;
}

function scrollMap() {
  var lastY1 = 0;
  var lastY2 = 0;
  Object.keys(mapLayers).forEach(function(key) {
    if (gameState === 'playing' && canScrollMap) {
      mapLayers[key].y += (2);
      lastY1 = mapLayers[key].y;

      mapLayers2[key].y += (2);
      lastY2 = mapLayers2[key].y;

    if (mapLayers[key].y >= 700) {
        mapLayers[key].y = lastY2 - 2816;
      }

      if (mapLayers2[key].y >= 700) {
        mapLayers2[key].y = lastY1 - 2816;
      }
    }
  });
}

function checkCollides(self) {
  var thisSelf = self;
  thisSelf.physics.add.overlap(player, enemies, overlapPlayerEnemies, null, this);
  thisSelf.physics.add.overlap(playerBullets, enemies, overlapPlayerBulletsEnemies, null, this);
  thisSelf.physics.add.overlap(player, enemyBullets, overlapPlayerEnemyBullets, null, this);
}

function overlapPlayerEnemies(player, enemy) {
  // destroy enemy and player and remove 1 life
  player.destroy();
  playerState = 'dead';
  gameState = 'gameover';
  enemy.destroy();
  gameOverText.setText('Game Over' + '\n\n' + 'Reload Screen to start again');
}

function overlapPlayerBulletsEnemies(playerBulllet, enemy) {
  enemy.destroy();
  playerBulllet.destroy();
  score += 50;
}

function overlapPlayerEnemyBullets(player, enemyBulllet) {
  player.destroy();
  playerState = 'dead';
  gameState = 'gameover';
  gameOverText.setText('Game Over' + '\n\n' + 'Reload Screen to start again');
  enemyBulllet.destroy();
}

function createRandomEnemies() {
  if (enemySpawnCoolDown < thisTimestep) {
    enemySpawnCoolDown = thisTimestep + (enemySpawnLevel * 400) + 500;

    if (gameState === 'playing') {
      var sx = Math.floor(Math.random() * 280) + 50;
      enemy = enemies.create(sx, -50, 'enemy');
      enemy.setVelocityY(250);

      var movementIndex = Math.floor(Math.random() * 2);
      enemy.movement = enemyMovements[movementIndex];
      enemy.initialX = sx;
      enemy.shootCoolDown = 0;
      enemy.shootDelay = (Math.random() * 2000) + 1000;
    }
  }
}

function createPlayerBullet() {
  bullet = playerBullets.create(player.x, player.y - 16, 'effects');
  bullet.setVelocityY(-400);

  bullet.anims.play('bulletAnim1', true);
}

function createEnemyBullet(enemy) {
  if (thisTimestep > (enemy.shootCoolDown + enemy.shootDelay)) {
    // randomize if shoot or not
    var willShoot =  Math.round(Math.random());
    if (willShoot === 1) {
      var bullet = enemyBullets.create(enemy.x, enemy.y + 16, 'effects');
      bullet.setVelocityY(360);
      bullet.anims.play('bulletAnim2', true);

      enemy.shootCoolDown = thisTimestep;
    }
  }
}

function checkInputs() {
  if (gameState === 'playing' && playerState === 'alive' && player !== undefined && player !== null) {
    // horizontal movement
    if (cursors.left.isDown) {
      player.setVelocityX(-190);
    } else if (cursors.right.isDown) {
      player.setVelocityX(190);
    } else {
      player.setVelocityX(0);
    }

    // vertical movement
    if (cursors.up.isDown) {
      player.setVelocityY(-190);
    } else if (cursors.down.isDown) {
      player.setVelocityY(190);
    } else {
      player.setVelocityY(0);
    }

    if (cursors.space.isDown) {
      if (!shootButtonLocked && thisTimestep > (bulletTime + 400)) {
        createPlayerBullet();
        shootButtonLocked = true;
        bulletTime = thisTimestep;
      }
    } else {
      shootButtonLocked = false;
    }
  }
}

function moveEnemies() {
  enemies.children.iterate(function(enemy) {
    if (enemy.movement === 'sin_down') {
      enemy.x = enemy.initialX + ((Math.sin(enemy.y / 60) * 100));
    }
  });
}

function destroyOutboundsEnemies() {
  enemies.children.iterate(function(enemy) {
      if (enemy !== undefined
        && enemy.y !== undefined
        && enemy.y >= 800) {
        window.console.log('out');
        enemy.destroy();
      }
    });
}

function destroyOutboundsBullets() {
  playerBullets.children.iterate(function(bullet) {
    if (bullet !== undefined
      && bullet.y !== undefined
      && (bullet.y >= 800 || bullet.y <= -800)) {
      window.console.log('playwe bullet out');
      bullet.destroy();
    }
  });

  enemyBullets.children.iterate(function(bullet) {
    if (bullet !== undefined
      && bullet.y !== undefined
      && (bullet.y >= 800 || bullet.y <= -800)) {
      window.console.log('enemy bullet out');
      bullet.destroy();
    }
  });
}

function enemiesAttack() {
  enemies.children.iterate(function(enemy) {
    createEnemyBullet(enemy)
  })
}