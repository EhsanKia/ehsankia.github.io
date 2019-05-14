/// <reference path="geometry.ts" />
// Inspiration: http://ncase.me/sight-and-light/
var Visibility = (function () {
    function Visibility() {
    }
    Visibility.computePolygon = function (pos, segments, vertices) {
        vertices.sort(function (a, b) {
            var a1 = Math.atan2(a.y - pos.y, a.x - pos.x);
            var a2 = Math.atan2(b.y - pos.y, b.x - pos.x);
            return a1 - a2;
        });

        var visPoly = [];
        for (var i = 0; i < vertices.length; i++) {
            var angle = Math.atan2(vertices[i].y - pos.y, vertices[i].x - pos.x);
            var v2 = Visibility.closestIntersect(pos, angle, segments);
            if (v2.distSquare(vertices[i]) > EPSILON) {
                continue;
            }

            var v1 = Visibility.closestIntersect(pos, angle - 1e-5, segments);
            var v3 = Visibility.closestIntersect(pos, angle + 1e-5, segments);
            if (v1.distSquare(v2) > EPSILON)
                visPoly.push(v1);
            visPoly.push(v2);
            if (v3.distSquare(v2) > EPSILON)
                visPoly.push(v3);
        }

        return new Polygon(visPoly);
    };

    // Find closest intersection of a ray with a list of edges
    Visibility.closestIntersect = function (s, a, segments) {
        var dir = new Vector(Math.cos(a), Math.sin(a));
        var best_t = Number.POSITIVE_INFINITY;
        for (var i = 0; i < segments.length; i++) {
            var t = Visibility.intersectSegment(s, dir, segments[i]);
            if (t < best_t)
                best_t = t;
        }
        return new Vertex(s.x + best_t * dir.x, s.y + best_t * dir.y);
    };

    Visibility.intersectSegment = function (p, d, s) {
        // Check if lines are parallel
        if (Math.abs(Vector.cross(d, s.d)) < EPSILON) {
            return Number.POSITIVE_INFINITY;
        }

        // Find intersection
        var t2 = (d.x * (s.p.y - p.y) + d.y * (p.x - s.p.x)) / (s.d.x * d.y - s.d.y * d.x);
        var t1 = (s.p.x + s.d.x * t2 - p.x) / d.x;

        // Check if intersection is within segment bound
        if (t1 < -EPSILON || t2 < -EPSILON || t2 > 1 + EPSILON) {
            return Number.POSITIVE_INFINITY;
        }

        return t1;
    };
    return Visibility;
})();
//# sourceMappingURL=visibility.js.map
