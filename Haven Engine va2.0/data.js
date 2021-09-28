// I'm not shure what the engine settings should be, but this is where they'll be stored.
//to-do> Add editor sound options (soundOn,editorVolume)
var engineSettings = {
	
};

// Data for the game itself that allows the game to be saved
var gameData = {
	version : "2.1a",
	world : {},
	engine : {
		render:{
			images : true,
			shapes : true,
			debug : false,
			shader : true,
			post : true,
		},
		physics : {
			name : "defaultPhysicsEngine",
			mode : "platformer",
		},
		shader : {
			name : "none",
			lod : 0,
			resolution : 0,
		},
		postProcesses : [
			{ type : "vignette", ammout : 10 },
      { type : "greyscale", ammout : 10 },
		],
	},
};

// Downloads a file (save as)
//to-do> Needs to save as JSON.
function download(filename,value) {
	var element = document.createElement('a');
	element.style.display = 'none';
	element.setAttribute('href', 'data:text/plain;charset-utf-8,' + encodeURIComponent(value));
	element.setAttribute('download', filename);
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

// Loads a .txt file.
//to-do> Needs to load JSON.

//Quinn> We should be using the more standard fetch API
// Additionally, because any API call is asynchronous, the function will always return ""
// Consider making the function asynchronous and use an await fetch or implementing a callback function instead

//Ender> I'm in agreement, I used this method since it was the only one that worked without a server. (localhost was insufficient.)

function loadTextFile(file) {
	var allText = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
	return(allText);
}

// Loading test data from a file [REMOVE IN FINAL]
// gameData = JSON.parse(loadTextFile("default.txt"));

// Adds functionality to the save button.
document.getElementById('save').addEventListener('click', () => {
	download("GameData", JSON.stringify(gameData));
})