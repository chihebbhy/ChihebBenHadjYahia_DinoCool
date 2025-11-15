// Bugs to fix : 
// zooming out shows the 
// Animation t3 kolchy
// HitBox is off when jumping 
//
// Features to add :
// Biomes.
// More speed over time
// Faster fall speed to look better
// Parallax background
// Enemies
// Trees, flowers ..


// DOMs 
const playerSpriteDOM = document.getElementById("PlayerSprite");
const playerHitBoxDOM = document.getElementById("PlayerHitBox");
const floorDOM = document.getElementById("Floor");
const scoreDOM = document.getElementById("Score");
const menuDOM = document.getElementById("Menu");
const gameDOM = document.getElementById("Game");
const BackgroundsDOM = document.getElementsByClassName("Background");

// Constants 
const g = -1000;                                     // gravity 
const BiomeImage = 'Resources/Extra/ground.png';     // biomes 
const floorHeight = 90;                              // self explanatory 
let floorSpeed = 300;                                // the speed that the floor goes by at
let PositionFloor = 0;                               // used to make the floor scroll by 
const speeds = [0, 50, 130, 200, 300];               // different speeds for different backgrounds
let backgroundOffsets = [0, 0, 0, 0, 0];             // backgrounds offsets


// fps related variables 
let GameStarted = false;
let fpslimit = 144;
let interval = 1000 / fpslimit;
let LastFrameTime = 0;
let dt = 0;
let GameLoopId;

// our player
let Player = {
    PositionBottom: parseInt(window.getComputedStyle(playerHitBoxDOM).bottom), // position bl bottom
    PositionTop: parseInt(window.getComputedStyle(playerHitBoxDOM).bottom) + parseInt(window.getComputedStyle(playerHitBoxDOM).height), // position top = bottom + kobr tswire(height)
    PositionLeft: parseInt(window.getComputedStyle(playerHitBoxDOM).left),
    PositionRight: parseInt(window.getComputedStyle(playerHitBoxDOM).left) + parseInt(window.getComputedStyle(playerHitBoxDOM).width),
    Velocity: 0,
    Ducking: false,
    OnGround: true,
    Score: 0,
    reload() {
        var PlayerCSS = window.getComputedStyle(playerHitBoxDOM);
        this.PositionBottom = parseInt(PlayerCSS.bottom);
        this.PositionTop = parseInt(PlayerCSS.bottom) + parseInt(PlayerCSS.height);
        this.PositionLeft = parseInt(PlayerCSS.left);
        this.PositionRight = parseInt(PlayerCSS.left) + parseInt(PlayerCSS.width);

    },
    ApplyPhysics(seconds) {
        this.Velocity += g * seconds;
        this.PositionBottom += Player.Velocity * seconds;
        if (this.PositionBottom <= floorHeight) {
            this.PositionBottom = floorHeight;
            this.Velocity = 0;
            this.OnGround = true;
            playerSpriteDOM.classList.remove("JumpAndRotate");
            playerHitBoxDOM.classList.remove("JumpAndRotate");
            if (!playerSpriteDOM.classList.contains("Standing") && !Player.Ducking) {
                playerSpriteDOM.classList.add("Standing");
                playerHitBoxDOM.classList.add("Standing");
            }
        }
        this.updateVisuals();

    },
    AddScore(toAdd) {
        this.Score += toAdd;
    },
    updateVisuals() {
        playerHitBoxDOM.style.bottom = this.PositionBottom + 20 + "px"; // 20 mta3 hitbox bch ykoun wst sprite
        playerSpriteDOM.style.bottom = this.PositionBottom + "px";
    },
};

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
        while (backgroundOffsets[i] <= -n) {
            backgroundOffsets[i] += n;
        }
        BackgroundsDOM[i].style.backgroundPositionX = backgroundOffsets[i] + "px";
    }

}

// runs each frame
function UpdateGame(dt) {
    // calcul physique
    const seconds = dt / 1000;
    Player.ApplyPhysics(seconds);
    UpdateFloor(seconds);
    UpdateBackground(seconds);
    Player.AddScore(seconds * 10); // 10 score par seconde
    scoreDOM.innerHTML = 'Score: ' + String(Math.round(Player.Score)).padStart(5, '0'); // Score 
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
    Player.PositionBottom = floorHeight;
    floorSpeed = 300;
    PositionFloor = 0;
    GameStarted = true;
    LastFrameTime = performance.now();
    playerSpriteDOM.style.imageSmoothingEnabled = false; // idkkkkkkkkkkkkkkkkkkkkkkkkkkkk
    GameLoopId = GameLoop(0);

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
    if (!GameStarted || event.repeat) return;
    var key = event.key;
    var code = event.code;
    if (code == "Space") {
        // ynagz
        if (Player.OnGround) {
            Player.Velocity = 800; // valeur 3ejbetni
            Player.OnGround = false;
            playerSpriteDOM.classList.remove("Duck", "Standing");
            playerSpriteDOM.classList.add("JumpAndRotate");
            playerHitBoxDOM.classList.remove("Duck", "Standing");
            playerHitBoxDOM.classList.add("JumpAndRotate");
        }


    }
    if (code == "ArrowDown") {
        //duck
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