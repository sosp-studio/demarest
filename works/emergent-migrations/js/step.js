/*
 * Step Instance
 *
 */

function Step (p5i, parent, pos, dir, length){
  this.pos = pos;
  this.dir = dir;
  this.dirInit = this.dir.copy();
  this.count = 0;
  this.l = length;
  this.parent = parent;


  this.next = function(){
    var dirNext = p5.Vector.mult(this.dir,this.l);
    var posNext = p5.Vector.add(this.pos,dirNext);
    var stepNext = new Step(p5i,this,posNext,this.dir.copy(),this.l);
    return stepNext;
  }

  
  this.reset = function(){
    this.dir = this.dirInit.copy();
    this.count = 0;
  }

}
