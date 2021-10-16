//testing for bit-wise functions
let img;
let myImage;
const threshold = 5;
let myCanvas; //for imported image
// let input;

function preload() {
    myImage = loadImage('assets/imgTemp.jpg');
  }

function setup() {
  createCanvas(500,500);
    myImage.loadPixels();
    for (let i = 0; i < myImage.width; i++) {
        for (let j = 0; j < myImage.height; j++) {
          var index = (i + j * myImage.width) * 4;
          if(myImage.pixels[index]>=threshold){
              myImage.pixels[index]= 255;   //R
              myImage.pixels[index+1]= 255; //G
              myImage.pixels[index+2]= 255; //B
              myImage.pixels[index+3]= 255; //A

          } else {
            myImage.pixels[index]= 0;
              myImage.pixels[index+1]= 0;
              myImage.pixels[index+2]= 0;
              myImage.pixels[index+3]= 255;
          }
        }

      }
    myImage.updatePixels();
  }
//     myCanvas = createCanvas(512, 512);
//     myCanvas.parent("canvas");
//     img = loadImage('assets/img1.png')
//     input = createFileInput(handleFile);

//   // Top-left corner of the img is at (0, 0)
//   // Width and height are the img's original width and height
// //   image(img, 0, 0);

function handleFile(file){
    print(file);
    if (file.type == "image"){
        img = createImg(file.data, '');
        // img.hide();
    } else {
        img = null;
    }
}


function modifyImage(){
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        // img.set(i, j, color(0, 90, 102));
        var index = (i + j * img.width) * 4;
        // console.log(img.pixels[index]);
      }
    }
    img.updatePixels();
    image(img, 0, 0);
}


function draw() {
    // image(img, 0,0)
    image(myImage, 0, 0, width, height);
}

testButton.addEventListener("click", modifyImage);

