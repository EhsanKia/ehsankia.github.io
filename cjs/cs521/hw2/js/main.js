/// <reference path="engine.ts" />
/// <reference path="ref/keyboardjs.d.ts" />
/// <reference path="ref/dat.gui.d.ts" />
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var w, h;
var game;
var gui;

// Resizes canvas to fill the whole screen
window.onload = window.onresize = function () {
    // Keeps aspect ratio of 2:1
    w = Math.min(window.innerWidth, window.innerHeight * 2);
    h = w / 2;
    cvs.setAttribute("width", w + "px");
    cvs.setAttribute("height", h + "px");
    cvs.style.marginLeft = (-w / 2) + "px";

    // Flips canvas to have proper axis
    ctx.translate(0, h);
    ctx.scale(1, -1);
};

var lastTime = new Date().getTime();
function animate() {
    // Computes elapsed time since last frame
    var timeNow = new Date().getTime();
    var elapsed = (timeNow - lastTime) / 1e3;
    lastTime = timeNow;

    // Runs a frame of game
    game.step(elapsed);
    handleKeys();
    game.draw(ctx, w, h);

    // Request next frame
    requestAnimationFrame(animate);
}

var shooting = false;
function setupKeys() {
    // Shoot button
    KeyboardJS.on("space", function () {
        if (!shooting)
            game.shoot();
        shooting = true;
    }, function () {
        shooting = false;
    });

    // Restart button
    KeyboardJS.on("r", function () {
        game.generateTerrain();
    });
}

function handleKeys() {
    // Get a list of held down keys
    var active = KeyboardJS.activeKeys();

    // Cannon controls
    if (active.has("up"))
        game.cAngle += 0.02;
    if (active.has("down"))
        game.cAngle -= 0.02;
    game.cAngle = Math.max(Math.min(game.cAngle, Math.PI / 2), 0);

    if (active.has("right"))
        game.cForce += 0.02;
    if (active.has("left"))
        game.cForce -= 0.02;
    game.cForce = Math.max(Math.min(game.cForce, 1), 0.1);
}

// GUI for adjusting variables in real time
function setupGUI() {
    gui = new dat.GUI();

    var terrain = gui.addFolder('Terrain');
    var h = terrain.add(game, 'mHeight', 0.4, 0.8);
    terrain.add(game, 'wHeight', 0.0, 0.25);
    var d = terrain.add(game, 'detail', 0, 6).step(1);
    var r = terrain.add(game, 'roughness', 0, 2);
    terrain.add(game, 'generateTerrain');

    h.onChange(function () {
        game.generateTerrain();
    });
    d.onChange(function () {
        game.generateTerrain();
    });
    r.onChange(function () {
        game.generateTerrain();
    });

    var physic = gui.addFolder('Physics');
    physic.add(game, 'gravity', 0, 2);
    physic.add(game, 'friction', 0, 1);
    physic.add(game, 'restitution', 0, 1);
    physic.add(game, 'collisions');

    var perlin = gui.addFolder('Perlin Noise / Wind');
    perlin.add(game, "wEnabled");
    perlin.add(game, "wForce", 0.5, 2);
    perlin.add(game, "timeSpeed", 0, 1);
    perlin.add(game, "hVariation", 1, 6);

    var destruction = gui.addFolder('Destruction');
    destruction.add(game, "dEnabled");
    destruction.add(game, "dAmount", 0.5, 3);
}

// Runs when page is loaded and ready
// Starts the game engine
game = new Engine();
setupGUI();
setupKeys();
animate();
//# sourceMappingURL=main.js.map
