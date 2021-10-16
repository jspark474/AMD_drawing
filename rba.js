// https://www.youtube.com/watch?v=o4UmGrPst_c&ab_channel=TheCodingTrain
//Rule based agent testing

let x, y;
let img;
let myCanvas; //for imported image

function setup() {
    let myCanvas = createCanvas(600, 600);
	myCanvas.parent("canvas");
	corner=myCanvas.position();
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
