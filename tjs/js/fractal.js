if (!Detector.webgl) Detector.addGetWebGLMessage();

var FOVY = Math.PI/4;  // 45 degree vertical field of view

var gStats, gCamera, gRTCamera, gControls, gScene, gRenderer, gScreen, gUniforms;
var gClock = new THREE.Clock();
var gParams;

function init() {
	gStats = new Stats();
	gStats.domElement.style.position = 'absolute';
	gStats.domElement.style.top = '0px';
	document.body.appendChild( gStats.domElement );

	// SCENES
	gScene = new THREE.Scene();

	// CAMERAS
	gCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1, 1);
	gRTCamera = new THREE.PerspectiveCamera(45, 1.0, 0.1, 100);
	gRTCamera.position.set(2, -1.5, 3);
	gRTCamera.up.set(0,-1,0);

	// RENDERER
	gRenderer = new THREE.WebGLRenderer({precision:'highp'});
	gRenderer.setSize(window.innerWidth, window.innerHeight);
	$('body').append(gRenderer.domElement);

	// Controls
	gControls = controls = new THREE.OrbitControls(gRTCamera);
	gControls.target.set(0, 0, 0);
	gControls.minDistance = 1;
	gControls.maxDistance = 6;
	gControls.zoomSpeed = 2;
	gControls.noPan = true;
	gControls.autoRotate = true;
	controls.addEventListener( 'change', function(){
		gRTCamera.updateMatrixWorld();
	});

	// EVENTS
	window.addEventListener('resize', onWindowResize, false);

	// SHADERS
	gUniforms = {
		colorSteps: {type: "i", value: 5},
		mixRatio:   {type: "f", value: 0.5},
		dist:   {type: "f", value: 1.0 / Math.tan(FOVY * 0.5)},
		aspect: {type: "f", value: window.innerWidth / window.innerHeight},
		camera: {type: "m4", value: gRTCamera.matrixWorld},
		rot1:   {type: "m4", value: new THREE.Matrix4()},
		rot2:   {type: "m4", value: new THREE.Matrix4()}
	};

	var shader = new THREE.ShaderMaterial({
		uniforms:		gUniforms,
		vertexShader:	$("#shader-vs").text(),
		fragmentShader:	$("#shader-fs").text()
	});

	// Screen on which we run frag-shader
	gScreen = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shader);
  	gScene.add(gScreen);

	// GUI
	setupGui();

	animate();
}

// EVENT HANDLERS
function onWindowResize() {
	gRenderer.setSize(window.innerWidth, window.innerHeight);
	gUniforms.aspect.value = window.innerWidth / window.innerHeight;
}

function setupGui() {
	gParams = {
		quality: 1.0,
		autoRotate: true,
		mixRatio: 0.5,
		colorSteps: 5,
		rotX1: 0.0,
		rotY1: 0.0,
		rotZ1: 0.0,
		rotX2: 0.0,
		rotY2: 0.0,
		rotZ2: 0.0,
	};

	var gui = new dat.GUI();
	var ar = gui.add(gParams, "autoRotate");
	var q = gui.add(gParams, "quality", 0.1, 2.0);
	var mr = gui.add(gParams, "mixRatio", 0, 1);
	var cs = gui.add(gParams, "colorSteps", 0, 13).step(1);
	var ox1 = gui.add(gParams, "rotX1", 0, Math.PI);
	var oy1 = gui.add(gParams, "rotY1", 0, Math.PI);
	var oz1 = gui.add(gParams, "rotZ1", 0, Math.PI);
	var ox2 = gui.add(gParams, "rotX2", 0, Math.PI);
	var oy2 = gui.add(gParams, "rotY2", 0, Math.PI);
	var oz2 = gui.add(gParams, "rotZ2", 0, Math.PI);

	ar.onChange(function(){gControls.autoRotate = !gControls.autoRotate;});
	ox1.onChange(updateRotation1);
	oy1.onChange(updateRotation1);
	oz1.onChange(updateRotation1);
	ox2.onChange(updateRotation2);
	oy2.onChange(updateRotation2);
	oz2.onChange(updateRotation2);
	cs.onChange(function(v){gUniforms.colorSteps.value = v;});
	mr.onChange(function(v){gUniforms.mixRatio.value = v;});
	q.onChange(function(v){
		gRenderer.setSize(window.innerWidth * v, window.innerHeight * v);
	});
}

function updateRotation1(){
	var v = new THREE.Euler(gParams.rotX1, gParams.rotY1, gParams.rotZ1);
	gUniforms.rot1.value.makeRotationFromEuler(v);
}
function updateRotation2(){
	var v = new THREE.Euler(gParams.rotX2, gParams.rotY2, gParams.rotZ2);
	gUniforms.rot2.value.makeRotationFromEuler(v);
}

//ANIMATION
function animate() {
	gStats.update()
	var delta = gClock.getDelta();
	gControls.update(delta);
	gRenderer.render(gScene, gCamera);
	requestAnimationFrame(animate);
}

$(document).ready(function() {
	$("#shader-fs").load("shaders/fractal.fs", init);
});