
const wait = function (second) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, second * 1000 )
    });
};

const images = document.querySelector(".images");

const createImg = async function (imgPath){
 return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load',function(){
        images.append(img);
        resolve(img);
    });
    img.addEventListener('error',function(){
        reject(new Error('Image not found'))
    });
 })
}

let currentImg;

createImg('./images/img1.png').then(img => {
    currentImg  = img;
    console.log("Img is load")
   return wait(2);
}).then(() =>{
    currentImg.style.display='none';
    return createImg('./images/img2.png');
}).then(img =>  {
    currentImg  = img;
    console.log("Img2 is load")
   return wait(2);
})