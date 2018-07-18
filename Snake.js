//Global declarations are for ease of use during development. To be disabled in final version.
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const size = 20;
var developerMode = false; //setting to true allows you to watch animations frame by frame. Space advances frames and arrows work as expected.
var gameSpeed = 4; //tells the program how many animations are in each transition. also affects game speed

/*


// Object Declarations----------------------------------------------------------------------------------------------


*/
const Game = {
	eventStack: [],
	Score: 0,
	frameCount: 0,
	frames: gameSpeed,
	refreshRate: 1000/60,
	grid: {
		xMax: canvas.width/(size),
		xMin: 0,
		yMax: canvas.height/(size),
		yMin: 0
	},
	board: [],
	boardHash(pt){
		let hash = Math.floor(pt.y)*this.grid.xMax + Math.floor(pt.x);
		if(Snake.head.dir[0] < 0 || Snake.head.dir[1] < 0){
			hash = Math.ceil(pt.y)*this.grid.xMax + Math.ceil(pt.x);
		}

		return hash;
	},
	lose(){
    	Snake.head.dir = [0,0];
   		this.lost = true;
    	ctx.font = '30px Arial';
		ctx.textAlign = 'center';
		window.clearInterval(animation); animation = null;
		console.log('You lose!');
		ctx.fillText('Play Again? Press <Space> to replay',size*(Game.grid.xMax/2),size*(Game.grid.yMax/2));
	},
	replay(){
		//resets the game to starting points.
		ctx.clearRect(0,0,canvas.width,canvas.height);
		Game.Score = 0;
    	this.lost = false;
    	this.won = false;
    	Snake.head.dir = [0,0];
    	Snake.head.location.x = Math.floor(this.grid.xMax/2);
    	Snake.head.location.y = Math.floor(this.grid.yMax/2);
    	Snake.head.location.recalculate();
    	Snake.body.location = [new Point(Snake.head.location.x, Snake.head.location.y)];
    	Snake.body.dir = [];
    	this.eventStack = [];
		this.framecount = 0;
		this.board = [];
		document.getElementById('score').innerHTML = 'Score: ' + Game.Score;
    	this.animate();
  },
  lost: false,
	win(){
    	Snake.head.dir = [0,0]; 
    	this.won = true;
		console.log('Woah. You actually won... I wish I had something better to give you, but congratulations!')
	},

	animate(){
		//initialization commands:
		Snake.draw();
		Food.reDraw();
		this.board = new Array(this.grid.xMax*this.grid.yMax).fill(0);
		
		//Main game loop
		if(!developerMode){
		animation = window.setInterval(function(){
			Game.frameCount++;
			ctx.clearRect(0,0,canvas.width,canvas.height)
			if(Game.frameCount == Game.frames) {
				Snake.update();
			}else{
				Snake.transition();
			}
			food.update();
			food.render();
			Snake.draw();	
			if(Snake.head.location.x == Food.location.x && Snake.head.y == Food.location.y && developerMode){	
				Snake.eatFood();
				Food.reDraw();
			}

		},this.refreshRate);
		}
	}
}


var Snake = {
	size: 20,
	head:{
		color: 'red',
		location: new Point(Math.floor(Game.grid.xMax/2), Math.floor(Game.grid.yMax/2)),
		dir: [0,0],
		grid: [], 
		foodEaten: false,

		checkCollision(dir){
			let collided = false;
			let testX = this.location.x + (gameSpeed*dir[0]);
			let testY = this.location.y + (gameSpeed*dir[1]);

			if(Snake.body.location.length == Game.grid.xMax * Game.grid.yMax){
				Game.win;
				return false;
			}

			//tests for an edge collision
			if(testX >= Game.grid.xMax || testX < 0 || testY >= Game.grid.yMax || testY < 0) collided = true;
			for(let i = 1; i < Snake.body.dir.length; i++){
				if(testX == Snake.body.location[i].x && testY == Snake.body.location[i].y ) collided = true;
			}

			
			return collided;
		},
		changeDir: function(curDir){
			let e = Game.eventStack.shift();
			let newDir;

			//checks for any queued events in the stack and then processes it with the switch
			if(e != undefined){
				switch(e.key) {
					case 'ArrowLeft':
					case 37: //left
						newDir = [-1,0];
					break;
					
					case 'ArrowUp':
					case 38: //up
						newDir = [0,-1];
					break;
	
					case 'ArrowRight':
					case 39: //right
						newDir = [1,0];
					break;
	
					case 'ArrowDown':
					case 40: //down
						newDir = [0,1];
					break;
	
					default: 
					return curDir; 
				} 

				//if the snake is longer than 1 unit, this will prevent backtracking. 
				if(Snake.body.dir.length <= 1) return [newDir[0]/gameSpeed, newDir[1]/gameSpeed];
				else if(Snake.body.dir.length > 1 && (newDir[0]/gameSpeed != -curDir[0] || newDir[1]/gameSpeed != -curDir[1])){
					return [newDir[0]/gameSpeed, newDir[1]/gameSpeed];
				}else return curDir;
			}else{
				 return curDir;
			}
		}
	},

	body:{
		color: 'black',
		location: [new Point(Math.floor(Game.grid.xMax/2), Math.floor(Game.grid.yMax/2))],
		dir: [[0,0]],
		move(){
      		this.dir.pop();
			this.dir.unshift(Snake.head.dir);
			this.update();
		},
		translate(){
			for(let i = 1; i < this.dir.length; i++){
				this.location[i].translate((this.dir[i][0]),(this.dir[i][1]))
			}
		},

        	update(){
                //uses the dir array to calculate new body positions
                bodyLength = this.dir.length
                //adds new points to the location array if they don't match in size
                if(bodyLength != this.location.length){
               		for(let i = 0;i<bodyLength; i++){
							   this.dir.push[new Point()];
							   console.log('new point made')
                	}
            	}
            	for(let i=1;i < bodyLength; i++){
					Game.board[Game.boardHash(this.location[i])] = 0;
					this.location[i].x = this.location[i - 1].x - (this.dir[i][0]*gameSpeed);
					this.location[i].y = this.location[i - 1].y - (this.dir[i][1]*gameSpeed);
					this.location[i].recalculate();
					Game.board[Game.boardHash(this.location[i])] = 1;
				}

        	}
	},
	draw() {
		if(this.body.dir.length > 0){
			ctx.beginPath();
			ctx.fillStyle = Snake.body.color;
			for(let i = 1; i < Snake.body.location.length; i++){
				ctx.rect(Snake.body.location[i].xactual, Snake.body.location[i].yactual,this.size, this.size);
			}
			ctx.closePath();  
			ctx.fill();
		}  
		ctx.beginPath();
		ctx.rect(this.head.location.xactual,this.head.location.yactual,this.size,this.size);
		ctx.fillStyle = this.head.color;
		ctx.fill();
		ctx.closePath();
	},
	update(){
		Game.frameCount = 0;			
		this.head.location.translate(Snake.head.dir[0],Snake.head.dir[1]);
		this.body.location[0].translate(Snake.head.dir[0],Snake.head.dir[1]);
		this.body.dir[0] = Snake.head.dir;
		this.body.move(); //update
		
		if (this.head.location.x == Food.location.x && this.head.location.y == Food.location.y){
			Snake.foodEaten = true;
			Food.reDraw();
			Snake.eatFood();
		}

		this.head.dir = this.head.changeDir(this.head.dir);
		if(this.head.checkCollision(this.head.dir)) Game.lose();
	},
	transition(){
		this.head.location.translate(this.head.dir[0],this.head.dir[1]);
		this.body.location[0].translate(this.head.dir[0],this.head.dir[1]);
		this.body.translate();
	},
	eatFood(){
		Game.Score++;
		this.body.location.push(new Point(this.head.location.x, this.head.location.y));
		this.body.dir.push(this.head.dir);
		document.getElementById('score').innerHTML = 'Score: ' + Game.Score;
	}
}


var Food = {
	location: new Point(Math.floor(Math.random()*Game.grid.xMax),Math.floor(Math.random()*Game.grid.yMax)),
	size: Snake.size,

	draw(){
		ctx.beginPath();
		ctx.arc(this.location.xactual + ((this.size + 1)/2),this.location.yactual + ((this.size+1)/2),this.size/2,0,2*Math.PI);
		ctx.fillStyle = 'blue';
		ctx.lineStyle = 'black';
		ctx.stroke();
		ctx.fill();
		return true;
	},
	reDraw(){
		//let locationAllowed = true;
		if(Snake.foodEaten == true){
			this.location.randomize();
			food.destinationX = this.location.xactual;
			food.destinationY = this.location.yactual;
		}


	},
}

function Point(x,y){
	this.xactual = size*x;
	this.yactual = size*y;

	this.x = x;
	this.y = y;
	this.translate = function(dx,dy){
		this.xactual += (dx*size);
		this.yactual += (dy*size);
		this.x += dx;
		this.y += dy;
	}
        this.recalculate = function(xx,yy){
      
		this.xactual = this.x*size;
    		this.yactual = this.y*size;
  	}
	this.randomize = function(){
		this.x = Math.floor(Math.random()*Game.grid.xMax);
		this.y = Math.floor(Math.random()*Game.grid.yMax);
		this.xactual = this.x * size;
		this.yactual = this.y * size;
	}
}

/*binds keys and pushes the keypress event to the eventStack property of the Game object. This is done to catch keys
pressed mid=animation so the program can process them at the appropriate time and prevents the user from feeling 
as though their keypress was 'missed.'*/
document.onkeydown = function (e) {
		e = e || window.event;

		let testValues = [32,37,38,39,40];

		if(testValues.indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
		if(testValues.includes(e.keyCode)){
			if(e.keyCode != 32) {
   			   Game.eventStack.push(e);
    		}else if(Game.lost){
	       		Game.replay();
	    	}

			if(developerMode){
				Game.frameCount++;
				ctx.clearRect(0,0,canvas.width,canvas.height);
				if(Game.frameCount == Game.frames){
					Snake.update();
				}
				else{
					Snake.transition();
				}
				Food.draw();
				Snake.draw();
				if(Snake.head.x == Food.location.x && Snake.head.y == Food.location.y){
					Snake.eatFood();
					Food.replace();
				}
			}
		}
}