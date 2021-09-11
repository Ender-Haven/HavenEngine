import Level from "/Level.js";
import GameObject from "/GameObject.js";
import graphicsInit from "/graphicsInit.js";
import getUpload from "/upload.js";
import getBase64FromUrl from "/urlToBase64.js";

// This will act as a library for the engine, everything else will likely be dependent on this to work.

// Engine version.
const version = "2.0a";
// to-do> Use version to modify index.html's verion number display

var width = 0;
var height = 0; // Canvas dimensions
var mouseX = 0;
var mouseY = 0; // Mouse position relative to canvas
var mouseClicked = () => {}; // This will be defined as a function and executed when the user clicks
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
	ctx = canvas.getContext('2d');

    // Get the width and height of the canvas.
	width = canvas.width;
	height = canvas.height;
	
    // Find the canvas' offset to correct mouse position.
	var offset = {
		x : Math.round(window.scrollX +
		document.querySelector("#editorCanvas").getBoundingClientRect().left), // X
		y : Math.round(window.scrollY +
		document.querySelector("#editorCanvas").getBoundingClientRect().top), // Y
	}

    // corrects mouse position when the page has been scrolled.
	var scrollTop = 0;
	document.addEventListener('mousemove', event => {
		scrollTop = $(window).scrollTop();
		mouseX = (event.clientX - offset.x);
		mouseY = ((event.clientY - offset.y) + scrollTop);
	});
	document.addEventListener('scroll', e => {
		scrollTop = $(window).scrollTop();
		mouseX = -1;
		mouseY = -1;
	});

    // Run mouseClicked() on click.
	document.addEventListener('click', event => {
        clicked = true;
		mouseClicked();
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
    }
});


//not-working> Displays the level's objects with no calculations.
//note> Could be good for screenshots, I guess.
Level.prototype.display = function(){
	for(var i = 0; i < this.objects.length; i++){
		this.objects[i].display();
	} 
}

//not-working> Displays the object.
GameObject.prototype.display = function() {
	fill(0, 0, 0);
    let texture = this.texture;
    if(typeof this.texture !== "string") {
        rect(this.x, this.y, this.w, this.h);
    } else {
        base64Image(texture, this.x, this.y, this.w, this.h);
    }
}

// The level the user is editing or playing.
var activeLevel = "default";

// The game world, contains the levels.
var world = {
	default : new Level()
};

// Attempts to add a non colliding static object. [REMOVE IN FINAL]
world.default.objects.push(new GameObject("static", 10, 10, 20, 20, false, false, true, 1,));

(async () => {
    let b64 = await getBase64FromUrl("https://upload.wikimedia.org/wikipedia/commons/3/39/C_Hello_World_Program.png");
    world.default.objects.push(new GameObject("static", 30, 30, 200, 200, false, false, true, 1, undefined, undefined, b64));
})();

// Replaces init's default draw.
draw = () => world[activeLevel].display();


const testUpload = document.getElementById("test-upload");
testUpload.oninput = async () => base64Image((await getUpload(testUpload))[0], 0, 0, width, height);

const testURL = document.getElementById("test-url");
testURL.oninput = async () => base64Image(await getBase64FromUrl(testURL.value), 0, 0, width, height);