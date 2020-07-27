class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship1', './assets/spaceship1.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('starfield1', './assets/starfield1.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        let timerVar = 0; 
    }

    create() {
       

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield1').setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // add rocket (p1)

        if(game.settings.gameTimer == 45000){
            this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'spaceship1').setScale(0.5, 0.5).setOrigin(0, 0);
        } else {
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        
    
    
    }

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}), 
            frameRate: 30
        });
    
        //gametimer
        
        // player 1 score
        this.p1Score = 0;
        //gamesettings
 

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        let timeLeft = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.p1Time = eval(game.settings.gameTimer)/1000;
        this.timeLeft = this.add.text(500, 54, this.p1Time, timeLeft);
        
        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
           
        }, null, this);

        this.clock = this.time.delayedCall(1000, () => {
            var newVar = eval(this.timeLeft.text);
            this.timeLeft.text = newVar -1;
            this.myTimer();
        }, null, this);

        this.clock = this.time.delayedCall(30000, () => {
            this.ship01.setSpeed();
         }, null, this);

    

        
    }
    update() {



 // check key input for restart
 if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
    this.scene.restart(this.p1Score);
}
if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
    this.scene.start("menuScene");
}

 //this.timeLeft.text = 26;

        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 

       // check collisions
       if(this.checkCollision(this.p1Rocket, this.ship03)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship03);   
    }
    if (this.checkCollision(this.p1Rocket, this.ship02)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship02);
    }
    if (this.checkCollision(this.p1Rocket, this.ship01)) {
        this.p1Rocket.reset();
        this.shipExplode(this.ship01);
    }

          this.p1Rocket.update();

      }


      checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       
            ship.alpha = 1;                     
            boom.destroy();                     
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;     
        // play sound
        var numberSFX = Math.floor(Math.random() * 4) + 1;; 
        var toString = 'sfx_explosion'.concat(numberSFX.toString());  
        this.sound.play(toString);  

        //add points

        var newVar = eval(this.timeLeft.text);
        this.timeLeft.text = newVar + 5;
        
    }

    myTimer() {
    
        this.clock = this.time.delayedCall(1000, () => {
            var newVar = eval(this.timeLeft.text);
            if(newVar>0){
            this.timeLeft.text = newVar -1;
            this.myTimer(); 
            } else{
                this.add.text(this.game.config.width/2, this.game.config.height/2, 'GAME OVER', ).setOrigin(0.5);
                this.add.text(this.game.config.width/2, this.game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', ).setOrigin(0.5);
           
                this.gameOver = true;
                
            }
            
        }, null, this);
      }


}