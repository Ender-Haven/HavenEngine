// A level is basically the place where game objects are located and interacted with. (in other words, a game contains a world, a world contains levels, and a level contains the game content.)
const Level = function(){
	this.objects = [];
	this.settings = {};

    // returns all the GameObjects with their id appended. That way, when reinserted, they can replace the current running GameObject that have their ID
    this.save = function() {
        return this.objects
            .map(v => { return { ...v }; })
            .map((v, i) => { v.id = i; v.textureDisplay = false; if(v.save) return v; })
            .filter(v => !!v);
    };
    this.revert = function(objects) {
        if(objects.length) {
            for(let i = 0; i < objects.length; i++) {
                if(objects[i].id + 1 && -1 < objects[i].id && objects[i].id < this.objects.length && Math.floor(objects[i].id) === objects[i].id) {
                    this.objects[objects[i].id] = objects[i];
                } else {
                    delete objects[i].id;

                    this.objects.push(objects[i]);
                }
            }
        } else {
            if(-1 < objects.id && objects.id < this.objects.length && Math.floor(objects.id) === objects.id) {
                this.objects[objects.id] = objects;
            } else {
                delete objects.id;

                this.objects.push(objects);
            }
        }
    };
    this.download = function(element, data) {
        let encoded = encodeURIComponent(JSON.stringify(data));
        let dataStr = "data:text/json;charset=utf-8," + encoded;
        element.setAttribute("href", dataStr);
        element.onclick = function(e) {
            e.preventDefault();
            this.setAttribute("download", prompt("Save as...") + ".json");
            this.onclick = () => {};
            this.click();
        };
    };
};

export default Level;