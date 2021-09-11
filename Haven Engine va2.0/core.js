const version = "2.0a";

var draw;

var width;
var height;
var mouseX;
var mouseY;
var mouseClicked;
var clicked;

var background;
var fill;
var stroke;
var rect;
var button;

var ctx;
var initialised = true;
var volume=0.2;

var elem = document.getElementById("page");

var soundOn = document.getElementById("soundOn");
soundOn.onclick = function() {
	initialised=false;
	volume=0.2;
	$("#soundOption").hide();
	init();
}
var soundOff = document.getElementById("soundOff");
soundOff.onclick = function() {
	initialised=false;
	volume=0.0;
	$("#soundOption").hide();
	init();
}

function download(filename,value){
	var element = document.createElement('a');
	element.style.display='none';
	element.setAttribute('href', 'data:text/plain;charset-utf-8,' + encodeURIComponent(value));
	element.setAttribute('download', filename);
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function init () {
	const canvas = document.getElementById('editorCanvas')
	ctx = canvas.getContext('2d')
	width=canvas.width;
	height=canvas.height;
	
	var offset = {
		x:Math.round(window.scrollX +
		document.querySelector("#editorCanvas").getBoundingClientRect().left), // X
		y:Math.round(window.scrollY +
		document.querySelector("#editorCanvas").getBoundingClientRect().top), // Y
	}
			
	mouseX;
	mouseY;
	var scrollTop=0;
	document.addEventListener('mousemove', function(event){
		scrollTop=$(window).scrollTop();
		mouseX = (event.clientX-offset.x);
		mouseY = ((event.clientY-offset.y)+scrollTop);
		//document.getElementById("cords").innerHTML = "x: " + (mouseX) + " y: " + (mouseY);
	});
	document.addEventListener('scroll', function(e) {
		scrollTop=$(window).scrollTop();
		mouseX = -1;
		mouseY = -1;
	});
	document.addEventListener('click', function(event){
		mouseClicked();
	});
	
	clicked = false;
	mouseClicked=function(){
		clicked = true;
	};
	
	background = function(hex){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		document.getElementById("editorCanvas").style.background = hex;
	};
	fill = function(hex){
		ctx.fillStyle = hex;
	};
	stroke = function(hex){
		ctx.strokeStyle = hex;
	};
	rect = function(x,y,w,h){
		ctx.beginPath();
		ctx.rect(x,y,w,h);
		ctx.fill();
		ctx.stroke();
	};
			
	button = function(x,y,w,h,onClick,c1,c2,cs){
	fill(c1||"#FFF");
	stroke(cs||'#000');
	if(mouseX>=x && mouseX<=x+w && mouseY>y && mouseY<=y+h){
		fill(c2||"#EEF");
		if(clicked){
			clicked=false;
			onClick();
		}
	}
	rect(x,y,w,h);
	};
	
	draw = function(){
		background("#55c");
	};
	
	setInterval(function(){
		draw();
		clicked=false;
	}, 1);
	
	
	return(ctx)
};

	// ONLY CALLED ONCE,
	document.addEventListener('DOMContentLoaded', function(){
		if(!initialised){
			init();
		}
	});