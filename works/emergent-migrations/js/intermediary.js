/*
 * Intermediary Instance
 *
 */

function Intermediary (p5i,xPos,yPos,xDir,yDir,diameter){

  this.pos = p5i.createVector(xPos,yPos);
  this.normalizedBool = function(x){return Math.random() <= x;} 
  this.exampleBoo = this.normalizedBool(0.5); 
  this.network = p5i.random() <= 0.5 ? "a" : "b";
  this.d = diameter;
  this.dMax = 250;
  this.dMin = 9;

  var parent = this;
  this.networks = {
    "a" : {
      move:function(){parent.recruitingWalk()},
      color:p5i.color(255),
      stroke:p5i.color(75,75,75)
    },
    "b" : {
      move:function(){parent.recruitingWalk()},
      color:p5i.color(125,21,10),
      stroke:p5i.color(75,75,75)
    }
  };


  this.update = function(){
    this.networks[this.network].move();
  }


  this.show = function(){
    p5i.push();
    p5i.translate(this.pos.x, this.pos.y);
    p5i.fill(this.networks[this.network].color);
    p5i.noStroke();
    p5i.ellipse(0,0,this.d,this.d);
    
    p5i.noFill();
    p5i.strokeWeight(2);
    p5i.stroke(this.networks[this.network].stroke);
    p5i.ellipse(0,0,this.d*2,this.d*2);

    /*
     * LOGIC
    p5i.stroke(55,50);
    p5i.ellipse(0,0,this.dMax,this.dMax);
    p5i.ellipse(0,0,this.dMin,this.dMin);
    */
    p5i.pop();
  }

  this.recruitingWalk = function(){
      this.randomWalk(
      -1, 1, 0.5, p5i.destination[0][0]*0.7-this.d, p5i.destination[1][0],
      -1, 1, 0.5, p5i.destination[0][1]+this.d, p5i.destination[1][1]-this.d
    );
  } 

  this.randomWalk = function(xStepMin,xStepMax,xSpread,xMin,xMax,yStepMin,yStepMax,ySpread,yMin,yMax){
    var validLocation = true;
    var nextMove = this.pos.copy().add(p5i.random() >= xSpread ? xStepMin : xStepMax,p5i.random() >= ySpread ? yStepMin : yStepMax);
    for(var j = 0; j < p5i.employers.length;j++)if(p5.Vector.dist(nextMove,p5i.employers[j].pos) < p5i.employers[j].d*5)validLocation = false;
    var attempts = 0;
    while((nextMove.x < xMin || nextMove.x > xMax || nextMove.y < yMin || nextMove.y > yMax || validLocation == false) && attempts < 100){
      attempts++;
      validLocation = true;
      nextMove = this.pos.copy().add(p5i.random() >= xSpread ? xStepMin : xStepMax,p5i.random() >= ySpread ? yStepMin : yStepMax);
      for(var j = 0; j < p5i.employers.length;j++)if(p5.Vector.dist(nextMove,p5i.employers[j].pos) < p5i.employers[j].d*5)validLocation = false;
    }     
    if(nextMove.x >= xMin && nextMove.x <= xMax && nextMove.y >= yMin && nextMove.y <= yMax && validLocation)this.pos = nextMove;
  }

/*
  this.randomWalk = function(xStepMin,xStepMax,xSpread,xMin,xMax,yStepMin,yStepMax,ySpread,yMin,yMax){
    var nextMove = this.pos.copy().add(p5i.random() >= xSpread ? xStepMin : xStepMax,p5i.random() >= ySpread ? yStepMin : yStepMax);
    if((nextMove.x >= xMin && nextMove.x <= xMax) && (nextMove.y >= yMin && nextMove.y <= yMax))this.pos = nextMove;
  }
*/
}
