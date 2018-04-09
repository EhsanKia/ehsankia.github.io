uniform int colorSteps;
uniform float mixRatio;
uniform float dist;
uniform float aspect;
uniform mat4 rot1;
uniform mat4 rot2;
uniform mat4 camera;

varying vec2 vUv;

const int COLOR_ITER = 10;
const int MAX_ITER = 25;
const int DETAIL = 15;
const float MIN_D = 0.001;
const float MAX_D = 10000.0;
const float SCALE = 2.0;
const vec3 OFFSET = vec3(1.0, 1.0, 1.0);

float de(vec3 p, out vec4 ot) {
	ot = vec4(10000.0);
	for (int n = 0; n < DETAIL; n++) {
		p = (vec4(p, 1.0) * rot1).xyz;
		if (p.x + p.y < 0.0) p.xy = -p.yx;
		if (p.x + p.z < 0.0) p.xz = -p.zx;
		if (p.y + p.z < 0.0) p.zy = -p.yz;
		p = p * SCALE - OFFSET * (SCALE - 1.0);
		p = (vec4(p, 1.0) * rot2).xyz;

		if (n < colorSteps) ot = min(ot, vec4(p, dot(p,p)));
	}
	return length(p) * pow(SCALE, -float(DETAIL));
}

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