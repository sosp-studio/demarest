/*
 * Migration Pathways ABM
 *
 */

let migrationPathwaysABM = p5i => {
  p5i.disableFriendlyErrors = true;

  p5i.ticks = 3000;
  var pause = true;
  var fr = 60;
  var wEnv = 1920;
  var hEnv = 1080;

  p5i.origin = [[0,0],[wEnv/2,hEnv]];
  p5i.destination = [[wEnv/2,0],[wEnv,hEnv]];

  p5i.logMigrantStates = [];
  p5i.migrants = [];
  p5i.numOfMigrants = 185;//200;
  var migrantDiameter = 15;

  p5i.intermediaries = [];
  p5i.numOfIntermediaries = 100;//90;
  var intermediaryDiameter = 15;
  
  p5i.employers = [];
  p5i.numOfEmployers = 4;//4;
  var employerDiameter = 15;


  p5i.setup = function() {
    var canvas = p5i.createCanvas(wEnv, hEnv,p5i.P2D);
    canvas.mousePressed(p5i.pauseSketch);
    p5i.pixelDensity(1);
    p5i.background(175);
    p5i.frameRate(fr);
    p5i.textSize(30);

    p5i.select("#start").mousePressed(function(){p5i.pauseSketch()});
    p5i.select("#reset").mousePressed(function(){p5i.setSketch()});
    p5i.select("#export").mousePressed(function(){p5i.exportData()});

    numOfTicks = p5i.select("#numOfTicks");
    numOfTicks.mouseReleased(p5i.setSketch);
    numOfTicks.value(p5i.ticks);

    numOfMigrants = p5i.select("#numOfMigrants");
    numOfMigrants.mouseReleased(p5i.setSketch);
    numOfMigrants.value(p5i.numOfMigrants);

    numOfIntermediaries = p5i.select("#numOfIntermediaries");
    numOfIntermediaries.mouseReleased(p5i.setSketch);
    numOfIntermediaries.value(p5i.numOfIntermediaries);

    numOfEmployers = p5i.select("#numOfEmployers");
    numOfEmployers.mouseReleased(p5i.setSketch);
    numOfEmployers.value(p5i.numOfEmployers);
    
    p5i.setSketch();

    p5i.noLoop();
    //p5i.loop();
    //pause = false;
}


  p5i.draw = function() {
    p5i.drawEnvironment();
    for(var i = 0; i < p5i.employers.length; i++){p5i.employers[i].update();}
    for(var i = 0; i < p5i.intermediaries.length; i++){p5i.intermediaries[i].update();}
    for(var i = 0; i < p5i.migrants.length; i++){p5i.migrants[i].update();}

    for(var i = 0; i < p5i.migrants.length; i++){
      p5i.push();
      for(var j = 0; j < p5i.migrants[i].paths.length; j++)p5i.migrants[i].paths[j].show();
      p5i.pop();
    }

    for(var i = 0; i < p5i.employers.length; i++){p5i.employers[i].show();}
    for(var i = 0; i < p5i.intermediaries.length; i++){p5i.intermediaries[i].show();}
    for(var i = 0; i < p5i.migrants.length; i++){p5i.migrants[i].show();}
    p5i.drawLabels();
    p5i.logStates();
    p5i.isCompleted();
  }


  p5i.setSketch = function(){
    p5i.logMigrantStates = [];
    pause = true;
    p5i.select("#start").html("start");

    p5i.push();
    p5i.fill(175);
    p5i.rect(0,0,wEnv,hEnv);
    p5i.pop();
    
    p5i.drawEnvironment();
    p5i.ticks = numOfTicks.value();
    p5i.numOfMigrants = numOfMigrants.value();
    p5i.numOfIntermediaries = numOfIntermediaries.value();
    p5i.numOfEmployers = numOfEmployers.value();
    p5i.select("#currentNumOfTicks").html(numOfTicks.value() + " ");
    p5i.select("#currentNumOfMigrants").html(numOfMigrants.value() + " ");
    p5i.select("#currentNumOfIntermediaries").html(numOfIntermediaries.value() + " ");
    p5i.select("#currentNumOfEmployers").html(numOfEmployers.value() + " ");
    p5i.populate();
    p5i.noLoop();
    p5i.redraw();
  }


  p5i.drawEnvironment = function(){
    p5i.background(150);
    p5i.push();
    p5i.line(p5i.origin[1][0],p5i.origin[0][1],p5i.origin[1][0],p5i.origin[1][1]);
    p5i.pop();
  }


  p5i.drawLabels = function(){
    p5i.push();
    p5i.stroke(0);
    p5i.textAlign(p5i.CENTER);
    p5i.text("ORIGIN",wEnv*0.25,50);
    p5i.text("DESTINATION",wEnv*0.75,50);
    //p5i.text(p5i.frameRate(),15,77);
    p5i.pop();
  }


  p5i.pauseSketch = function(){
    pause = pause ? false : true;
    pause?p5i.noLoop():p5i.loop();
    pause ? p5i.select("#start").html("start") : p5i.select("#start").html("stop");
  }


  p5i.isCompleted = function(){if(p5i.logMigrantStates.length>=p5i.ticks)p5i.noLoop();}


  p5i.logStates = function(){
    var totals = {"potential":0,"seeking":0,"brokered":0,"transit":0,"employed":0,"returning":0};
    for(var i = 0; i < p5i.migrants.length; i++){totals[p5i.migrants[i].state]++;}
    p5i.logMigrantStates.push(totals);
  }

 
  p5i.exportData = function(){
    p5i.saveJSON(p5i.logMigrantStates,
      "t-" + p5i.ticks + 
      "-m-" + numOfMigrants.value() +
      "-i-" + numOfIntermediaries.value() +
      "-e-" + numOfEmployers.value() +
      Date.now() + 
      ".json"
    );
  }


  p5i.populate = function(){
    p5i.logMigrantStates = [];
    p5i.initEmployers();
    p5i.initIntermediaries();
    p5i.initMigrants();
    p5i.noLoop();
  }

 
  p5i.initEmployers = function(){
    p5i.employers = [];
    for(var i = 0; i < p5i.numOfEmployers; i++){
      var networkTemp = (i+1)/p5i.numOfEmployers <= 0.5? "a" : "b";
      var maxRatio = p5i.map(p5i.numOfEmployers,2,6,30,10);
      var maxNumOfEmployeesTemp = Math.floor(p5i.random(8,maxRatio));
      var validLocation = false;
      var attempts = 0;
      while(validLocation == false && attempts < 10000){
        attempts++;
        validLocation = true;
        var posTest = p5i.createVector(
          p5i.random(p5i.destination[0][0] *1.75,p5i.destination[1][0]-(maxNumOfEmployeesTemp*10)),
          p5i.random(p5i.destination[0][1]+(maxNumOfEmployeesTemp*10), p5i.destination[1][1]-(maxNumOfEmployeesTemp*10))
          //p5i.random(p5i.destination[0][0] *1.75,p5i.destination[1][0]-(employerDiameter*5)),
          //p5i.random(p5i.destination[0][1]+(employerDiameter*5), p5i.destination[1][1]-(employerDiameter*5))
        );
        for(var j = 0; j < p5i.employers.length;j++)if(p5.Vector.dist(posTest,p5i.employers[j].pos) < maxNumOfEmployeesTemp*10)validLocation = false;
      }

      if(validLocation == false)throw new Error("Unable to place employer " + i);
      p5i.employers.push(new Employer(p5i, posTest.x, posTest.y, 0, 0, intermediaryDiameter,networkTemp,maxNumOfEmployeesTemp));
    }
  }


  p5i.initIntermediaries = function(){
    p5i.intermediaries = [];
    for(var i = 0; i < p5i.numOfIntermediaries; i++){
      var validLocation = false;
      var attempts = 0;
      while(validLocation == false && attempts < 10000){
        attempts++;
        validLocation = true;
        var posXTemp; 
        if(i < (0.5 * p5i.numOfIntermediaries)){
          posXTemp = p5i.random(p5i.destination[0][0]*0.8 - intermediaryDiameter, p5i.destination[0][0]*1,2);
        }else{
          posXTemp = p5i.random(p5i.destination[0][0] - intermediaryDiameter, p5i.destination[1][0]*0.9);
        }
        var posTest = p5i.createVector(
          posXTemp,
          p5i.random(p5i.destination[0][1]+intermediaryDiameter, p5i.destination[1][1]-intermediaryDiameter)
        );
        for(var j = 0; j < p5i.employers.length;j++)if(p5.Vector.dist(posTest,p5i.employers[j].pos) < employerDiameter*5)validLocation = false;
      }

      if(validLocation == false)throw new Error("Unable to place intermediary " + i);
      p5i.intermediaries.push(new Intermediary(p5i, posTest.x,posTest.y, 0, 0, intermediaryDiameter));
    }
  }


  p5i.initMigrants = function(){
    p5i.migrants = [];
    for(var i = 0; i < p5i.numOfMigrants; i++){
    p5i.migrants.push(
      new Migrant(p5i, 
        p5i.random(p5i.origin[0][0]+migrantDiameter,p5i.origin[1][0]), 
        p5i.random(p5i.origin[0][1]+migrantDiameter,p5i.origin[1][1]-migrantDiameter), 
        0, 0, migrantDiameter)
      );
    }
  }


}


let abm = new p5(migrationPathwaysABM,'abm-main');
