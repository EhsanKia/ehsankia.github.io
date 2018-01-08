/// <reference path="ref/keyboardjs.d.ts" />
/// <reference path="ref/dat.gui.d.ts" />
/// <reference path="ref/peer.d.ts" />
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var w, h;
var game;
var gui;
var mParams;
var peer;

var MultiplayerData = (function () {
    function MultiplayerData() {
        this.yourID = "Loading...";
        this.peerID = "";
    }
    MultiplayerData.prototype.connect = function () {
        // Hackish way of changing gui button
        var f = gui.__folders.Multiplayer;
        var i = f.__controllers[5];
        f.__controllers.splice(5, 1);
        f.remove(i);
        f.add(mParams, "disconnect");

        // try connecting to peer and adding it as a player
        game.updateNetworkPlayer({ "connected": this.peerID });
    };

    MultiplayerData.prototype.disconnect = function (c) {
        var f = gui.__folders.Multiplayer;
        var i = f.__controllers[4];
        f.__controllers.splice(4, 1);
        f.remove(i);
        f.add(mParams, "connect");

        if (peer !== undefined) {
            for (var key in game.netPlayers) {
                if (!game.netPlayers.hasOwnProperty(key)) {
                    continue;
                }
                game.netPlayers[key].conn.send({ "disconnected": peer.id });
            }
            peer.disconnect();
        }

        // Reset network settings
        game.netPlayers = {};
        game.numPlayers = 1;
        setupP2P();
    };
    return MultiplayerData;
})();

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
    game.draw(ctx, h);

    // Request next frame
    requestAnimationFrame(animate);
}

function handleKeys() {
    // Get a list of held down keys
    var active = KeyboardJS.activeKeys();
    game.movePlayer(active.has("up"), active.has("right"), active.has("down"), active.has("left"));
}

// Add options to gui
function setupGUI() {
    gui = new dat.GUI();
    mParams = new MultiplayerData();

    var player = gui.addFolder("Player");
    player.add(game, "showPlayer");
    player.add(game, "mouseControl");
    var c = player.addColor(game.player, "playerColor");
    c.onChange(function (v) {
        game.updateNetworkColor(v);
    });

    var terrain = gui.addFolder("Terrain");
    terrain.add(game, "blockSize", 0.1, 0.4);
    terrain.add(game, "numSides", 3, 15).step(1);
    terrain.add(Polygon, "complexity", 0.2, 1);
    terrain.add(game, "drawBound");
    terrain.add(game, "createNewTerrain");

    var visiblity = gui.addFolder("Visibility");
    visiblity.add(game, "brightness", 0.2, 0.7);
    visiblity.add(game, "extraLights", 0, 40).step(4);
    visiblity.add(game, "fuzzyness", 0, 0.05);
    visiblity.add(game, "showVisibility");
    visiblity.add(game, "showLines");
    visiblity.add(game, "showLights");

    var flocking = gui.addFolder("Flocking");
    flocking.add(Flock, "numBirds", 0, 400).step(1);
    flocking.add(Flock, "castShadow");
    flocking.add(Flock, "initialize");
    var flock_params = flocking.addFolder("Parameters");
    flock_params.add(Flock, "NEIGHBOR_RADIUS", 0, 1);
    flock_params.add(Bird, "MAX_SPEED", 0.1, 1);
    flock_params.add(Bird, "MAX_FORCE", 0, 0.1);
    flock_params.add(Bird, "MIN_DIST", 0, 0.1);
    flock_params.add(Bird, "SEP_WEIGHT", 0, 5);
    flock_params.add(Bird, "ALIGN_WEIGHT", 0, 5);
    flock_params.add(Bird, "COHESION_WEIGHT", 0, 5);
    flock_params.add(Bird, "COLLISION_WEIGHT", 0, 5);

    var multiplayer = gui.addFolder("Multiplayer");
    multiplayer.add(game, "packetPerSec", 1, 60).step(1);
    multiplayer.add(game, "latency", 0, 500).step(10);
    multiplayer.add(Player, "interpolate");
    multiplayer.add(mParams, "yourID").listen().readOnly();
    multiplayer.add(mParams, "peerID");
    multiplayer.add(mParams, "connect");
}

function setupP2P() {
    // Connect to ICE/TURN server
    peer = new Peer({ key: "djz08k77pe0o1or" });
    peer.on("error", mParams.disconnect);
    peer.on("open", function (id) {
        mParams.yourID = id;
    });
    peer.on("connection", function (c) {
        var f = gui.__folders.Multiplayer;
        var i = f.__controllers[5];
        f.__controllers.splice(5, 1);
        f.remove(i);
        f.add(mParams, "disconnect");

        c.on("data", function (d) {
            game.updateNetworkPlayer(d);
        });
        c.on("open", function () {
            // Send new player the map and tell everyone they joined
            game.sendMap(c);
            game.broadcastJoin(c.peer);
            game.addNetworkPlayer(c, c.peer);
        });
        c.on("error", function () {
            game.removeNetworkPlayer(c.peer);
        });
        c.on("close", function () {
            game.removeNetworkPlayer(c.peer);
        });
    });
}

// Mouse control
cvs.onmousemove = function (e) {
    if (game.mouseControl) {
        cvs.style.cursor = "none";
        game.player.p.x = (e.clientX - cvs.offsetLeft) / h;
        game.player.p.y = 1 - (e.clientY - cvs.offsetTop) / h;
    } else {
        cvs.style.cursor = "normal";
    }
};

// Runs when page is loaded and ready
game = new Engine();
setupGUI();
setupP2P();
animate();
//# sourceMappingURL=main.js.map
