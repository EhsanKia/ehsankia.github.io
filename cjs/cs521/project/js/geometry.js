/// <reference path="utils.ts" />
var Vertex = (function () {
    function Vertex(x, y) {
        this.x = x;
        this.y = y;
        this.ind = Vertex.index_counter++;
    }
    Vertex.prototype.distSquare = function (v) {
        return Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2);
    };

    Vertex.prototype.minDistance = function (vertices) {
        var dMin = Number.POSITIVE_INFINITY;
        for (var i = 0; i < vertices.length; i++) {
            var d = vertices[i].distSquare(this);
            if (d < dMin)
                dMin = d;
        }
        return Math.sqrt(dMin);
    };
    Vertex.index_counter = 0;
    return Vertex;
})();

var Triangle = (function () {
    function Triangle(v1, v2, v3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.computeBoundingCircle();
        this.e1 = new Edge(v1, v2, this);
        this.e2 = new Edge(v2, v3, this);
        this.e3 = new Edge(v3, v1, this);
        this.ind = Triangle.index_counter++;
    }
    // Find a circle bounding the triangle
    // http://www.exaflop.org/docs/cgafaq/cga1.html
    Triangle.prototype.computeBoundingCircle = function () {
        var A = this.v2.x - this.v1.x;
        var B = this.v2.y - this.v1.y;
        var C = this.v3.x - this.v1.x;
        var D = this.v3.y - this.v1.y;

        var E = A * (this.v1.x + this.v2.x) + B * (this.v1.y + this.v2.y);
        var F = C * (this.v1.x + this.v3.x) + D * (this.v1.y + this.v3.y);

        var G = 2.0 * (A * (this.v3.y - this.v2.y) - B * (this.v3.x - this.v2.x));

        var dx, dy;
        if (Math.abs(G) < EPSILON) {
            var xMin = Math.min(this.v1.x, this.v2.x, this.v3.x);
            var yMin = Math.min(this.v1.y, this.v2.y, this.v3.y);
            var xMax = Math.max(this.v1.x, this.v2.x, this.v3.x);
            var yMax = Math.max(this.v1.y, this.v2.y, this.v3.y);
            this.center = new Vertex((xMin + xMax) * 0.5, (yMin + yMax) * 0.5);

            dx = this.center.x - xMin;
            dy = this.center.y - yMin;
        } else {
            var cx = (D * E - B * F) / G;
            var cy = (A * F - C * E) / G;
            this.center = new Vertex(cx, cy);

            dx = cx - this.v1.x;
            dy = cy - this.v1.y;
        }

        this.radSqr = dx * dx + dy * dy;
        this.radius = Math.sqrt(this.radSqr);
    };

    // Check if the vertex is inside
    // the bounding circle of the triangle
    Triangle.prototype.inBoundingCircle = function (v) {
        return (this.center.distSquare(v) <= this.radSqr);
    };

    // Checks if two triangles share any vertices
    Triangle.prototype.shareVertex = function (t) {
        var v1 = (this.v1 === t.v1 || this.v1 === t.v2 || this.v1 === t.v3);
        var v2 = (this.v2 === t.v1 || this.v2 === t.v2 || this.v2 === t.v3);
        var v3 = (this.v3 === t.v1 || this.v3 === t.v2 || this.v3 === t.v3);
        return (v1 || v2 || v3);
    };
    Triangle.index_counter = 0;
    return Triangle;
})();

var Edge = (function () {
    function Edge(v1, v2, t) {
        this.v1 = v1;
        this.v2 = v2;
        this.t = t;
        this.p = new Vector(v1.x, v1.y);
        this.d = new Vector(v2.x - v1.x, v2.y - v1.y);
    }
    // Checks if it's the same edge (either direction)
    Edge.prototype.same = function (e) {
        var t1 = this.v1 === e.v1 && this.v2 === e.v2;
        var t2 = this.v1 === e.v2 && this.v2 === e.v1;
        return (t1 || t2);
    };

    Edge.removeDuplicateEdges = function (edges) {
        var uniqueList = [];
        var e1, e2, unique;
        for (var i = 0; i < edges.length; i++) {
            e1 = edges[i];
            unique = true;
            for (var j = 0; j < edges.length; j++) {
                if (i === j) {
                    continue;
                }
                e2 = edges[j];
                if (e1.same(e2)) {
                    unique = false;
                    break;
                }
            }
            if (unique)
                uniqueList.push(e1);
        }
        return uniqueList;
    };

    Edge.orderEdges = function (edges) {
        var map = {};
        var el;
        var e;

        for (var i = 0; i < edges.length; i++) {
            e = edges[i];
            el = (map[e.v1.ind] || []);
            el.push(e);
            map[e.v1.ind] = el;
            el = (map[e.v2.ind] || []);
            el.push(e);
            map[e.v2.ind] = el;
        }

        // Using the map, order the edges
        e = edges[0];
        var ordered = [e];
        for (var j = 0; j < edges.length - 1; j++) {
            el = map[e.v2.ind];
            if (el[0].v1 === e.v1) {
                e = el[1];
            } else
                e = el[0];
            ordered.push(e);
        }

        return ordered;
    };
    return Edge;
})();

var Delauney = (function () {
    function Delauney() {
    }
    Delauney.triangulate = function (vertices) {
        if (vertices.length < 3) {
            return [];
        } else if (vertices.length === 3) {
            return [new Triangle(vertices[0], vertices[1], vertices[2])];
        }

        var triangles = [];

        // Add a super triangle
        var super_tri = Delauney.createSuperTriangle(vertices);
        triangles.push(super_tri);

        for (var i = 0; i < vertices.length; i++) {
            triangles = Delauney.addVertex(vertices[i], triangles);
        }

        // Remove all triangles which were formed from the super triangle
        var finalTriangles = [];
        for (var j = 0; j < triangles.length; j++) {
            if (!triangles[j].shareVertex(super_tri)) {
                finalTriangles.push(triangles[j]);
            }
        }

        return finalTriangles;
    };

    Delauney.addVertex = function (v, tris) {
        var edges = [];
        var t;
        var e;

        // Remove all triangles which have the
        // given vertex in their bounding circle
        // Add their edges to the edgelist
        var finalTriangles = [];
        for (var i = 0; i < tris.length; i++) {
            t = tris[i];
            if (t.inBoundingCircle(v)) {
                edges.push(t.e1);
                edges.push(t.e2);
                edges.push(t.e3);
            } else {
                finalTriangles.push(t);
            }
        }

        // Keep the unique edges only
        edges = Edge.removeDuplicateEdges(edges);

        for (var j = 0; j < edges.length; j++) {
            e = edges[j];
            finalTriangles.push(new Triangle(e.v1, e.v2, v));
        }

        return finalTriangles;
    };

    // Creates a giant triangle bounding all the points
    Delauney.createSuperTriangle = function (vertices) {
        var xMax = Number.NEGATIVE_INFINITY, xMin = Number.POSITIVE_INFINITY, yMax = Number.NEGATIVE_INFINITY, yMin = Number.POSITIVE_INFINITY;

        for (var i = 0; i < vertices.length; i++) {
            if (vertices[i].x < xMin)
                xMin = vertices[i].x;
            if (vertices[i].x > xMax)
                xMax = vertices[i].x;
            if (vertices[i].y < yMin)
                yMin = vertices[i].y;
            if (vertices[i].y > yMax)
                yMax = vertices[i].y;
        }

        var dx = (xMax - xMin);
        var dy = (yMax - yMin);
        var dm = Math.max(dx, dy);
        var xm = xMin + dx * 0.5;
        var ym = yMin + dy * 0.5;

        var v1 = new Vertex(xm - 20 * dm, ym - dm);
        var v2 = new Vertex(xm, ym + 20 * dm);
        var v3 = new Vertex(xm + 20 * dm, ym - dm);

        return new Triangle(v1, v2, v3);
    };
    return Delauney;
})();

var Polygon = (function () {
    function Polygon(vertices) {
        this.vertices = vertices;
        this.boundingCircle = MEC.computeMEC(vertices);
    }
    Polygon.fromEdges = function (edges) {
        var vertices = [edges[0].v1];
        for (var i = 0; i < edges.length; i++) {
            if (vertices.indexOf(edges[i].v2) < 0) {
                vertices.push(edges[i].v2);
            }
        }
        return new Polygon(vertices);
    };

    // Inspired by http://stackoverflow.com/questions/8997099/algorithm-to-generate-random-2d-polygon
    Polygon.createSimple = function (numSides, xOff, yOff, size) {
        var vertices = [];
        var vertex;

        for (var i = 0; i < numSides * 1 / this.complexity; i++) {
            do {
                var xPos = Random.rand(-size / 2, size / 2);
                var yPos = Random.rand(-size / 2, size / 2);
                vertex = new Vertex(xPos + xOff, yPos + yOff);
            } while(vertex.minDistance(vertices) < 1e-2);
            vertices.push(vertex);
        }

        // Triangular points
        var triangulation = Delauney.triangulate(vertices);

        // Get all the edges
        var edgeList = [];
        var t;
        for (var j = 0; j < triangulation.length; j++) {
            t = triangulation[j];
            edgeList.push(t.e1);
            edgeList.push(t.e2);
            edgeList.push(t.e3);
        }

        // Keep only unique ones (bound edges)
        var boundary = Edge.removeDuplicateEdges(edgeList);

        while (boundary.length !== numSides) {
            t = null;
            if (boundary.length > numSides) {
                t = Polygon.findEar(boundary); // Remove an ear
            }

            if (boundary.length < numSides || t == null) {
                t = Polygon.findSide(boundary); // Remove side
            }

            if (t == null) {
                boundary = Edge.removeDuplicateEdges(edgeList);
                break;
            }

            edgeList.remove(t.e1);
            edgeList.remove(t.e2);
            edgeList.remove(t.e3);
            boundary = Edge.removeDuplicateEdges(edgeList);
        }

        boundary = Edge.orderEdges(boundary);
        var poly = Polygon.fromEdges(boundary);

        if (poly.vertices.length !== numSides) {
            return Polygon.createSimple(numSides, xOff, yOff, size);
        } else {
            return poly;
        }
    };

    Polygon.findEar = function (edges) {
        var ordered = Edge.orderEdges(edges);
        var n = ordered.length;
        for (var i = 0; i < ordered.length; i++) {
            if (ordered[i].t === ordered[(i + 1) % n].t) {
                return ordered[i].t;
            }
        }
        return null;
    };

    Polygon.findSide = function (edges) {
        var vList = [];
        var t;
        var map = [];
        for (var i = 0; i < edges.length; i++) {
            vList.push(edges[i].v1.ind);
            map[edges[i].t.ind] = (map[edges[i].t.ind] || 0) + 1;
        }
        for (var j = 0; j < edges.length; j++) {
            if (map[edges[j].t.ind] === 1) {
                t = edges[j].t;
                if (vList.has(t.v1) && vList.has(t.v2) && vList.has(t.v3)) {
                    continue;
                }
                return t;
            }
        }
        return null;
    };
    Polygon.complexity = 0.5;
    return Polygon;
})();

// Computes Minimum Enclosing Circle using Welzl's algorithm
// Based on this: http://www.sunshine2k.de/coding/java/Welzl/Welzl.html
var MEC = (function () {
    function MEC(points) {
        this.points = points;
        this.bound = new Array(3);
    }
    MEC.computeMEC = function (points) {
        var m = new MEC(points);
        if (points.length === 0) {
            return null;
        }
        return m.mec(points.length, 0);
    };

    // Recursive method computing minimum enclosing circle
    MEC.prototype.mec = function (n, b) {
        if (b === 3) {
            return MEC.compCirc3(this.bound[0], this.bound[1], this.bound[2]);
        } else if (n === 1 && b === 0) {
            return new Circle(0, this.points[0]);
        } else if (n === 0 && b === 2) {
            return MEC.compCirc2(this.bound[0], this.bound[1]);
        } else if (n === 1 && b === 1) {
            return MEC.compCirc2(this.bound[0], this.points[0]);
        } else {
            var tmpCircle = this.mec(n - 1, b);
            if (!tmpCircle.inCircle(this.points[n - 1])) {
                this.bound[b++] = this.points[n - 1];
                return this.mec(n - 1, b);
            }
            return tmpCircle;
        }
    };

    // Build circle from 2 points
    MEC.compCirc2 = function (v1, v2) {
        var x = 0.5 * (v1.x + v2.x);
        var y = 0.5 * (v1.y + v2.y);
        var center = new Vertex(x, y);
        var radius = Math.sqrt(center.distSquare(v1));
        return new Circle(radius, center);
    };

    // Build circle from 3 points
    MEC.compCirc3 = function (v1, v2, v3) {
        var A = v2.x - v1.x;
        var B = v2.y - v1.y;
        var C = v3.x - v1.x;
        var D = v3.y - v1.y;

        var E = A * (v1.x + v2.x) + B * (v1.y + v2.y);
        var F = C * (v1.x + v3.x) + D * (v1.y + v3.y);

        var G = 2.0 * (A * (v3.y - v2.y) - B * (v3.x - v2.x));

        var dx, dy;
        var center, radius;
        if (Math.abs(G) < EPSILON) {
            var xMin = Math.min(v1.x, v2.x, v3.x);
            var yMin = Math.min(v1.y, v2.y, v3.y);
            var xMax = Math.max(v1.x, v2.x, v3.x);
            var yMax = Math.max(v1.y, v2.y, v3.y);
            center = new Vertex((xMin + xMax) * 0.5, (yMin + yMax) * 0.5);

            dx = center.x - xMin;
            dy = center.y - yMin;
        } else {
            var cx = (D * E - B * F) / G;
            var cy = (A * F - C * E) / G;
            center = new Vertex(cx, cy);

            dx = cx - v1.x;
            dy = cy - v1.y;
        }

        radius = Math.sqrt(dx * dx + dy * dy);
        return new Circle(radius, center);
    };
    return MEC;
})();

var Circle = (function () {
    function Circle(radius, center) {
        this.radius = radius;
        this.center = center;
        this.radSqr = radius * radius;
    }
    Circle.prototype.inCircle = function (p) {
        return this.center.distSquare(p) <= this.radSqr;
    };
    return Circle;
})();
//# sourceMappingURL=geometry.js.map
