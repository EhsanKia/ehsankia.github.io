THREE.Object3D.prototype.moving = false;

THREE.Object3D.prototype.moveTo = function(target){
	this.targetPosition = target;
	this.moveVector = new THREE.Vector3();
	this.update = function(delta){
		this.moveVector.subVectors(this.targetPosition,this.position);
		var distance = this.moveVector.length();
		if (distance >  1) this.moveVector.divideScalar(6);
		else this.update = function(){};
		this.position.add(this.moveVector);
	}
};

THREE.Object3D.prototype.rotateTo = function(target){
	var newTarget = new THREE.Quaternion();
	this.targetRotation = newTarget.setFromEuler(target);
	this.slerpTime = 0;
	this.update = function(delta){
		this.slerpTime += delta;
		var newAngle = new THREE.Quaternion();
		newAngle.setFromEuler(this.rotation);
		newAngle.slerp(this.targetRotation, this.slerpTime);
		this.rotation.setEulerFromQuaternion(newAngle);
	}
};

THREE.Object3D.prototype.glow = function(){
	this.glowTime = 0;
	this.update = function(delta){
		this.glowTime += delta*5;
		if (this.glowTime > Math.PI*3){
			this.children[0].material.emissive.setRGB(0,0,0);
			this.update = function(){};
		}
		else{
			var c = Math.sin(this.glowTime);
			this.children[0].material.emissive.setRGB(c,c,c);
		}
	}
}

THREE.Object3D.prototype.swapColor = function(){
	c = this.cardColor == 0 ? 1 : -1;
	for (var i=0; i<4; i++)
		this.children[0].geometry.faceVertexUvs[0][0][i].x += c;
	this.cardColor = 1 - this.cardColor;
	this.children[0].geometry.uvsNeedUpdate = true;
	this.children[0].material.emissive.setRGB(0,0,0);
}

THREE.Object3D.prototype.convert = function(){
	var that = this;

	var forward = that.position.clone().setZ(200);
	var back = that.position.clone();
	var flip = new THREE.Vector3(0,Math.PI,0);
	var flop = that.rotation.clone();


	setTimeout(function(){that.glow()}, 250);
	setTimeout(function(){that.moveTo(forward)}, 2000);
	setTimeout(function(){that.rotateTo(flip)}, 2300);
	setTimeout(function(){that.swapColor(); that.rotateTo(flop)}, 2700);
	setTimeout(function(){that.moveTo(back)}, 3200);
	setTimeout(function(){
		that.position.copy(back);
		that.rotation.set(0,0,0);
	}, 3500);
}

THREE.Object3D.prototype.update = function(){};