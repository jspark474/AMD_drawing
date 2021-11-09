// https://www.youtube.com/watch?v=o4UmGrPst_c&ab_channel=TheCodingTrain
let drawErase = true;
let drawStat = true;

let img;
let drawing;
let input;

let myCanvas; //for imported image
let extraCanvas; //for drawing

let brushSize = 5;
let eraserSize = 10;

let arrUnity = [];

const canvasSize = 500;
const threshold = 250;
//open cv

function setup() {
    pixelDensity(1);    
    myCanvas = createCanvas(canvasSize, canvasSize);
    extraCanvas = createGraphics(canvasSize, canvasSize);
    opencvCanvas = createGraphics(canvasSize, canvasSize);
    extraCanvas.clear();
    // canvas2 = createCanvas(canvasSize, canvasSize);
    // canvas2.clear();
    background(255);

    myCanvas.drop(gotFile);
    input = createFileInput(handleFile);
    extraCanvas.parent("canvas");
	myCanvas.parent("canvas");
    input.parent("fileButton");
    
    background(255);
}

function gotFile(file){
  if (file.type === 'image') {
    const img = createImg(file.data).hide();
    extraCanvas.image(img, 0, 0, width, height);
  } else {
    console.log('Not an image file!');
  }
}

function handleFile(file){
    print(file);
    if (file.type == "image"){
        img = createImg(file.data, '');
        img.hide();
    } else {
        img = null;
    }
}

function draw() {
    background(255);
    if (drawErase == true){
        if (mouseIsPressed) {
           drawStroke();
         }
    } else {
        if (mouseIsPressed) {
            eraseStroke();
          }
    }      
    //adding imported image to the canvas
    if (img){
       image(img, 0, 0, width, height);
    }
    //adding drawn stroke to the extra cavnas
    image(extraCanvas,0,0);
}

function clearCanvas(){
    extraCanvas.clear();
    // image(extraCanvas,0,0);
    // drawStat = true;
}

function drawStroke(){
    // if (!drawStat) {
        // extraCanvas.clear();
    // }
    drawErase = true;

    extraCanvas.noErase();
    extraCanvas.stroke(0);
    extraCanvas.strokeWeight(brushSize);
    extraCanvas.noFill();
    extraCanvas.line(mouseX, mouseY, pmouseX, pmouseY);
}

function eraseStroke(){
    // if (!drawStat) {
        // extraCanvas.clear();
    // }
    drawErase = false;
    extraCanvas.erase();
    extraCanvas.stroke(0);
    extraCanvas.strokeWeight(eraserSize);
    extraCanvas.noFill();
    extraCanvas.line(mouseX, mouseY, pmouseX, pmouseY);
}

function saveImage(){
    saveCanvas(extraCanvas, 'MD_draw', 'jpg');
}

function isClosed(){
    let imageBase64String = opencvCanvas.elt.toDataURL('image/jpg', 1.0);
    let canvas = document.getElementById('opencvCanvas');
    let ctx = canvas.getContext('2d');
    let msg = document.getElementById('msg');
    let image = new Image();

    image.onload = function() {
        ctx.drawImage(image, 0, 0);   
        let src = cv.imread('opencvCanvas')
        cv.cvtColor(src, src, cv.COLOR_BGR2GRAY, 0);
        cv.imshow('canvasOutput', src); 
        cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
        let cnt = contours.get(0);
        let hier;
        for (let i = 0; i < contours.size(); ++i) {
                hier = hierarchy.intPtr(0, i)
                if (hier[2] >= 2){
                // console.log("Ready to be sent!");
                    msg.innerHTML = "Ready to be sent";
                    console.log(arrUnity);
                    // src.delete(); dst.delete(); contours.delete(); hierarchy.delete(); cnt.delete();
                    return true;
                }
        }  
        // console.log("You need to create a closed shape");
        msg.innerHTML = "You need to create a closed shape";
        // src.delete(); dst.delete(); contours.delete(); hierarchy.delete(); cnt.delete();  
    };
    image.src = imageBase64String;
}
function clearPixels(){
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            var index = (i + j * width) * 4;
                opencvCanvas.pixels[index]= 0;   //R
                opencvCanvas.pixels[index+1]= 0; //G
                opencvCanvas.pixels[index+2]= 0; //B
                opencvCanvas.pixels[index+3]= 0; //A
        }
    }
    opencvCanvas.updatePixels();

}


function createArray() {
    let imageBase64String = extraCanvas.elt.toDataURL("image/jpg", 1.0);    
    drawing = loadImage(imageBase64String, function done() {
        // extraCanvas.clear();
        opencvCanvas.image(drawing, 0, 0, width, height); // draw the image
        opencvCanvas.loadPixels();
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                var index = (i + j * width) * 4;
                if(opencvCanvas.pixels[index+3]<=threshold){
                    opencvCanvas.pixels[index]= 255;   //R
                    opencvCanvas.pixels[index+1]= 255; //G
                    opencvCanvas.pixels[index+2]= 255; //B
                    opencvCanvas.pixels[index+3]= 255; //A
    
                } else {
                    opencvCanvas.pixels[index]= 0;
                    opencvCanvas.pixels[index+1]= 0;
                    opencvCanvas.pixels[index+2]= 0;
                    opencvCanvas.pixels[index+3]= 255;
                } 
                arrUnity.push(opencvCanvas.pixels[index]);
            }
        }
        opencvCanvas.updatePixels();
          isClosed();
          clearPixels();

        //   saveImage();
        //   drawStat = false;
        // console.log(arrUnity);
        // saveImage();
      });  
      
}

//button
clearButton.addEventListener("click", clearCanvas);
// toggleButton.addEventListener("click", toggleImage);
penButton.addEventListener("click", drawStroke);
eraseButton.addEventListener("click", eraseStroke);
arrayButton.addEventListener("click", createArray);
// submitButton.addEventListener("click", isClosed);