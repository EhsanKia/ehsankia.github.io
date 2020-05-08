/* global FPSMeter */

var tracklist = document.getElementById("tracklist");
var bg_stars = document.getElementById("bg_stars");
var sky = document.getElementById("sky");
var star = document.getElementById("star");
var doge = document.getElementById("doge");
var lights = [
	document.getElementById("light3"),
	document.getElementById("light2"),
	document.getElementById("light1"),
];

var canvas = document.getElementById("canvas1");
var canvasCtx = canvas.getContext('2d');

var canvas2 = document.getElementById("canvas2");
var canvasCtx2 = canvas2.getContext('2d');
canvasCtx2.strokeStyle = 'white';

var canvas3 = document.getElementById("canvas3");
var canvasCtx3 = canvas3.getContext('2d');
var grd = canvasCtx3.createLinearGradient(0,0,0,600);
grd.addColorStop(0, "rgb(100, 200, 255)");
grd.addColorStop(1, "rgba(255, 255, 255, 0)");
canvasCtx3.fillStyle = 'rgba(0, 0, 0, 0.03)';
canvasCtx3.globalCompositeOperation  = 'destination-out';
canvasCtx3.shadowColor = 'rgb(100, 200, 255)';
canvasCtx3.shadowBlur = 10;
canvasCtx3.shadowOffsetX = 0;
canvasCtx3.shadowOffsetY = 0;
var barSat = 100;
var barMult = 1;

var audio, songs, meter;
var audioCtx = new window.AudioContext();
var analyser = audioCtx.createAnalyser();

// navigator.webkitGetUserMedia({audio:true}, function(stream) {
// 	var microphone = audioCtx.createMediaStreamSource(stream);
// 	microphone.connect(analyser);
// }, function() {
// 	alert('Error capturing audio.');
// });

var mouseTime = 0;
document.onmousemove = function() {
	mouseTime = new Date().getTime();
};

// Wait for window.onload to fire. See crbug.com/112368
window.addEventListener('load', function() {
	audio = new Audio();
	audio.controls = true;
	audio.onplay = function() {
		audioCtx.resume();
	}
	audio.onended = function() {
		var track = songs.pop();
		loadSong(track);
		songs.unshift(track);
	};

	songs = ["creamonchrome"];
	doge.src = "img/duck.png"
	audio.volume = 0.2;
	barSat = 0;

	// audio.onvolumechange = function() {
	// 	var range = analyser.maxDecibels - analyser.minDecibels;
	// 	var current = analyser.minDecibels + range * audio.volume;
	// 	volumeRatio = current / analyser.maxDecibels;
	// };

	songs = songs.shuffle();
	var track = songs.pop();
	loadSong(track);
	songs.unshift(track);
	document.body.appendChild(audio);

	// Our <audio> element will be the audio source.
	var source = audioCtx.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(audioCtx.destination);

	meter = new FPSMeter({
		left: 'auto',
		right: '5px',
		opacity: 0.3,
		transition: 'opacity 0.2s',
	});

	rafCallback();
}, false);

var freqHistory = [];
var timeHistory = [];
var lightsEnabled = [false, false, false];
var starActive = false;
var laserActive = false;
function rafCallback() {
	window.requestAnimationFrame(rafCallback);
	meter.tickStart();

	if (new Date().getTime() - mouseTime < 500) {
		meter.el.container.style.opacity = 0.3;
		tracklist.style.opacity = 0.3;
		audio.style.opacity = 0.5;
	} else {
		meter.el.container.style.opacity = 0;
		tracklist.style.opacity = 0;
		audio.style.opacity = 0;
	}

	var i;
	var freqByteData = new Uint8Array(analyser.frequencyBinCount);
	var timeByteData = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(freqByteData);
	analyser.getByteTimeDomainData(timeByteData);
	freqHistory.unshift(freqByteData);
	timeHistory.unshift(timeByteData);
	if (freqHistory.length > 50) {
		freqHistory.pop();
		timeHistory.pop();
	}

	canvasCtx.clearRect (0, 0, canvas.width, canvas.height);
	for (i = 0; i < BINS; i++) {
		var barHeight = barMult * getFreqBar(i) * canvas.height - 3;
		canvasCtx.fillStyle = 'hsl(' + (i*4) + ', ' + barSat + '%,' + (10 + barHeight / 10) + '%)';
		canvasCtx.strokeRect(960 + i * BARS, canvas.height, BARS, -barHeight);
		canvasCtx.fillRect(960 + i * BARS, canvas.height, BARS, -barHeight);
		if (i > 0) {
			canvasCtx.strokeRect(960 - i * BARS, canvas.height, BARS, -barHeight);
			canvasCtx.fillRect(960 - i * BARS, canvas.height, BARS, -barHeight);
		}

		var lineHeight = barMult * getMaxFreqBar(i, 10) * canvas.height - 3;
		canvasCtx.fillStyle = "hsla(" + (lineHeight/2) + ", 80%, 50%, 0.8)";
		canvasCtx.fillRect(960 + i * BARS, canvas.height - lineHeight, BARS, 1);
		canvasCtx.fillRect(960 - i * BARS, canvas.height - lineHeight, BARS, 1);
	}

	canvasCtx2.clearRect(0, 0, canvas2.width, canvas2.height);
	canvasCtx2.beginPath();
	canvasCtx2.moveTo(0, getAverageTimeBar(0) + MOUNTAIN[0]);
	for (i = 1; i < 960; i++) {
		var pos = (getAverageTimeBar(i, 5) * 0.5 - 64) * Math.pow(barMult, 2) + 128 + MOUNTAIN[i];
		canvasCtx2.lineTo(i * 2, pos);
	}
	canvasCtx2.stroke();

	// var v1 = 1 + getAverageFreqBar(40, 5);
	// if (doge.style.webkitFilter === undefined) {
	// 	doge.style.filter = "brightness(" + v1 + ")";
	// } else {
	// 	doge.style.webkitFilter = "brightness(" + v1 + ")";
	// }

	var v3 = Math.max(0, getAverageFreqBar(0, 3) * 0.8 - 0.4);
	sky.style.opacity = v3;

	var v4 = 0.5 + getFreqBar(48) * 2;
	bg_stars.style.opacity = v4;

	for (i = 0; i < lightsEnabled.length; i++) {
		var level = Math.sqrt(barMult) * getAverageFreqBar((i + 1) * 8, 3) * (i + 1);
		if (lightsEnabled[i]) {
			lights[i].style.opacity = level;
			if (level < 0.5) lightsEnabled[i] = false;
		} else {
			var brightness = parseFloat(lights[i].style.opacity || 1);
			brightness = Math.max(0, brightness - 0.05);
			lights[i].style.opacity = brightness;

			if (level > 0.6) lightsEnabled[i] = true;
		}
	}

	if (!starActive && Math.random() < 0.001) {
		starActive = true;
		star.style.transform = "rotate(30deg)";
		setTimeout(function() {
			star.style.opacity = 0;
			star.style.transform = "rotate(-10deg)";
		}, 3000);
		setTimeout(function() {
			star.style.opacity = 0.3;
			starActive = false;
		}, 10000);
	}

	var laserEnabled = getAverageFreqBar(15, 40) / Math.pow(barMult, 2) < 0.3;

	canvasCtx3.fillRect(0, 0, canvas3.width, canvas3.height);

	if (laserEnabled && !laserActive && getDiffTimeBar(10) * Math.pow(barMult, 2) > 25) {
		canvasCtx3.save();
		canvasCtx3.translate(Math.random() * 400 + 300, canvas3.height);
		canvasCtx3.rotate(Math.PI + Math.random() * 1 - 0.5);
		canvasCtx3.fillStyle = grd;
		canvasCtx3.globalCompositeOperation  = 'source-over';
		canvasCtx3.fillRect(0, 0, 10, canvas3.height);
		canvasCtx3.restore();

		laserActive = true;
		setTimeout(function(){laserActive = false;}, 100);
	}

	// if (!laserEnabled && audio.currentTime > 100 && groovy.style.opacity !== "1") {
	// 	groovy.style.display = "block";
	// 	groovy.style.opacity = "1";
	// 	setTimeout(function() {
	// 		groovy.style.display = "none";
	// 	}, 15 * 1000);
	// }

	// if (groovy.style.opacity === "1") {
	// 	// animateText();
	// }

	meter.tick();
}

var BINS = 128;
var BARS = analyser.frequencyBinCount/BINS;
function getFreqBar(i) {
	var total = 0;
	for (var j = 0; j < BARS; j++) {
		total += freqHistory[0][i * BARS + j];
	}

	return adjust(total / BARS);
}

function getAverageFreqBar(i, d) {
	d = Math.min(d, freqHistory.length);

	var total = 0;
	for (var k = 0; k < d; k++) {
		for (var j = 0; j < BARS; j++) {
			total += freqHistory[k][i * BARS + j];
		}
	}

	return adjust(total / BARS / d);
}

function getMaxFreqBar(i, d) {
	d = Math.min(d, freqHistory.length);

	var max = 0;
	for (var k = 0; k < d; k++) {
		var total = 0;
		for (var j = 0; j < BARS; j++) {
			total += freqHistory[k][i * BARS + j];
		}
		max = Math.max(max, total);
	}

	return adjust(max / BARS);
}

var volumeRatio = 1;
function getDiffTimeBar(d) {
	d = Math.min(d, freqHistory.length) - 1;

	var total1 = 0;
	var total2 = 0;
	for (var j = 0; j < analyser.frequencyBinCount; j++) {
		total1 += Math.abs(timeHistory[0][j] - 127);
		total2 += Math.abs(timeHistory[d][j] - 127);
	}

	var value = (total1 - total2) / analyser.frequencyBinCount;
	return (value - 128) * volumeRatio + 128;
}

function getAverageTimeBar(i, d) {
	d = Math.min(d, freqHistory.length);

	var total = 0;
	for (var k = 0; k < d; k++) {
		total += timeHistory[k][i];
	}

	return (total / d - 128) * volumeRatio + 128;
}

function adjust(v) {
	return Math.pow(v * volumeRatio, 2) / Math.pow(255, 2);
}

function loadSong(name) {
	audio.src = 'music/' + name + '.mp3';
	if (name === "shitsong")
		audio.currentTime = 19;
	groovy.style.opacity = "0";
}

Array.prototype.shuffle = function() {
  var currentIndex = this.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = this[currentIndex];
    this[currentIndex] = this[randomIndex];
    this[randomIndex] = temporaryValue;
  }

  return this;
};

var MOUNTAIN = [113, 113, 111, 111, 111, 111, 111, 113, 115, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 115, 115, 115, 115, 113, 113, 113, 113, 113, 111, 111, 111, 111, 111, 111, 111, 111, 111, 113, 113, 113, 113, 113, 113, 115, 115, 115, 117, 119, 119, 119, 119, 121, 121, 121, 123, 123, 125, 127, 127, 127, 129, 129, 129, 129, 131, 133, 133, 135, 135, 135, 135, 135, 135, 137, 137, 137, 139, 141, 143, 141, 141, 141, 141, 141, 141, 141, 143, 143, 145, 145, 145, 145, 145, 145, 145, 145, 147, 147, 149, 149, 151, 151, 153, 153, 155, 155, 155, 155, 155, 157, 157, 159, 161, 163, 163, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 165, 167, 167, 167, 167, 167, 165, 165, 165, 163, 161, 159, 157, 157, 157, 157, 157, 157, 157, 157, 157, 155, 155, 153, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 151, 153, 153, 155, 155, 157, 157, 159, 159, 159, 161, 161, 163, 163, 163, 165, 165, 165, 167, 167, 169, 169, 169, 171, 171, 171, 171, 171, 171, 171, 171, 171, 171, 171, 171, 171, 171, 171, 173, 173, 173, 173, 175, 175, 177, 177, 177, 179, 179, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 181, 183, 183, 185, 185, 187, 187, 187, 189, 189, 189, 187, 187, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 187, 185, 185, 185, 185, 183, 183, 183, 183, 183, 185, 185, 187, 189, 189, 191, 193, 193, 193, 195, 195, 197, 197, 197, 197, 197, 199, 199, 199, 199, 199, 199, 199, 201, 201, 201, 201, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 201, 201, 201, 201, 201, 199, 199, 197, 197, 195, 193, 191, 191, 191, 191, 191, 193, 193, 195, 195, 197, 197, 199, 199, 197, 197, 197, 197, 197, 197, 197, 197, 197, 199, 199, 199, 199, 199, 197, 197, 197, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 193, 193, 193, 193, 193, 191, 189, 187, 187, 185, 185, 185, 183, 181, 179, 177, 175, 171, 165, 149, 147, 145, 143, 135, 133, 133, 131, 131, 129, 121, 117, 111, 109, 107, 105, 103, 101, 97, 95, 93, 91, 83, 81, 73, 71, 61, 59, 59, 59, 59, 53, 53, 53, 37, 31, 25, 23, 21, 19, 17, 17, 17, 17, 17, 19, 19, 21, 21, 23, 25, 27, 29, 31, 35, 37, 39, 41, 43, 45, 47, 49, 53, 55, 59, 61, 65, 67, 71, 75, 79, 83, 85, 99, 107, 109, 111, 113, 121, 121, 121, 121, 121, 123, 123, 123, 123, 123, 123, 125, 127, 129, 131, 131, 133, 135, 137, 139, 141, 143, 143, 145, 145, 147, 149, 149, 151, 153, 153, 155, 155, 157, 159, 159, 161, 161, 163, 165, 165, 167, 167, 169, 171, 171, 173, 175, 177, 177, 179, 181, 183, 185, 187, 189, 191, 193, 195, 197, 197, 199, 201, 203, 205, 207, 209, 213, 215, 215, 217, 219, 221, 223, 225, 227, 227, 229, 231, 231, 233, 233, 235, 237, 239, 239, 241, 243, 245, 245, 245, 243, 241, 237, 237, 237, 237, 237, 237, 237, 237, 237, 237, 237, 237, 239, 239, 239, 239, 239, 241, 241, 241, 241, 241, 241, 241, 241, 241, 241, 241, 241, 243, 243, 243, 243, 243, 243, 243, 243, 245, 245, 245, 245, 245, 247, 247, 247, 247, 247, 247, 249, 249, 249, 249, 249, 249, 249, 247, 247, 247, 247, 247, 245, 245, 245, 245, 245, 245, 245, 245, 245, 247, 247, 247, 247, 247, 247, 247, 247, 247, 247, 247, 249, 247, 243, 241, 239, 237, 237, 237, 237, 237, 235, 233, 233, 231, 229, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 229, 229, 229, 231, 231, 233, 233, 235, 235, 235, 237, 237, 237, 237, 237, 237, 237, 239, 239, 239, 239, 237, 237, 237, 237, 237, 237, 237, 237, 237, 237, 235, 235, 235, 235, 235, 235, 235, 235, 235, 233, 233, 233, 233, 231, 231, 231, 231, 229, 229, 229, 229, 229, 229, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 225, 227, 229, 231, 233, 231, 229, 229, 227, 225, 223, 217, 213, 211, 209, 207, 207, 205, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 205, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 203, 201, 201, 201, 201, 199, 199, 199, 199, 197, 197, 197, 195, 193, 193, 191, 189, 189, 187, 185, 185, 183, 183, 181, 179, 179, 177, 177, 177, 177, 177, 175, 173, 173, 173, 173, 171, 171, 171, 171, 171, 173, 173, 173, 173, 173, 171, 171, 171, 171, 171, 169, 169, 169, 169, 167, 165, 165, 163, 163, 161, 161, 161, 159, 157, 155, 155, 155, 155, 155, 153, 151, 151, 149, 147, 143, 143, 141, 141, 139, 137, 135, 133, 133, 131, 129, 127, 127, 127, 127, 125, 123, 121, 121, 121, 119, 117, 117, 117, 115, 115, 113, 111, 109, 109, 109, 107, 105, 105, 105, 105, 105, 105, 105, 105, 105, 107, 107, 109, 109, 111, 111, 111, 113, 113, 113, 115, 117, 119, 121, 121, 121, 121, 121, 121, 123, 123, 123, 123, 123, 123, 125, 127, 129, 129];


var colorTime = 0,
    waveTheta = 0,
    maxCount = 100,
    colorIncrement = -12,
    waveIncrement = 0.1,
    xPos = [ -2, -1, 0, 1, 2 ],
    yPos = [ -2, -1, 0, 1, 2 ],
    groovy = document.getElementById('groovy');

var getTextShadow = function(x, y, hue) {
	return ', ' + x + 'px ' + y + 'px hsl(' + hue + ', 100%, 50%)';
};

function animateText() {
	var shadows = '0 0 transparent',
		hue0 = colorTime % 360,
		i, j, x, y,
		iLen = xPos.length,
		jLen = yPos.length;

	// outline
	for (i = 0; i < iLen; i++) {
		x = xPos[i];
		for (j = 0; j < jLen; j++) {
			y = yPos[j];
			shadows += getTextShadow(x, y, hue0);
		}
	}

	// renders rainbow river
	for (i = 1; i < maxCount; i++) {
		var normI = i / maxCount,
		hue = (normI * 360 * 2 + colorTime) % 360;
		x = ~~((Math.sin(normI * Math.PI * 2 + waveTheta) - Math.sin(waveTheta))  * 50);
		y = i * 3;
		shadows += getTextShadow(x, y, hue);
	}

	groovy.style.textShadow = shadows;
	colorTime += colorIncrement;
	waveTheta += waveIncrement;
}