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
const BiomeImage = {
    grass: 'Resources/GreenGrassBlock.png',
    snow: 'Resources/snowy.png'
}
let Floors = [];
let GameLoopId;


//fps related variables 
let GameStarted = false;
let fpslimit = 144;
let interval = 1000 / fpslimit;
let LastFrameTime = 0;
let dt = 0;

// our entity class
class Entity {
    constructor(EntityId, Name, Image, Velocity) {
        this.EntityDOM = this.CreateEntity(EntityId, Image);
        this.Name = Name;
        this.PositionBottom = parseInt(window.getComputedStyle(this.EntityDOM).bottom);
        this.PositionTop = parseInt(window.getComputedStyle(this.EntityDOM).bottom) + parseInt(window.getComputedStyle(this.EntityDOM).height);
        this.PositionLeft = parseInt(window.getComputedStyle(this.EntityDOM).left);
        this.PositionRight = parseInt(window.getComputedStyle(this.EntityDOM).left) + parseInt(window.getComputedStyle(this.EntityDOM).width);
        this.Velocity = Velocity;

    }
    CreateEntity(EntityId, Image) {
        var entity = document.createElement("div");
        entity.setAttribute("id", EntityId);
        entity.style.backgroundImage = `url("${Image}")`;
        if (EntityId.includes("Floor")) {
            document.getElementById("Floor").appendChild(entity);
        } else {
            document.getElementById("Enemies").appendChild(entity);
        }
        return entity;
    }
    Deconstruct() {
        this.EntityDOM.parentNode.removeChild(this.EntityDOM);
        this.Name = null;
        this.PositionBottom = null;
        this.PositionLeft = null;
        this.PositionRight = null;
        this.PositionTop = null;
        this.Velocity = null;

    }
}

// our floor class
class Floor extends Entity {
    constructor(Name, Image, Velocity) {
        super(Name, Name, Image, Velocity);
    }
    reload() {              // to fix the zoom bug
        const css = window.getComputedStyle(this.EntityDOM);
        this.PositionBottom = parseInt(css.bottom);
        this.PositionTop = parseInt(css.bottom) + parseInt(css.height);
        this.PositionLeft = parseInt(css.left);
        this.PositionRight = parseInt(css.left) + parseInt(css.width);
    }
    ChangeImage(newImage) { // for different biomes
        this.EntityDOM.style.backgroundImage = `  url("${newImage}")  `;
    }
    ExpandFloor() {                 // for the animation when starting the game
        this.EntityDOM.classList.add("FloorExpanded");
        setTimeout(() => {          // tna7i el class ejdid ama trod el width 200vw  for cleaner css
            this.EntityDOM.classList.remove("FloorExpanded");
            this.EntityDOM.style.width = "200vw";
            this.EntityDOM.style.transition = "";
        }, 1000);
    }
    MoveFloor(seconds){
        this.PositionLeft -= this.Velocity*seconds;
        this.PositionRight -= this.PositionLeft +  this.EntityDOM.offsetWidth;
        this.EntityDOM.style.left = this.PositionLeft + "px"
        
    }

};

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
    ApplyPhysics(seconds){
        this.Velocity += g * seconds;
        this.PositionBottom += Player.Velocity * seconds;
    },
    AddScore(toAdd){
        this.Score += toAdd ;
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



// runs each frame
function UpdateGame(dt) {
    // calcul physique
    const seconds = dt / 1000;
    for (const f of Floors){
        f.MoveFloor(seconds);
        f.reload();
    }
    Player.ApplyPhysics(seconds);
    Player.AddScore(seconds*10); // 10 score par seconde
    for (const f of Floors) {
        if (isColliding(Player, f)) {          // collision detection
            Player.PositionBottom = f.PositionTop;
            Player.Velocity = 0;
            if (!Player.OnGround) {
                Player.OnGround = true;
                playerDOM.classList.remove("JumpAndRotate");
            }
        }
    }
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
    const btn = document.getElementById("StartButton");
    btn.style.display = "none";
    btn.disabled = true;
    btn.blur();
    const btn2 = document.getElementById("ResetGame");
    btn2.style.display = "block";
    btn2.disabled = false;  
    HideMenuAndShowGame(true);
    Player.Score = 0;
    Player.Velocity = 0;
    Player.Ducking = false;
    Player.OnGround = true;
    GameStarted = true;

    //Floor management-----------
    Floors = [
        new Floor("Floor1", BiomeImage.grass, 200),
    ];
    Floors[0].ExpandFloor();
    console.log(Floors);
    //---------------------------
    LastFrameTime = performance.now();
    GameLoopId = GameLoop(0);

}

// Restart 
function ResetGame() {
    //for (const enemy of Enemies) {enemy.Deconstruct()};
    //Enemies = [];
    for (const floor of Floors) { floor.Deconstruct(); }
    Floors = [];
    HideMenuAndShowGame(false);
    const btn = document.getElementById("StartButton");
    btn.style.display = "block";
    btn.disabled = false;
    
    document.getElementById("ResetGame").style.display = "none";
    document.getElementById("ResetGame").disabled = true;
    document.getElementById("ResetGame").blur();

    Player.Score = 0;
    Player.Velocity = 0;
    Player.PositionBottom = 0;

    GameStarted = false;
}



// zooming or resizing window (khatr lzoom kent tbuggi)
window.addEventListener('resize', function (event) {
    for (const f of Floors) {
        f.reload();
    }
    Player.reload();
    if (Player.OnGround && Floors.length > 0) {
        Player.PositionBottom = Floors[0].PositionTop;
    }

})

// to jump or duck
document.addEventListener('keydown', function (event) {
    if (GameStarted) {
        var key = event.key;
        var code = event.code;
        console.log(playerDOM.classList);
        if (code == "Space") {
            // ynagz* 
            if (Player.OnGround == true) {
                Player.Velocity = 650; // valeur 3ejbetni
                Player.OnGround = false;
                playerDOM.classList.add("JumpAndRotate");
            }
        }else{
            if(code == "ArrowDown"){
                //duck
                if(Player.OnGround == true){
                    playerDOM.classList.add("Duck");
                    playerDOM.classList.remove("Standing");
                }
            }else{
                if(playerDOM.classList.contains("Duck")){
                    playerDOM.classList.remove("Duck");
                    playerDOM.classList.add("Standing");
                }
            }
        }
    }
}
)