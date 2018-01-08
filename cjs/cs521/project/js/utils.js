EPSILON = 1e-5;

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

    Vector.scale = function (k, v) {
        return new Vector(k * v.x, k * v.y);
    };

    Vector.sub = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    };

    Vector.add = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };

    Vector.dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };

    Vector.distSquare = function (v1, v2) {
        return Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2);
    };

    Vector.dist = function (v1, v2) {
        return Math.sqrt(Vector.distSquare(v1, v2));
    };

    Vector.mag = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };

    Vector.norm = function (v) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.scale(div, v);
    };

    Vector.cross = function (v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    };

    Vector.rotate = function (a, v) {
        var s = Math.sin(a);
        var c = Math.cos(a);
        return new Vector(v.x * c - v.y * s, v.x * s + v.y * c);
    };

    Vector.limit = function (v, m) {
        var mag = Vector.mag(v);
        if (mag > m) {
            return Vector.scale(m / mag, v);
        } else if (mag < 0.00001) {
            return new Vector(0, 0);
        } else {
            return v;
        }
    };
    return Vector;
})();

// Check if array contains an object
Array.prototype.has = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    ;
    return false;
};

// Remove an object from an array
Array.prototype.remove = function (obj) {
    this.splice(this.indexOf(obj), 1);
};

// Checks if object has any properties
Object.prototype.isEmpty = function () {
    for (var prop in this) {
        if (this.hasOwnProperty(prop))
            return false;
    }
    return true;
};

// Various Random functions
var Random = (function () {
    function Random() {
    }
    Random.rand = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    Random.randint = function (min, max) {
        return Math.floor(Random.rand(min, max));
    };
    return Random;
})();

// Converts hex color to RGB
// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRGB(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Creates a 2D matrix of specified size filled with 0's
// http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
function createMatrix(row, col) {
    var arr = [];
    for (var i = 0; i < row; i++) {
        arr.push([]);
        arr[i].push(new Array(col));
        for (var j = 0; j < col; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}
//# sourceMappingURL=utils.js.map
