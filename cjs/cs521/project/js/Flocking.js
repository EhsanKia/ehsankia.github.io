// Inspired by the following sources:
// http://processing.org/examples/flocking.html
// http://harry.me/blog/2011/02/17/neat-algorithms-flocking/
var Flock = (function () {
    function Flock() {
    }
    Flock.initialize = function () {
        var offset = new Vector(1, 0.5);
        var radius = 0.3;
        var count = Flock.numBirds;
        Flock.obstacles = game.holes;

        Flock.distMatrix = createMatrix(count, count);
        Flock.birds = [];

        for (var i = 0; i < count; i++) {
            var x = offset.x + (Math.random() - 0.5) * radius;
            var y = offset.y + (Math.random() - 0.5) * radius;
            var bird = new Bird(x, y);
            bird.ind = i;
            Flock.birds.push(bird);
        }

        Flock.started = true;
    };

    Flock.step = function (h) {
        if (!Flock.started) {
            return;
        }

        var d;

        for (var i = 0; i < Flock.birds.length; i++) {
            for (var j = i + 1; j < Flock.birds.length; j++) {
                d = Vector.dist(Flock.birds[i].pos, Flock.birds[j].pos);
                Flock.distMatrix[i][j] = d;
                Flock.distMatrix[j][i] = d;
            }
        }

        // Find the neighborhood of each bird and use that to update forces
        var neighbors;
        for (i = 0; i < Flock.birds.length; i++) {
            neighbors = [];
            for (j = 0; j < Flock.birds.length; j++) {
                if (Flock.distMatrix[i][j] > Flock.NEIGHBOR_RADIUS) {
                    continue;
                }
                if (Flock.distMatrix[i][j] < EPSILON) {
                    continue;
                }
                neighbors.push(Flock.birds[j]);
            }
            Flock.birds[i].step(neighbors, Flock.obstacles, h);
        }
    };

    Flock.draw = function (ctx, s) {
        if (!Flock.started) {
            return;
        }

        ctx.fillStyle = "#fff";
        var b;
        var angle;

        for (var i = 0; i < Flock.birds.length; i++) {
            b = Flock.birds[i];
            ctx.save();
            ctx.translate(b.pos.x * s, b.pos.y * s);

            // facing velocity direction
            angle = Math.atan2(b.vel.y, b.vel.x);
            ctx.rotate(angle);

            // Draw triangular shape
            ctx.beginPath();
            ctx.moveTo(-b.rad * s, -b.rad * s);
            ctx.lineTo(2 * b.rad * s, 0);
            ctx.lineTo(-b.rad * s, b.rad * s);
            ctx.lineTo(-b.rad * s, -b.rad * s);

            ctx.fill();
            ctx.restore();
        }
    };

    Flock.addSegments = function (segments) {
        // Don't edit list if we don't have a flock
        // or if the flock isn't casting shadow
        if (!Flock.started || !Flock.castShadow) {
            return segments;
        }

        var newSegments = segments.slice(0);
        var v1, v2, v3;
        var b;
        var angle, c, s, r;

        for (var i = 0; i < Flock.birds.length; i++) {
            b = Flock.birds[i];
            angle = Math.atan2(b.vel.y, b.vel.x);
            c = Math.cos(angle);
            s = Math.sin(angle);
            r = b.rad;
            v1 = new Vertex(b.pos.x - c * r + s * r, b.pos.y - s * r - c * r);
            v2 = new Vertex(b.pos.x + 2 * c * r, b.pos.y + 2 * s * r);
            v3 = new Vertex(b.pos.x - c * r - s * r, b.pos.y - s * r + c * r);
            newSegments.push(new Edge(v1, v2));
            newSegments.push(new Edge(v2, v3));
            newSegments.push(new Edge(v3, v1));
        }
        return newSegments;
    };

    Flock.addVertices = function (vertices) {
        // Don't edit list if we don't have a flock
        // or if the flock isn't casting shadow
        if (!Flock.started || !Flock.castShadow) {
            return vertices;
        }

        var newVertices = vertices.slice(0);
        var b;
        var angle, c, s, r;

        for (var i = 0; i < Flock.birds.length; i++) {
            b = Flock.birds[i];
            angle = Math.atan2(b.vel.y, b.vel.x);
            c = Math.cos(angle);
            s = Math.sin(angle);
            r = b.rad;
            newVertices.push(new Vertex(b.pos.x - c * r + s * r, b.pos.y - s * r - c * r));
            newVertices.push(new Vertex(b.pos.x + 2 * c * r, b.pos.y + 2 * s * r));
            newVertices.push(new Vertex(b.pos.x - c * r - s * r, b.pos.y - s * r + c * r));
        }
        return newVertices;
    };
    Flock.NEIGHBOR_RADIUS = 0.1;

    Flock.numBirds = 100;
    Flock.started = false;
    Flock.castShadow = false;
    return Flock;
})();

var Bird = (function () {
    function Bird(x, y) {
        this.pos = new Vector(x, y);
        var vx = (Math.random() - 0.5) / 3;
        var vy = (Math.random() - 0.5) / 3;
        this.vel = new Vector(vx, vy);
        this.rad = 0.003;
    }
    // Compute force and do symplectic integration
    Bird.prototype.step = function (neighbors, obstacles, h) {
        var acc = this.addForces(neighbors, obstacles, h);
        this.vel = Vector.add(this.vel, acc);
        this.vel = Vector.limit(this.vel, Bird.MAX_SPEED);
        var speed = Vector.mag(this.vel);
        if (speed < Bird.MIN_SPEED)
            this.vel = Vector.scale(Bird.MIN_SPEED / speed, this.vel);
        this.pos = Vector.add(this.pos, Vector.scale(h, this.vel));

        // Wrap birds around
        if (this.pos.x > 2)
            this.pos.x = 0;
        if (this.pos.x < 0)
            this.pos.x = 2;
        if (this.pos.y > 1)
            this.pos.y = 0;
        if (this.pos.y < 0)
            this.pos.y = 1;
    };

    // Compute each force and add them together
    Bird.prototype.addForces = function (neighbors, obstacles, h) {
        var sep = Vector.scale(Bird.SEP_WEIGHT, this.separate(neighbors));
        var ali = Vector.scale(Bird.ALIGN_WEIGHT, this.align(neighbors));
        var coh = Vector.scale(Bird.COHESION_WEIGHT, this.cohere(neighbors));
        var col = Vector.scale(Bird.COLLISION_WEIGHT, this.collision(obstacles, h));
        return Vector.add(Vector.add(sep, col), Vector.add(ali, coh));
    };

    // Keep birds from colliding each other
    Bird.prototype.separate = function (neighbors) {
        var average = new Vector(0, 0);
        var tmp;
        var dist, count = 0;
        for (var i = 0; i < neighbors.length; i++) {
            dist = Flock.distMatrix[this.ind][neighbors[i].ind];
            if (dist > Bird.MIN_DIST) {
                continue;
            }
            tmp = Vector.norm(Vector.sub(this.pos, neighbors[i].pos));
            average = Vector.add(average, Vector.scale(1 / dist, tmp));
            count++;
        }

        if (count === 0) {
            return average;
        }
        average = Vector.scale(1 / count, average);
        return Vector.limit(average, Bird.MAX_FORCE);
    };

    // Keep bird going in same direction as neighbors
    Bird.prototype.align = function (neighbors) {
        var average = new Vector(0, 0);
        var count = 0;
        for (var i = 0; i < neighbors.length; i++) {
            average = Vector.add(average, neighbors[i].vel);
            count++;
        }

        if (count === 0) {
            return average;
        }
        average = Vector.scale(1 / count, average);
        return Vector.limit(average, Bird.MAX_FORCE);
    };

    // Keep neighbors groups together
    Bird.prototype.cohere = function (neighbors) {
        var average = new Vector(0, 0);
        var count = 0;
        for (var i = 0; i < neighbors.length; i++) {
            average = Vector.add(average, neighbors[i].pos);
            count++;
        }

        if (count === 0) {
            return average;
        }

        average = Vector.scale(1 / count, average);
        var dir = Vector.sub(average, this.pos);
        var mag = Vector.mag(dir);
        if (mag < EPSILON) {
            return new Vector(0, 0);
        }
        dir = Vector.scale(1 / mag, dir);
        if (mag < 100) {
            dir = Vector.scale(Bird.MAX_SPEED * mag * 0.01, dir);
        } else {
            dir = Vector.scale(Bird.MAX_SPEED, dir);
        }
        var steer = Vector.sub(dir, this.vel);
        return Vector.limit(steer, Bird.MAX_FORCE);
    };

    // Avoiding circular obstacles, inspired by:
    // http://books.google.ca/books?id=jSwEAwAAQBAJ&pg=PA74&lpg=PA74
    Bird.prototype.collision = function (obstacles, h) {
        var total = new Vector(0, 0);
        var center, radius;
        for (var j = 0; j <= obstacles.length; j++) {
            if (j === obstacles.length) {
                // Consider the player as an obstacle too
                center = game.player.p;
                radius = 0.1;
            } else {
                var circle = obstacles[j].boundingCircle;
                center = new Vector(circle.center.x, circle.center.y);
                radius = circle.radius;
            }

            var v = Vector.scale(4, this.vel);
            var a = Vector.sub(center, this.pos);
            var p = Vector.scale(Vector.dot(a, v) / Vector.dot(v, v), v);
            var b = Vector.sub(p, a);

            if (Vector.mag(p) > Vector.mag(v)) {
                continue;
            }
            if (Vector.mag(b) > radius) {
                continue;
            }

            var ratio = Vector.mag(v) / Vector.mag(a);
            total = Vector.add(total, Vector.scale(ratio, b));
        }

        return Vector.limit(total, Bird.MAX_FORCE);
    };
    Bird.MAX_SPEED = 0.15;
    Bird.MIN_SPEED = 0.05;
    Bird.MAX_FORCE = 0.006;
    Bird.MIN_DIST = 0.01;
    Bird.SEP_WEIGHT = 1.5;
    Bird.ALIGN_WEIGHT = 1;
    Bird.COHESION_WEIGHT = 1;
    Bird.COLLISION_WEIGHT = 2;
    return Bird;
})();
//# sourceMappingURL=flocking.js.map
