//Global variables
var SCREEN = {w:800, h:400};
var GROUND = {0:400, 70:0, 95:25, 170:0, 690:120, 730:400, b:60};

var cvs, ctx, bc1, bx1, bc2, bx2;
var pKeys = {};
var KEYS = { //Key codes
    U: 38,
    L: 37,
    D: 40,
    R: 39,
    Z: 90,
    X: 88,
    C: 67,
    DEBUG: 69
};

var lastTime = new Date().getTime();
var elapsed;
var cycle = 0;

var sprInd = {};
sprInd.chars    = 0;
sprInd.pos      = {x:0, y:0};
sprInd.hilda    = {x:0, y:0};
sprInd.hippy    = {x:0, y:0};
sprInd.bracket  = {x:0, y:0};
sprInd.cursor   = 0;
sprInd.convPos  = "";
sprInd.listOS   = 0;

var size= {w:36,    h:48};
var pos = {x:220,   y:0};
var vel = {x:0,     y:0};

var jump = false;
var bPressed = false;
var charSelect = true;
var convMode = false;
var speechMode = false;

var gfxList = [ "chars", "bracket", "hilda", "hilda_nude", "studyRoom", "tableL", "tableR",
                "selector", "charMenu", "heart", "corner", "baby","hippy"];
var sndList = ["bgm","click","drugs","hurt","jump","peace","sex"];
var gfx = [];
var snd = [];

var hildaPos = {x:350, y:0};
var hildaTimer = 0;
var hildaFollow = false;
var hildaScared = false;

var hippyStart  = 550;
var hippyPos    = {x:550, y:0};
var hippyCyc    = 0;
var hippyTT     = 0;
var hippyHT     = 0;
var hippyDir    = 1;
var hippyHP     = 5;

var playerHT     = 0;
var playerHP     = 4;
var playerFroze  = false;

var babyPos = [];
var babyNum = 0;

var sTimer = 0;
var sWidth  = 6;
var sHeight  = 6;
var sState = 0;
var sLine = [0,0,0];
var sText = 0;

//Initializes canvas on load
window.onload = function(){
    cvs = document.getElementById('game-canvas');
    ctx = cvs.getContext('2d');
    cvs.setAttribute("width", SCREEN.w+"px");
    cvs.setAttribute("height", SCREEN.h+"px");
    cvs.style.display = "block";

    bc1 = document.createElement('canvas');
    bc1.width = size.h;
    bc1.height = size.h;
    bx1 = bc1.getContext('2d');
    bx1.fillStyle = '#FF0000';
    bx1.globalCompositeOperation = "destination-atop";

    bc2 = document.createElement('canvas');
    bc2.width = size.w;
    bc2.height = size.h;
    bx2 = bc2.getContext('2d');
    bx2.fillStyle = '#FF0000';
    bx2.globalCompositeOperation = "destination-atop";

    loadResources();
};

function loadResources(){

    //creates the loading screen
    ctx.font = '60px monospace';
    ctx.textAlign = "center";
    ctx.fillText("Loading", SCREEN.w/2, SCREEN.h/2 - 50);

    ctx.font = '30px monospace';
    ctx.textAlign = "right";
    ctx.fillText("GFX", SCREEN.w/2 - 110, SCREEN.h/2 + 15);
    ctx.fillText("SND", SCREEN.w/2 - 110, SCREEN.h/2 + 85);

    //Progress bar
    ctx.fillRect( SCREEN.w/2 - 100, SCREEN.h/2 - 20, 200, 50 );
    ctx.clearRect( SCREEN.w/2 - 90, SCREEN.h/2 - 10, 180, 30 );
    ctx.fillRect( SCREEN.w/2 - 100, SCREEN.h/2 + 50, 200, 50 );
    ctx.clearRect( SCREEN.w/2 - 90, SCREEN.h/2 + 60, 180, 30 );

    //Load all graphics
    for (var i=0; i<gfxList.length; i++){
        gfx[ gfxList[i] ] = new Image();
        gfx[ gfxList[i] ].onload = addProgressGFX;
        gfx[ gfxList[i] ].src = "gfx/" + gfxList[i] + ".png";
    }

    //Load all sounds
    for (i=0; i<sndList.length; i++){
        snd[ sndList[i] ] = document.createElement('audio');
        snd[ sndList[i] ].addEventListener("loadeddata", addProgressSND);
        snd[ sndList[i] ].src = "snd/" + sndList[i] + ".ogg";
    }

    //Extra sound options
    snd['bgm'].loop = true;
    snd['jump'].volume = 0.25;
    snd['hurt'].volume = 0.50;

    var progGFX = 0;
    var progSND = 0;
    function addProgressGFX(){ //Fills progress bar each time an image is loaded
        var d = 160/(gfxList.length*3);
        var x = SCREEN.w/2 - 80 + d * 3 * progGFX;
        ctx.fillRect( x, SCREEN.h/2 - 5, d*2 , 20 );
        if (++progGFX + progSND == gfxList.length + sndList.length){
            animate();
            snd['bgm'].play();
            //toggleMute(); //DEBUG, REMOVE LATER
        }
    }

    function addProgressSND(){ //Fills progress bar each time an image is loaded
        var d = 160/(sndList.length*3);
        var x = SCREEN.w/2 - 80 + d * 3 * progSND;
        ctx.fillRect( x, SCREEN.h/2 + 65, d*2 , 20 );
        if (++progSND + progGFX == gfxList.length + sndList.length){
            animate();
            snd['bgm'].play();
            //toggleMute(); //DEBUG, REMOVE LATER
        }
    }
}

function animate(){
    window.requestAnimationFrame( animate );

    //Computes time delta
    var timeNow = new Date().getTime();
    elapsed = timeNow - lastTime;

    if ( charSelect )
        charMenu();

    else{
        draw();
        handleBaby();
        handleHilda();

        if (hippyHP>0 || hippyHT > 0)
            handleHippy();

        if ( convMode )
            handleConversation();

        else if ( speechMode )
            handleSpeech();

        else if (!playerFroze){
            handleKeys();
            handleMovement();
            handleSprite();
        }
    }


    lastTime = timeNow;
}

document.onkeydown = function (e) {
    pKeys[e.keyCode] = true;
    if (e.keyCode == KEYS.DEBUG)  sprInd.chars = (sprInd.chars+1)%7;
};
document.onkeyup = function (e) {
    pKeys[e.keyCode] = false;
};

function handleConversation(){
    var listSize = 4;
    var bracketTop = 0;
    var convText = { h:["talk", "command", "inventory", "exit"],
                     h0:["stand aside","madam, i am on a quest", "i will wear your skin","more..."],
                     h1:["undress","follow","stay","make babyabed"],
                     h01:["for your hand","weapons and upgrades","thrown of hawkthorne","i am done with you"],
                     h03:["egg treatment","blue poultry","the chicken lady","forest fungus","wild children","trippy potions","pharmacist","sawing small trees","carpenter camps","broken swords","giant rock monster","frog prescriptions","vision medication","brick vouchers","extra large swords","spacetime rpg","frog extinction","ostrich","other parrot","anglerfish","seal","spider","snake","parrot","swordfish","rhino","magic carpet","rocket ship","albatross","ladder bug","hidden pipe","subcon vase","magic flute","star zone","rashes","zits pimples","dark queen","mechanical","stoneship","channel wood","space ship","fly on a bird","cinnamon island","seal along the shore","black lightning","hornet shredder","avenger","wing hat","magic feather","raccoon clothes","running jump","collect all blue coins","island of annoying voices","hot tub end boss","mustached mushroom","bell toss","charged fireball","time bombs","rock punch","blue fire","green fire","purple fire","boring regular old fire","flying war ships","clown face helicopter","teeter totter flying floor","unstable bath","impervious to lava","underwater exploration","hover puppy","giant ant dance club","good karma quests","fun murder quests","unkillable beras","antiphysics horse","bubble attack","leaf attack","time freeze attack","metal blade attack","nevermind"]};
    if (sprInd.chars == 2)
        sprInd.bracket.y = 1;

    if ( !pKeys[KEYS.Z] )
        sprInd.pos.x = 0;

    if ( pKeys[ KEYS.X ] && cycle >= 800 && !bPressed ){
        if (sprInd.convPos == "h")
            cycle = -800;
        else{
            sprInd.convPos = sprInd.convPos.slice(0,-1);
            sprInd.cursor = 0;
        }

        snd['click'].currentTime = 0;
        snd['click'].play();
    }

    if (cycle < 800){
        sprInd.bracket.x = Math.floor(Math.abs(cycle)/100);
        if ( sign(cycle) != sign(cycle+elapsed) )
            convMode = false;
        cycle += elapsed;
    }
    else{
        ctx.font = '8px minecraftia';
        ctx.textAlign = "right";
        ctx.fillStyle = "black";

        if ( convText[sprInd.convPos].length > 4 ){
            listSize = 16;
            bracketTop = -135;

            if ( pKeys[KEYS.U] && !bPressed ){
                if (sprInd.cursor == 0)
                    sprInd.listOS = sprInd.listOS+convText[sprInd.convPos].length-4;
                else
                    sprInd.cursor--;
            }

            if ( pKeys[KEYS.D] && !bPressed ){
                if (sprInd.cursor == 15)
                    sprInd.listOS += 4;
                else
                    sprInd.cursor++;
            }


            ctx.drawImage(  gfx['bracket'],
                16 * size.w, 0, size.w, 2 * size.h,
                hildaPos.x - size.w/2, SCREEN.h - (hildaPos.y + 2.25*size.h + GROUND.b + 45), size.w, 2*size.h);
            ctx.drawImage(  gfx['bracket'],
                16 * size.w, 0, size.w, 2 * size.h,
                hildaPos.x - size.w/2, SCREEN.h - (hildaPos.y + 2.25*size.h + GROUND.b + 90), size.w, 2*size.h);
            ctx.drawImage(  gfx['bracket'],
                16 * size.w, 0, size.w, 2 * size.h,
                hildaPos.x - size.w/2, SCREEN.h - (hildaPos.y + 2.25*size.h + GROUND.b + 135), size.w, 2*size.h);
        }
        else {
            if ( pKeys[KEYS.U] && !bPressed )
                sprInd.cursor = (sprInd.cursor+3)%4;

            if ( pKeys[KEYS.D] && !bPressed )
                sprInd.cursor = (sprInd.cursor+1)%4;
        }


        for (var i=0; i<listSize; i++){
            ctx.fillText( convText[sprInd.convPos][(sprInd.listOS+i)%convText[sprInd.convPos].length],
                hildaPos.x - size.w/2,
                SCREEN.h - (hildaPos.y + 2.25*size.h + GROUND.b) + bracketTop + 17 + i*11 );
        }

        var textDim = ctx.measureText(convText[sprInd.convPos][(sprInd.listOS+sprInd.cursor)%convText[sprInd.convPos].length]);
        ctx.drawImage( gfx['heart'], hildaPos.x - size.w/2 - textDim.width - 11,
            SCREEN.h - (hildaPos.y + 2.25*size.h + GROUND.b) + bracketTop + 11 + sprInd.cursor*11 );

        if ( pKeys[KEYS.Z] || sTimer > 0 ){
            ctx.strokeRect( hildaPos.x - size.w/2 - textDim.width - 2.5,
                SCREEN.h - (hildaPos.y + 2.25*size.h + GROUND.b) + bracketTop + 7.5 + sprInd.cursor*11,
                textDim.width + 4, 12);
            ctx.fillStyle = "white";
            ctx.fillText( convText[sprInd.convPos][sprInd.cursor],
                hildaPos.x - size.w/2,
                SCREEN.h - (hildaPos.y + 2.25*size.h + GROUND.b) + bracketTop + 17 + sprInd.cursor*11 );

            if ( !bPressed ){
                snd['click'].currentTime = 0;
                snd['click'].play();
                sTimer = 250;
            }
        }

        bPressed = pKeys[KEYS.U] || pKeys[KEYS.D] || pKeys[KEYS.Z] || pKeys[KEYS.X] || sTimer > 0;
        if (sTimer > 0){
            if ( sign(sTimer - elapsed) != sign(sTimer) ){
                sprInd.convPos += sprInd.cursor;
                if ( !(sprInd.convPos in convText) ){
                    cycle = -800;
                    handleAction( sprInd.convPos );
                }
                sprInd.cursor = 0;
                sprInd.listOS = 0;
            }
            sTimer -= elapsed;
        }
    }
}

function handleAction( action ){
    sState = 0;
    sText = 0;
    switch( action ){
        case "h00":
            setTimeout( function(){ hildaPos.x -= 2 * (hildaPos.x - pos.x) } , 1000);
            break;

        case "h010":
            speechMode = true;
            hildaScared = false;
            break;

        case "h011":
            speechMode = true;
            break;

        case "h012":
            speechMode = true;
            break;

        case "h02":
            speechMode = true;
            hildaScared = true;
            break;

        case "h10":
            gfx['hilda'] = gfx['hilda_nude']
            break;

        case "h11":
            hildaFollow = true;
            break;

        case "h12":
            hildaFollow = false;
            break;

        case "h13":
            if (!hildaScared){
                setTimeout( function(){ sprInd.hilda.x = 6 } , 1000);
                setTimeout( function(){
                    sprInd.hilda.x = 0;
                    hildaPos.x += 30*sign(hildaPos.x-pos.x);
                    if ( getHeight(hildaPos.x) != hildaPos.y )
                        hildaPos.x -= 30*sign(hildaPos.x-pos.x);
                    babyPos[babyNum] = {x:(pos.x+hildaPos.x)/2, y:0};
                    babyNum++;
                    } , 1500);
            }
            break;

    }
}

function handleSpeech(){
    var speech = {  h012:   [["The throne is in","Castle Hawkthorne,","north of here..."],
                            ["You unlock the cas-","tle with the white","crystal of discipline"],
                            ["which you must","free from the", "black caverns."]],
                    h02:    [["D:","",""]],
                    h010:   [[":D","",""]],
                    h011:   [["Try pressing F13!","",""]]};


    var cx = SCREEN.w / 2;
    var cy = SCREEN.h / 4;


    switch( sState ){
        case 0:
            if ( sHeight < 50 )
                sHeight += elapsed/5;
            else if (sWidth < 120)
                sWidth += elapsed/5;
            else
                sState = 1;
            break;

        case 1:
            if ( pKeys[KEYS.Z] && !bPressed ){
                snd['click'].currentTime = 0;
                snd['click'].play();
                sState = 2;
            }

            if ( sLine[2] == speech[sprInd.convPos][sText][2].length )
                sState = 2;

            else{
                for (var i=0; i<3; i++){
                    if ( sLine[i] != speech[sprInd.convPos][sText][i].length ){
                        sLine[i]++;
                        break;
                    }
                }
            }

            break;
        case 2:
            for (i=0; i<3; i++)
                sLine[i] = speech[sprInd.convPos][sText][i].length;

            if ( pKeys[KEYS.Z] && !bPressed ){
                sLine = [0,0,0];
                snd['click'].currentTime = 0;
                snd['click'].play();
                if (sText == speech[sprInd.convPos].length-1)
                    sState = 3;
                else{
                    sText++;
                    sState = 1;
                }
            }

            break;
        case 3:
            if (sWidth > 7)
                sWidth -= elapsed/5;
            else if ( sHeight > 6 )
                sHeight -= elapsed/5;
            else
                speechMode = false;
            break;
    }

    bPressed = pKeys[KEYS.Z];

    ctx.fillStyle = "black";
    ctx.fillRect( cx - sWidth/2 - 1, cy - sHeight/2 - 1, sWidth + 2, sHeight + 2);
    ctx.fillStyle = "rgb(128,20,128)";
    ctx.fillRect( cx - sWidth/2, cy - sHeight/2, sWidth, sHeight);
    ctx.fillStyle = "rgb(22,22,22)";
    ctx.fillRect( cx - sWidth/2 + 1, cy - sHeight/2 + 1, sWidth - 2, sHeight - 2);

    ctx.drawImage( gfx['corner'], cx - sWidth/2 - 3, cy - sHeight/2 - 3);
    ctx.drawImage( gfx['corner'], cx + sWidth/2 - 3, cy - sHeight/2 - 3);
    ctx.drawImage( gfx['corner'], cx - sWidth/2 - 3, cy + sHeight/2 - 3);
    ctx.drawImage( gfx['corner'], cx + sWidth/2 - 3, cy + sHeight/2 - 3);

    ctx.fillStyle = "white";
    ctx.font = '8px minecraftia';
    ctx.textAlign = "left";
    ctx.fillText(speech[sprInd.convPos][sText][0].slice(0,sLine[0]), cx - sWidth/2 + 8, cy - sHeight/4 + 2);
    ctx.fillText(speech[sprInd.convPos][sText][1].slice(0,sLine[1]), cx - sWidth/2 + 8, cy             + 2);
    ctx.fillText(speech[sprInd.convPos][sText][2].slice(0,sLine[2]), cx - sWidth/2 + 8, cy + sHeight/4 + 2);
}

function handleKeys(){
    var acl = 0.002;
    var dec = 0.006;
    var max = 0.3;
    var frc = 0.002;
    var jmp_max = 0.9;
    var jmp_min = 0.3;
    var grv = 0.003;

    //Use on Hilda
    if (pKeys[ KEYS.Z ] && pos.y == 0)
        if ( ( pos.x > hildaPos.x && pos.x - hildaPos.x < 30 && sprInd.pos.y%2 == 0) ||
             ( pos.x < hildaPos.x && hildaPos.x - pos.x < 30 && sprInd.pos.y%2 == 1)){
            snd['click'].currentTime = 0;
            snd['click'].play();
            cycle = 1;
            sprInd.cursor = 0;
            sprInd.convPos = "h";
            convMode = true;
        }


    // Jump if on ground
    if ( pKeys[KEYS.U] && !jump && pos.y == getHeight(pos.x) ){
        vel.y = jmp_max;
        jump = true;

        //stops and plays jump sound
        snd['jump'].currentTime = 0;
        snd['jump'].play();
    }

    // cut jump short
    if( !pKeys[KEYS.U] && vel.y > jmp_min && jump)
        vel.y = jmp_min;


    //Force jump repress
    if ( !pKeys[KEYS.U] )
        jump = false;

    //gravity
    if (pos.y > getHeight(pos.x) ){
        acl = 0.04; //Change strafe speed in air
        vel.y -= grv * elapsed ;
    }

    //Left and right movement
    if ( pKeys[KEYS.L] ){
        if (vel.x > 0)
            vel.x -= dec * elapsed;
        else if (vel.x > -max){
            vel.x -= acl * elapsed;
            if (vel.x < -max)
                vel.x = -max;
        }
    }
    else if ( pKeys[KEYS.R] ){
        if (vel.x < 0)
            vel.x += dec * elapsed;
        else if (vel.x < max){
            vel.x += acl * elapsed;
            if (vel.x > max)
                vel.x = max;
        }
    }
    else{ //Friction
        vel.x -= Math.min( Math.abs(vel.x), frc * elapsed) * sign(vel.x);
    }

    if ( pKeys[KEYS.C]){
        charSelect = true;
		hippyHP = 5;
	}
}

function handleMovement(){

    pos.y += vel.y * elapsed; //Update y position

    if (pos.y < getHeight(pos.x)){ //hit ground
        pos.y = getHeight(pos.x);
        vel.y = 0;
    }

    var tmpX = pos.x + vel.x * elapsed; //tentative pos.x

    if ( getHeight(tmpX) <= pos.y) //checks if wall is hit
        pos.x = tmpX;
    else
        vel.x /= 10; //if it is, velocity is lost

}

function handleSprite(){
    cycle = (cycle + elapsed) % 600; //Cycle for sprite animation

    if (vel.x < 0){ //Facing left
        sprInd.pos.y = sprInd.chars * 2;
    }
    else if (vel.x > 0) //Facing right
        sprInd.pos.y = sprInd.chars * 2 + 1;

    if (pos.y > getHeight(pos.x)){
        if (vel.y > 0.2)
            sprInd.pos.x = 8;
        else if (vel.y < -0.2)
            sprInd.pos.x = 10;
        else
            sprInd.pos.x = 9;
    } //Jumping

    else{
        if (vel.x != 0)
            sprInd.pos.x = 1 + Math.floor(cycle/150) % 4; //Running animation
        else if ( pKeys[ KEYS.X ] )
            sprInd.pos.x = 5; //Talk
        else if ( pKeys[ KEYS.Z ] )
            sprInd.pos.x = 6; //Use
        else if ( pKeys[ KEYS.D ] )
            sprInd.pos.x = 7; //Look down
        else
            sprInd.pos.x = 0; //Rest
    }

}

function handleHilda(){
    if (hildaFollow && Math.abs(hildaPos.x - pos.x) > 50){
        var d = pos.x - hildaPos.x;
        d -= 50*sign(d);
        d /= 10;

        if ( getHeight(hildaPos.x+d) == hildaPos.y)
            hildaPos.x += d;
    }

    sprInd.hilda.y = 0 + (pos.x > hildaPos.x);

    if (hildaTimer <= 0 && sprInd.hilda.x != 6){
        if (hildaScared)
            sprInd.hilda.x = 4;
        else
            sprInd.hilda.x = (sState==1) * 2 * (Math.floor((sLine[0]+sLine[1]+sLine[2])/8)%2) ;
        if (Math.random() > 0.995){ //Probability of winking
            sprInd.hilda.x += 1; //Activate wink
            hildaTimer = 150; //Lasts 10 frames
        }
    }
    else
        hildaTimer -= elapsed; //Count frames

}

function handleBaby(){
    for (var i=0; i<babyNum; i++){
        if ((lastTime+i*43)%200<100)
            babyPos[i].y = 6;
        else
            babyPos[i].y = 0;
    }
}

function handleHippy(){
    var hippySpeech = ["drugs","peace","sex"];

    if ( Math.abs((hippyPos.x + hippyDir * elapsed/20)-hippyStart)>100 )
        hippyDir *= -1;

    hippyCyc = (hippyCyc + elapsed)%500;

    sprInd.hippy.y = 0 + (pos.x < hippyPos.x);

    if ( Math.abs(pos.x-hippyPos.x) < 25){
        if ( pos.y < size.h/4 ){
            sprInd.hippy.x = 4 + Math.floor(hippyCyc/250)%2;
            if ( playerHT <= 0 ){
                if ( playerHP > 0){
                    playerHT = 250;
                    playerHP--;
                    playerFroze = true;
                }
                else{
                    vel.x = 2*sign(pos.x - hippyPos.x)/3;
                    vel.y = 0.4;
                    playerHP = 4;
                    playerFroze = false;
                }

                snd['hurt'].currentTime = 0;
                snd['hurt'].play();
            }
        }
        else if (pos.y < 3*size.h/4){
            hippyHP--;
            hippyHT = 500;
            vel.y = 0.8;
            snd['jump'].currentTime = 0;
            snd['jump'].play();
            snd['hurt'].currentTime = 0;
            snd['hurt'].play();
        }
    }

    else if ( Math.abs(pos.x-hippyPos.x) < 75 && sprInd.hippy.y == sprInd.pos.y%2)
        sprInd.hippy.x = 4;
    else{
        sprInd.hippy.y = 0+(hippyDir<0);
        sprInd.hippy.x = 0 + Math.floor(hippyCyc/250)%2;
        hippyPos.x += hippyDir * elapsed/20;

        hippyTT += elapsed;
        if (hippyTT > 5000){
            snd[ hippySpeech[ Math.floor(Math.random()*3) ] ].play();
            hippyTT = 0;
        }
        else if (hippyTT < 250)
            sprInd.hippy.x += 2;
    }

    bx1.clearRect(0,0,bc1.width,bc1.height);
    bx2.clearRect(0,0,bc2.width,bc2.height);

    if (hippyHT > 0){
        if ( Math.floor(hippyHT/50)%2==0 ){
            bx1.fillRect(0,0,bc1.width,bc1.height);
            bx1.drawImage(  gfx['hippy'],
                sprInd.hippy.x * size.h, sprInd.hippy.y * size.h, size.h, size.h,
                0, 0, size.h, size.h);
        }
        hippyHT -= elapsed;
    }

    if (playerHT > 0){
        if ( Math.floor(playerHT/125)%2==0 ){
            bx2.fillRect(0,0,bc2.width,bc2.height);
            bx2.drawImage(  gfx['chars'],
                sprInd.pos.x * size.w, sprInd.pos.y * size.h, size.w, size.h,
                0, 0, size.w, size.h);
        }
        playerHT -= elapsed;
    }

}

function draw(){
    ctx.clearRect( 0, 0, SCREEN.w, SCREEN.h ); //Clear screen

    ctx.drawImage(  gfx['studyRoom'], 0, 0); //Background

    ctx.drawImage( gfx['tableR'], 85, 306); //Background table

    //Babies
    for (var i=0; i<babyNum; i++){
        ctx.drawImage(  gfx['baby'],
            0, (pos.x>babyPos[i].x) * size.h/2, size.w, size.h/2,
            babyPos[i].x - size.w/2, SCREEN.h - (babyPos[i].y + size.h/2 + GROUND.b), size.w, size.h/2)
    }

    //Hilda
    ctx.drawImage(  gfx['hilda'],
                    sprInd.hilda.x * size.w, sprInd.hilda.y * size.h, size.w, size.h,
                    hildaPos.x - size.w/2, SCREEN.h - (hildaPos.y + size.h + GROUND.b), size.w, size.h);

    //Conversation bracket
    ctx.drawImage(  gfx['bracket'],
        sprInd.bracket.x * 2 * size.w, sprInd.bracket.y * size.h, 2*size.w, size.h,
        hildaPos.x - size.w/2, SCREEN.h - (hildaPos.y + 2.25*size.h + GROUND.b), 2*size.w, size.h);

    if (hippyHP>0 || hippyHT > 0){
        //Draw hippy
        ctx.globalAlpha = 0+(hippyHP>0);
        ctx.drawImage(  gfx['hippy'],
            sprInd.hippy.x * size.h, sprInd.hippy.y * size.h, size.h, size.h,
            hippyPos.x - size.h/2, SCREEN.h - (hippyPos.y + size.h + GROUND.b), size.h, size.h);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(bc1,hippyPos.x - size.h/2, SCREEN.h - (hippyPos.y + size.h + GROUND.b));
        ctx.globalAlpha = 1;
    }

    //Draw character
    ctx.drawImage(  gfx['chars'],
                    sprInd.pos.x * size.w, sprInd.pos.y * size.h, size.w, size.h,
                    pos.x - size.w/2, SCREEN.h - (pos.y + size.h + GROUND.b), size.w, size.h);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(bc2, pos.x - size.w/2, SCREEN.h - (pos.y + size.h + GROUND.b));
    ctx.globalAlpha = 1;

    //Foreground table
    ctx.drawImage( gfx['tableL'], 85, 306);

}

function charMenu(){
    //Positions of the selector
    var selPos = [  {x:-64,     y:78 }, {x:-136,    y:148},
                    {x:-204,    y:218}, {x:-274,    y:288},
                    {x:407,     y:78 }, {x:478,     y:148},
                    {x:546,     y:218}, {x:618,     y:288} ];

    var names = ["JEFF WINGER","BRITTA PERRY","ABED NADIR","ANNIE EDISON","TROY BARNES","SHIRLEY BENNETT","PIERCE HAWTHORNE","???"];

    cycle = (cycle + elapsed) % 600; //Cycle for running animation

    //Moves around the menu
    if (!bPressed){
        if ( pKeys[KEYS.U] )
            sprInd.chars = (sprInd.chars+7)%8;

        if ( pKeys[KEYS.D] )
            sprInd.chars = (sprInd.chars+1)%8;

        if ( pKeys[KEYS.L] && sprInd.chars > 3)
            sprInd.chars = (sprInd.chars+4)%8;

        if ( pKeys[KEYS.R] && sprInd.chars < 4)
            sprInd.chars = (sprInd.chars+4)%8;
    }

    //Forces you to depress and repress arrow keys
    bPressed = pKeys[KEYS.U] || pKeys[KEYS.D] || pKeys[KEYS.L] || pKeys[KEYS.R];

    //Starts the game if Z or X is pressed and it's not on "insufficient friends"
    if ( (pKeys[KEYS.Z] || pKeys[KEYS.X]) && sprInd.chars != 7){
        sprInd.pos.x = 0;
        sprInd.pos.y = sprInd.chars;
        snd['click'].play();
        charSelect = false;
    }

    sprInd.pos.x = 1 + Math.floor(cycle/150) % 4;
    sprInd.pos.y = sprInd.chars*2 + 1;

    ctx.fillStyle = "#000";
    ctx.fillRect( 0, 0, SCREEN.w, SCREEN.h ); //Clear screen

    ctx.drawImage(  gfx['charMenu'], 0, 0); //Background

    ctx.fillStyle = "#fff";
    ctx.font = '30px minecraftia';
    ctx.textAlign = "center";
    ctx.fillText( names[sprInd.chars], SCREEN.w/2, SCREEN.h/7 );

    ctx.drawImage( gfx['selector'], selPos[sprInd.chars].x, selPos[sprInd.chars].y);

    //Draw running character
    ctx.drawImage(  gfx['chars'],
        sprInd.pos.x * size.w, sprInd.pos.y * size.h, size.w, size.h,
        SCREEN.w/2 - size.w - 8, SCREEN.h/2 + 16, size.w*2, size.h*2);

}

function getHeight(x){
    var keys = Object.keys(GROUND);
    for (var i=1; i < keys.length-1; i++){
        if ( keys[i] > x )
            return GROUND[ keys[i-1] ];
    }
    return GROUND[ keys[keys.length-2] ];
}

function toggleMute(){
    var keys = Object.keys(snd);
    for (var i=0; i < keys.length; i++)
        snd[keys[i]].muted = !snd[keys[i]].muted;
}

function sign(x) {
    if (x>0) return 1;
    else if (x<0) return -1;
    else return 0;
}

window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame        ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.oRequestAnimationFrame       ||
        window.msRequestAnimationFrame      ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();