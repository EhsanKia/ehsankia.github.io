<html>
 <head>
	<script type="text/javascript" src="rAF.js"></script>
	<meta charset="UTF-8">
	<style type="text/css">
		body { background-color: #000; width:  100%; height: 100%; margin: 0px; }
    </style>
 </head>
 <body>
	<canvas id="canvas"></canvas>

   <script type="text/javascript">
		var cvs = document.getElementById('canvas');
		var ctx = cvs.getContext('2d');
		var w = window.innerWidth;
		var h = window.innerHeight;
		var rid = null;


		var numStar = 200;
		var starX = new Array( numStar );
		var starY = new Array( numStar );
		var starR = new Array( numStar );
		var starD = new Array( numStar );
		var starA = new Array( numStar );
		var maxR = 0, score = 0, overall=0;
		if (localStorage["score"])
			overall = localStorage["score"];

		window.onload = function() {
			cvs.style.position = "fixed";
			cvs.setAttribute("width", w);
			cvs.setAttribute("height", h);

			terminate();
			animate();
		}
		window.onload();

		var mx=0, my=0, ma=0, md=0;
		cvs.onmousemove = function (e) {
			mx = (e.clientX - canvas.offsetLeft)-w/2;
			my = (e.clientY - canvas.offsetTop) -h/2;
			ma = Math.atan2(my,mx);
			md = Math.sqrt( mx*mx + my*my );
			console.log("tset");
		};

		var lastTime = new Date().getTime();
		function animate() {
			var timeNow = new Date().getTime();
			var elapsed = timeNow - lastTime;

			rid = requestAnimationFrame( animate );
			draw(elapsed);

			lastTime = timeNow;
		}

		function draw(e) {
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,w,h);
		ctx.fillStyle = "white";

		if ( isNaN(starX[1]) )
			makeStars();

		for (var i=0; i<numStar; i++){

				if ( checkStar(i) )
					remakeStar(i);

				starX[i] += e*starR[i]*starR[i]*starD[i]*Math.cos(starA[i])/2000;
				starY[i] += e*starR[i]*starR[i]*starD[i]*Math.sin(starA[i])/2000;
				starX[i] -= e*md*starR[i]*starR[i]*Math.cos(ma)/1000;
				starY[i] -= e*md*starR[i]*starR[i]*Math.sin(ma)/1000;
				starD[i] = Math.sqrt(Math.pow(starX[i]-w/2,2)+Math.pow(starY[i]-h/2,2));
				starA[i] = Math.atan2(starY[i]-h/2,starX[i]-w/2);
				starR[i] += 0.01;

				if (starR[i] > maxR){
					maxR = starR[i];
					score = Math.round(Math.sqrt(maxR)*1000);
					if (score > overall){
						localStorage["score"] = score;
						overall = score;
					}
					document.title = overall;
				}

				ctx.beginPath();
				ctx.arc(starX[i], starY[i], starR[i],0,Math.PI*2,true);
				ctx.fill();
				ctx.closePath();
			}

		}

		function checkStar(i){
			if (starX[i] < starR[i] || starX[i] > w+starR[i])
				return true;
			if (starY[i] < starR[i] || starY[i] > h+starR[i])
				return true;
			if (starR[i] > 20)
				return true;
			return false;
		}

		function makeStars(){
			for (var i=0; i<numStar; i++){
				starX[i] = Math.random();
				starY[i] = Math.random();
				starR[i] = Math.random()*Math.random() * 2;
				starD[i] = Math.sqrt(Math.pow(starX[i]-w/2,2)+Math.pow(starY[i]-h/2,2));
				starA[i] = Math.atan2(starY[i]-h/2,starX[i]-w/2);
			}
		}

		function remakeStar(i){
			starX[i] = Math.random() * w;
			starY[i] = Math.random() * h;
			starR[i] = Math.random();
			starD[i] = Math.sqrt(Math.pow(starX[i]-w/2,2)+Math.pow(starY[i]-h/2,2));
			starA[i] = Math.atan2(starY[i]-h/2,starX[i]-w/2);
		}

		function terminate(){
			cancelAnimationFrame(rid);
			document.title = "Canvas Experiments";
		}
  </script>
 </body>
</html>