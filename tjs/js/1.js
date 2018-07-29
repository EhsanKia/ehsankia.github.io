if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene, renderer;
var clock = new THREE.Clock();
var cameraControls;
var params;
var cube;

function init() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
	camera.position.z = 5;
	scene.add(camera);	

	// RENDERER
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	renderer.setClearColorHex(0xaaaaaa, 1);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// EVENTS
	window.addEventListener('resize', onWindowResize, false );

	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0, 0, 0);

	// MATERIALS
	var matSolid = new THREE.MeshBasicMaterial({color:0x2A2A2A, side: THREE.DoubleSide});
	var matWire = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
	var mat = [matSolid]

	spike = new THREE.Object3D();
	var totY = 0;
	for (var i = 1; i <= 6; i++) {
		var w = Math.pow(2.5, i);
		var h = (8-i)/12;
		var geo = new THREE.CylinderGeometry(i==6 ? 0 : 1/w, 2.5/w, h, 4, 1, true);
		section = THREE.SceneUtils.createMultiMaterialObject(geo, mat);
		section.position.y += totY + h/2 + 0.001*i;
		totY += h;
		spike.add(section);
	}
	spike.rotation.setY(Math.PI/4);

	// MESHES
	for (var x = -10; x <= 10; x++) {
		for (var y = -10; y <= 10; y++) {
			var s = spike.clone();
			s.position.setX(x*1.4);
			s.position.setZ(y*1.4);
			scene.add(s);
		};
	};	

	// GUI
	setupGui();
}
	
// EVENT HANDLERS
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function setupGui() {
	params = {
		cubeSize: 2.0
	};

	var gui = new dat.GUI();
	var cs = gui.add(params, "cubeSize", 1.0, 5.0, 0.5);

	cs.onChange(function(size){
		cube.scale.set(size, size, size);
	});
}


//ANIMATION
function animate() {
	requestAnimationFrame(animate);
	stats.update()
	render();	
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	renderer.render(scene, camera);
}

init();
animate();
