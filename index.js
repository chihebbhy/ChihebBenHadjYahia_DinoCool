// Bugs to fix : 
// Animation t3 kolchy
// HitBox is off when jumping 
//
// Features to add :
// Biomes.
// Enemies #ON GOING
// Trees, flowers ..
// Fix restarting (reset everything)
// Preloading



// DOMs 
const playerSpriteDOM = document.getElementById("PlayerSprite");
const playerHitBoxDOM = document.getElementById("PlayerHitBox");
const floorDOM = document.getElementById("Floor");
const scoreDOM = document.getElementById("Score");
const menuDOM = document.getElementById("Menu");
const gameDOM = document.getElementById("Game");
const BackgroundsDOM = document.getElementsByClassName("Background");
const EndBackgroundsDOM = document.getElementsByClassName("EndBackground");
const DeathDOM = document.getElementById("DeathAnimation");

// Local Storage
if (localStorage.getItem("HighScore")) {
    document.getElementById("HighScore").innerHTML = "Highest Score: " + String(localStorage.getItem("HighScore")).padStart(5, '0');
}
// Constants 
const g = -1000;
let gfall = g * 1.5;                               // gravity 
const BiomeImage = 'Resources/Extra/ground.png';     // biomes 
const floorHeight = 90;                              // self explanatory 
const PlayerOffGround = 30;                          // height above the ground when the player is considered off the ground
let floorSpeed = 300;                                // the speed that the floor goes by at
let PositionFloor = 0;                               // used to make the floor scroll by 
const speeds = [0, 50, 130, 200, 300];               // different speeds for different backgrounds
const speedsDefault = [0, 50, 130, 200, 300];        //       
let backgroundOffsets = [0, 0, 0, 0, 0];             // backgrounds offsets

// Score
let previousScoreDivision = 0;

// fps related variables 
let GameStarted = false;
const fpslimit = 144;
const interval = 1000 / fpslimit;
let LastFrameTime = 0;
let dt = 0;
let GameLoopId;

// enemy spawning variables
let spawnTimer = 0
let CurrentEnemies = [];
let minSpawnDelay = 3;
let nextSpawnTime = 3;
const EnemyTypes = [                                 // different types of enemies
    {
        name: "SmallCactus",
        image: "",
        Speed: 300,
        weight: 5,
    },
    {
        name: "LargeCactus",
        image: "",
        Speed: 300,
        weight: 3,
    },
    {
        name: "Bird",
        image: "",
        Speed: 300,
        weight: 200,
    }
];

// our player
let Player = {
    PositionBottom: parseInt(window.getComputedStyle(playerHitBoxDOM).bottom) , // position bl bottom
    PositionTop: parseInt(window.getComputedStyle(playerHitBoxDOM).bottom) + parseInt(window.getComputedStyle(playerHitBoxDOM).height), // position top = bottom + kobr tswire(height)
    PositionLeft: parseInt(window.getComputedStyle(playerHitBoxDOM).left),
    PositionRight: parseInt(window.getComputedStyle(playerHitBoxDOM).left) + parseInt(window.getComputedStyle(playerHitBoxDOM).width),
    Velocity: 0,
    Ducking: false,
    OnGround: true,
    Dead: false,
    Score: 0,
    reload() {
        var PlayerCSS = window.getComputedStyle(playerHitBoxDOM);
        this.PositionBottom = parseInt(PlayerCSS.bottom) ; // 20 mta3 hitbox bch ykoun wst sprite
        this.PositionTop = parseInt(PlayerCSS.bottom) + parseInt(PlayerCSS.height);
        this.PositionLeft = parseInt(PlayerCSS.left);
        this.PositionRight = parseInt(PlayerCSS.left) + parseInt(PlayerCSS.width);

    },
    ApplyPhysics(seconds) {
        if (this.Velocity > 0) {
            this.Velocity += g * seconds;
        } else {
            this.Velocity += gfall * seconds; // faster fall velocity
        }
        this.PositionBottom += this.Velocity * seconds;
        if (this.PositionBottom <= floorHeight + PlayerOffGround) {
            this.PositionBottom = floorHeight + PlayerOffGround;
            this.Velocity = 0;
            this.OnGround = true;
            if (Player.Dead) return;
            playerSpriteDOM.classList.remove("JumpAndRotate");
            playerHitBoxDOM.classList.remove("JumpAndRotate");
            if (!playerSpriteDOM.classList.contains("Standing") && !Player.Ducking) {
                playerSpriteDOM.classList.add("Standing");
                playerHitBoxDOM.classList.add("Standing");
            }
        }
        this.updateVisuals();
        this.reload();
        

    },
    AddScore(toAdd) {
        this.Score += toAdd ;
        UpdateSpeeds(this.Score);
    },
    updateVisuals() {
        playerHitBoxDOM.style.bottom = this.PositionBottom + "px"; // 20 mta3 hitbox bch ykoun wst sprite
        playerSpriteDOM.style.bottom = this.PositionBottom - PlayerOffGround +"px";
    },
};

class Enemies {
    constructor(type) {
        this.Type = type;
        this.Velocity = type.Speed;
        this.Collided = false;
        // Create div in html
        this.DOM = document.createElement("div");
        this.DOM.className = "Enemy " + type.name;
        document.getElementById("Enemies").appendChild(this.DOM);

        const css = window.getComputedStyle(this.DOM);

        this.x = window.innerWidth;
        if(this.Type.name == "Bird"){
            this.y = floorHeight + parseInt(css.height)+ 200; // birds fly higher
        }else{
        this.y = floorHeight;
        }
        this.DOM.style.left = this.x + "px";
        this.DOM.style.bottom = this.y + "px";

    }
    update(seconds) {
        if (!this.DOM) return;
        this.x -= this.Velocity * seconds;
        this.DOM.style.left = this.x + "px";
        const css = window.getComputedStyle(this.DOM);
        this.PositionLeft = parseInt(css.left);
        this.PositionRight = this.PositionLeft + parseInt(css.width);
        this.PositionBottom = parseInt(css.bottom);
        this.PositionTop = this.PositionBottom + parseInt(css.height);
    }
    destructor() {
        if (this.DOM && this.DOM.parentNode) {
            this.DOM.parentNode.removeChild(this.DOM);
        }
        this.DOM = null;
    }

}


// test if a and b collide based on them .Position
function isColliding(a, b) {
    return !(a.PositionRight < b.PositionLeft ||
        a.PositionLeft > b.PositionRight ||
        a.PositionTop < b.PositionBottom ||
        a.PositionBottom > b.PositionTop
    );
}
// hides menu and shows game
function HideMenuAndShowGame(ok) {
    if (ok) {
        menuDOM.style.visibility = "hidden";
        gameDOM.style.visibility = "visible";
    } else {
        menuDOM.style.visibility = "visible";
        gameDOM.style.visibility = "hidden";
    }
}

// floor scrolling
function UpdateFloor(seconds) {
    PositionFloor -= floorSpeed * seconds;
    if (PositionFloor < -2304) {
        PositionFloor += 2304;
    }
    floorDOM.style.backgroundPositionX = PositionFloor + "px";
}

// Run Parallax Backgrounds 
function UpdateBackground(seconds) {
    for (var i = 0; i < BackgroundsDOM.length; i++) {
        backgroundOffsets[i] -= speeds[i] * seconds; // speed

        //remove excess position 
        var n = window.innerWidth;
        while (backgroundOffsets[i] <= -384) { // 384 is the width of the background image
            backgroundOffsets[i] += n;
        }

        BackgroundsDOM[i].style.backgroundPositionX = backgroundOffsets[i] + "px";
    }

}

// Chooses which type of enemy to spawn based on their weights 
function getRandomEnemyType() {
    let totalWeight = EnemyTypes.reduce((s, e) => s + e.weight, 0); // reduce t3addi lfct hedhika 3la kol element wl s hia somme wl e howa el element eli 9a3da tet3ada 3lih lfct
    let r = Math.random() * totalWeight;

    for (let e of EnemyTypes) {
        if (r < e.weight) return e;
        r -= e.weight;
    }
}

// spawns and moves enemies 
function UpdateAndSpawnEnemies(seconds) {
    spawnTimer += seconds;
    if (spawnTimer >= nextSpawnTime) {
        spawnTimer = 0;
        nextSpawnTime = minSpawnDelay + Math.random() * minSpawnDelay;
        var type = getRandomEnemyType();
        CurrentEnemies.push(new Enemies(type));

    } // move the already existing enemies
    for (let i = 0; i < CurrentEnemies.length; i++) {
        let e = CurrentEnemies[i];
        e.update(seconds);
        if (e.x < -200) {
            e.destructor();
            CurrentEnemies.splice(i, 1); // at position i remove 1 element 
        }

       // console.log("Right < Left",e.PositionRight < Player.PositionLeft);
       // console.log("Left > Right",e.PositionLeft > Player.PositionRight);
       // console.log("Top < Bottom",e.PositionTop < Player.PositionBottom);
       // console.log("Bottom > Top",e.PositionBottom > Player.PositionTop);
       console.log('Enemy Bottom:',e.PositionBottom);
       console.log('Player Top:', Player.PositionTop);

        console.log('-------------------------');
        if (!e.Collided && isColliding(e, Player)) {
            e.destructor();
            CurrentEnemies.splice(i, 1); // at position i remove 1 element
            GameOver();
        }
    }
}

async function GameOver() {
    Player.Dead = true;
    document.getElementById("ResetGame").disabled = true;
    Player.Velocity = 300;
    CurrentEnemies.forEach(element => {
        element.destructor();  // remove all enemies
        CurrentEnemies.length--;
    });

    gfall = -500; // slower fall for death animation
    KillAllAnimations(playerHitBoxDOM);
    KillAllAnimations(playerSpriteDOM);

    playerSpriteDOM.classList.remove('Standing', 'JumpAndRotate', 'Duck', 'Death'); // remove all classes
    playerHitBoxDOM.classList.remove('Standing', 'JumpAndRotate', 'Duck', 'Death');

    playerSpriteDOM.classList.add("Chilling");

    await wait(1500); // wait for the player to fall

    gfall = -1500; // reset gravity after animation
    playerSpriteDOM.style.zIndex = 1008;

    await wait(1000); // wait to start death animation
    DeathDOM.style.display = "inline-block";
    DeathDOM.classList.add("Start");

    document.getElementById("DeathScreen").removeAttribute("hidden");

    playerSpriteDOM.classList.add("Death");
    DeathDOM.style.opacity = "1";

    await wait(3000); // wait for death animation to finish

    // show final score 
    let finalScore = Math.round(Player.Score);
    let FinalScoreDOM = document.getElementById("FinalScore");
    FinalScoreDOM.style.visibility = "visible";
    FinalScoreDOM.style.animation = "opacity 1.5s forwards";
    FinalScoreDOM.innerHTML = "Score: " + String(finalScore);
    // show replay button
    const PlayAgainDOM = document.getElementById("PlayAgain");
    PlayAgainDOM.style.visibility = "visible";

    // update highscore if needed
    if (!localStorage.getItem("HighScore") || finalScore > parseInt(localStorage.getItem("HighScore"))) {
        localStorage.setItem("HighScore", finalScore);
        document.getElementById("HighScore").innerHTML = "Highest Score: " + String(finalScore).padStart(5, '0');

    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function KillAllAnimations(element) {
    element.className = ""; // remove all classes to kill animations
    element.style.animation = "none";
    element.style.transition = "none";
    element.getAnimations().forEach(a => a.cancel());

    void element.offsetWidth; // trigger reflow
    element.style.transform = "none";
    element.style.animation = "";
    element.style.transition = "";

}
// updates speeds based on score
function UpdateSpeeds(Score) {
    var u = Math.floor(Score / 100);
    if (u > previousScoreDivision) {
        floorSpeed = 300 + u * 20; // floor: starts at 300 and adds 20 speed every 100 score (10 seconds)
        if (u < 25) {
            minSpawnDelay = 3 - u * 0.1;// enemyspawning: starts at 3 seconds and reduces 0.1 every 100 score 
        } else {
            minSpawnDelay = 0.5;
        }
        for (let i = speeds.length - 1; i >= 0; i--) {
            speeds[i] = speedsDefault[i] + u * (20 - (5 * (speeds.length - i))); // backgroundspeeds: add 20 to the closest background, 15 to the one after it , 10 after it....
        }
        EnemyTypes.forEach(enemy => {enemy
            enemy.Speed = 300 + u * 20;  // enemyspeeds: add 20 speed to each enemy
        });
        previousScoreDivision = u;
    }

}
// runs each frame
function UpdateGame(dt) {
    // calcul physique
    const seconds = dt / 1000;

    if (GameStarted) {
        Player.ApplyPhysics(seconds);
        if (!Player.Dead) {

            UpdateFloor(seconds);
            UpdateBackground(seconds);
            UpdateAndSpawnEnemies(seconds);
            Player.AddScore(seconds * 10);      // 10 score par seconde
            scoreDOM.innerHTML = 'Score: ' + String(Math.round(Player.Score)).padStart(5, '0'); // Score 
        }
    }
}


// loop tcontrolli lframes bch mayfoutouch 144 fps w maydhay3ouch frames 
function GameLoop(TimeStamp) {
    if (!GameStarted) return;
    if (TimeStamp < (LastFrameTime + interval)) {
        requestAnimationFrame(GameLoop);
        return;
    }
    dt += TimeStamp - LastFrameTime;
    LastFrameTime = TimeStamp;
    if (dt >= interval * 100) dt = 0;
    while (dt >= interval) {
        // trajja3 eli je retard 
        UpdateGame(interval);
        dt -= interval;
    }
    requestAnimationFrame(GameLoop);
}



function StartGame() {
    // hide start button
    const btn = document.getElementById("StartButton");
    btn.style.display = "none";
    btn.disabled = true;
    btn.blur();

    // show menu button
    const btn2 = document.getElementById("ResetGame");
    btn2.style.display = "block";
    btn2.disabled = false;


    HideMenuAndShowGame(true);
    floorDOM.style.backgroundImage = `url("${BiomeImage}")`;
    Player.Score = 0;
    Player.Velocity = 0;
    Player.Ducking = false;
    Player.OnGround = true;
    Player.Dead = false;
    Player.PositionBottom = floorHeight;
    floorSpeed = 300;
    PositionFloor = 0;
    GameStarted = true;
    gfall = g * 1.5;
    floorSpeed = 300;
    PositionFloor = 0;
    backgroundOffsets = [0, 0, 0, 0, 0];
    previousScoreDivision = 0;
    spawnTimer = 0;
    CurrentEnemies.forEach(element => {
        element.destructor(); // remove all enemies 
        CurrentEnemies.length--;
    });
    CurrentEnemies = [];
    minSpawnDelay = 3;
    nextSpawnTime = 3;

    playerSpriteDOM.style.zIndex = 8;
    playerSpriteDOM.classList.remove('JumpAndRotate', 'Duck', 'Death', 'Chilling'); // remove all classes
    playerHitBoxDOM.classList.remove('JumpAndRotate', 'Duck', 'Death', 'Chilling');
    playerSpriteDOM.style.animation = "";
    playerHitBoxDOM.style.animation = "";
    playerSpriteDOM.style.transition = "";
    playerHitBoxDOM.style.transition = "";
    playerSpriteDOM.style.transform = "";
    playerHitBoxDOM.style.transform = "";
    playerSpriteDOM.classList.add("Standing");
    playerHitBoxDOM.classList.add("Standing");
    Player.updateVisuals();
    document.getElementById("DeathScreen").setAttribute("hidden", "true");
    document.getElementById("FinalScore").style.visibility = "hidden";
    document.getElementById("PlayAgain").style.visibility = "hidden";
    DeathDOM.classList.remove("Start");
    DeathDOM.style.display = "none";
    DeathDOM.style.opacity = "0";


    LastFrameTime = performance.now();
    playerSpriteDOM.style.imageSmoothingEnabled = false; // idkkkkkkkkkkkkkkkkkkkkkkkkkkkk
    GameLoopId = GameLoop(0);

    // reset score display
    

}

// Restart 
function ResetGame() {
    cancelAnimationFrame(GameLoopId);
    GameStarted = false;
    HideMenuAndShowGame(false);

    const btn = document.getElementById("StartButton");
    btn.style.display = "block";
    btn.disabled = false;

    const btn2 = document.getElementById("ResetGame");
    btn2.style.display = "none";
    btn2.disabled = true;
    btn2.blur();

    Player.Score = 0;
    Player.Velocity = 0;
    Player.PositionBottom = floorHeight;
    Player.updateVisuals();
}

// to jump or duck
document.addEventListener('keydown', function (event) {
    if (!GameStarted || event.repeat || Player.Dead) return;
    var key = event.key;
    var code = event.code;
    if (code == "Space") { // ynagz
        if (Player.OnGround) {
            Player.Velocity = 1000; // valeur 3ejbetni
            Player.OnGround = false;
            playerSpriteDOM.classList.remove("Duck", "Standing");
            playerSpriteDOM.classList.add("JumpAndRotate");
            playerHitBoxDOM.classList.remove("Duck", "Standing");
            playerHitBoxDOM.classList.add("JumpAndRotate");
        }
    }
    if (code == "ArrowDown") {//duck
        if (Player.OnGround && !Player.Ducking) { 
            Player.Ducking = true;
            playerSpriteDOM.classList.add("Duck");
            playerSpriteDOM.classList.remove("Standing");
            playerHitBoxDOM.classList.add("Duck");
            playerHitBoxDOM.classList.remove("Standing");

        }
    }
}
)




document.addEventListener('keyup', function (event) {
    if (Player.Ducking && event.code == "ArrowDown") {
        Player.Ducking = false;
        playerSpriteDOM.classList.remove("Duck");
        playerSpriteDOM.classList.add("Standing");
        playerHitBoxDOM.classList.remove("Duck");
        playerHitBoxDOM.classList.add("Standing");
    }
}
)

