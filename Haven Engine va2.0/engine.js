var Level = function(){
	this.objects=[];
	this.settings={};
};
Level.prototype.display=function(){
	for(var i=0; i<this.objects.length; i++){
		this.objects[i].display();
	}
}

var Object = function(type,x,y,w,h,shape,colliding,display,opacity,velocity,animated,texture,normals,RMD){
	/* Strucure related */
	this.type=type;
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.shape=[];
	
	/* Calculation related */
	this.colliding=true;
	this.display=true;
	this.opacity=1;
	this.v={
		x:0,
		y:0,
	};
	
	/* Texture related */
	this.animated=false;
	this.texture=0;
	this.normals=0;
	//Roughness, metalic, displacement
	this.RMD=0;
};
Object.prototype.display=function(){
	fill(0,0,0);
	rect(this.x,thisy,this.w,this.h);
}



var activeLevel="default";
var world ={
	default: new Level()
};
world.default.objects.push(new Object("static",10,10,20,20,false,false,true,1,));

draw=function(){
	world[activeLevel].display();
}