const GameObject = function(type, x, y, w, h, shape, colliding, display, opacity, velocity, animated, texture, normals, RMD, xControls, xCollisions) {
    /* Strucure related */
    this.type = type;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.shape = shape;
    
    /* Calculation related */
    this.colliding = true;
    this.toDisplay = true;
    this.canJump = false;
    this.opacity = 1;
    this.v = {
        x : 0,
        y : 0,
    };
    this.xControls = xControls;
    this.xCollisions = xCollisions;
    
    /* Texture related */
    this.animated = false;
    this.texture = texture || 0;
    this.normals = 0;
    //Roughness, metalic, displacement
    this.RMD = 0;

    if(typeof type === "object") {
        let names = Object.getOwnPropertyNames(type);

        for(let i = 0; i < names.length; i++) {
            this[names[i]] = type[names[i]];
        }
    }

    if(this.texture) {
        let image = new Image();
        image.src = this.texture;
        image.onload = () => this.texture = image;
    }

    // Add some parameters to run collisions or not and to use typical keyboard controls, or some other control function (such as an AI)


    // simple physics 
    this.update = function(objs) {
        this.v.y = this.v.y < 10 ? this.v.y + 0.1 : 10;

        for(let i = 0; i < objs.length; i++) {
            this.isColliding(objs[i]);
        }

        // controls
        if(typeof this.xControls === "function") {
            this.xControls();
        } else {
            this.controls();
        }
        this.x += this.v.x;
        this.y += this.v.y;
        this.canJump = false;
    };


    // basic platformer collision to be applied block by block on the GameObject instance
    // call for all moving entities by looping through all solid objects
    this.isColliding = function(obj) {
        if(this.x + this.w > obj.x && this.x < obj.x + obj.w && this.y + this.h > obj.y && this.y < obj.y + obj.h) {
            this.colliding = true;
            if(this.x + this.w + this.v.x > obj.x && this.x + this.v.x < obj.x + obj.w) {
                if(this.v.y < 0) {
                    if(obj.xCollisions.bottom) {
                        obj.xCollisions.bottom();
                    } else {
                        this.y = obj.y + obj.h;
                        this.v.y = 1;
                    }
                } else {
                    if(obj.xCollisions.top) {
                        obj.xCollisions.top();
                    } else {
                        this.y = obj.y - this.h;
                        this.v.y = 0;
                        this.canJump = true;
                    }
                }
            }
            if(this.y + this.h + this.v.y > obj.y && this.y + this.v.y < obj.y + obj.h) {
                if(this.v.x < 0) {
                    if(obj.xCollisions.left) {
                        obj.xCollisions.left();
                    } else {
                        this.x = obj.x + obj.w;
                    }
                } else {
                    if(obj.xCollisions.right) {
                        obj.xCollisions.right();
                    } else {
                        this.x = obj.x - obj.w;
                    }
                }
                this.v.x = 0;
            }
        } else {
            this.colliding = false;
        }
    };
};

export default GameObject;