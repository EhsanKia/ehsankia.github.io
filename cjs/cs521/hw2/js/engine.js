/// <reference path="utils.ts" />
var EPSILON = 1e-10;

var Engine = (function () {
    function Engine() {
        this.wHeight = 0.1;
        this.mHeight = 0.6;
        this.detail = 4;
        this.roughness = 1.0;
        this.cForce = 0.7;
        this.cAngle = Math.PI / 4;
        this.bRadius = 8e-3;
        this.balls = [];
        // Physics
        this.gravity = 0.5;
        this.friction = 0.1;
        this.restitution = 0.2;
        this.collisions = true;
        this.wEnabled = true;
        this.wForce = 1.0;
        this.timeSpeed = 0.1;
        this.hVariation = 3;
        // Destruction
        this.dEnabled = true;
        this.dAmount = 1.0;
        this.generateTerrain();
        this.perlin = new Perlin2D();
        this.time = 0;
    }
    // Steps the simulation with physics and collision
    Engine.prototype.step = function (h) {
        this.time += h * this.timeSpeed;

        var newBalls = [];
        for (var i = 0; i < this.balls.length; i++) {
            var b = this.balls[i];

            // Remove ball if it's static, in water or outside
            if (b.pos.x > 0.5 && b.pos.x < 1.5 && b.pos.y < this.wHeight)
                continue;
            if (b.pos.x < -0.1 || b.pos.x > 2.1 || b.pos.y < -0.1)
                continue;
            if (Vector.mag(b.vel) < 1e-2)
                b.idleCounter++;
            if (b.idleCounter > 50)
                continue;
            newBalls.push(b);

            // Add friction and gravity
            b.force = Vector.times(-this.friction, b.vel);
            b.force.y -= this.gravity;

            // Add wind force
            if (this.wEnabled) {
                b.force.x += this.perlin.noise(this.time, this.hVariation * b.pos.y) * this.wForce;
            }

            // Update velocities
            b.vel = Vector.plus(b.vel, Vector.times(h, b.force));
        }

        // Check for collisions
        if (this.collisions) {
            var k = 0;
            while (!this.collision(h) || k++ < 100)
                ;
        }

        for (i = 0; i < this.balls.length; i++) {
            b = this.balls[i];
            b.pos = Vector.plus(b.pos, Vector.times(h, b.vel));
        }

        this.balls = newBalls;
    };

    Engine.prototype.collision = function (h) {
        var clean = true;

        for (var i = 0; i < this.balls.length; i++) {
            var b = this.balls[i];

            // Do broadphase detection
            var xmin = Math.min(b.pos.x, b.pos.x + h * b.vel.x) - 2 * this.bRadius;
            var xmax = Math.max(b.pos.x, b.pos.x + h * b.vel.x) + 2 * this.bRadius;
            var divs = Math.pow(4, this.detail + 1);
            var start_ind = Math.max(Math.floor(xmin * divs / 2), 0);
            var end_ind = Math.min(Math.ceil(xmax * divs / 2), this.mountain.length - 1);

            for (var j = start_ind; j < end_ind; j++) {
                var m1 = this.mountain[j];
                var m2 = this.mountain[j + 1];

                // Check if there's a collision in this timestep
                var BA = Vector.minus(m1, m2);
                var n = Vector.norm(new Vector(BA.y, -BA.x));
                var tstar = (m1.x * n.x + m1.y * n.y - b.pos.x * n.x - b.pos.y * n.y);
                tstar /= n.x * b.vel.x + n.y * b.vel.y;
                if (tstar < -EPSILON || tstar > h + EPSILON)
                    continue;

                // Prepare vectors and positions at tstar
                var bstar = Vector.plus(b.pos, Vector.times(tstar, b.vel));
                var BC = Vector.minus(bstar, m2);

                // Compute alpha and check if the ball is on the line
                var alpha = Vector.dot(BC, BA) / Vector.dot(BA, BA);
                if (alpha < -EPSILON || alpha > 1 + EPSILON)
                    continue;
                clean = false; // Found a collision!

                if (b.firstBounce) {
                    // stop the ball on the first bounce
                    b.firstBounce = false;
                    b.vel = new Vector(0, 0);

                    // Destroy a piece of the mountain
                    if (this.detail < 1 || !this.dEnabled)
                        continue;

                    // Find how many adjacent units to lower
                    var d = Math.round(this.detail * this.detail * this.dAmount);
                    if (j - d < 0)
                        d = j;
                    if (j + d >= this.mountain.length + 1)
                        d = this.mountain.length - j - 1;
                    var ymin = Math.min(this.mountain[j - d].y, this.mountain[j + d].y);

                    for (var k = j - d + 1; k <= j + d; k++) {
                        var ycur = this.mountain[k].y;
                        var dmg = (j / d - k / d + 1) / 2;

                        // Flip damage curve if other side of mountain
                        if (this.mountain[j - d].y < this.mountain[j + d].y)
                            dmg = 1 - dmg;
                        this.mountain[k].y = ymin + (ycur - ymin) * dmg * 0.9;
                    }

                    continue;
                }

                // Get normal and relative velocity
                var Vrel = Vector.dot(n, b.vel);

                // Apply impulse to particle
                var impulse = -(1 + this.restitution) * Vrel;
                b.vel = Vector.plus(Vector.times(impulse, n), b.vel);
            }
        }

        return clean;
    };

    // Shoots a cannon ball
    Engine.prototype.shoot = function () {
        var p = Vector.rotate(this.cAngle, new Vector(0.02, 0));
        p = Vector.plus(this.cPos, p);

        var v = Vector.rotate(this.cAngle, new Vector(this.cForce, 0));

        this.balls.push(new CBall(p, v));
    };

    // Draws the scene
    Engine.prototype.draw = function (ctx, w, h) {
        ctx.clearRect(0, 0, w, h);

        // Compute dimensionality constant and adjust height
        var d = w / 1000;

        // Draw balls
        ctx.fillStyle = "#F00";
        for (var i = 0; i < this.balls.length; i++) {
            var b = this.balls[i];

            ctx.beginPath();
            ctx.arc(b.pos.x * h, b.pos.y * h, this.bRadius * h, 0, Math.PI * 2, false);
            ctx.fill();
        }

        // Draw water
        ctx.fillStyle = "#38F";
        ctx.fillRect(0.25 * w, 0, 0.5 * w, h * this.wHeight);

        // Draw mountain
        ctx.fillStyle = "#988";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        this.mountain.forEach(function (point) {
            ctx.lineTo(point.x * h, point.y * h);
        });
        ctx.closePath();
        ctx.fill();

        // Draw cannon
        ctx.fillStyle = "#111";
        ctx.save();
        ctx.translate(this.cPos.x * h, this.cPos.y * h);
        ctx.beginPath();
        ctx.arc(0, 0, 5 * d, 0, Math.PI * 2, false);
        ctx.fill(); // Base

        ctx.rotate(this.cAngle);
        ctx.fillRect(-d, -3 * d, 10 * d, 6 * d); // Barrel

        ctx.fillStyle = "#0F0";
        ctx.fillRect(-3 * d, -d, this.cForce * 10 * d, 2 * d); // Force bar
        ctx.restore();

        // Draw wind meter on the side
        if (this.wEnabled) {
            for (var y = 0; y < h; y++) {
                var n = this.perlin.noise(this.time, this.hVariation * y / h);
                var v = Math.floor((n * this.wForce + 1) * 128);
                ctx.fillStyle = "rgb(" + v + ",0," + (255 - v) + ")";
                ctx.fillRect(0, y, 20, 1);
            }
        }
    };

    // Generates terrain using midpoint displacement
    Engine.prototype.generateTerrain = function () {
        // Remove all balls and reset time
        this.balls = [];
        this.time = 0;

        // Place base silhouette
        this.mountain = [];
        this.mountain.push(new Vector(0, -this.mHeight / 2));
        this.mountain.push(new Vector(0.5, this.mHeight));
        this.mountain.push(new Vector(1, -this.mHeight / 2));
        this.mountain.push(new Vector(1.5, this.mHeight));
        this.mountain.push(new Vector(2, -this.mHeight / 2));

        // Start doing midpoint displacement
        var newMountain = [];
        while (this.mountain.length > 1) {
            // Get two points and check their x-distance
            var p1 = this.mountain.pop();
            var p2 = this.mountain.pop();
            var delta = p1.x - p2.x;

            // If points are too close,
            // Add one point to final list
            // And continue working on the rest
            if (delta < Math.pow(0.25, this.detail)) {
                newMountain.unshift(p1);
                this.mountain.push(p2);
                continue;
            }

            // Compute midpoint and shift y-pos by random amount
            var p3 = Vector.times(0.5, Vector.plus(p1, p2));
            p3.y += delta * this.roughness * (Math.random() - 0.5);

            // Put back the three points in the list
            this.mountain.push(p2);
            this.mountain.push(p3);
            this.mountain.push(p1);
        }

        // Put in the last point and swap with new mountain
        newMountain.unshift(this.mountain.pop());
        this.mountain = newMountain;

        for (var i = 0; i < this.mountain.length; i++) {
            var p = this.mountain[i];
            if (p.y < 2 * this.mHeight / 3 && p.x > 0.5) {
                p = this.mountain[i - 1];
                this.cPos = new Vector(p.x + 0.002, p.y + 0.004);
                break;
            }
        }
    };
    return Engine;
})();

// Cannonball class
var CBall = (function () {
    function CBall(pos, vel) {
        this.pos = pos;
        this.vel = vel;
        this.force = new Vector(0, 0);
        this.idleCounter = 0;
        this.firstBounce = true;
    }
    return CBall;
})();
//# sourceMappingURL=engine.js.map
