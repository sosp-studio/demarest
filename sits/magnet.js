class Magnet {
  constructor(img) {
      
    //------------------------------------------------------
    // setup the magnet's image
    //------------------------------------------------------
    // load the image data for this magnet
    this.img = img;
    // resize the image if needed so that it fits the screen
    this.img.resize(50,50);
    // make the magnet's width/height the same as the image
    this.w = this.img.width;
    this.h = this.img.height;
    //------------------------------------------------------
    let x = random(this.w,width-this.w);
    let y = 0;
    this.pos = createVector( x, y, 0 );
    this.vel = createVector(random(-3,3),random(1,3),0);
    this.angle = 0;
    this.c = color("#008292");
    
    this.alive = true;
    this.aliveCounter = 0;
    
    this.fingerx = 0;
    this.fingery = 0;

  }
  
  display() {
    
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    if(this.pos.x > width - (this.w*0.5) || this.pos.x < this.w*0.5){
      this.vel.x = -this.vel.x;
    }
    
    
    
    if ( height - (this.pos.y + (this.h*0.5)) < this.h ){
      
      if( abs(width/2 - this.pos.x) < 35 ){
        this.c = color(0,255,0)
      }else{
        this.c = color(255,0,0)
      }
    } 
    
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    stroke(this.c);
    strokeWeight(5);
    fill(this.c);
    rect(0, 0, this.w+5, this.h+5);
    image(this.img, 0,0);
    pop();
    
    if(this.pos.y > height - this.h*1.5){ 
      this.alive = false; 
      this.c = color(255)
      this.aliveCounter ++;
      if(this.aliveCounter > 30*3 ){
        if( abs(width/2 - this.pos.x) < 35 ){
          streak += 1;
        }else{
          streak = 0;
        }
        console.log(streak)
        this.alive = true;
        this.pos.x = random(this.w,width-this.w);
        this.pos.y = 0;
        this.vel.x = random(-3,3);
        this.vel.x = random(-3,3);
        this.aliveCounter = 0;
      }
    }
  }
  
  touch(mp) {

    this.fingerx = mp.x;
    this.fingery = mp.y;
    
    
    let dff = p5.Vector.dist(this.pos,mp);
    
    if (dff < this.w*0.75) {
      this.c = color("#008292");
      this.pos.x = constrain(this.fingerx,this.w,width-this.w);
      this.pos.y = constrain(this.fingery,this.h,height-this.w);
      this.vel.x = 0;
    } else {
      this.c = color(255);
    }
    
  }
}