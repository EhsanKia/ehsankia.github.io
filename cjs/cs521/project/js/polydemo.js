/// <reference path="ref/dat.gui.d.ts" />
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var w, h;
var gui;

window.onload = window.onresize = function () {
    w = Math.min(window.innerWidth, window.innerHeight * 2);
    h = w / 2;
    cvs.setAttribute("width", w + "px");
    cvs.setAttribute("height", h + "px");
    cvs.style.marginLeft = (-w / 2) + "px";

    ctx.translate(0, h);
    ctx.scale(1, -1);
};

function run() {
    draw();
    requestAnimationFrame(run);
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);
    var t, v, e;

    if (s5) {
        for (var m = 0; m < boundary.length; m++) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ccc";
            e = boundary[m];
            ctx.beginPath();
            ctx.moveTo(e.v1.x * h, e.v1.y * h);
            ctx.lineTo(e.v2.x * h, e.v2.y * h);
            ctx.stroke();
        }
    }

    if (s2) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#888";
        for (var j = 0; j < triangulation.length; j++) {
            t = triangulation[j];
            ctx.beginPath();
            ctx.moveTo(t.v1.x * h, t.v1.y * h);
            ctx.lineTo(t.v2.x * h, t.v2.y * h);
            ctx.lineTo(t.v3.x * h, t.v3.y * h);
            ctx.lineTo(t.v1.x * h, t.v1.y * h);
            ctx.stroke();
        }
    }

    if (s3) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0f0";
        for (var k = 0; k < ears.length; k++) {
            e = ears[k];
            ctx.beginPath();
            ctx.moveTo(e.v1.x * h, e.v1.y * h);
            ctx.lineTo(e.v2.x * h, e.v2.y * h);
            ctx.stroke();
        }

        ctx.strokeStyle = "#00f";
        for (var l = 0; l < sides.length; l++) {
            e = sides[l];
            ctx.beginPath();
            ctx.moveTo(e.v1.x * h, e.v1.y * h);
            ctx.lineTo(e.v2.x * h, e.v2.y * h);
            ctx.stroke();
        }
    }

    if (s1) {
        ctx.fillStyle = "#f00";
        for (var i = 0; i < vertices.length; i++) {
            v = vertices[i];
            ctx.beginPath();
            ctx.arc(v.x * h, v.y * h, 0.008 * h, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

var vertices;
var s1 = false;

var triangulation;
var s2 = false;

var boundary;
var edgeList;
var ears = [];
var sides = [];
var s3 = false;

var s5 = false;

var Demo = (function () {
    function Demo() {
    }
    Demo.step1 = function () {
        s2 = false;
        s3 = false;
        s5 = false;

        vertices = [];
        var size = 0.8;
        var xOff = 1;
        var yOff = 0.5;
        for (var i = 0; i < 20; i++) {
            do {
                var xPos = Random.rand(-size / 2, size / 2);
                var yPos = Random.rand(-size / 2, size / 2);
                var vertex = new Vertex(xPos + xOff, yPos + yOff);
            } while(vertex.minDistance(vertices) < 1e-2);
            vertices.push(vertex);
        }
        s1 = true;
    };
    Demo.step2 = function () {
        if (!s1) {
            return;
        }
        triangulation = Delauney.triangulate(vertices);
        s2 = true;
    };

    Demo.step3 = function () {
        edgeList = [];
        var t;
        for (var j = 0; j < triangulation.length; j++) {
            t = triangulation[j];
            edgeList.push(t.e1);
            edgeList.push(t.e2);
            edgeList.push(t.e3);
        }

        // Keep only unique ones (bound edges)
        boundary = Edge.removeDuplicateEdges(edgeList);

        ears = [];
        var ordered = Edge.orderEdges(boundary);
        var n = ordered.length;
        for (var i = 0; i < ordered.length; i++) {
            if (ordered[i].t === ordered[(i + 1) % n].t) {
                ears.push(ordered[i]);
                ears.push(ordered[(i + 1) % n]);
            }
        }

        sides = [];
        var map = [];
        for (i = 0; i < boundary.length; i++) {
            map[boundary[i].t.ind] = (map[boundary[i].t.ind] || 0) + 1;
        }
        for (j = 0; j < boundary.length; j++) {
            if (map[boundary[j].t.ind] === 1) {
                sides.push(boundary[j]);
            }
        }

        s3 = true;
    };

    Demo.step4 = function () {
        if (boundary.length == 15)
            return;

        var t = null;
        if (boundary.length > 15) {
            t = Polygon.findEar(boundary); // Remove an ear
        }

        if (boundary.length < 15 || t == null) {
            t = Polygon.findSide(boundary); // Remove side
        }

        if (t == null) {
            boundary = Edge.removeDuplicateEdges(edgeList);
            return;
        }

        edgeList.remove(t.e1);
        edgeList.remove(t.e2);
        edgeList.remove(t.e3);
        boundary = Edge.removeDuplicateEdges(edgeList);

        ears = [];
        var ordered = Edge.orderEdges(boundary);
        var n = ordered.length;
        for (var i = 0; i < ordered.length; i++) {
            if (ordered[i].t === ordered[(i + 1) % n].t) {
                ears.push(ordered[i]);
                ears.push(ordered[(i + 1) % n]);
            }
        }

        sides = [];
        var map = [];
        for (i = 0; i < boundary.length; i++) {
            map[boundary[i].t.ind] = (map[boundary[i].t.ind] || 0) + 1;
        }
        for (var j = 0; j < boundary.length; j++) {
            if (map[boundary[j].t.ind] === 1) {
                sides.push(boundary[j]);
            }
        }
    };

    Demo.step5 = function () {
        s1 = false;
        s2 = false;
        s3 = false;
        s5 = true;
    };
    return Demo;
})();

function setup() {
    gui = new dat.GUI();
    gui.add(Demo, "step1");
    gui.add(Demo, "step2");
    gui.add(Demo, "step3");
    gui.add(Demo, "step4");
    gui.add(Demo, "step5");
}

setup();
run();
//# sourceMappingURL=polydemo.js.map
