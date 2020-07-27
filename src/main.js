/*
Jonathan Palafox 


Mods created for this project:

-Create 4 new explosion SFX and randomize which one plays on impact (15)
-Allows the player to control the Rocket after it's fired (10)
-Implement the speed increase that happens after 30 seconds in the original game (10)
-Create a new title screen (15)
-Display the time remaining (in seconds) on the screen (15)
-Implement a new timing/scoring mechanism that adds time to the clock for successful hits (25)
-New tile background sprite (10)
-Add your own (copyright-free) background music to the Play scene (10) 

*/


let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu,Play]
  }


let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000    
}

// reserve keyboard vars
let keyF, keyLEFT, keyRIGHT;