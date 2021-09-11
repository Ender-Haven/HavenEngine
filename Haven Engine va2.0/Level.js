// A level is basically the place where game objects are located and interacted with. (in other words, a game contains a world, a world contains levels, and a level contains the game content.)
const Level = function(){
	this.objects = [];
	this.settings = {};
};

export default Level;