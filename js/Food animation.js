const foodImg = new Image();
foodImg.src = 'images/Food.png';


function sprite (srcImage) {
    this.img = srcImage;
    this.xFrame = 0;
    this.yFrame = 0;
    this.destinationX = Food.location.xactual;
    this.destinationY = Food.location.yactual;
    this.frameSize = 79;
    this.height = Food.size;
    this.width = Food.size;
    this.ticks = 5;
    this.tickCounter = 0;
    this.iFrame = 0;
    this.numberOfFrames = 10;

    this.render = function(){
        this.xFrame = this.iFrame*this.frameSize;
        ctx.drawImage(this.img, this.xFrame, this.yFrame, this.frameSize, this.img.height, this.destinationX, this.destinationY, this.height, this.width);
    }

    this.update = function(){
        this.tickCounter++;
        if(this.tickCounter > this.ticks - 1){
            this.tickCounter = 0;
            if(this.iFrame < this.numberOfFrames - 1){
                this.iFrame+=1;
            }else this.iFrame = 0;
        }
    }
}

var food = new sprite(foodImg);