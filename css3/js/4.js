var angle = 0;
var velocity = -0.1;
var auto = true;
window.onload = function(){
    animate();
}

function setAngle(ang){
    var prefix = ['transform','webkitTransform','msTransform','MozTransform','msTransform','OTransform'];
    ang4 = (ang%360 + 180)%360;
    ang3 = ((ang-90)%360 + 180)%360;
    ang2 = ((ang-180)%360 + 180)%360;
    ang1 = ((ang-270)%360 + 180)%360;
    while (p = prefix.shift()){
        d1.style[p] = "translateZ(-500px) rotateX("+ang1+"deg)";
        d2.style[p] = "translateZ(-500px) rotateX("+ang2+"deg)";
        d3.style[p] = "translateZ(-500px) rotateX("+ang3+"deg)";
        d4.style[p] = "translateZ(-500px) rotateX("+ang4+"deg)";
    }

    d1.style.zIndex = computeZ(ang1);
    d2.style.zIndex = computeZ(ang2);
    d3.style.zIndex = computeZ(ang3);
    d4.style.zIndex = computeZ(ang4);
}

function computeZ(ang){
    if (ang < -90) return 3;
    else if (ang < 0) return 4;
    else if ( ang < 90) return 2;
    else return 1;
}

document.onmousewheel = function(e){
    console.log(e.detail);
    if (e.wheelDelta < 0 || e.detail > 0) velocity -= 1;
    if (e.wheelDelta > 0 || e.detail < 0) velocity += 1;
    auto = false;
}

document.addEventListener("DOMMouseScroll", document.onmousewheel, true)
document.addEventListener("mousewheel", document.onmousewheel, true)
document.addEventListener("wheel", document.onmousewheel, true)


function animate(){
    requestAnimationFrame(animate);
    window.scrollTo(0, 0);
    angle += velocity;
    if (!auto) velocity *= 0.9;
    if (angle > 0) angle -= 360;
    setAngle(angle);
}