uniform int colorSteps;
uniform float mixRatio;
uniform float dist;
uniform float aspect;
uniform mat4 rot1;
uniform mat4 rot2;
uniform mat4 camera;

varying vec2 vUv;

const int COLOR_ITER = 10;
const int MAX_ITER = 30;
const int DETAIL = 15;
const float BAILOUT = 5.0;
const float MIN_D = 0.00005;
const float MAX_D = 10000.0;
const float POWER = 8.0;

float de(vec3 p, out vec4 ot) {
	ot = vec4(10000.0);
	vec3 z = p;
	float dr = 1.0;
	float r = 0.0;
	for (int i = 0; i < DETAIL ; i++) {
		r = length(z);
		if (r>BAILOUT) break;

		z = (vec4(z, 1.0) * rot1).xyz;

		// convert to polar coordinates
		float theta = acos(z.z/r);
		float phi = atan(z.y,z.x);
		dr =  pow(r, POWER - 1.0) * POWER * dr + 1.0;

		// scale and rotate the point
		float zr = pow(r, POWER);
		theta = theta * POWER;
		phi = phi * POWER;

		// convert back to cartesian coordinates
		z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
		z += p;

		z = (vec4(z, 1.0) * rot2).xyz;

		if (i < colorSteps) ot = min(ot, vec4(z, dot(z,z)));
	}

	return 0.5 * log(r) * r / dr;
}

// float de(vec3 p, out vec4 ot) {
// 	ot = vec4(10000.0);
// 	for (int n = 0; n < DETAIL; n++) {
// 		p = (vec4(p, 1.0) * rot1).xyz;
// 		if (p.x + p.y < 0.0) p.xy = -p.yx;
// 		if (p.x + p.z < 0.0) p.xz = -p.zx;
// 		if (p.y + p.z < 0.0) p.zy = -p.yz;
// 		p = p * SCALE - OFFSET * (SCALE - 1.0);
// 		p = (vec4(p, 1.0) * rot2).xyz;

// 		if (n < colorSteps) ot = min(ot, vec4(p, dot(p,p)));
// 	}
// 	return length(p) * pow(SCALE, -float(DETAIL));
// }

vec3 rayMarch(vec3 start, vec3 dir){
	vec4 orbitTrap;
	float d;
	float total = 0.0;
	vec3 p = start;
	for (int steps = 0; steps < MAX_ITER; steps++) {
		p = start + total * dir;
		d = de(p, orbitTrap);
		total += d;
		if (d < MIN_D) {
			float c = 1.0 - float(steps) / float(MAX_ITER);
			return mix((camera * orbitTrap).xyz, vec3(c,c,c), mixRatio);
		}
		if (d > MAX_D) return vec3(0.0, 0.0, 0.0);
	}
	return vec3(0.0, 0.0, 0.0);
}

void main() {
	vec2 coord = vUv * 2.0 - 1.0;
	vec3 origin = -(camera * vec4(0.0, 0.0, -1.0, 1.0)).xyz;
	vec3 direction = normalize((camera * vec4(coord.x * aspect, coord.y, dist, 0.0)).xyz);

	gl_FragColor = vec4(rayMarch(origin, direction), 1.0);
}