var g;
var Gamepad = {
	UP: false,
	DOWN: false,
	LEFT: false,
	RIGHT: false,
	A: false,
	B: false,
	START: false
};

Gamepad.BUTTONS = {
	FACE_1: 0,
	FACE_2: 1,
	FACE_3: 2,
	FACE_4: 3,
	SELECT: 8,
	START: 9,
};

Gamepad.AXES = {
	LEFT_ANALOGUE_HOR: 0,
	LEFT_ANALOGUE_VERT: 1,
	RIGHT_ANALOGUE_HOR: 2,
	RIGHT_ANALOGUE_VERT: 3
};

Gamepad.THRESHOLD = 0.5;

Gamepad.ticking = false;
Gamepad.enabled = false;
Gamepad.activeGamepad = -1;

Gamepad.startPolling = function(){
	if (!Gamepad.ticking) {
		Gamepad.ticking = true;
		Gamepad.tick();
	}

	window.addEventListener("gamepadconnected", Gamepad.onConnect, false);
};

Gamepad.stopPolling = function(){
	Gamepad.ticking = false;

	window.removeEventListener("gamepaddisconnected", Gamepad.onConnect);
};

Gamepad.tick = function(){
	Gamepad.pollStatus();
	if (Gamepad.ticking)
		window.requestAnimationFrame(Gamepad.tick);
};

Gamepad.pollStatus = function(){
	if (Gamepad.activeGamepad === -1){
		Gamepad.findGamepad();
		return;
	}

	if (!!navigator.getGamepads)
		g = navigator.getGamepads()[Gamepad.activeGamepad];

	Gamepad.A = g.buttons[Gamepad.BUTTONS.FACE_1].value > Gamepad.THRESHOLD;
	Gamepad.B = g.buttons[Gamepad.BUTTONS.FACE_2].value > Gamepad.THRESHOLD;
	Gamepad.START = g.buttons[Gamepad.BUTTONS.START].value > Gamepad.THRESHOLD;
	Gamepad.UP = g.axes[Gamepad.AXES.LEFT_ANALOGUE_VERT] < -Gamepad.THRESHOLD;
	Gamepad.DOWN = g.axes[Gamepad.AXES.LEFT_ANALOGUE_VERT] > Gamepad.THRESHOLD;
	Gamepad.LEFT = g.axes[Gamepad.AXES.LEFT_ANALOGUE_HOR] < -Gamepad.THRESHOLD;
	Gamepad.RIGHT = g.axes[Gamepad.AXES.LEFT_ANALOGUE_HOR] > Gamepad.THRESHOLD;
};

Gamepad.findGamepad = function(){
	if (!navigator.getGamepads) return;

	var gamepads = navigator.getGamepads();
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i]){
			Gamepad.activeGamepad = i;
			document.querySelector(".gamepad").classList.remove('disabled');
			break;
		}
	}
};

Gamepad.onConnect = function(e){
	g = e.gamepad;
	Gamepad.activeGamepad = e.gamepad.index;
	document.querySelector(".gamepad").classList.remove('disabled');
	Gamepad.BUTTONS.START = 7;
};