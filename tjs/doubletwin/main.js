if (!Detector.webgl) Detector.addGetWebGLMessage();

var GAME_WIDTH = 1868, GAME_HEIGHT = 1024, GAME_ASPECT = GAME_WIDTH/GAME_HEIGHT;

var clock = new THREE.Clock();
var camera, scene, renderer, projector, mouse, game, gp;
var frontMat, typeMat;
var templateMesh, numberMesh, selectAreaMesh;
var cameraControls;

var NUM_RES = 6;
typeData = [{name: "Octorac", uv: [2,0], power: [3,2,2,3]},
			{name: "Bat", uv: [2,1], power: [4,1,1,4]},
			{name: "Skeleton", uv: [2,2], power: [2,3,3,2]},
			{name: "Red Wizard", uv: [2,3], power: [6,1,1,2]},
			{name: "Slime", uv: [2,4], power: [4,3,4,4]},
			{name: "Kobra Zero", uv: [2,5], power: [7,3,3,2]},
			{name: "Scaven", uv: [2,6], power: [4,3,5,3]},
			{name: "Tork", uv: [2,7], power: [1,5,5,4]},
			{name: "Emuk", uv: [1,0], power: [4,4,4,3]},
			{name: "Zoomba", uv: [1,1], power: [5,5,5,5]},
			{name: "Pakkun", uv: [1,2], power: [6,5,5,4]},
			{name: "Wasp", uv: [1,3], power: [4,4,4,8]},
			{name: "A'tuin", uv: [1,4], power: [3,6,6,5]},
			{name: "Spider", uv: [1,5], power: [3,7,5,5]},
			{name: "Worm", uv: [1,6], power: [4,5,8,3]},
			{name: "Clink", uv: [1,7], power: [7,6,6,6]},
			{name: "Kaeris", uv: [0,0], power: [5,5,7,8]},
			{name: "Dopple", uv: [0,1], power: [6,6,6,7]},
			{name: "Kefka's Ghost", uv: [0,2], power: [5,10,5,5]},
			{name: "Undead King", uv: [0,3], power: [6,9,5,5]},
			{name: "Babamut", uv: [0,4], power: [7,7,10,6]},
			{name: "Zephyros", uv: [0,5], power: [10,5,5,10]},
			{name: "The Seed", uv: [0,6], power: [9,9,9,8]}];

resources = ['img/pointer.png',
	'img/win_lose.png',
	'img/score_numbers.png',
	'img/card_frame.png',
	'img/card_types.png',
	'img/power_numbers.png',
	'img/center_bg.jpg',
	'img/side_bg.jpg'];

function init() {
	game = {};
	
	// PRELOAD IMAGES
	for (var i = 0; i < resources.length; i++) {
		preloadImage(resources[i]);
	}

	// CONTAINER
	container = document.createElement('div');
	container.classList.add('container');
	document.body.appendChild(container);

	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	// SCENE
	scene = new THREE.Scene();
	scene.swapColor = false;
	scene.moving = true;
	scene.updating = [];

	// RENDERER
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.sortObjects = false;
	renderer.shadowMapEnabled = true;

	// CAMERA
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 50, 5000);
	camera.preferredZ = Math.round(GAME_HEIGHT*0.5/Math.tan(camera.fov/2*Math.PI/180));
	camera.position.z = GAME_ASPECT/Math.min(camera.aspect,GAME_ASPECT) * camera.preferredZ;
	scene.add(camera);	

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x888888);
	scene.add(ambientLight);

	spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(0,-500,2200);
	spotLight.shadowCameraFov = 80;
	spotLight.castShadow = true;
	spotLight.shadowMapWidth = 2048;
	spotLight.shadowMapHeight = 2048;
	spotLight.shadowBias = -0.00005;
	spotLight.intensity = 1.1;
	spotLight.angle = 0.7;
	spotLight.target.position.set(0,0,0);
	scene.add(spotLight);

	// PROJECTOR
	projector = new THREE.Projector();

	// CONTROLS
	mouse = new THREE.Vector2(),
	mouse.x = 0;
	mouse.y = 0;
	mouse.click = false;

	// EVENTS
	window.addEventListener('resize', onWindowResize, false );
	renderer.domElement.addEventListener('mousemove', onMouseMove, false);
	renderer.domElement.addEventListener('mousedown', 
		function(e){e.preventDefault(); mouse.click = true}, false);
	renderer.domElement.addEventListener('mouseup',
		function(e){e.preventDefault(); mouse.click = false}, false);
	window.addEventListener('mousewheel', function(e){e.preventDefault()}, false);

	// Prepare scene
	var bgPlane = createBackground();
	scene.add(bgPlane);
	scene.draggingPlane = bgPlane.clone();
	scene.draggingPlane.position.z += 100;
	scene.draggingPlane.traverse(function(o){o.visible = false});
	scene.add(scene.draggingPlane);

	animate();
	Gamepad.startPolling();
	document.querySelector("#modal-controls").classList.add('md-show');
}

// Menus
function choseRestart(){
	if (game.mode == 1){
		setReady();
		if (!peer.ready) return;
		restartGame();
		game.mode = 1;
		peer.ready = false;
		if (scene.swapColor)
			game.myTurn = seededRandom(peer.id) > 0.5;
		else
			game.myTurn = seededRandom(peer.conn.peer) <= 0.5;
	}
	else
		restartGame();

	document.querySelector("#modal-restart").style.top = ""
	document.querySelector(".restart").classList.remove("disabled");
	scene.moving = false;
}

function choseMouse(){
	Gamepad.stopPolling();
	document.querySelector("#modal-controls").classList.remove('md-show');
	
	if (!game.board)
		setTimeout(function(){document.querySelector("#modal-mode").classList.add('md-show');}, 500);
	else if (game.mode == 0)
		setTimeout(function(){document.querySelector("#modal-difficulty").classList.add('md-show');}, 500);
}

function choseGamepad(){
	if (Gamepad.activeGamepad == -1)
		return;

	document.querySelector("#modal-controls").classList.remove('md-show');

	if (!game.board)
		setTimeout(function(){document.querySelector("#modal-mode").classList.add('md-show');}, 500);
	else if (game.mode == 0)
		setTimeout(function(){document.querySelector("#modal-difficulty").classList.add('md-show');}, 500);

	var pointerMap = THREE.ImageUtils.loadTexture('img/pointer.png');
	var pointerGeo = new THREE.PlaneGeometry(32, 32);
	var pointerMat = new THREE.MeshBasicMaterial({map: pointerMap, transparent: true});
	var pointerMesh = new THREE.Mesh(pointerGeo, pointerMat);
	pointerMesh.position.set(10,-14,50);
	scene.pointer = new THREE.Object3D();
	scene.pointer.add(pointerMesh);

	setupGamepad();
}

function setupGamepad(){
	Gamepad.enabled = true;
	gs = {};
	gs.downTimer = 0;
	gs.upTimer = 0;
	gs.leftTimer = 0;
	gs.rightTimer = 0;
	gs.aLock = true;
	gs.bLock = true;
	gs.startLock = true;
	gs.menu = false;
	gs.placing = false;
	gs.cardInd = 0;
	gs.posInd = 4;

	scene.remove(scene.pointer);
}

function choseSingleplayer(){
	document.querySelector("#modal-mode").classList.remove('md-show');
	setTimeout(function(){
		document.querySelector("#modal-difficulty").classList.add('md-show');
	}, 500);	
}

function choseDifficulty(d){
	document.querySelector("#modal-difficulty").classList.remove('md-show');
	document.querySelector("#modal-restart").classList.add('md-show');

	if (!game.AI)
		choseRestart();

	var dif = [RandomAI, MostFlipsAI, MostFlipsAIEnhanced];
	game.AI = dif[d];
}

function choseMultiplayer(){
	document.querySelector("#modal-mode").classList.remove('md-show');
	setTimeout(function(){
		document.querySelector("#modal-peer").classList.add('md-show');
	}, 500);
	// peer = new Peer({host:'ip.ehsankia.com', port: 7100, debug: true});
	peer = new Peer({key: 'djz08k77pe0o1or'});

	peer.on('error',function(){
		document.querySelector("#error").innerHTML = "Connection failed. Invalid Peer ID?";
		document.querySelector("#loader").style.opacity = 0;
	});

	document.querySelector("#myid").innerHTML = "Loading...";

	peer.on('open', function(id){
		document.querySelector("#myid").innerHTML = id;
		document.querySelector("#connect").classList.remove('disabled');
	});

	peer.on('connection', function(conn){
		document.querySelector("#modal-peer").classList.remove('md-show');
		document.querySelector("#modal-restart").classList.add('md-show');
		peer.conn = conn;
		prepareGame();
		game.mode = 1;
		game.myTurn = seededRandom(conn.peer) <= 0.5;
		peer.ready = false;
		scene.moving = false;
		conn.on('data', getMultiplayerChoice);
		conn.on('close', function(){
			document.querySelector("#modal-disconnected").classList.add('md-show');
		});
	});
}

function connectToPeer(){
	document.querySelector("#loader").style.opacity = 1;
	var peerid = document.querySelector("#peerid").value;
	if (peerid == ""){
		document.querySelector("#error").innerHTML = "Plaese enter a Peer ID";
		document.querySelector("#loader").style.opacity = 0;
		return;
	}

	peer.conn = peer.connect(peerid);
	peer.conn.on('open',function(){
		document.querySelector("#modal-peer").classList.remove('md-show');
		document.querySelector("#modal-restart").classList.add('md-show');
		scene.swapColor = true;
		prepareGame();
		game.mode = 1;
		game.myTurn = seededRandom(peer.id) > 0.5;
		peer.ready = false;
		scene.moving = false;
	});
	peer.conn.on('data', getMultiplayerChoice);
	peer.conn.on('close', function(){
		document.querySelector("#modal-disconnected").classList.add('md-show');
	});
}

function openHelp(){
	document.querySelector("#modal-help").classList.add('md-show');
}

function closeHelp(){
	document.querySelector("#modal-help").classList.remove('md-show');
}

function openSettings(){
	Gamepad.startPolling();
	document.querySelector("#modal-controls").classList.add('md-show');
}

function prepareGame(){
	game.mode = 0;
	game.myTurn = Math.random() > 0.5;
	game.started = !game.myTurn;
	game.board = new Array(9);
	game.rScore = 0;
	game.bScore = 0;
	game.myCards = [];
	game.hisCards = [];
	game.selectedCard = undefined;
	game.selectedPos = undefined;

	var redCards = uniqueRandomSubset(5, typeData.length);
	var bluCards = uniqueRandomSubset(5, typeData.length);

	prepareCardStructures();
	for (var i=0; i<5; i++){
		var card = createCard(0, bluCards[i]);
		card.position.set(650, (i-2)*100, 50);
		card.rotation.x = 0.08;
		scene.add(card);

		card = createCard(1, redCards[i]);
		card.position.set(-650, (i-2)*100, 50);
		card.rotation.set(0.08, Math.PI, 0);
		scene.add(card);
	}

	prepareScoring();

	scene.updating.push(spotLight);
	scene.updating.push(spotLight.target);
	spotLight.target.moveTo(new THREE.Vector3(0,0,0));
	spotLight.moveTo(new THREE.Vector3(0,-500,2200));
}

function prepareScoring(){
	var winLoseMap = THREE.ImageUtils.loadTexture('img/win_lose_draw.png');
	winLoseMap.repeat.y = 1/3;
	var scoreNumberMap = THREE.ImageUtils.loadTexture('img/score_numbers.png');
	scoreNumberMap.repeat.x = 1/10;

	var winLoseGeo = new THREE.PlaneGeometry(650, 150);
	var scoreGeo = new THREE.PlaneGeometry(64, 64);

	var winLoseMat = new THREE.MeshLambertMaterial({map: winLoseMap, transparent: true});
	var scoreMat = new THREE.MeshBasicMaterial({map: scoreNumberMap, transparent: true});

	scene.winLoseMesh = new THREE.Mesh(winLoseGeo, winLoseMat);
	scene.winLoseMesh.position.z -= 1000;

	scene.rScoreMesh = new THREE.Mesh(scoreGeo, scoreMat);
	scene.rScoreMesh.position.set(-670 + 1340 * scene.swapColor,-425,10);
	scene.add(scene.rScoreMesh);
	
	scene.bScoreMesh = new THREE.Mesh(scoreGeo.clone(), scoreMat);
	scene.bScoreMesh.position.set(670 - 1340 * scene.swapColor,-425,10);
	scene.add(scene.bScoreMesh);
}

function prepareCardStructures(){
	// TEXTURES
	var maxAnisotropic = renderer.getMaxAnisotropy();
	frameMap = THREE.ImageUtils.loadTexture('img/card_frame.png');
	frameMap.repeat.x = 0.25;
	frameMap.anisotropic = maxAnisotropic;

	var typeMap = THREE.ImageUtils.loadTexture('img/card_types.png');
	typeMap.repeat.set(1/8,1/3);
	typeMat = new THREE.MeshLambertMaterial({map: typeMap, transparent: true});
	typeMat.anisotropic = maxAnisotropic;

	var powerNumberMap = THREE.ImageUtils.loadTexture('img/power_numbers.png');
	powerNumberMap.repeat.x = 1/10;
	powerNumberMap.anisotropic = maxAnisotropic;

	// Card template
	var cardShape = [	[10,0],[246,0],[251,2],[254,5],
						[256,10],[256,306],[254,311],[251,314],
						[246,316],[10,316],[5,314],[2,311],
						[0,306],[0,10],[2,5],[5,2] ];
	cardShape = cardShape.map(function(a){return new THREE.Vector2(a[0],a[1])});
	cardShape = new THREE.Shape(cardShape);
	var cardGeo = cardShape.extrude({amount: 6, bevelEnabled: false, material: 1, extrudeMaterial: 0});
	normalizeUvs(cardGeo);
	for (var i=0; i<cardGeo.faces.length; i++)
		if (cardGeo.faces[i].normal.z == 1) translateUvs(cardGeo.faceVertexUvs[0][i],1,0);

	var matArray = [];
	matArray.push(new THREE.MeshBasicMaterial({color: 0x111111}));
	matArray.push(new THREE.MeshLambertMaterial({map: frameMap, transparent: true}));
	var templateMat = new THREE.MeshFaceMaterial(matArray);
	templateMesh = new THREE.Mesh(cardGeo, templateMat);
	templateMesh.position.set(-256/2,-316/2,0);
	templateMesh.castShadow = true;
	templateMesh.receiveShadow = true;

	frontMat = new THREE.MeshLambertMaterial({map: frameMap, transparent: true});

	var numberGeo = new THREE.PlaneGeometry(32, 32);
	numberMesh = [];
	for (var i=0; i<10; i++){
		var geo = numberGeo.clone();
		geo.faceVertexUvs[0][0][0].x += i;
		geo.faceVertexUvs[0][0][1].x += i;
		geo.faceVertexUvs[0][0][2].x += i;
		geo.faceVertexUvs[0][0][3].x += i;
		var numberMat = new THREE.MeshBasicMaterial({map: powerNumberMap, transparent: true});
		numberMesh.push(new THREE.Mesh(geo, numberMat));
	}

	var selectAreaGeo  = new THREE.PlaneGeometry(252, 100);
	var selectAreaMat  = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});
	selectAreaMesh = new THREE.Mesh(selectAreaGeo, selectAreaMat);
	selectAreaMesh.position.set(0, 100, 8);
	selectAreaMesh.visible = false;
}

function createCard(color, type){
	if (scene.swapColor) color = 1 - color;

	var cardObj = new THREE.Object3D();

	var frontGeo = new THREE.PlaneGeometry(252, 310);
	for (var i=0; i<4; i++)
		frontGeo.faceVertexUvs[0][0][i].x += 2 + color;
	var bgMesh = new THREE.Mesh(frontGeo, frontMat.clone());
	bgMesh.receiveShadow = true;
	bgMesh.position.z = 5;
	cardObj.add(bgMesh);

	var data = typeData[type];
	var u = data.uv[1], v = data.uv[0];
	var typeGeo = new THREE.PlaneGeometry(252, 310);
	typeGeo.faceVertexUvs[0][0][0].set(u,v+1);
	typeGeo.faceVertexUvs[0][0][1].set(u,v);
	typeGeo.faceVertexUvs[0][0][2].set(u+1,v);
	typeGeo.faceVertexUvs[0][0][3].set(u+1,v+1);

	var typeMesh = new THREE.Mesh(typeGeo, typeMat);
	typeMesh.receiveShadow = true;
	typeMesh.position.z = 5;
	cardObj.add(typeMesh);

	cardObj.add(templateMesh.clone());

	var topPower = numberMesh[data.power[0]%10].clone()
	var leftPower = numberMesh[data.power[1]%10].clone()
	var rightPower = numberMesh[data.power[2]%10].clone()
	var bottomPower = numberMesh[data.power[3]%10].clone()
	topPower.position.set(0,130,7);
	rightPower.position.set(102,0,7);
	leftPower.position.set(-102,0,7);
	bottomPower.position.set(0,-130,7);
	cardObj.add(topPower);
	cardObj.add(rightPower);
	cardObj.add(leftPower);
	cardObj.add(bottomPower);

	if (color == scene.swapColor*1){
		var selectArea = selectAreaMesh.clone();
		cardObj.cardID = game.myCards.length;
		game.myCards.push(selectArea);
		cardObj.add(selectArea);
	}
	else{
		cardObj.cardID = game.hisCards.length;
		game.hisCards.push(cardObj);
	}

	cardObj.cardType = type;
	cardObj.power = data.power;
	cardObj.cardColor = color;

	scene.updating.push(cardObj);
	return cardObj;
}

function createBackground(){
	var bgObj = new THREE.Object3D();

	var bgCenterMap = THREE.ImageUtils.loadTexture('img/center_bg.jpg');
	var bgSideMap = THREE.ImageUtils.loadTexture('img/side_bg.jpg');
	
	var bgCenterMesh = new THREE.Mesh(new THREE.PlaneGeometry(844, 1024),
			new THREE.MeshLambertMaterial({map: bgCenterMap}) );
	bgCenterMesh.receiveShadow = true;
	bgObj.add(bgCenterMesh);

	var bgSideMesh = new THREE.Mesh(new THREE.PlaneGeometry(512, 1024),
			new THREE.MeshLambertMaterial({map: bgSideMap})	);

	var bgSidePos = [-1190,-678,678,1190];
	for (var i=0; i<4; i++){
		bgSideMesh = bgSideMesh.clone();
		bgSideMesh.position.setX(bgSidePos[i]);
		bgSideMesh.receiveShadow = true;
		bgObj.add(bgSideMesh);
	}

	var highlightGeo  = new THREE.PlaneGeometry(256, 316);
	var highlightMat  = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, transparent: true});
	highlightMat.blending = THREE.AdditiveBlending;
	var litColor = new THREE.Color(0x353535);
	highlightGeo.faces[0].vertexColors = [litColor, litColor, litColor, litColor];

	scene.highlightBoxes = [];
	for (var i=0; i<3; i++){
		for (var j=0; j<3; j++){
			var mesh = new THREE.Mesh(highlightGeo.clone(), highlightMat);
			mesh.visible = false;
			mesh.position.set((i-1)*256, (j-1)*316, 5);
			mesh.ind = i + j * 3;
			scene.highlightBoxes.push(mesh);
			bgObj.add(mesh);
		}
	}
	scene.highlightBackup = scene.highlightBoxes.slice(0);

	return bgObj;
}

function restartGame(){
	if (game.selectedPos != undefined)
		game.selectedPos.visible = false;

	scene.remove(scene.rScoreMesh);
	scene.remove(scene.bScoreMesh);

	for (var i=0; i<scene.updating.length; i++)
		scene.remove(scene.updating[i]);
	scene.add(spotLight);
	scene.updating = [];
	prepareGame();
	scene.winLoseMesh.moveTo(new THREE.Vector3(0,0,-1000));
	setTimeout(function(){scene.winLoseMesh.material.map.offset.y = 0;}, 1000);
	scene.highlightBoxes = scene.highlightBackup.slice(0);

	updateScore()

	if (Gamepad.enabled)
		setupGamepad();
}
	
function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.position.z = GAME_ASPECT/Math.min(camera.aspect,GAME_ASPECT) * camera.preferredZ;
}

function onMouseMove(e){
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}

function handleMouse(){
	var mouseVector = new THREE.Vector3(
		2*(mouse.x / window.innerWidth)-1,
		1-2*(mouse.y / window.innerHeight) );
	var raycaster = projector.pickingRay(mouseVector.clone(), camera);

	if (!mouse.click){
		if (game.selectedPos != undefined){
			var target = game.selectedPos.position.clone();
			game.selectedCard.parent.moveTo(target);
			game.selectedCard.parent.rotation.setX(0);
			var ind = game.myCards.indexOf(game.selectedCard);
			game.myCards.splice(ind, 1);
			game.board[game.selectedPos.ind] = game.selectedCard.parent;

			game.selectedPos.visible = false;
			ind = scene.highlightBoxes.indexOf(game.selectedPos);
			scene.highlightBoxes.splice(ind, 1);
			
			handleConversion(game.selectedCard.parent, game.selectedPos);

			if (game.mode == 1)
				sendMultiplayerChoice(game.selectedCard.parent, game.selectedPos);

			game.selectedCard = undefined;
			game.selectedPos = undefined;
			
			game.myTurn = false
		}

		var intersects = raycaster.intersectObjects(game.myCards, true);
		if (game.selectedCard != undefined){
			game.selectedCard.scale.set(1,1,1);
			game.selectedCard.position.setX(0);
			var y = (game.selectedCard.parent.cardID - 2) * 100;
			game.selectedCard.parent.moveTo(new THREE.Vector3(650,y,50));
			game.selectedCard = undefined;
		}
		if (intersects.length > 0){
			game.selectedCard = intersects[0].object;
			game.selectedCard.scale.set(1.3,1.2,1);
			game.selectedCard.position.setX(30);
		}
	}

	if (game.selectedCard == undefined) return;

	if (mouse.click){
		var planeIntersects = raycaster.intersectObjects([scene.draggingPlane], true);
		if (planeIntersects.length == 0) return;
		var target = planeIntersects[0].point.setZ(100);
		target.y -= 100;
		game.selectedCard.parent.moveTo(target);

		if (game.selectedPos != undefined){
			game.selectedPos.visible = false;
			game.selectedPos = undefined;
		}

		var highlightIntersects = raycaster.intersectObjects(scene.highlightBoxes, true);
		if (highlightIntersects.length != 0){
			game.selectedPos = highlightIntersects[0].object;
			game.selectedPos.visible = true;
		}
	}
	else{
		var y = (game.selectedCard.parent.cardID - 2) * 100;
		game.selectedCard.parent.moveTo(new THREE.Vector3(550,y,100));
	}
}

function handleGamepad(delta){
	if (gs.upTimer > 0) gs.upTimer -= delta;
	if (gs.downTimer > 0) gs.downTimer -= delta;
	if (gs.leftTimer > 0) gs.leftTimer -= delta;
	if (gs.rightTimer > 0) gs.rightTimer -= delta;

	if (!Gamepad.UP) gs.upTimer = 0;
	if (!Gamepad.DOWN) gs.downTimer = 0;
	if (!Gamepad.LEFT) gs.leftTimer = 0;
	if (!Gamepad.RIGHT) gs.rightTimer = 0;
	if (!Gamepad.A) gs.aLock = false;
	if (!Gamepad.B) gs.bLock = false;
	if (!Gamepad.START) gs.startLock = false;

	if (!gs.placing){
		var y = (game.myCards[gs.cardInd].parent.cardID - 2) * 100;
		game.myCards[gs.cardInd].parent.moveTo(new THREE.Vector3(650,y,50));
	}

	var mcl = game.myCards.length;
	if (Gamepad.UP && gs.upTimer <= 0){
		if (gs.placing) gs.posInd = (gs.posInd+3) % 9;
		else gs.cardInd = (gs.cardInd+1) % mcl;
	
		gs.upTimer = 0.3;
	}

	if (Gamepad.DOWN && gs.downTimer <= 0){
		if (gs.placing) gs.posInd = (gs.posInd+6) % 9;
		else gs.cardInd = (gs.cardInd+(mcl-1)) % mcl;
		
		gs.downTimer = 0.3;
	}

	if (Gamepad.LEFT && gs.leftTimer <= 0){
		if (gs.placing) gs.posInd = Math.floor(gs.posInd/3)*3 + (gs.posInd+1) % 3;

		gs.leftTimer = 0.3;
	}

	if (Gamepad.RIGHT && gs.rightTimer <= 0){
		if (gs.placing) gs.posInd = Math.floor(gs.posInd/3)*3 + (gs.posInd+2) % 3;

		gs.rightTimer = 0.3;
	}

	if (gs.placing){
		if (game.selectedPos != undefined)
			game.selectedPos.visible = false;
		game.selectedPos = undefined;
		var px = (1-(gs.posInd%3)) * 256;
		var py = (Math.floor(gs.posInd/3)-1) * 316;
		scene.pointer.position.setX(px);
		scene.pointer.position.setY(py);
		var ndc = projector.projectVector(new THREE.Vector3(px, py, 0), camera);
		var raycaster = projector.pickingRay(ndc, camera);
		var intersects = raycaster.intersectObjects(scene.highlightBoxes, true);
		if (intersects.length > 0){
			game.selectedPos = intersects[0].object;
			game.selectedPos.visible = true;
		}
	}
	else{
		var y = (game.myCards[gs.cardInd].parent.cardID - 2) * 100;
		game.myCards[gs.cardInd].parent.moveTo(new THREE.Vector3(550,y,100));
	}

	if (Gamepad.A && !gs.aLock){
		gs.aLock = true;

		if (gs.menu){
			choseRestart();
			document.querySelector("#modal-restart").style.top = "";
			gs.menu = false;
			return;
		}

		if (gs.placing && game.selectedPos != undefined){
			var target = game.selectedPos.position.clone();
			game.selectedCard = game.myCards.splice(gs.cardInd, 1)[0];

			game.selectedCard.parent.moveTo(target);
			game.selectedCard.parent.rotation.setX(0);

			game.board[game.selectedPos.ind] = game.selectedCard.parent;

			game.selectedPos.visible = false;
			ind = scene.highlightBoxes.indexOf(game.selectedPos);
			scene.highlightBoxes.splice(ind, 1);
			
			handleConversion(game.selectedCard.parent, game.selectedPos);

			if (game.mode == 1)
				sendMultiplayerChoice(game.selectedCard.parent, game.selectedPos);

			game.selectedCard = undefined;
			game.selectedPos = undefined;
			
			scene.remove(scene.pointer);
			gs.placing = false;
			gs.cardInd = 0;
			gs.posInd = 4;
			game.myTurn = false
		}
		else{
			gs.placing = true;
			scene.add(scene.pointer);
		}
	}

	if (Gamepad.B && !gs.bLock){
		gs.bLock = true;

		if (gs.menu){
			document.querySelector("#modal-restart").style.top = "";
			gs.menu = false;
			return;
		}

		if (gs.placing){
			scene.remove(scene.pointer);
			gs.placing = false;
		}
	}

	if (Gamepad.START && !gs.startLock){
		gs.startLock = true;

		var menu = document.querySelector("#modal-restart");
		if (menu.style.top == "")
			menu.style.top = "0px";			
		else
			menu.style.top = "";

		gs.menu = menu.style.top == "0px";
	}
}

function handleConversion(card, pos){
	// Check up
	if (pos.ind+3 < 9 && game.board[pos.ind+3] != undefined){
		var opp = game.board[pos.ind+3];
		if (opp.cardColor != card.cardColor && card.power[0] > opp.power[3]){
			opp.convert();
			scene.moving = true;
		}
	}

	// Check left
	if ((pos.ind+2)%3 != 2 && game.board[pos.ind-1] != undefined){
		var opp = game.board[pos.ind-1];
		if (opp.cardColor != card.cardColor && card.power[1] > opp.power[2]){
			opp.convert();
			scene.moving = true;
		}
	}

	// Check right
	if ((pos.ind+1)%3 != 0 && game.board[pos.ind+1] != undefined){
		var opp = game.board[pos.ind+1];
		if (opp.cardColor != card.cardColor && card.power[2] > opp.power[1]){
			opp.convert();
			scene.moving = true;
		}
	}

	// Check down
	if (pos.ind-3 >= 0 && game.board[pos.ind-3] != undefined){
		var opp = game.board[pos.ind-3];
		if (opp.cardColor != card.cardColor && card.power[3] > opp.power[0]){
			opp.convert();
			scene.moving = true;
		}
	}

	if (scene.moving)
		setTimeout(function(){scene.moving=false; updateScore()},3500);
	else{
		scene.moving = true;
		setTimeout(function(){scene.moving = false},250);
		updateScore();
	}
}

function handleOpponent(){
	if (scene.highlightBoxes.length == 0) return;
	spotLight.target.moveTo(new THREE.Vector3(-700,0,0));
	spotLight.moveTo(new THREE.Vector3(500,-500,2200));

	if (game.mode == 0)
		var choice = getAIChoice();

	scene.moving = true;
}

function opponentPlay(choice){
	setTimeout(function(){
		scene.moving = false;
		handleConversion(choice.card, choice.pos);
		choice.card.position.clone(choice.pos.position);
		choice.card.rotation.clone(new THREE.Vector3(0, 0, 0));
	}, 1750);

	choice.card.moveTo(new THREE.Vector3(0,0,400));
	setTimeout(function(){choice.card.rotateTo(new THREE.Vector3(0, 0, 0))}, 500);
	setTimeout(function(){choice.card.moveTo(choice.pos.position)}, 1500);

	setTimeout(function(){
		choice.card.rotation.set(0, 0, 0);
		choice.card.position.clone(choice.pos.position);
	}, 2000);

	game.myTurn = true;
}

function getAIChoice(){
	var choice = game.AI.compute();
	game.board[choice.pos.ind] = choice.card;
	setTimeout(function(){opponentPlay(choice);}, 750);
}

function getMultiplayerChoice(data){
	if (data.ready){
		peer.ready = true;
		if (document.querySelector(".restart").classList.contains("disabled"))
			choseRestart();
		return;
	}

	var card, choice = {};

	for (var i = 0; i < game.hisCards.length; i++) {
		if (game.hisCards[i].cardID == data.ind){
			card = game.hisCards.splice(i,1)[0];
			break;
		}
	};

	var newCard = createCard(1, data.type);
	newCard.cardID = card.cardID;
	newCard.position.copy(card.position);
	newCard.rotation.copy(card.rotation);
	scene.remove(card);
	scene.add(newCard);
	choice.card = newCard;

	for (var i = 0; i < scene.highlightBoxes.length; i++) {
		if (scene.highlightBoxes[i].ind == data.position){
			choice.pos = scene.highlightBoxes.splice(i,1)[0];
			break;
		}
	};

	game.board[choice.pos.ind] = choice.card;
	opponentPlay(choice);
}

function sendMultiplayerChoice(card, pos){
	peer.conn.send({color: card.cardColor, 
		type: card.cardType, 
		position: pos.ind,
		ind: card.cardID
	});
}

function setReady(){
	document.querySelector(".restart").classList.add('disabled');
	peer.conn.send({ready: true});
}

function updateScore(){
	game.bScore = 0;
	game.rScore = 0;
	for (var i=0; i<game.board.length; i++){
		if (game.board[i] == undefined) continue;
		if (game.board[i].cardColor == 0) game.bScore += 1;
		if (game.board[i].cardColor == 1) game.rScore += 1;
	}

	scene.bScoreMesh.geometry.faceVertexUvs[0][0][0].x = game.bScore;
	scene.bScoreMesh.geometry.faceVertexUvs[0][0][1].x = game.bScore;
	scene.bScoreMesh.geometry.faceVertexUvs[0][0][2].x = game.bScore+1;
	scene.bScoreMesh.geometry.faceVertexUvs[0][0][3].x = game.bScore+1;
	scene.bScoreMesh.geometry.uvsNeedUpdate = true;

	scene.rScoreMesh.geometry.faceVertexUvs[0][0][0].x = game.rScore;
	scene.rScoreMesh.geometry.faceVertexUvs[0][0][1].x = game.rScore;
	scene.rScoreMesh.geometry.faceVertexUvs[0][0][2].x = game.rScore+1;
	scene.rScoreMesh.geometry.faceVertexUvs[0][0][3].x = game.rScore+1;
	scene.rScoreMesh.geometry.uvsNeedUpdate = true;

	if (game.bScore + game.rScore == 9){
		if (Gamepad.enabled) gs.menu = true;
		spotLight.target.moveTo(new THREE.Vector3(0,0,0));
		scene.add(scene.winLoseMesh);
		scene.updating.push(scene.winLoseMesh);
		if (scene.swapColor){
			game.rScore += game.started;
			game.bScore *= -1;
			game.rScore *= -1;
		}
		else
			game.bScore += game.started;

		if (game.bScore == game.rScore)
			scene.winLoseMesh.material.map.offset.y = 0;
		else if (game.bScore < game.rScore)
			scene.winLoseMesh.material.map.offset.y = 1/3;
		else
			scene.winLoseMesh.material.map.offset.y = 2/3;

		setTimeout(function(){
			scene.winLoseMesh.moveTo(new THREE.Vector3(0,0,600));
		}, 1000);
		setTimeout(function(){
			document.querySelector("#modal-restart").style.top = "0";
		}, 2000);
		scene.moving = false;
	}
}

function animate() {
	requestAnimationFrame(animate);
	var delta = clock.getDelta();

	if (!scene.moving){
		if (game.myTurn){
			spotLight.target.moveTo(new THREE.Vector3(700,0,0));
			spotLight.moveTo(new THREE.Vector3(-500,-500,2200));

			if (Gamepad.enabled)
				handleGamepad(delta);
			else
				handleMouse();
		}
		else
			handleOpponent();
	}

	scene.updating.map(function(obj){obj.update(delta)});
	// cameraControls.update(delta);
	stats.update()
	renderer.render(scene, camera);
}

init();