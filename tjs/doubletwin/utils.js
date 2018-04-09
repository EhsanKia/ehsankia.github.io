function normalizeUvs(geo){
	var f = geo.faceVertexUvs[0];
	for (var i=0; i<f.length; i++){
		for (var j=0; j<f[i].length; j++){
			f[i][j].x /= 256;
			f[i][j].y /= 316;
		}
	}
}

function translateUvs(face, x, y){
	for (var i=0; i<face.length; i++){
		face[i].x += x;
		face[i].y += y
	}
}

function uniqueRandomSubset(size, range){
	arr = [];
	while (arr.length < size){
		var i = Math.floor(Math.random()*range);
		if (arr.indexOf(i) < 0)
			arr.push(i);
	}
	return arr;
}

var m_u = 521288629;
var m_v = 362436069;
function seededRandom(seed) {
	var count = 0;
	for (var i=0; i<seed.length; i++)
		count += seed.charCodeAt(i);

	for (var i=0; i<count; i++){
		m_u = 36969 * (m_u & 65535) + (m_u >>> 16);
		m_v = 18000 * (m_v & 65535) + (m_v >>> 16);
	}

	var rand = ((m_u << 16)>>>0) + m_v;
	return (rand + 1.0) * 1.826e-10;
}

function selectPeerID(){
	var myid = document.querySelector("#myid");
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(myid);
	selection.removeAllRanges();
	selection.addRange(range);
	selection.setBaseAndExtent(myid, 0, myid, 1);
}

function preloadImage(url){
    var img = new Image();
    img.src = url;
}