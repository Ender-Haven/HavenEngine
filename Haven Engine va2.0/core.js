
import Level from "/Level.js";
import GameObject from "/GameObject.js";
import graphicsInit from "/graphicsInit.js";
import getUpload from "/upload.js";
import getBase64FromUrl from "/urlToBase64.js";
import localforage from "https://unpkg.com/localforage@1.7.3/src/localforage.js";

localforage.config();

// This will act as a library for the engine, everything else will likely be dependent on this to work.

// Engine version.
const version = "2.1.1a";
// to-do> Use version to modify index.html's verion number display

var width = 0;
var height = 0; // Canvas dimensions
var mouseX = 0;
var mouseY = 0; // Mouse position relative to canvas
var mouseClicked = () => {}; // This will be defined as a function and executed when the user clicks
var keys = [];
var clicked = false; // True for one frame on mouse click
var draw;
// Canvas context
var ctx;

// Deals with initializing the systems
var initialised = false;
//note> It's true by default because picking a sound option will allow it to intiate with special settings
//note> Could be useful for other special pre-init settings as well
var volume = 0.2; // Audio volume. Has to be applied

const elem = document.getElementById("page"); // The main page.

// Enable editor sound
var soundOn = document.getElementById("soundOn");
soundOn.onclick = () => {
	initialised = false;
	volume = 0.2;
	$("#soundOption").hide();
	init();
};

// Disable editor sound.
var soundOff = document.getElementById("soundOff");
soundOff.onclick = () => {
	initialised = false;
	volume = 0.0;
	$("#soundOption").hide();
	init();
};

// Initialise the canvas and variables related to it.
function init() {
    // Get the canvas and set ctx to canvas context.
	const canvas = document.getElementById('editorCanvas');
    canvas.width = canvas.getBoundingClientRect().width * 2;
    canvas.height = canvas.getBoundingClientRect().height * 2;
	width = canvas.width;
	height = canvas.height;
    canvas.style.width = width / 2 + "px";
    canvas.style.height = height / 2 + "px";

	ctx = canvas.getContext('2d');
	
    // Find the canvas' offset to correct mouse position.
	var offset = {
		x : Math.round(window.scrollX +
		document.querySelector("#editorCanvas").getBoundingClientRect().left), // X
		y : Math.round(window.scrollY +
		document.querySelector("#editorCanvas").getBoundingClientRect().top), // Y
	}

    // corrects mouse position when the page has been scrolled.
	var scrollTop = 0;
    var onCanvas = false;
	canvas.addEventListener('mousemove', event => {
		scrollTop = $(window).scrollTop();
		mouseX = (event.clientX - offset.x);
		mouseY = ((event.clientY - offset.y) + scrollTop);
	});
    canvas.addEventListener("mouseenter", event => {
        onCanvas = true;
    });
    canvas.addEventListener("mouseleave", event => {
        onCanvas = false;
    });
	canvas.addEventListener('scroll', e => {
        e.preventDefault();
		scrollTop = $(window).scrollTop();
		mouseX = -1;
		mouseY = -1;
	});
    // Run mouseClicked() on click.
	canvas.addEventListener('click', event => {
        clicked = true;
		mouseClicked();
	});
    window.addEventListener("keydown", e => {
        if(onCanvas) {
            e.preventDefault();
            keys[e.keyCode] = true;
        }
    });
    window.addEventListener("keyup", e => {
        if(onCanvas) {
            e.preventDefault();
            keys[e.keyCode] = false;
        }
    });


	
    // Define display library functions
    graphicsInit(ctx, canvas);
    
    /**
     * A simple button that runs function onClick() when clicked.
     * 
     * @param {number} x - x position 
     * @param {number} y - y position
     * @param {number} w - width
     * @param {number} h - height
     * @param {function} onClick - call on button click
     * @param {color} c1 - default color
     * @param {color} c2 - hover color
     * @param {color} c3 - outline color
     * 
     * @returns {void}
     */
	let button = (x, y, w, h, onClick, c1, c2, cs) => {
        fill(ctx, c1 || "#FFF");
        stroke(ctx, cs || '#000');
        if(mouseX >= x && mouseX <= x + w && mouseY > y && mouseY <= y + h){
            fill(ctx, c2 || "#EEF");
            if(clicked) {
                clicked = false;
                onClick();
            }
        }
        rect(ctx, x, y, w, h);
	};
	
    // Default draw function.
    // note> Should be replaced with an error message here, just in case only core is present and no other code so the error can be tracked easier.
    // only set to default if it hasn't been defined somewhere else first
	draw = draw || (() => {
	 	background("#55c");
	});
	
    // Runs draw() whenever possible.
	setInterval(() => {
		draw();
		clicked = false;
	}, 1);
	
	// Returns the canvas context.
	return(ctx);
};

// ONLY CALLED ONCE,
document.addEventListener('DOMContentLoaded', () => {
    if(!initialised) {
        init();
        initialised = true;
    }
});


//not-working> Displays the level's objects with no calculations.
//note> Could be good for screenshots, I guess.
Level.prototype.display = function() {
    background(0, 0, 0);
    player.display();
	for(var i = 0; i < this.objects.length; i++) {
		this.objects[i].display();
		this.objects[i].setSave();
	} 
}
Level.prototype.update = function() {
    player.update(this.objects);
    let saveData = JSON.stringify(this.save(), null, 4);
    document.getElementById("save-json").textContent = saveData;
    this.download(downloadLink, saveData);
}

//not-working> Displays the object.
GameObject.prototype.display = function() {
	fill(0, 0, 0);
    if(this.shape.length) {
        ctx.beginPath();
        ctx.moveTo(this.shape[0][0] + this.x, this.shape[0][1] + this.y);
        for(let i = 1; i < this.shape.length; i++) {
            ctx.lineTo(this.shape[i][0] + this.x, this.shape[i][1] + this.y);
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    } else {
        if(typeof this.texture === "boolean") {
            rect(this.x, this.y, this.w, this.h);
        } else {
            if(this.textureDisplay) {
                image(this.textureDisplay, this.x, this.y, this.w, this.h);
            } else {
                base64Image(this.texture, this.x, this.y, this.w, this.h);
            }
        }
    }
};

GameObject.prototype.controls = function() {
    this.v.x = !this.friction ? 0 : this.v.x / this.friction;

    if((keys[87] || keys[32] || keys[38]) && this.canJump) {
        this.v.y -= this.jumpBoost;
        this.friction = 2;
        this.speed = 1;
    }

    if(keys[65] || keys[37]) {
        this.v.x -= this.speed;
    }
    if(keys[68] || keys[39]) {
        this.v.x += this.speed;
    }
};

GameObject.prototype.setSave = function() {
    if(!this.shape.length) {
        if(mouseX <= this.x / 2 + this.w / 2 && mouseX >= this.x / 2 && mouseY <= this.y / 2 + this.h / 2 && mouseY >= this.y / 2 && clicked) {
            this.save = !this.save;
        }
    }
}

// The level the user is editing or playing.
var activeLevel = "default";

// The game world, contains the levels.
var world = {
	default : new Level()
};

// Attempts to add a non colliding static object. [REMOVE IN FINAL]
const player = new GameObject({
    type : "player",
    x : 20,
    y : 20,
    w : 40,
    h : 40,
    shape : [],
    colliding : true,
    toDisplay : true,
    opacity : 1,
    velocity : { x : 0, y : 0 },
    animated : null,
    texture : false,
    normals : 0,
    RMD : 0,
    speed : 2,
    jumpBoost : 7,
    friction : 0
});

world.default.objects.push(new GameObject({
    type : "static",
    x : 0,
    y : 700,
    w : 400,
    h : 10,
    shape : false,
    colliding : false,
    toDisplay : true,
    opacity : 1,
    velocity : { x : 0, y : 0 },
    animated : null,
    texture : false,
    normals : 0,
    RMD : 0,
    xCollisionsTop : function(p) {
        p.v.y = p.v.y > 1 ? -p.v.y / 2 : 0;
        p.y = this.y - p.h + p.v.y;
        p.canJump = true;
        p.jumpBoost = 10;
    }
}));

world.default.objects.push(new GameObject({
    type : "static",
    x : 400,
    y : 600,
    w : 400,
    h : 110,
    shape : false,
    colliding : false,
    toDisplay : true,
    opacity : 1,
    velocity : { x : 0, y : 0 },
    animated : null,
    texture : false,
    normals : 0,
    RMD : 0
}));

(async () => {
    let b64 = await getBase64FromUrl("https://upload.wikimedia.org/wikipedia/commons/3/39/C_Hello_World_Program.png");
    world.default.objects.push(new GameObject({
        type : "static",
        x : 60,
        y : 260,
        w : 200,
        h : 200,
        shape : [],
        colliding : false,
        toDisplay : true,
        opacity : 1,
        velocity : { x : 0, y : 0 },
        animated : null,
        texture : b64,
        normals : 0,
        RMD : 0
    }));
})();

// Replaces init's default draw.
draw = () => {
    world[activeLevel].display();
    world[activeLevel].update();
};


const testUpload = document.getElementById("test-upload");
testUpload.oninput = async () => base64Image((await getUpload(testUpload))[0], 0, 0, width, height);

const testURL = document.getElementById("test-url");
testURL.oninput = async () => base64Image(await getBase64FromUrl(testURL.value), 0, 0, width, height);

const JSONInput = document.getElementById("json-input");
JSONInput.oninput = () => {
    let data = JSON.parse(JSONInput.value);

    if(data.length) {
        for(let i = 0; i < data.length; i++) {
            world.default.revert(new GameObject(data[i]));
        }
    } else {
        world.default.revert([ new GameObject(data) ]);
    }
}


const uploadJSON = document.getElementById("load");
const downloadLink = document.getElementById('save');


uploadJSON.addEventListener("change", event => {
    let reader = new FileReader();
    reader.onload = event => {
        let data = JSON.parse(JSON.parse(event.target.result));
        for(let i = 0; i < data.length; i++) {
            let obj = new GameObject(data[i]);
            world.default.revert(obj);
        }
    };
    reader.readAsText(event.target.files[0]);
});

const quickLoad = document.getElementById("loadLocal");

quickLoad.addEventListener("click", () => {
    localforage.getItem("game").then(result => {
        result = JSON.parse(result);

        if(result.length) {
            for(let i = 0; i < result.length; i++) {
                world.default.revert(new GameObject(result[i]));
            }
        } else {
            world.default.revert([ new GameObject(result) ]);
        }
    });
});

window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    let saveData = JSON.stringify(world.default.save(), null, 4);
    localforage.setItem("game", saveData);
    // Chrome requires returnValue to be set.
    event.returnValue = "Are you sure you want to leave?";
});