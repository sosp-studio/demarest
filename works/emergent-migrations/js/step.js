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
}

Step.prototype.next = function(){
  var dirNext = p5.Vector.mult(this.dir,this.l);
  var posNext = p5.Vector.add(this.pos,dirNext);
  return new Step(null,this,posNext,this.dir.copy(),this.l);
}

Step.prototype.reset = function(){
  this.dir = this.dirInit.copy();
  this.count = 0;
}
