// Title: Flush Rush
// TODO: 
//  
//  
//  
//  

// Author: Luke Demarest

let video, handPose, hands = [];

let magnets = []; 
let magnetImages = [];
let logo, toilet, toiletBottom, nappy;
let canvas;

let streak = 0;

// https://p5js.org/reference/p5/image/
let magnetImageLinks = [
  "./images/poop.jpg"
  // "./images/0-0.png",
  // "./images/0-1.png",
  // "./images/0-2.png",
  // "./images/1-0.png",
  // "./images/1-1.png",
  // "./images/1-2.png",
  // "./images/2-0.png",
  // "./images/2-1.png",
  // "./images/2-2.png"
];

function preload() {
  // ---------------------------------------
  // preload the handpose model
  // before starting the sketch
  // ---------------------------------------
  handPose = ml5.handPose({flipped: true});
  
  // ---------------------------------------
  // preload all of the images into an array
  // before we use them in the Magnet class
  // ---------------------------------------
  for(let i=0; i < magnetImageLinks.length; i++){
    let tempImg = loadImage(magnetImageLinks[i]);
    magnetImages.push(tempImg);
  }
  
  logo = loadImage("images/logo.png");
  toilet = loadImage("images/toilet.png");
  toiletBottom = loadImage("images/toilet-bottom.png");
  nappy = loadImage("images/nappy.png");
  
}

function setup() {
  // createCanvas(800, 400);
  canvas = createCanvas(640, 480);
  canvas.parent("canvas-section");
  rectMode(CENTER);
  
  
  // ----------------------------------------
  // Initialize the camera,
  // have the ML model detect the video feed
  // ----------------------------------------
  
    let constraints = {
    video: {
      mandatory: {
        minWidth: 640,
        minHeight: 280
      },
      optional: [{ maxFrameRate: 30 }]
    },
    audio: false
  };

  // ---------------------------------------
  // Create the video capture.
  // ----------------------------------------
  video = createCapture(constraints,{flipped:true});
  // video = createCapture(VIDEO, {flipped: true});
  video.hide();
  handPose.detectStart(video, gotHands);
  
  // ----------------------------------------
  // Create new instances of the Magnet class
  // using the data from the preloaded images.
  // for each image -> create a new magnet
  // and add it to the magnets array
  // ----------------------------------------
  for (let i=0; i<magnetImages.length; i++) {
    magnets[i] = new Magnet( magnetImages[i] );
  }
  
}

function draw() {
  background(0);
  push();
  tint("#008292");
  image(video, 0, 0, width, height);
  pop();

  push();
  imageMode(CENTER);
  // tint(255,75);
  image(toilet,width/2,height-47,(logo.height/logo.width)*100,100);
  
  pop();
  // ----------------------------
  // draw the hand detection data
  // ----------------------------
  drawHandData();
  
  // ----------------------------
  // draw each magnet
  // ----------------------------
  drawMagnets();
  
  push();
  imageMode(CENTER);
  // tint(255,75);
  // image(toilet,width/2,height-50,(logo.height/logo.width)*100,100);
  image(toiletBottom,width/2,height-17,(logo.height/logo.width)*100,50);
  image(nappy,width/2 - 100 ,height-35,(logo.height/logo.width)*100,65);
  image(nappy,width/2 - 187.5 ,height-35,(logo.height/logo.width)*100,65);
  image(nappy,width/2 - 275 ,height-35,(logo.height/logo.width)*100,65);
  image(nappy,width/2 + 100 ,height-35,(logo.height/logo.width)*100,65);
  image(nappy,width/2 + 187.5 ,height-35,(logo.height/logo.width)*100,65);
  image(nappy,width/2 + 275 ,height-35,(logo.height/logo.width)*100,65);
  // image(logo,width/2,height/2+110,width*0.8,height*(logo.height/logo.width)*0.8);
  pop();
  
  push();
  fill(255);
  textSize(25);
  textAlign(CENTER);
  noStroke();
  text("Flush Rush Streak: " + streak,width/2,40);
  pop();
}

function gotHands(results) {
  hands = results;
}

function drawHandData(){
  if (hands.length > 0) {
    
    let index = createVector(
      hands[0].keypoints[8].x, 
      hands[0].keypoints[8].y
    );
    
    let thumb = createVector(
      hands[0].keypoints[4].x, 
      hands[0].keypoints[4].y
    );
  
    let distanceBetweenFingers = p5.Vector.dist(thumb, index);
    let middlePoint = p5.Vector.lerp(index,thumb,0.5);
    
    push();
    strokeWeight(10);
    stroke(255);
    point(middlePoint.x,middlePoint.y);
    noFill();
    strokeWeight(3);
    rectMode(CORNERS);
    // setLineDash([5, 10, 30, 10]);
    setLineDash([5, 5]);
    rect(thumb.x,thumb.y, index.x,index.y);
    pop();
    
    if(distanceBetweenFingers < 40){
      for (let i=0; i<magnets.length; i++) {
        magnets[i].touch( middlePoint );
      }
    }
  }
}

function drawMagnets(){
   for (let i=0; i<magnets.length; i++) magnets[i].display();
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}