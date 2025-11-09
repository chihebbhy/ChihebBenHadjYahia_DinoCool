// Bugs to fix : 
// when restarting GameLoop keeps running and player falls
// Animation t3 kolchy

// Features to add :
// Biomes.
// More speed over time


// DOMs 
const playerDOM = document.getElementById("Player");
const floorDOM = document.getElementById("Floor");
const scoreDOM = document.getElementById("Score");
const menuDOM = document.getElementById("Menu");
const gameDOM = document.getElementById("Game");

// Constants 
const g = -1000;    //gravity 
const BiomeImage = 'Resources/ground.png';
const floorHeight = 90;
let floorSpeed = 300;
let PositionFloor = 0;


//fps related variables 
let GameStarted = false;
let fpslimit = 144;
let interval = 1000 / fpslimit;
let LastFrameTime = 0;
let dt = 0;
let GameLoopId;

// our player
let Player = {
    PositionBottom: parseInt(window.getComputedStyle(playerDOM).bottom), // position bl bottom
    PositionTop: parseInt(window.getComputedStyle(playerDOM).bottom) + parseInt(window.getComputedStyle(playerDOM).height), // position top = bottom + kobr tswire(height)
    PositionLeft: parseInt(window.getComputedStyle(playerDOM).left),
    PositionRight: parseInt(window.getComputedStyle(playerDOM).left) + parseInt(window.getComputedStyle(playerDOM).width),
    Velocity: 0,
    Ducking: false,
    OnGround: true,
    Score: 0,
    reload() {
        var PlayerCSS = window.getComputedStyle(playerDOM);
        this.PositionBottom = parseInt(PlayerCSS.bottom);
        this.PositionTop = parseInt(PlayerCSS.bottom) + parseInt(PlayerCSS.height);
        this.PositionLeft = parseInt(PlayerCSS.left);
        this.PositionRight = parseInt(PlayerCSS.left) + parseInt(PlayerCSS.width);

    },
    ApplyPhysics(seconds) {
        this.Velocity += g * seconds;
        this.PositionBottom += Player.Velocity * seconds;
        if (this.PositionBottom - floorHeight <= 0) {
            this.PositionBottom = floorHeight;
            this.Velocity = 0;
            this.OnGround = true;
            playerDOM.classList.remove("JumpAndRotate");
            if (!playerDOM.classList.contains("Standing")) {
                playerDOM.classList.add("Standing");
            }
        }
    },
    AddScore(toAdd) {
        this.Score += toAdd;
    }
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

// runs each frame
function UpdateGame(dt) {
    // calcul physique
    const seconds = dt / 1000;
    Player.ApplyPhysics(seconds);
    UpdateFloor(seconds);
    Player.AddScore(seconds * 10); // 10 score par seconde
    playerDOM.style.bottom = Player.PositionBottom + "px";    // For player jumping 
    scoreDOM.innerHTML = 'Score: ' + String(Math.round(Player.Score)).padStart(5, '0'); // Score 
}


// loop tcontrolli lframes bch mayfoutouch 144 fps w maydhay3ouch frames 
function GameLoop(TimeStamp) {
    if (TimeStamp < (LastFrameTime + interval)) {
        requestAnimationFrame(GameLoop);
        return;
    }
    dt += TimeStamp - LastFrameTime;
    LastFrameTime = TimeStamp;
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

    console.log(Floor);
    LastFrameTime = performance.now();
    playerDOM.style.imageSmoothingEnabled = false;
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
    Player.PositionBottom = 0;
    playerDOM.style.bottom = floorHeight + "px";
}



// prevent zooming
document.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) { // Ctrl for Windows/Linux, Cmd for macOS
        e.preventDefault();
    }
},
    { passive: false }
);


// to jump or duck
document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')) {
        event.preventDefault();
    }; // prevent zooming
    console.log(event.code);
    if (GameStarted) {
        var key = event.key;
        var code = event.code;
        console.log(code);
        if (code == "Space") {
            // ynagz
            if (Player.OnGround == true) {
                Player.Velocity = 800; // valeur 3ejbetni
                Player.OnGround = false;
                if (playerDOM.classList.contains("Duck")) {
                    playerDOM.classList.remove("Duck");
                }
                if (playerDOM.classList.contains("Standing")) {
                    playerDOM.classList.remove("Standing");
                }

                playerDOM.classList.add("JumpAndRotate");
            }
        } else {
            if (code == "ArrowDown") {
                //duck
                if (Player.OnGround == true) {
                    Player.Ducking = true;
                    playerDOM.classList.add("Duck");
                    if (playerDOM.classList.contains("Standing")) {
                        playerDOM.classList.remove("Standing");
                    }
                }
            }
        }
    }
}
)

document.addEventListener('keyup', function (event) {
    if (Player.Ducking && event.code == "ArrowDown") {
        Player.Ducking = false;
        playerDOM.classList.remove("Duck");
        playerDOM.classList.add("Standing");
    }
}
)