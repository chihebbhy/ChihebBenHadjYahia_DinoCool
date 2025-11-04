// DOMs 
const playerDOM = document.getElementById("Player");
const floorDOM = document.getElementById("Floor");
const scoreDOM = document.getElementById("Score");
// Constants 
const g = -1000;//gravity 
const FloorLevel = parseInt(window.getComputedStyle(document.getElementById("Floor")).bottom) + 39; // 39 = kobr limage - decalage li says fl image t3 joueur 

//fps related variables 
let GameStarted = false;
let fpslimit = 144;
let interval = 1000 / fpslimit;
let lastFrameTimeMs = 0;
let dt = 0;

// our player
let Player = {
    Position: parseInt(window.getComputedStyle(document.getElementById("Player")).backgroundPositionX),// initial position in pixels(computed from css) 
    Velocity: 0,
    Ducking: false,
    OnGround: true,
    Score: 0,
};

document.addEventListener('keydown', function (event) {
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

function UpdateGame(dt) {
    // calcul physique
    const seconds = dt / 1000;
    Player.Velocity += g * seconds;
    Player.Position += Player.Velocity * seconds;

    // calcul score
    Player.Score += seconds * 10; // 10 score par seconde

    if (Player.Position <= FloorLevel) { // collision detection
        Player.Position = FloorLevel ;
        Player.Velocity = 0;
        if (!Player.OnGround) { 
            Player.OnGround = true;
            playerDOM.classList.remove("JumpAndRotate");
        }
    }
    playerDOM.style.bottom = Player.Position + "px"; // For player jumping 
    scoreDOM.innerHTML = 'Score: ' + String(Math.round(Player.Score)).padStart(5, '0'); // for moving floors 
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
    document.getElementById("StartButton").disabled = true;
    GameStarted = true;
    lastFrameTimeMs = performance.now();
    GameLoop(0);
    floorDOM.classList.add("FloorExpanded");
    setTimeout(() => { // tna7i el class ejdid ama trod el width 200vw  for cleaner css
        floorDOM.classList.remove("FloorExpanded");
        floorDOM.style.width = "200vw";
        floorDOM.style.transition = "none";
    }, 1000);
}