const GameObject = function(type, x, y, w, h, shape, colliding, display, opacity, velocity, animated, texture, normals, RMD) {
	/* Strucure related */
	this.type = type;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.shape = [];
	
	/* Calculation related */
	this.colliding = true;
	this.toDisplay = true;
	this.opacity = 1;
	this.v = {
		x : 0,
		y : 0,
	};
	
	/* Texture related */
	this.animated = false;
	this.texture = texture;
	this.normals = 0;
	//Roughness, metalic, displacement
	this.RMD = 0;
};

export default GameObject;