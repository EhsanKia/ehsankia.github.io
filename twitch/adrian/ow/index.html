<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style>
		@font-face {
		    font-family: BigNoodle;
		    src: url(BigNoodleTooOblique.ttf);
		}

		body {

		}

		.ow {
			font-family: BigNoodle;
			position: absolute;
		}

		.potg {
			color: #FCFFFF;
			text-shadow: white 0px 0px 5px;
			top: 363px;
			left: 215px;
			font-size: 52pt;
			opacity: 0;
		}

		.name {
			color: #FDEE31;
			text-shadow: rgb(239, 186, 28) 0px 0px 5px;
			top: 430px;
			left: 250px;
			font-size: 97pt;
			opacity: 0;
		}

		.subtitle {
			color: #FCFFFF;
			text-shadow: white 0px 0px 5px;
			top: 562px;
			left: 280px;
			font-size: 39pt;
			opacity: 0;
		}

		.animate .potg {
			animation: potg 6.5s linear;
		}

		.animate .name {
			animation: name 5s linear 1s;
		}

		.animate .subtitle {
			animation: subtitle 4s linear 1.5s;
		}

		@keyframes potg {
			0% { transform: translate(-100px, 0px); opacity: 0;}
			7% { transform: translate(0px, 0px) scale(1); opacity: 1; }
			90% { transform: translate(50px, 0px) scale(1.1); opacity: 1; }
			100% { transform: translate(200px, 0px) scale(1.1); opacity: 0;}
		}

		@keyframes name {
			0% { transform: translate(20px, 20px) scale(2); opacity: 0;}
			3% { transform: translate(0px, 0px) scale(1); opacity: 1; }
			90% { transform: translate(50px, 5px) scale(1.1); opacity: 1; }
			100% { transform: translate(200px, 5px) scale(1.1); opacity: 0;}
		}

		@keyframes subtitle {
			0% { transform: translate(0px, 0px) scale(1); opacity: 0;}
			10% { opacity: 1; }
			90% { transform: translate(50px, 15px) scale(1.1); opacity: 1; }
			100% { transform: translate(200px, 15px) scale(1.1); opacity: 0;}
		}


	</style>

	<script src="https://code.jquery.com/jquery-3.0.0.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-throttle-debounce/1.1/jquery.ba-throttle-debounce.min.js"></script>
	<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
</head>
<body>
	<div id="line1" class="ow potg">PLAY OF THE GAME</div>
	<div id="user" class="ow name">Seagull</div>
	<div id="line2" class="ow subtitle">AS REAPER</div>
	<script type="text/javascript">
		function getUrlParameter(sParam) {
			var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'), sParameterName, i;
			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : sParameterName[1];
				}
			}
		}

		var subQueue = [];
		function startSocket(socketToken) {
			var socket = io("io.twitchalerts.com:4567?token=" + socketToken);
			socket.on('connect', function(){
				console.log("Connected to socket");
				setInterval(function() {
					socket.emit("ping");
				}, 5000);

				socket.on("subscriptions", function(data) {
					console.log("Got subscription alert");
					for (var i = 0; i < data.length; i++) {
						subQueue.push(data[i]);
					}
					checkQueue();
				});
			});
		}

		var checkQueue = $.throttle(8000, function() {
			if (subQueue.length === 0) return;
			data = subQueue.shift();

			$('#user').text(data.name);
			if (data.months === 1) {
				$("#line1").text("New subscriber");
				$("#line2").text("Welcome to the flock!");
			} else {
				$("#line1").text("New resubscriber");
				$("#line2").text("For " + data.months + " months!");
			}
			document.body.classList.add("animate");
			setTimeout(function() {
				document.body.classList.remove("animate");
				checkQueue();
			}, 7000);
		});

		var token = getUrlParameter("token");
		if (token !== undefined) {
			$.ajax({
				url: "http://www.twitchalerts.com/service/get-socket-token",
				dataType: "jsonp",
				data: {token: token}
			}).done(function(resp) {
				console.log("Got socket token");
				startSocket(resp.token);
			});
		} else {
			$('body').css('background', 'url(http://i.imgur.com/4ldw0ln.jpg');
			setTimeout(function() {
				document.body.classList.add("animate");
			}, 2000);
		}

		let user = getUrlParameter('test');
		if (user) {
			subQueue.push(getUrlParameter({'name': user, 'months': 5}));
		}
	</script>
</body>
</html>