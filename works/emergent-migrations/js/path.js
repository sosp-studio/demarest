/*
 *
 * Path 
 *
 */

function Path (p5i, migrant, pos, dir, network){
  this.migrant = migrant;
  this.pos = pos;
  this.dir = dir;
  this.network = network

  var initial = new Step(p5i,null,this.pos,this.dir,9);//10 9 
  this.steps = [];
  this.steps.push(initial);
  this.shortestStep = [];


  var parent = this;
  this.networks = {
    "a":{
      move:function(){parent.grow()},
      stroke:p5i.color(255,100),
    },
    "b":{
      move:function(){parent.grow()},
      stroke:p5i.color(0,50),
    }
  };



  this.update = function(){
    this.networks[this.network].move();
  };


  this.show = function(){
    p5i.push();
    p5i.noFill();
    p5i.stroke(this.networks[this.network].stroke);
    p5i.strokeWeight(migrant.states[migrant.state].strokeWeight);
    migrant.state == "brokered" ? p5i.beginShape(p5i.POINTS) : p5i.beginShape();
    for(var i = 3; i < this.steps.length; i++){p5i.vertex(this.steps[i].pos.x,this.steps[i].pos.y);}
    p5i.endShape();
    p5i.pop();
  };


  this.grow = function(network,employed){
    // look at each employer 
    for(var i = 0; i < p5i.employers.length; i++){
      
      // if this employer is in the same network as this migrant
      if(p5i.employers[i].network == this.network && migrant.employers[i] == false){
        var closestStep = null;
        var employer = p5i.employers[i];
        var record = employer.dMax; 
        
        // does the employer interact with any steps in the migrant's path
        // if so, only influence the closest step
        for(var j = 0; j < this.steps.length;j++){
          var step = this.steps[j]
          var d = p5.Vector.dist(employer.pos,step.pos);

          // if this step is within the employer's employment diameter
          // the employer will employ the migrant
          if(employer.dMin > d && employer.numOfEmployees < employer.maxNumOfEmployees){
            migrant.employer = employer;
            migrant.employers[i]=true;
            migrant.employer.numOfEmployees++;
            migrant.state = "transit"; 
            closestStep = null; 
            break;
          }else if(d < record){
            // (A step in a migrant's path can be influenced by many employers each timestep)
            // (An employer can only influence 1 step in a migrant's path each timestep)
            // An employer influences the closest located step 
            // that is inside it's influence diameter
            // and outside it's employment diameter
            // identify this step as potentially influenced for this timestep
            closestStep = step;
            record = d;
          }
        }

        // if this employer influences a step in the migrant's path
        // sum its direction with the step's other influcencers directions
        // then we can find the average direction for the path's next step
        // when the loop is complete
        if(closestStep != null){
          closestStep.dir.add(p5.Vector.sub(employer.pos,closestStep.pos).normalize());
          closestStep.count++;
        }
      }
    }


    // look at each intermediary
    // need to refactor
    for(var i = 0; i < p5i.intermediaries.length; i++){
      
      if(p5i.intermediaries[i].network == this.network && migrant.intermediaries[i] == false){
        var intermediary = p5i.intermediaries[i];
        var record = intermediary.dMax; 
        var closestStep = null;
        
        for(var j = 0; j < this.steps.length;j++){
          var step = this.steps[j]
          var d = p5.Vector.dist(intermediary.pos,step.pos);

          if(intermediary.dMin > d){
            migrant.intermediaries[i]=true;
            closestStep = null;
          }else if(d < record){
            record = d;
            closestStep = step;
          }
        }

        if(closestStep != null){
          closestStep.dir.add(p5.Vector.sub(intermediary.pos,closestStep.pos).normalize());
          closestStep.count++;
        }
      }
    }

    //---------------------------------------------------------------------------
    // from an influenced step in the migrant's path, add a new step 
    // whose direction is the normalized averaged of 
    // all of its influencer's direction
    for(var i = this.steps.length - 1; i >= 0; i--){
      var step = this.steps[i];
      if(step.count > 0){
        step.dir.div(step.count + 1);
        this.steps.push(step.next());
        step.reset();
      }
    }

    //---------------------------------------------------------------------------
    // if the migrant's path has reached an employer
    // remove all erroneous steps
    if(migrant.state == "transit"){
      var eRecord = 100000;
      var employerStep;
      var shortestPath = [];
      
      // find step that reached the employer
      // >=
      for(var i = this.steps.length -1; i > 0; i--){
        var ed = p5.Vector.dist(migrant.employer.pos,this.steps[i].pos);
        if(ed < eRecord){
          eRecord = ed;
          employerStep = this.steps[i];
        }
      };

      // remove all steps that do not lead to employer
      shortestPath.push(employerStep);
      while(shortestPath[shortestPath.length-1].parent != null){
        var nextStep = shortestPath[shortestPath.length-1].parent;
        if(shortestPath.indexOf(nextStep) != -1)break;
        shortestPath.push(nextStep);
      }
      this.steps = shortestPath;
    }
  };


}
