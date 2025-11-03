let Player; 
const g = -500;
let fpslimit = 144;
let interval = 1000/fpslimit;
let then = performance.now();   
let lastFrameTimeMs = 0;
let dt = 0;
//let defaultPosition = parseInt(window.getComputedStyle(document.getElementById("Player")).bottom);

document.addEventListener("DOMContentLoaded",() => { // Loading the page
    const playerDOM = document.getElementById("Player");
    Player = {
    Position : 0, // getComputedStyle ta9ra valeur lfinale khtr js maya9rach el css toul
    Velocity : 0,
    Ducking : false,
    OnGround : false,
    Score : 0
};

})

document.addEventListener('keydown',function(event){
    var key = event.key; 
    var code = event.code;
    var playerDOM = document.getElementById("Player");
    console.log('Pressed Key',key);
    console.log('Key Code',code);
    if(code == "Space"){ // ynagz
        console.log(Player.Position);
        Player.Velocity = 300;
        Player.OnGround = false;
    }

})

function UpdateGame(dt){
    Player.Velocity += g*(dt/1000);
    Player.Position += Player.Velocity*(dt/1000);
    if(Player.Position <=0){
        Player.Position = 0;
        Player.Velocity = 0;
        Player.OnGround = true;
    }

    document.getElementById("Player").style.bottom = Player.Position +"px";
    
    
}
// loop tcontrolli lframes bch mayfoutouch 144 fps w maydhay3ouch frames
function GameLoop(TimeStamp){
    if( TimeStamp < (lastFrameTimeMs + interval)){
        requestAnimationFrame(GameLoop);
        return;
    }
    dt += TimeStamp - lastFrameTimeMs;
    lastFrameTimeMs = TimeStamp;    
    while(dt >= interval){ // trajja3 eli je retard
        UpdateGame(interval);
        dt -= interval;
    }
    requestAnimationFrame(GameLoop);    
}
function StartGame(){
    requestAnimationFrame(GameLoop);
}