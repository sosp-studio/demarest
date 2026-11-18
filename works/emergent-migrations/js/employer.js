/*
 * Employer Instance
 *
 */

function Employer (p5i,xPos,yPos,xDir,yDir,diameter,network,maxNumOfEmployees){

  this.state = network;
  var parent = this;
  this.states = {
    "a" : {
      move:function(){parent.defaultWalk()},
      color:p5i.color(32,37,48),
      stroke:p5i.color(125,21,10),
      outline:p5i.color(255,255,255)
    },
    "b" : {
      move:function(){parent.defaultWalk()},
      color:p5i.color(32,37,48),
      stroke:p5i.color(75,75,75),
      outline:p5i.color(75,75,75)
    }
  };

  this.pos = p5i.createVector(xPos,yPos);
  this.normalizedBool = function(x){return Math.random() <= x;} 
  this.exampleBoo = this.normalizedBool(0.5); 
  this.network = network;
  this.hiring = true;
  this.harm = p5i.random()/2;
  this.harm += this.network == "a" ? 0 : 1;
  this.harmColor = p5i.lerpColor(p5i.color(211,179,166),this.states.a.stroke,this.harm);
  this.harm = p5i.map(p5i.random(),0,1,50,255);
  this.d = diameter;
  this.dMin = this.d*2;
  this.dMax = 800;
  this.numOfEmployees = 0;
  this.maxNumOfEmployees = maxNumOfEmployees;
  this.dWorkPlace = this.maxNumOfEmployees*10;



  this.update = function(){}


  this.show = function(){
    p5i.push();
    p5i.translate(this.pos.x, this.pos.y);
    p5i.strokeWeight(2);
    p5i.stroke(0);
    p5i.stroke(this.states[this.network].stroke);
    p5i.fill(this.harmColor);
    p5i.ellipse(0,0,this.dWorkPlace,this.dWorkPlace);
    p5i.noFill();
    p5i.stroke(this.states[this.network].outline);
    p5i.ellipse(0,0,this.dWorkPlace+15,this.dWorkPlace+15);

    p5i.noFill();
    p5i.strokeWeight(3);
    p5i.stroke(this.states[this.network].color);
    p5i.ellipse(0,0,this.d*3,this.d*3);
    
    p5i.fill(this.states[this.state].color);
    p5i.stroke(this.states[this.state].color);
    p5i.ellipse(0,0, this.d*2, this.d*2);
    p5i.fill(255);
    p5i.textAlign(p5i.CENTER,p5i.CENTER);
    p5i.textSize(20);
    p5i.text(this.maxNumOfEmployees - this.numOfEmployees,0,0);
    p5i.pop();
 }


  this.defaultWalk = function(){
    this.randomWalk(
      -1, 1, 0.5, p5i.origin[0][0]+this.d, p5i.origin[1][0],
      -1, 1, 0.5, p5i.origin[0][1]+this.d, p5i.origin[1][1]-this.d
    );
  } 


  this.randomWalk = function(xStepMin,xStepMax,xSpread,xMin,xMax,yStepMin,yStepMax,ySpread,yMin,yMax){
    nextMove = this.pos.copy().add(p5i.random() >= xSpread ? xStepMin : xStepMax,p5i.random() >= ySpread ? yStepMin : yStepMax);
    if((nextMove.x >= xMin && nextMove.x <= xMax) && (nextMove.y >= yMin && nextMove.y <= yMax))this.pos = nextMove;
  }
}
