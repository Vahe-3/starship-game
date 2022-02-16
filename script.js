const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const backgroundImg = document.createElement("img");
backgroundImg.src = "./data/2513478.jpg";

let score = 0;
let gameOver = false;

const  intersect = (rect1, rect2) => {

    const x = Math.max(rect1.x, rect2.x),
        num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width),
        y = Math.max(rect1.y, rect2.y),
        num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
    return (num1 >= x && num2 >= y);
};

const  drawScore = () => {
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "White";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score,10,10);
};

const  gameOverFunc = () =>{
    
    ctx.font = "60px Comic Sans MS";
    ctx.fillStyle = "Red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over!",canvas.width/2,canvas.height/2);
};





class Game {
    constructor(x, y, w, h) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        

        this._speed = 1;
        this._xDelta = 0;
        this._yDelta = 0;

        this._Img = document.createElement("img");
        this._Img.src = "";

        

    };

    update() {
        this._x += this._xDelta;
        this._y += this._yDelta;
    };


    draw() {
        ctx.drawImage(this._Img, this._x, this._y, this._w, this._h);
    };

    

    

    goRight() {
        this._xDelta = this._speed;
    };

    goLeft() {
        this._xDelta = this._speed * -1;
    };

    goTop() {
        this._yDelta = this._speed * -1;
    };

    goBottom() {
        this._yDelta = this._speed;
    }

    stop() {
        this._xDelta = 0;
    };

    getBoundingBox() {
        return {
            x: this._x,
            y: this._y,
            width: this._w,
            height: this._h,
        }
    };

    

}



class Starship extends Game {

    constructor(x, y, w, h) {
        super(x, y, w, h)

        this._speed = 7;
        


        this._Img = document.createElement("img");
        this._Img.src = "./data/starship.png";

        this._starAudio = document.createElement("audio");
        this._starAudio.src = ""

    };



    goRight() {

        
        
        
        

        this._Img.src = "./data/starshipRight.png";

        super.goRight();

        

        

    };

    goLeft() {
        
        

        this._Img.src = "./data/starshipLeft.png";

        super.goLeft();

    }

    stop() {
        super.stop();


        this._Img.src = "./data/starship.png";

    }

    fire() {
        
        const x = this._x + 57;
        const y = this._y;

        const lasers = data.gameObjects.filter(obj => obj instanceof Laser);

        if (lasers.length === 0) {

            let laser = new Laser(x, y, 5, 15);

            laser.goTop()
            data.gameObjects.push(laser);

        }




    };

    update(){
        super.update();

        if(this._x > canvas.width ){
            this._x = -100;
        } else if(this._x < -100){
            this._x = canvas.width 
        }

        
    }

    



};

class Ufo extends Game {
    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.delete = false;
        this._speed = score / 5  + 1 ;

        this._Img = document.createElement("img");
        this._Img.src = "./data/ufo.png";
    };



    die() {

        this.delete = true;
        score = score  +1;

        const explosion = new Explosion(this._x - 20, this._y, 120, 100)
        explosion.clear();

        data.gameObjects.push(explosion);



    };


    update() {
        super.update()

        if ((this._yDelta > 0 && this._y + this._w > canvas.height) || (this._yDelta > 0 && this._y > canvas.height)) {

            this.die();
            
            gameOver = true;
            


        };

        
    };

};

class Explosion extends Game {
    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.delete = false;

        this._Img = document.createElement("img");
        this._Img.src = "./data/explosion.png";
    };

    clear() {
        setTimeout(() => {
            this.delete = true;
        }, 500)
    }





}


class Laser extends Game {
    constructor(x, y, w, h) {
        super(x, y, w, h)

        this.delete = false;
        this._speed = 10;

        this._stabAudio = document.createElement("audio");
        this._stabAudio.src = "https://soundbible.com//mp3/Stab-SoundBible.com-766875573.mp3";
    };

    draw() {
        super.draw();
        ctx.fillStyle = "red"
        ctx.fillRect(this._x, this._y, this._w, this._h);
    }

    update() {
        super.update();

        if (this._y < 0) {
            this.delete = true;
        };

        let ufos = data.gameObjects.filter(ufo => ufo instanceof Ufo)

        ufos.forEach((ufo) => {
            if (intersect(this.getBoundingBox(), ufo.getBoundingBox())) {

                ufo.die();


                this.delete = true;
            }
        });



    };

    clear() {
        this.delete = true;
    };

};


const data = { gameObjects: [new Starship(100, 520, 120, 100)] }




function draw() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);


    
    drawScore() 
    
    data.gameObjects.forEach(obj => obj.draw())

};

function update() {
    data.gameObjects.forEach(obj => obj.update());
    data.gameObjects = data.gameObjects.filter((obj) => obj.delete !== true);

    const ufos = data.gameObjects.filter(obj => obj instanceof Ufo);

    if (ufos.length === 0) {

        let x = Math.floor(Math.random() * 1000 - 100);

        if(x < 0 || x > canvas.width){
            x = Math.floor(Math.random() * 1000 - 100);
        }

        const ufo = new Ufo(x, -50 , 100, 50)


        ufo.goBottom();

        data.gameObjects.push(ufo)

    }


    

}

function loop() {
    requestAnimationFrame(gameOver ? gameOverFunc : loop);
    update();
    draw();
};

loop();

document.addEventListener("keydown", function (evt) {
    let starship = data.gameObjects.find(obj => obj instanceof Starship)
    if (evt.code === "ArrowRight") {
        starship.goRight();

        

    } else if (evt.code === "ArrowLeft") {
        starship.goLeft();
    } else {
        starship.fire()
    }

});

document.addEventListener("keyup", function (evt) {
    let starship = data.gameObjects.find(obj => obj instanceof Starship);
    if(evt.code === "ArrowRight" || evt.code === "ArrowLeft" )
    starship.stop();


});

window.states = data;





