// DOMs 
const playerDOM = document.getElementById("Player");
const floorDOM = document.getElementById("Floor");
const scoreDOM = document.getElementById("Score");
const menuDOM = document.getElementById("Menu");
const gameDOM = document.getElementById("Game");

// Constants 
const g = -1000;    //gravity 

//fps related variables 
let GameStarted = false;
let fpslimit = 144;
let interval = 1000 / fpslimit;
let lastFrameTimeMs = 0;
let dt = 0;

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

    }
};

// our floor
let Floor = {
    PositionBottom: parseInt(window.getComputedStyle(floorDOM).bottom), // initial position in pixels(computed from css) 
    PositionTop: parseInt(window.getComputedStyle(floorDOM).bottom) + parseInt(window.getComputedStyle(floorDOM).height),
    PositionLeft: -Infinity,
    PositionRight: Infinity,
    reload() {
        var FloorCSS = window.getComputedStyle(floorDOM);
        this.PositionBottom = parseInt(FloorCSS.bottom);
        this.PositionTop = parseInt(FloorCSS.bottom) + parseInt(FloorCSS.height);
    }
};

// zooming or resizing window (khatr lzoom kent tbuggi)
window.addEventListener('resize', function (event) {
    Floor.reload();
    Player.reload();
    if(Player.OnGround){
        Player.PositionBottom = Floor.PositionTop;
    }
})

// to make zooming in and out and resizing tabs work properly 
document.addEventListener('keydown', function (event) {
    console.log(Player.OnGround);
    if (GameStarted) {
        var key = event.key;
        var code = event.code;
        if (code == "Space") {
            // ynagz* 
            if (Player.OnGround == true) {
                Player.Velocity = 650; // valeur 3ejbetni
                Player.OnGround = false;
                playerDOM.classList.add("JumpAndRotate");
            }
        }
    }
}
)

function isColliding(a,b){
    return !( a.PositionRight < b.PositionLeft ||
        a.PositionLeft > b.PositionRight  ||
        a.PositionTop < b.PositionBottom  ||
        a.PositionBottom > b.PositionTop  
    );
}
function HideMenuAndShowGame(ok) {
    if (ok) {
        menuDOM.style.visibility = "hidden";
        gameDOM.style.visibility = "visible";
    } else {
        menuDOM.style.visibility = "visible";
        gameDOM.style.visibility = "hidden";
    }
}
function UpdateGame(dt) {
    // calcul physique
    const seconds = dt / 1000;
    Player.Velocity += g * seconds;
    Player.PositionBottom += Player.Velocity * seconds;

    // calcul score
    Player.Score += seconds * 10; // 10 score par seconde

    if (Player.PositionBottom <= Floor.PositionTop) {          // collision detection
        Player.PositionBottom = Floor.PositionTop;
        Player.Velocity = 0;
        if (!Player.OnGround) {
            Player.OnGround = true;
            playerDOM.classList.remove("JumpAndRotate");
        }
    }
    playerDOM.style.bottom = Player.PositionBottom + "px";    // For player jumping 
    scoreDOM.innerHTML = 'Score: ' + String(Math.round(Player.Score)).padStart(5, '0'); // Score 
}


// loop tcontrolli lframes bch mayfoutouch 144 fps w maydhay3ouch frames 
function GameLoop(TimeStamp) {
    if (TimeStamp < (lastFrameTimeMs + interval)) {
        requestAnimationFrame(GameLoop);
        return;
    }
    dt += TimeStamp - lastFrameTimeMs;
    lastFrameTimeMs = TimeStamp;
    while (dt >= interval) {
        // trajja3 eli je retard 
        UpdateGame(interval);
        dt -= interval;
    }
    requestAnimationFrame(GameLoop);
}


function StartGame() {
    HideMenuAndShowGame(true);
    document.getElementById("StartButton").disabled = true;
    GameStarted = true;
    lastFrameTimeMs = performance.now();
    GameLoop(0);
    floorDOM.classList.add("FloorExpanded");
    setTimeout(() => {      // tna7i el class ejdid ama trod el width 200vw  for cleaner css
        floorDOM.classList.remove("FloorExpanded");
        floorDOM.style.width = "200vw";
        floorDOM.style.transition = "none";
    }, 1000);
    console.log(Player);
}