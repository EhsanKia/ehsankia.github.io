/// <reference path="utils.ts" />
/// <reference path="geometry.ts" />
/// <reference path="ref/peer.d.ts" />
var EPSILON = 1e-8;

var Engine = (function () {
    function Engine() {
        this.showPlayer = true;
        this.mouseControl = false;
        this.numSides = 8;
        this.blockSize = 0.3;
        this.drawBound = false;
        // Visibility
        this.brightness = 0.2;
        this.extraLights = 0;
        this.fuzzyness = 0.02;
        this.showVisibility = true;
        this.showLines = false;
        this.showLights = false;
        this.numPlayers = 1;
        this.latency = 0;
        this.packetPerSec = 20;
        this.timeCounter = 0;
        // Create player
        var center = new Vector(1.0, 0.5);
        this.player = new Player(center);
        this.netPlayers = {};
        this.createNewTerrain();
    }
    Engine.prototype.createNewTerrain = function () {
        if (!this.netPlayers.isEmpty()) {
            return;
        }

        // Create obstacles
        this.holes = [];
        var poly;
        var variance = (0.5 - this.blockSize) / 2;
        for (var x = 0.25; x < 2; x += 0.5) {
            for (var y = 0.25; y < 1; y += 0.5) {
                var xOff = x + Random.rand(-variance, variance);
                var yOff = y + Random.rand(-variance, variance);
                poly = Polygon.createSimple(this.numSides, xOff, yOff, this.blockSize);
                this.holes.push(poly);
            }
        }

        this.createDataStructures();
    };

    Engine.prototype.createDataStructures = function () {
        // Store geometry as segments
        this.segments = [];
        this.vertices = [];
        var points;
        var e;
        for (var j = 0; j < this.holes.length; j++) {
            points = this.holes[j].vertices;
            var n = points.length;
            for (var i = n; i--;) {
                e = new Edge(points[i], points[(i + 1) % n]);
                this.segments.push(e);
                this.vertices.push(points[i]);
            }
        }

        // Add room edges
        var v1 = new Vertex(0.0, 0.0);
        var v2 = new Vertex(0.0, 1.0);
        var v3 = new Vertex(2.0, 1.0);
        var v4 = new Vertex(2.0, 0.0);
        this.segments.push(new Edge(v1, v2));
        this.segments.push(new Edge(v2, v3));
        this.segments.push(new Edge(v3, v4));
        this.segments.push(new Edge(v4, v1));
        this.vertices.push(v1);
        this.vertices.push(v2);
        this.vertices.push(v3);
        this.vertices.push(v4);
    };

    // Steps the simulation with physics and collision
    Engine.prototype.step = function (h) {
        this.player.step(h);
        while (!this.handleCollision(this.player, h))
            ;
        this.player.updatePosition(h);
        this.sendNetworkPosition(h);
        for (var key in this.netPlayers) {
            if (!this.netPlayers.hasOwnProperty(key)) {
                continue;
            }
            this.netPlayers[key].updatePosition(h);
        }
        Flock.step(h);
    };

    // Update player direction
    Engine.prototype.movePlayer = function (up, right, down, left) {
        var d = new Vector(0, 0);
        d.x += right ? 1 : 0;
        d.x -= left ? 1 : 0;
        d.y += up ? 1 : 0;
        d.y -= down ? 1 : 0;
        this.player.dir = d;
    };

    // Draws the scene
    Engine.prototype.draw = function (ctx, s) {
        var vs;

        // Draw background
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, s * 2, s);

        // Compute and draw visibility polygon
        ctx.lineWidth = 1;
        this.drawVisibility(this.player, s);
        for (var key in this.netPlayers) {
            if (!this.netPlayers.hasOwnProperty(key)) {
                continue;
            }
            this.drawVisibility(this.netPlayers[key], s);
        }

        // Draw obstables
        ctx.lineWidth = 2;
        ctx.fillStyle = "#ddd";
        ctx.strokeStyle = "#999";
        for (var j = 0; j < this.holes.length; j++) {
            vs = this.holes[j].vertices;
            ctx.beginPath();
            ctx.moveTo(vs[0].x * s, vs[0].y * s);
            for (var i = vs.length; i--;) {
                ctx.lineTo(vs[i].x * s, vs[i].y * s);
            }
            ctx.fill();
            ctx.stroke();
        }

        // Draw bounding circle for obstacles
        if (this.drawBound) {
            var c;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#f00";
            for (var k = 0; k < this.holes.length; k++) {
                c = this.holes[k].boundingCircle;
                ctx.beginPath();
                ctx.arc(c.center.x * s, c.center.y * s, c.radius * s, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // Draw players
        if (this.showPlayer)
            this.player.draw(ctx, s);
        for (key in this.netPlayers) {
            if (!this.netPlayers.hasOwnProperty(key)) {
                continue;
            }
            this.netPlayers[key].draw(ctx, s);
        }

        // Draw the flock
        Flock.draw(ctx, s);

        // Draw border
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000";
        ctx.strokeRect(2, 2, s * 2 - 4, s - 4);
    };

    // Draws visibility polygon for player
    Engine.prototype.drawVisibility = function (player, s) {
        if (!this.showVisibility) {
            return;
        }

        // Compute color/opacity for visibility polygon
        var opacity = this.brightness / ((this.extraLights + 1) * this.numPlayers);
        var c = hexToRGB(player.playerColor);
        ctx.fillStyle = "rgba(" + c.r + "," + c.g + "," + c.b + "," + opacity + ")";
        this.drawVisPoly(player.p, s);

        // Draw extra offset vispolys for penumbra effect
        var p;
        for (var l = 0; l < this.extraLights; l++) {
            p = new Vector(player.p.x, player.p.y);
            p.x += this.fuzzyness * Math.cos(l / this.extraLights * 2 * Math.PI);
            p.y += this.fuzzyness * Math.sin(l / this.extraLights * 2 * Math.PI);
            this.drawVisPoly(p, s);
        }
    };

    Engine.prototype.drawVisPoly = function (pos, s) {
        // Get segments and vertices of the flock
        var newSegments = Flock.addSegments(this.segments);
        var newVertices = Flock.addVertices(this.vertices);

        // compute visibility polygon for given obstacles
        var visPoly = Visibility.computePolygon(pos, newSegments, newVertices);
        var vs = visPoly.vertices;

        // If we don't have at least a triangle, then don't draw anything
        if (vs.length < 3) {
            return;
        }

        // Fill polygon
        ctx.beginPath();
        ctx.moveTo(vs[0].x * s, vs[0].y * s);
        for (var i = vs.length; i--;) {
            ctx.lineTo(vs[i].x * s, vs[i].y * s);
        }
        ctx.fill();

        // Show extra light position
        if (this.showLights) {
            ctx.strokeStyle = "#aaa";
            ctx.beginPath();
            ctx.arc(pos.x * s, pos.y * s, 0.001 * s, 0, Math.PI * 2);
            ctx.stroke();
        }

        //Trace lines
        if (this.showLines && this.player.p === pos) {
            ctx.strokeStyle = "#090";
            for (var k = vs.length; k--;) {
                ctx.beginPath();
                ctx.moveTo(this.player.p.x * s, this.player.p.y * s);
                ctx.lineTo(vs[k].x * s, vs[k].y * s);
                ctx.stroke();
            }
        }
    };

    // Simple continious collision detection with the obstacles
    Engine.prototype.handleCollision = function (p, h) {
        var clean = true;
        for (var j = 0; j < this.segments.length; j++) {
            var m1 = new Vector(this.segments[j].v1.x, this.segments[j].v1.y);
            var m2 = new Vector(this.segments[j].v2.x, this.segments[j].v2.y);

            var BA = Vector.sub(m1, m2);
            var n = Vector.norm(new Vector(BA.y, -BA.x));
            var tstar = (m1.x * n.x + m1.y * n.y - p.p.x * n.x - p.p.y * n.y);
            tstar /= n.x * p.v.x + n.y * p.v.y;
            if (tstar < -EPSILON || tstar > h + EPSILON) {
                continue;
            }

            var bstar = Vector.add(p.p, Vector.scale(tstar, p.v));
            var BC = Vector.sub(bstar, m2);
            var alpha = Vector.dot(BC, BA) / Vector.dot(BA, BA);
            if (alpha < -EPSILON || alpha > 1 + EPSILON) {
                continue;
            }
            clean = false;

            var Vrel = Vector.dot(n, p.v);
            p.v = Vector.add(Vector.scale(-Vrel, n), p.v);
        }
        return clean;
    };

    // Send new player our color and add them to list of network players
    Engine.prototype.addNetworkPlayer = function (c, id) {
        if (this.netPlayers.hasOwnProperty(id)) {
            return;
        }
        c.send({ "color": this.player.playerColor, "id": peer.id });
        this.numPlayers++;
        this.netPlayers[id] = new Player(new Vector(1.0, 0.5));
        this.netPlayers[id].conn = c;
    };

    // Tell everyone player with id joined cluster
    Engine.prototype.broadcastJoin = function (id) {
        if (this.netPlayers.hasOwnProperty(id)) {
            return;
        }
        for (var key in this.netPlayers) {
            if (!this.netPlayers.hasOwnProperty(key)) {
                continue;
            }
            if (id === key) {
                continue;
            }
            var data = { "connected": id };
            this.netPlayers[key].conn.send(data);
        }
    };

    // Send our position to everyone in the cluster
    Engine.prototype.sendNetworkPosition = function (h) {
        this.timeCounter += h * 1000;
        if (this.timeCounter < 1000 / this.packetPerSec) {
            return;
        }
        this.timeCounter = 0;

        for (var key in this.netPlayers) {
            if (!this.netPlayers.hasOwnProperty(key)) {
                continue;
            }
            if (this.netPlayers[key].conn === null) {
                continue;
            }
            var data = { "x": this.player.p.x, "y": this.player.p.y, "id": peer.id };
            var c = this.netPlayers[key].conn;
            setTimeout(function () {
                c.send(data);
            }, this.latency);
        }
    };

    // Process data recieved from other players
    Engine.prototype.updateNetworkPlayer = function (data) {
        var _this = this;
        var id;
        if (data.hasOwnProperty("map")) {
            this.holes = [];
            var v;
            var vertices;
            var map = data["map"];
            for (var i = 0; i < map.length; i++) {
                vertices = [];
                for (var j = 0; j < map[i].length; j++) {
                    v = new Vertex(map[i][j][0], map[i][j][1]);
                    vertices.push(v);
                }
                this.holes.push(new Polygon(vertices));
            }
            this.createDataStructures();
        } else if (data.hasOwnProperty("connected")) {
            id = data["connected"];
            if (this.netPlayers.hasOwnProperty(id)) {
                return;
            }
            var c = peer.connect(id);
            c.on("data", function (d) {
                game.updateNetworkPlayer(d);
            });
            c.on("open", function () {
                _this.addNetworkPlayer(c, c.peer);
            });
            c.on("error", function () {
                game.removeNetworkPlayer(c.peer);
            });
            c.on("close", function () {
                game.removeNetworkPlayer(c.peer);
            });
        } else if (data.hasOwnProperty("disconnected")) {
            game.removeNetworkPlayer(data["disconnected"]);
        } else if (data.hasOwnProperty("x")) {
            id = data["id"];
            if (this.netPlayers.hasOwnProperty(id)) {
                this.netPlayers[id].updateNetworkPosition(data["x"], data["y"]);
            }
        } else if (data.hasOwnProperty("color")) {
            id = data["id"];
            if (this.netPlayers.hasOwnProperty(id)) {
                this.netPlayers[id].playerColor = data["color"];
            }
        }
    };

    // Send our color to everyone in the cluster
    Engine.prototype.updateNetworkColor = function (color) {
        for (var key in this.netPlayers) {
            if (!this.netPlayers.hasOwnProperty(key)) {
                continue;
            }
            this.netPlayers[key].conn.send({ "color": color, "id": peer.id });
        }
    };

    // Encode and send map data to a player
    Engine.prototype.sendMap = function (c) {
        var points;
        var map = [];
        for (var j = 0; j < this.holes.length; j++) {
            points = this.holes[j].vertices;
            var n = points.length;
            var poly = [];
            for (var i = n; i--;) {
                poly.push([points[i].x, points[i].y]);
            }
            map.push(poly);
        }
        c.send({ "map": map });
    };

    // Remove player from list of network players
    Engine.prototype.removeNetworkPlayer = function (id) {
        if (this.netPlayers.hasOwnProperty(id)) {
            this.numPlayers--;
            delete this.netPlayers[id];
        }
    };
    return Engine;
})();

var Player = (function () {
    function Player(p) {
        this.p = p;
        this.playerColor = "#fff";
        this.FRICTION = 0.1;
        this.MAX_SPEED = 0.3;
        this.lastUpdate = -1;
        this.r = 0.006;
        this.v = new Vector(0, 0);
        this.dir = new Vector(0, 0);
    }
    Player.prototype.draw = function (ctx, l) {
        ctx.fillStyle = this.playerColor;
        ctx.beginPath();
        ctx.arc(this.p.x * l, this.p.y * l, this.r * l, 0, Math.PI * 2);
        ctx.fill();
    };

    Player.prototype.step = function (h) {
        // Update velocity (accelerate, apply friction and limit max velocity)
        this.v = Vector.add(Vector.scale(this.MAX_SPEED / 10, this.dir), this.v);
        this.v = Vector.scale(1 - this.FRICTION, this.v);
        var speed = Vector.mag(this.v);
        if (speed > this.MAX_SPEED) {
            this.v = Vector.scale(this.MAX_SPEED / speed, this.v);
        } else if (speed < 0.001) {
            this.v = new Vector(0, 0);
        }
    };

    Player.prototype.updatePosition = function (h) {
        // Update position
        this.p = Vector.add(this.p, Vector.scale(h, this.v));

        // Keep player inside box
        this.p.x = Math.max(this.r * 2, this.p.x);
        this.p.x = Math.min(2 - this.r * 2, this.p.x);
        this.p.y = Math.max(this.r * 2, this.p.y);
        this.p.y = Math.min(1 - this.r * 2, this.p.y);
    };

    // Do interpolation for networked players
    Player.prototype.updateNetworkPosition = function (x, y) {
        var time = new Date().getTime();
        if (this.lastUpdate < 0 || !Player.interpolate) {
            this.p.x = x;
            this.p.y = y;
            this.v = new Vector(0, 0);
        } else {
            var dt = (time - this.lastUpdate) / 1e3;
            this.v.x = x - this.p.x;
            this.v.y = y - this.p.y;
            if (dt > 0)
                this.v = Vector.scale(1 / dt, this.v);
            this.v = Vector.limit(this.v, this.MAX_SPEED);
        }
        this.lastUpdate = time;
    };
    Player.interpolate = true;
    return Player;
})();
//# sourceMappingURL=engine.js.map
