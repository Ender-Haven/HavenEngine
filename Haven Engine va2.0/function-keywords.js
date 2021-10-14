export default function functionKeywords() {
    let keywords = {
        "collisions": {
            "default": {
                "bottom": function(p) {
                    p.y = this.y + this.h;
                    p.v.y = 1;
                    p.canMove = true;
                    p.friction = 0;
                },
                "top": function(p) {
                    p.y = this.y - p.h;
                    p.v.y = 0;
                    p.canJump = true;
                    p.friction = 0;
                    p.speed = 2;
                    p.jumpBoost = 7;
                    p.canMove = true;
                    p.friction = 0;
                },
                "left": function(p) {
                    p.x = this.x + this.w;
                    p.canMove = true;
                    p.friction = 0;
                },
                "right": function(p) {
                    p.x = this.x - p.w;
                    p.canMove = true;
                    p.friction = 0;
                }
            },
            "bouncy": {
                "top": function(p) {
                    p.v.y = p.v.y > 1 ? -p.v.y / 2 : 0;
                    p.y = this.y - p.h + p.v.y;
                    p.canJump = true;
                    p.jumpBoost = 10;
                    p.canMove = true;
                    p.friction = 0;
                },
                "bottom": function(p) {
                    p.y = this.y + this.h;
                    p.v.y = 2;
                    p.canMove = true;
                    p.friction = 0;
                },
                "left": function(p) {
                    p.x = this.x + this.w;
                    p.v.x = 2;
                    p.canMove = false;
                    p.friction = 1;
                },
                "right": function(p) {
                    p.x = this.x - p.w;
                    p.v.x = -2;
                    p.canMove = false;
                    p.friction = 1;
               }
            }
        }
    }

    window.keywords = keywords;

    return keywords;
}