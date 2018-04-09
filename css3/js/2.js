$(document).ready(function(){
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    //Centered square div filling 90%
    var $window = $(window);
    var w, h, s;
    function setContainer(){
        w = $window.width();
        h = $window.height();
        s = Math.round(Math.min(h, w) * 0.9);
        $('.container').width(s).height(s);
        $('.container').css('top',(h-s)/2 + "px");
        $('.container').css('left',(w-s)/2 + "px");
        $('div:not(.container)').css('margin-top', (s/2-100) + "px");
    }
    setContainer();

    //Converts UInt32Array to string
    function toMatrix(m){
        var strMatrix = "perspective(500px) matrix3d(";
        for (var i=0; i<15; i++){
            if (Math.abs(m[i])>1e-6) strMatrix += m[i]+',';
            else strMatrix += "0,"; //because values in scientific notation break shit up
        }
        return strMatrix+m[15]+")";
    }

    //Creates the 6 side matrices
    var sideM = [];
    for (var i=0; i<6; i++){
        sideM[i] = mat4.create();
        mat4.identity(sideM[i]);
    }
    //Generate matrix to move each div to correct position
    mat4.translate(sideM[0], [0,0,-100]); //Back div
    mat4.translate(sideM[1], [0,0, 100]); //Front div
    mat4.translate(sideM[2], [ 100,0,0]); //Right div
    mat4.translate(sideM[3], [-100,0,0]); //Left div
    mat4.translate(sideM[4], [0, 100,0]); //Top quark
    mat4.translate(sideM[5], [0,-100,0]); //Bottom quark
    //Rotates the necessary ones
    mat4.rotate(sideM[2],-Math.PI/2, [0,1,0]);
    mat4.rotate(sideM[3], Math.PI/2, [0,1,0]);
    mat4.rotate(sideM[4],-Math.PI/2, [1,0,0]);
    mat4.rotate(sideM[5], Math.PI/2, [1,0,0]);

    //Collision walls, slightly bigger than actual divs, only side ones
    var wallP = [ vec3.create([ 150,0,650]), vec3.create([ 150,0,350]),
                  vec3.create([-150,0,350]), vec3.create([-150,0,650]) ];
    var wallV = [ vec3.create([0,0,-300]), vec3.create([-300,0,0]),
                  vec3.create([0,0, 300]), vec3.create([ 300,0,0]) ];

    //Manages the movements
    var mx = 0, my = 0;
    var pos = vec3.create([0,0,-100]); //Position
    var vel = vec3.create([0,0,0]); //Velocity
    var acc = vec3.create([0,0,0]); //Acceleration
    var tmpAcc = vec3.create();
    var jump = false;

    var KEYS = { //Key codes
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        SPACE: 32,
        DEBUG: 69
    };

    // Keydown and Keyup behavior
    $(document).keydown(function(e) {
        switch (e.keyCode) {
            case KEYS.W:
                acc[2] =  1; break;
            case KEYS.A:
                acc[0] =  1; break;
            case KEYS.S:
                acc[2] = -1; break;
            case KEYS.D:
                acc[0] = -1; break;
            case KEYS.SPACE:
                if (!jump) jump = true;
                break;
        }
    });

    $(document).keyup(function(e) {
        switch (e.keyCode) {
            case KEYS.W:
            case KEYS.S:
                acc[2] = 0; break;
            case KEYS.A:
            case KEYS.D:
                acc[0] = 0; break;
            case KEYS.SPACE:
                jump = false;
                break;
        }
    });

    //Checks for collision with the 4 side walls.
    function checkColision(){
        var den, P, u1, u2;
        for (var i=0;i<wallP.length;i++){ //For each wall
            den  = wallV[i][2]*vel[0] - wallV[i][0]*vel[2];
            if (Math.abs(den) > 1e-10){
                P = vec3.subtract(wallP[i], pos, []);
                P = vec3.create([ -P[2], 0, P[0] ]);
                u1 = vec3.dot(wallV[i], P) / den;
                u2 = vec3.dot(vel, P) / den;
                if(u1>0 && u1<1 && u2>0 && u2<1)
                    //Projection of velocity on direction of wall
                    vec3.scale(wallV[i],vec3.dot(vel,wallV[i])/vec3.dot(wallV[i],wallV[i]),vel);
            }
        }
    }

    function animate() {
        window.requestAnimationFrame(animate); // Because rAF > Timeout

        var dirMatrix = mat4.identity(mat4.create());
        mat4.rotateY(dirMatrix,  mx); //Create direction matrix
        mat4.multiplyVec3(dirMatrix,acc,tmpAcc); //Rotate acceleration

        if (vec3.dot(vel,vel) < 100) //Max speed
            vec3.add(vel, tmpAcc , vel);
        vec3.scale(vel, 0.9, vel); //Friction

        //Start Jump!
        if (jump && vel[1] == 0){
            acc[1] = -1;
            vel[1] = 15;
            jump = false;
        }

        //End Jump
        if (acc[1] < 0 && pos[1] < 0){
            acc[1] = 0; vel[1] = 0; pos[1] = 0;
        }

        checkColision();
        vec3.add(pos, vel, pos); // E = MC^2 / sqrt(1 - v^2/c^2), obviously
        draw();
    }

    //Updates the div transforms
    function draw(){
        var mvMatrix = mat4.create();
        mat4.identity(mvMatrix);

        //Moves cube to origin before rotating it
        mat4.translate(mvMatrix, [0,0,500]);

        // Rotate the cube
        mat4.rotate(mvMatrix,  my, [1, 0, 0]);
        mat4.rotate(mvMatrix, -mx, [0, 1, 0]);

        mat4.translate(mvMatrix, [0,0,-500]); //Move cube back
        mat4.translate(mvMatrix, pos); //Apply camera position

        for (var i=1; i<=6; i++){ //For each div, apply mv and side matrix.
            finalMatrix = mat4.create();
            mat4.multiply(mvMatrix, sideM[i-1], finalMatrix);
            var cssMatrix = toMatrix(finalMatrix);
            $('#s'+i).css('-webkit-transform', cssMatrix); //webkit
            $('#s'+i).css('-moz-transform', cssMatrix);  //FF
        }

    }

    //Updates mouse position
    $(document).mousemove(function(e){
        mx = -4*Math.PI*(e.pageX/w-0.5);
        my = -4*Math.PI*(e.pageY/h-0.5);
    });

    //Updates container size on resize
    $(window).resize(setContainer);

    animate();

});

