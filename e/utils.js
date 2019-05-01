Image.prototype.load = function(url, callback) {
	this.onload = () => {
		const cvs = document.getElementById('cvs');
		const ctx = cvs.getContext('2d');
		cvs.setAttribute("width", this.width);
		cvs.setAttribute("height", this.height);
		ctx.drawImage(this, 0, 0, this.width, this.height);
        this.imageData = ctx.getImageData(0, 0, img.width, img.height).data;
		if (callback) callback()
	};
	this.crossOrigin = "anonymous";
	this.src = url;
}

Image.prototype.getColor = function(x, y) {
	y = Math.max(0, Math.min(this.height - 1, y|0));
	x = Math.max(0, Math.min(this.width - 1, x|0));
	const start = (y * this.width + x) * 4;
	return this.imageData.slice(start, start + 4);
};

function randint(n) {
	return Math.round(Math.random() * n)
}

function dist(p1, p2) {
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

class Polygon {
	constructor(...vertices) {
		this.vertices = vertices;
		this.error = 0;
	}

	center() {
		const sides = this.vertices.length;
		return [
			this.vertices.reduce((sum, point) => sum + point[0], 0) / sides,
			this.vertices.reduce((sum, point) => sum + point[1], 0) / sides,
		];
	}

	draw(ctx, img) {
		const [cx, cy] = this.center();
		const [r, g, b] = img.getColor(cx, cy);

		ctx.beginPath();
		ctx.moveTo(this.vertices[0], this.vertices[1]);
		this.vertices.forEach(v => ctx.lineTo(v[0], v[1]));
		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.fill();

		this.error = this.getError(img);
	}

	getError(img) {
		const [a, b] = [this.vertices[0], this.vertices[2]]
		const [r1, g1, b1] = img.getColor(a[0], a[1]);
		const [r2, g2, b2] = img.getColor(b[0], b[1]);
		const colorError = 2 * Math.pow(r1 - r2, 2) + 4 * Math.pow(g1 - g2, 2) + 3 * Math.pow(b1 - b2, 2);
		return Math.sqrt(colorError) + 2 * dist(a, b);
	}
}

class Rectangle extends Polygon {
	constructor(width, height) {
		super([0, 0], [width, 0], [width, height], [0, height]);
	}

	split() {
		const [v1, v2, v3, v4] = this.vertices;
		return [
			new Triangle(v1, v2, v3),
			new Triangle(v3, v4, v1),
		];
	}
}

class Triangle extends Polygon {
	split() {
		const [a, b, c] = this.vertices;
		const d = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
		return [
			new Triangle(b, d, a),
			new Triangle(c, d, b),
		];
	}
}

function nanoq(max, compare) {
  this.tree = !max ? [0]:(max<65536 ? (max<256 ? new Uint8Array(max):new Uint16Array(max)):new Uint32Array(max));
  this.p = Number(!!(this.cmp = compare || function(a,b){return a>b}));  // lol?
  this.peek = function() {return this.tree[1];};
  this.length = function() {return this.p-1;};
  this.push = function(n) {
      var q=this.p++, p, v, t = this.tree, c = this.cmp;
      while((p = q >> 1) > 0) {
        v = t[p];
        if (c(n, v)) break;
        t[q] = v; q=p;
      }
      t[q] = n;
  };
  this.pop = function() {
    if (this.p==1) return null;
    var t = this.tree, c = this.cmp, p=--this.p, r=t[1], b=t[p], n=1, j, v;
    while((j = n << 1) < p) {
      if (j+1 <= p) if (c(t[j],t[j+1])) j++; v = t[j];
      if (c(v, b)) break;
      t[n] = v; n = j;
    }
    t[n] = b;
    return r;
  };
}