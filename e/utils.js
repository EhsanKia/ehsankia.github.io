function start(callback) {
	let step = 0;
	let speed = 2;
	let lastTime = new Date().getTime();

	// Setup speed bindings
	for (let i = 1; i <= 7; i++) {
		Mousetrap.bind(i.toString(), () => speed = 2 ** (i - 1));
	}

	const loop = () => {
		for (var i = 0; i < speed; i++) {
			const time = new Date().getTime();
			const elapsed = lastTime ? time - lastTime : 0;
			callback(step, elapsed);
			lastTime = time;
			step++;
		}

		requestAnimationFrame(loop);
	}
	loop();
}

function getUrlParam(name, defaultValue) {
	var urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name) || defaultValue;
}

Image.prototype.load = function(url, callback) {
	this.onload = () => {
		const cvs = document.getElementById('cvs');
		const ctx = cvs.getContext('2d');
		cvs.setAttribute("width", this.width);
		cvs.setAttribute("height", this.height);
		ctx.drawImage(this, 0, 0, this.width, this.height);
        this.imageData = ctx.getImageData(0, 0, img.width, img.height);
        ctx.clearRect(0, 0, this.width, this.height);
		if (callback) callback()
	};
	this.crossOrigin = "anonymous";
	this.src = getUrlParam('url', url);

	// Setup debug bindings
	Mousetrap.bind('z', () => this.style.opacity = 1 - this.style.opacity);
	Mousetrap.bind('x', () => this.style.zIndex = 2 - this.style.zIndex);
}

Image.prototype.getColor = function(x, y) {
	y = Math.max(0, Math.min(this.height - 1, y|0));
	x = Math.max(0, Math.min(this.width - 1, x|0));
	const start = (y * this.width + x) * 4;
	return this.imageData.data.slice(start, start + 4);
};

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0;  // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [ h, s, l ];
}

function randint(n) {
	return Math.round(Math.random() * n)
}

function dist(p1, p2) {
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function threshold(value, limits, outputs) {
	const ind = limits.findIndex(lim => value < lim);
	return outputs[ind === -1 ? outputs.length - 1 : ind];
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
		return Math.sqrt(colorError) + 4 * dist(a, b);
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

/* mousetrap v1.6.3 craig.is/killing/mice */
(function(q,u,c){function v(a,b,g){a.addEventListener?a.addEventListener(b,g,!1):a.attachEvent("on"+b,g)}function z(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return n[a.which]?n[a.which]:r[a.which]?r[a.which]:String.fromCharCode(a.which).toLowerCase()}function F(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function w(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function A(a,b){var g,d=[];var e=a;"+"===e?e=["+"]:(e=e.replace(/\+{2}/g,"+plus"),e=e.split("+"));for(g=0;g<e.length;++g){var m=e[g];B[m]&&(m=B[m]);b&&"keypress"!=b&&C[m]&&(m=C[m],d.push("shift"));w(m)&&d.push(m)}e=m;g=b;if(!g){if(!p){p={};for(var c in n)95<c&&112>c||n.hasOwnProperty(c)&&(p[n[c]]=c)}g=p[e]?"keydown":"keypress"}"keypress"==g&&d.length&&(g="keydown");return{key:m,modifiers:d,action:g}}function D(a,b){return null===a||a===u?!1:a===b?!0:D(a.parentNode,b)}function d(a){function b(a){a=
a||{};var b=!1,l;for(l in p)a[l]?b=!0:p[l]=0;b||(x=!1)}function g(a,b,t,f,g,d){var l,E=[],h=t.type;if(!k._callbacks[a])return[];"keyup"==h&&w(a)&&(b=[a]);for(l=0;l<k._callbacks[a].length;++l){var c=k._callbacks[a][l];if((f||!c.seq||p[c.seq]==c.level)&&h==c.action){var e;(e="keypress"==h&&!t.metaKey&&!t.ctrlKey)||(e=c.modifiers,e=b.sort().join(",")===e.sort().join(","));e&&(e=f&&c.seq==f&&c.level==d,(!f&&c.combo==g||e)&&k._callbacks[a].splice(l,1),E.push(c))}}return E}function c(a,b,c,f){k.stopCallback(b,
b.target||b.srcElement,c,f)||!1!==a(b,c)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function e(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=z(a);b&&("keyup"==a.type&&y===b?y=!1:k.handleKey(b,F(a),a))}function m(a,g,t,f){function h(c){return function(){x=c;++p[a];clearTimeout(q);q=setTimeout(b,1E3)}}function l(g){c(t,g,a);"keyup"!==f&&(y=z(g));setTimeout(b,10)}for(var d=p[a]=0;d<g.length;++d){var e=d+1===g.length?l:h(f||
A(g[d+1]).action);n(g[d],e,f,a,d)}}function n(a,b,c,f,d){k._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var e=a.split(" ");1<e.length?m(a,e,b,c):(c=A(a,c),k._callbacks[c.key]=k._callbacks[c.key]||[],g(c.key,c.modifiers,{type:c.action},f,a,d),k._callbacks[c.key][f?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:f,level:d,combo:a}))}var k=this;a=a||u;if(!(k instanceof d))return new d(a);k.target=a;k._callbacks={};k._directMap={};var p={},q,y=!1,r=!1,x=!1;k._handleKey=function(a,
d,e){var f=g(a,d,e),h;d={};var k=0,l=!1;for(h=0;h<f.length;++h)f[h].seq&&(k=Math.max(k,f[h].level));for(h=0;h<f.length;++h)f[h].seq?f[h].level==k&&(l=!0,d[f[h].seq]=1,c(f[h].callback,e,f[h].combo,f[h].seq)):l||c(f[h].callback,e,f[h].combo);f="keypress"==e.type&&r;e.type!=x||w(a)||f||b(d);r=l&&"keydown"==e.type};k._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)n(a[d],b,c)};v(a,"keypress",e);v(a,"keydown",e);v(a,"keyup",e)}if(q){var n={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",
18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},r={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},C={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},B={option:"alt",command:"meta","return":"enter",
escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p;for(c=1;20>c;++c)n[111+c]="f"+c;for(c=0;9>=c;++c)n[c+96]=c.toString();d.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};d.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};d.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};d.prototype.reset=function(){this._callbacks={};
this._directMap={};return this};d.prototype.stopCallback=function(a,b){if(-1<(" "+b.className+" ").indexOf(" mousetrap ")||D(b,this.target))return!1;if("composedPath"in a&&"function"===typeof a.composedPath){var c=a.composedPath()[0];c!==a.target&&(b=c)}return"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};d.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};d.addKeycodes=function(a){for(var b in a)a.hasOwnProperty(b)&&(n[b]=a[b]);p=null};
d.init=function(){var a=d(u),b;for(b in a)"_"!==b.charAt(0)&&(d[b]=function(b){return function(){return a[b].apply(a,arguments)}}(b))};d.init();q.Mousetrap=d;"undefined"!==typeof module&&module.exports&&(module.exports=d);"function"===typeof define&&define.amd&&define(function(){return d})}})("undefined"!==typeof window?window:null,"undefined"!==typeof window?document:null);