window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
        game.load.image( 'platforms','assets/platform.png');
        game.load.image( 'sky', 'assets/sky.png');
        game.load.image( 'player','assets/player.png');
        game.load.image( 'bullet','assets/bullet.png');
        game.load.image( 'boss', 'assets/boss.png');
        game.load.image( 'laser', 'assets/laser.png');
        game.load.image( 'warning', 'assets/warning.png');
        game.load.image( 'missile', 'assets/missile.png');
        game.load.image( 'win' ,'assets/win.png');
        game.load.image( 'lose', 'assets/lose.png');
        game.load.audio('music','assets/lightsaber soundtrack.mp3');
    }
    
   function hit(boss,bullet)
   {
   bullet.kill();
   bosshealth = bosshealth - 8;
   healthtexttwo.text = 'Boss: ' + bosshealth;
   }
   
   function dmg(player, missile)
   {
   missile.kill();
   health = health - 10;
   healthtext.text = 'Player: ' + health;
   }
      
   function block(ground,bullet)
   {
   bullet.kill();
   }
    
    var music;
    var bouncy;
    var platforms;
    var player;
    var cursors;
    var fire;
    var bullets;
    var rate = 15;
    var boss;
    var health = 100;
    var bosshealth = 400;
    var choice = 3;
    var prepare = 25;
    var cooldown = 45;
    var missiles;
    var healthtext;
    var healthtexttwo;
    
    function create() {
    	music = game.add.audio('music');
    	music.play();
        var background = game.add.sprite(0,0,'sky');
        
		game.physics.startSystem(Phaser.Physics.ARCADE);
        platforms = game.add.group();
     	platforms.enableBody = true;
   
        var ground = platforms.create(0, game.world.height - 64, 'platforms');
     	ground.scale.setTo(2,2);
     	ground.body.immovable = true;
     	
     	var ground = platforms.create(200, game.world.height - 200, 'platforms');
     	ground.body.immovable = true;
     	
     	player = game.add.sprite(0, game.world.height - 115, 'player' );
        game.physics.enable( player, Phaser.Physics.ARCADE );
        player.body.collideWorldBounds = true;
        cursors = game.input.keyboard.createCursorKeys();
        player.body.gravity.y = 500;
        
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.setAll('outOfBoundsKill', true);
    	bullets.setAll('checkWorldBounds', true);
        fire = game.input.keyboard.addKey(Phaser.Keyboard.F);
        
       	missiles = game.add.group();
        missiles.enableBody = true;
        missiles.setAll('outOfBoundsKill', true);
    	missiles.setAll('checkWorldBounds', true);
        
        boss = game.add.sprite(700, game.world.height - 163, 'boss' );
        game.physics.enable( boss, Phaser.Physics.ARCADE );
        boss.body.collideWorldBounds = true;
        
        healthtext = game.add.text(16,16, 'Player: 100',{ fontSize: '30px', fill: '#000'});
    	healthtexttwo = game.add.text(590,16, 'Boss: 400',{ fontSize: '30px', fill: '#000'});
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
    	game.physics.arcade.collide(player,platforms);
    	game.physics.arcade.overlap(boss, bullets, hit, null, this);
    	game.physics.arcade.overlap(platforms, bullets, block, null, this);
		game.physics.arcade.overlap(player, missiles, dmg, null, this);
    	player.body.velocity.x = 0;
    	rate = rate - 1;
    	cooldown = cooldown - 1;
    	if (cursors.left.isDown)
    	{
        //  Move to the left
        player.body.velocity.x = -350;
 		
        
   		}
    	else if (cursors.right.isDown)
    	{
        //  Move to the right
        player.body.velocity.x = 350;
 		}
    	else if (cursors.up.isDown && player.body.touching.down )
    	{
        //  Move to the right
        player.body.velocity.y = -450;
        }
        if(rate <= 0)
        {
        if(fire.isDown)
        {
        var bullet = bullets.create(player.body.x + 50,player.body.y + 25,'bullet');
    	game.physics.enable( bullet, Phaser.Physics.ARCADE );
    	bullet.body.velocity.x = 350;
        rate = 15;
        }
        }
        
        if(bosshealth <= 0)
        {
        boss.kill();
        game.add.image(0,0,'win');
        game.paused = true;
        }
        
        if(health <= 0)
        {
        player.kill();
        game.add.image(0,0,'lose');
        game.paused = true;
        }
        
        if(cooldown <= 0)
       {
        var missile = missiles.create(boss.body.x+50,player.body.y + 25,'missile');
    	game.physics.enable( missile, Phaser.Physics.ARCADE );
    	missile.body.velocity.x = -390;
    	cooldown = 45;
       }
    	
    }
};
