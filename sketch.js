// https://www.youtube.com/watch?v=o4UmGrPst_c&ab_channel=TheCodingTrain
let drawErase = true;
let drawStat = true;

let img;
let drawing;
let input;

let myCanvas; //for imported image
let extraCanvas; //for drawing

let brushSize = 3;
let eraserSize = 3;

const canvasSize = 512;
const threshold = 253;

function setup() {
    pixelDensity(1);    
    myCanvas = createCanvas(canvasSize, canvasSize);
    extraCanvas = createGraphics(canvasSize, canvasSize);
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
    if (drawErase){
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
    drawStat = true;
}

function drawStroke(){
    if (!drawStat) {
        extraCanvas.clear();
    }
    drawErase = true;
    extraCanvas.noErase();
    extraCanvas.stroke(0);
    extraCanvas.strokeWeight(brushSize);
    extraCanvas.noFill();
    extraCanvas.line(mouseX, mouseY, pmouseX, pmouseY);
}

function eraseStroke(){
    if (!drawStat) {
        extraCanvas.clear();
    }
    drawErase = false;
    extraCanvas.erase();
    extraCanvas.stroke(0);
    extraCanvas.strokeWeight(3);
    extraCanvas.noFill();
    extraCanvas.line(mouseX, mouseY, pmouseX, pmouseY);
}

function saveImage(){
    saveCanvas(extraCanvas, 'MD_draw', 'jpg');
}

function modifyImage(){
    for (var y = 0; y < height; y++){
        for (var x = 0; x < width; x++){
            var index = (x + y * width)*4;
        }
    }
    image(extraCanvas,0,0);
    updatePixels();
    console.log(extraCanvas.pixels[0]);
}

function cleanUp() {
    let imageBase64String = extraCanvas.elt.toDataURL("image/jpg", 1.0);    
    drawing = loadImage(imageBase64String, function done() {
        extraCanvas.clear();
        extraCanvas.image(drawing, 0, 0, width, height); // draw the image
        extraCanvas.loadPixels();
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                var index = (i + j * width) * 4;
                if(extraCanvas.pixels[index+3]<=threshold){
                    extraCanvas.pixels[index]= 255;   //R
                    extraCanvas.pixels[index+1]= 255; //G
                    extraCanvas.pixels[index+2]= 255; //B
                    extraCanvas.pixels[index+3]= 255; //A
    
                } else {
                    extraCanvas.pixels[index]= 0;
                    extraCanvas.pixels[index+1]= 0;
                    extraCanvas.pixels[index+2]= 0;
                    extraCanvas.pixels[index+3]= 255;
                }
            }
        }
          extraCanvas.updatePixels();
          saveImage();
          drawStat = false;
      });
    
}

// buttons
clearButton.addEventListener("click", clearCanvas);
// toggleButton.addEventListener("click", toggleImage);
penButton.addEventListener("click", drawStroke);
eraseButton.addEventListener("click", eraseStroke);
cleanUpButton.addEventListener("click", cleanUp);




