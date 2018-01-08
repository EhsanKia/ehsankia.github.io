// Simple 2D Vector class
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.clear = function () {
        this.x = 0;
        this.y = 0;
    };

    Vector.times = function (k, v) {
        return new Vector(k * v.x, k * v.y);
    };

    Vector.minus = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    };

    Vector.plus = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };

    Vector.dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };

    Vector.distance = function (v1, v2) {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    };

    Vector.mag = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };

    Vector.norm = function (v) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    };

    Vector.cross = function (v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    };

    Vector.rotate = function (a, v) {
        var s = Math.sin(a);
        var c = Math.cos(a);
        return new Vector(v.x * c - v.y * s, v.x * s + v.y * c);
    };
    return Vector;
})();

// 2D Perlin Noise implementation
var Perlin2D = (function () {
    function Perlin2D() {
        // Permutation table which generates gradient table
        this.p = [
            151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194,
            233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190,
            6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35,
            11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168,
            68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111,
            229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102,
            143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18,
            169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
            3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82,
            85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183,
            170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167,
            43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178,
            185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
            191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214,
            31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150,
            254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78,
            66, 215, 61, 156, 180
        ];
        for (var i = 0; i < 256; i++) {
            this.p.push(this.p[i]);
        }
    }
    // Gets the gradient at a cell given a hash
    Perlin2D.prototype.grad = function (hash, x, y) {
        var h = hash & 15;
        var u = h < 8 ? x : y;
        var v = h < 4 ? y : (h == 12 || h == 14 ? x : 0);
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    };

    // Cosine interpolation
    Perlin2D.prototype.interp = function (t, a, b) {
        var ft = t * Math.PI;
        var f = (1 - Math.cos(ft)) * 0.5;
        return a * (1 - f) + b * f;
    };

    // 2D perlin noise at real coordinate (x,y)
    Perlin2D.prototype.noise = function (x, y) {
        // find grid cell and relative position
        var X = Math.floor(x) & 255;
        var Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);

        // Noise contribution from the 4 corners
        var A = this.p[X] + Y;
        var B = this.p[X + 1] + Y;
        var g000 = this.grad(this.p[this.p[A]], x, y);
        var g001 = this.grad(this.p[this.p[B]], x - 1, y);
        var g010 = this.grad(this.p[this.p[A + 1]], x, y - 1);
        var g011 = this.grad(this.p[this.p[B + 1]], x - 1, y - 1);

        // Interpolate the 4 corners
        return this.interp(y, this.interp(x, g000, g001), this.interp(x, g010, g011));
    };
    return Perlin2D;
})();


Array.prototype.has = function (obj) {
    var i = this.length;
    while (i--)
        if (this[i] == obj)
            return true;
    return false;
};
//# sourceMappingURL=utils.js.map
