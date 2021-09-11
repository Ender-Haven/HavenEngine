var engineSettings={
	
};
var gameData={
	version:"2.0a",
	world:{},
	engine:{
		render:{
			images:true,
			shapes:true,
			debug:false,
			shader:true,
			post:true,
		},
		physics:{
			name:"defaultPhysicsEngine",
			mode:"platformer",
		},
		shader:{
			name:"none",
			lod:0,
			resolution:0,
		},
		postProcesses:[
			"vignette",
		],
	},
};
function download(filename,value){
	var element = document.createElement('a');
	element.style.display='none';
	element.setAttribute('href', 'data:text/plain;charset-utf-8,' + encodeURIComponent(value));
	element.setAttribute('download', filename);
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function loadTextFile(file){
	var allText = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
	return(allText);
}

gameData=JSON.parse(loadTextFile("default.txt"));

document.getElementById('save').addEventListener('click', function(){
	download("GameData",JSON.stringify(gameData));
})