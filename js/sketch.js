/*
title: Unfolding
author: Luke Demarest
license: GLPv3
*/

p5.disableFriendlyErrors = true;

let w;
let h;

let numOfWorkshops = 5;
let workshops = [];

function setup() {
    w = windowWidth;
    h = 200;
    const canvas = createCanvas(w, h);
    canvas.parent("canvasParent");
    frameRate(30);
    noiseSeed(800)
    background(255);

    for(var x = 0; x < numOfWorkshops; x++){
        workshops.push( new Workshop( w*0.2, h*0.25, 5+map(random(),0,1,-1,3), 7+map(random(),0,1,-1,3), 3 + getRandomInt(2)) );
        workshops.push( new Workshop( w*0.4, h*0.5, 17+map(random(),0,1,-1,2), 17+map(random(),0,1,-1,2), 4 ) );
        workshops.push( new Workshop( w*0.6, h*0.5, 12+map(random(),0,1,-1,2), 7+map(random(),0,1,-1,2), 4 ) );
        workshops.push( new Workshop( w*0.8, h*0.5, 5+map(random(),0,1,-1,2), 5+map(random(),0,1,-1,2), 4 ) );
    }

    for(var f = 0; f < 600;f++){
        for(var i = 0; i < workshops.length; i++){workshops[i].update();}
    }

}


//------
function draw() {

    if(frameCount % 7 == 0){
        push();
        rectMode(CORNER)
        fill(0,1)
        strokeWeight(1)
        stroke(50,1)
        fill(255,10)
        rect(0,0,width,height);
        pop();
    }

    // workshops
    for(var i = 0; i < workshops.length; i++){workshops[i].update();}
    for(var i = 0; i < workshops.length; i++){workshops[i].draw();}

}

//------
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


//-------------------------------------------------------
//-------------------------------------------------------
class Workshop{

  constructor(x,y,h,c,r){
    this.agents = [];
    this.totalNumOfHeroes = h;
    this.totalNumOfCowards = c;
    this.r = r;

    this.populate(x,y,this.agents,this.totalNumOfHeroes,this.totalNumOfCowards,this.r);

    this.allocateFriendsAndEnemies(this.agents);
  }

  //------
  populate(x,y,a,h,c,r){
    for(var i = 0; i < h; i++){a.push(new Agent(x,y,0,r));}
    for(var i = 0; i < c; i++){a.push(new Agent(x,y,1,r));}
  }

  //------
  allocateFriendsAndEnemies(a){
    for(var i = 0; i < a.length; i++){
      var tempFriend = getRandomInt(a.length);
      var tempEnemy = getRandomInt(a.length);
      while (tempFriend == i) tempFriend = getRandomInt(a.length);
      while (tempEnemy == i || tempEnemy == tempFriend) tempEnemy = getRandomInt(a.length);
      a[i].allocateAgents(tempFriend,tempEnemy);
    }
  }

  update(){
    var groundedX = true;
    var groundedY = true;
    var loc = [this.agents[0].x,this.agents[0].y];
    for(var i = 0; i < this.agents.length; i++){
      if(Math.abs(this.agents[i].x - loc[0]) > 5){
        groundedX = false;
      }
      if(Math.abs(this.agents[i].y - loc[1]) > 5){
        groundedY = false;
      }
    }
    if(groundedX){
      //console.log("groundedX");
      var alter = map(random(),0,1,5,20)
      if(loc[0] > width*0.5){
        alter = map(random(),0,1,-5,-20)
      }
      this.agents[Math.floor(map(random(),0,1,0,this.agents.length-1))].x = this.agents[2].x + alter ;
      this.agents[Math.floor(map(random(),0,1,0,this.agents.length-1))].x = this.agents[2].x + alter ;
    }

    if(groundedY){
      //console.log("groundedY");
      var alter = map(random(),0,1,5,20)
      if(loc[1] > width*0.5){
        alter = map(random(),0,1,-5,-20)
      }
      this.agents[Math.floor(map(random(),0,1,0,this.agents.length-1))].y = this.agents[2].y + alter;
      this.agents[Math.floor(map(random(),0,1,0,this.agents.length-1))].y = this.agents[2].y + alter;
    }

    for(var i = 0; i < this.agents.length; i++){this.agents[i].update(this.agents);}

  }

  draw(){
    for(var i = 0; i < this.agents.length; i++){this.agents[i].draw();}
  }

}


//-------------------------------------------------------
//-------------------------------------------------------
class Agent{

  constructor(x,y,personality,r){
    this.p = ["brave","cowardly"];
    this.personality = this.p[personality];
    this.personalities = {"brave":"white","cowardly":"black"};
    this.color = this.personalities[this.personality];
    this.r = r;
    this.friend;
    this.enemy;

    this.x = x+getRandomInt(100)-50;
    this.y = y+getRandomInt(100)-50;
    this.x = w/2+getRandomInt(w*0.3)-(w*0.15);
    this.y = h/2+getRandomInt(w*0.3)-(w*0.15);
    this.prevX = this.x;
    this.prevY = this.y;
    this.staticCounter = 0;
  }

  allocateAgents(f,e){
    this.friend = f;
    this.enemy = e;
  }

  update(a){
    // if brave, the agent heads  to the midpoint between friend and enemy
    this.xTarget = (a[this.friend].x + a[this.enemy].x)/2;
    this.yTarget = (a[this.friend].y + a[this.enemy].y)/2;

    // if coward, the agent heads behind their friend away from their enemy
    if(this.personality == "cowardly"){
      this.xTarget = a[this.friend].x - (this.xTarget - a[this.friend].x);
      this.yTarget = a[this.friend].y - (this.yTarget - a[this.friend].y);
    }

    // update agent's location
    var m = (this.y-this.yTarget)/(this.x-this.xTarget);
    var b = this.y - (m*this.x);

    if(
      isNaN(m) != true && m != "-Infinity"&& m != "Infinity"
      && isNaN(b) != true && b != "Infinity" && b != "-Infinity"
    ){
      this.prevX = this.x;
      this.prevY = this.y;

      // calculate x
      if(this.xTarget -1 > this.x){
        this.x++;
      }else{
        if(this.xTarget + 1 < this.x)this.x--;
      }
      if(this.x < this.r)this.x = this.r;
      if(this.x > w-this.r)this.x = w - this.r;

      // calculate y
      this.y = m*this.x +b;
      if(this.y < this.r){
        this.y = this.r;
      }else{
        if(this.y > h-this.r)this.y = h - this.r;
      }
    }

    if(this.x == this.prevX && this.y == this.prevY){
      this.staticCounter++;
    }else{
      this.staticCounter = 0;
    }

    if(this.staticCounter > 200){
      this.personality =(Math.random() > 0.5)? "brave" : "cowardly";
    }

  }

  draw(){
    push();
    strokeWeight(3);
    if(this.personality == "brave")stroke(120,20);
    if(this.personality == "cowardly")stroke(220,20);
    line(this.prevX,this.prevY,this.x,this.y);
    pop();
  }

}


function windowResized() {
    w = windowWidth;
    h = 200;
    resizeCanvas(w, h);
}

/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
