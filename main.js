
//画线
let canvas = document.getElementById("canvas");
let rubber = document.getElementById('rubber')
let lineWidth = 5
let rubberEnabled = false
let painting = false;
let last //记录上一次的结果

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let ctx = canvas.getContext("2d");

// ctx.fillStyle = "black";
ctx.strokeStyle = 'none';//描边
ctx.lineCap = 'round';//每个线的末尾是圆的还是方的

rubber.onclick = ()=>{
  rubberEnabled = true;
  rubber.classList.add('active')
  pen.classList.remove('active')
}
pen.onclick = ()=>{
  rubberEnabled = false;
  pen.classList.add('active')
  rubber.classList.remove('active')
}
clear.onclick = ()=>{
  ctx.clearRect(0,0,canvas.width,canvas.height)
}
download.onclick=()=>{
  const compositeOperation = ctx.globalCompositeOperation
  ctx.globalCompositeOperation = 'destination-over'
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height)
  const imageData = canvas.toDataURL('image/png')
  ctx.putImageData(
    ctx.getImageData(0,0,canvas.width,canvas.height),
    0,0
  )
  ctx.globalCompositeOperation = compositeOperation
  const a = document.createElement("a");
  document.body.appendChild(a)
  a.href = imageData;
  a.download='myPaint';
  a.target ='_blank'
  a.click()
}

const pinkColor = (pinkColor,pinkElement,x,y,z)=>{
  ctx.fillStyle = pinkColor;
  ctx.strokeStyle = pinkColor;
  pinkElement.classList.add('active')
  x.classList.remove('active')
  y.classList.remove('active')
  z.classList.remove('active')
}

const black =document.querySelector('.black')
const green = document.querySelector('.green')
const red = document.querySelector('.red')
const organ = document.querySelector('.organ')
black.onclick=()=>{
  pinkColor('black',black,green,organ,red)
}
organ.onclick=()=>{
  pinkColor('orange',organ,black,green,red)
}
green.onclick=()=>{
  pinkColor('green',green,black,organ,red)
}
red.onclick=()=>{
  pinkColor('red',red,green,black,organ)
}
currentColor.onclick=(e)=>{
  ctx.fillStyle = e.target.value
  ctx.strokeStyle = e.target.value
  black.classList.remove('active')
  green.classList.remove('active')
  red.classList.remove('active')
  organ.classList.remove('active')
}
currentColor.onchange = (e)=>{
  ctx.fillStyle = e.target.value
  ctx.strokeStyle = e.target.value
}
rangeValue.onchange = (e)=>{
  console.log(e.target.value)
  lineWidth = e.target.value
}

// 是否支持触屏
const isTouchDevice = 'ontouchstart' in document.documentElement;
if (isTouchDevice) {
  //在开始的时候获取点
  canvas.ontouchstart = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    if (rubberEnabled){
      clearRect(x,y)
    }else {
      last = [x, y];
    }
  }
  canvas.ontouchmove = (e) => {
    //先在console.log(e);里面找  然后在touches[0]里面有x y console.log(e.touches[0]);
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    if (rubberEnabled){
      clearRect(x,y)
    }else {
      last = [x, y];
    }
    drawLine(last[0], last[1], x, y);
  }
} else {
  canvas.onmousedown = (e) => {
    painting = true;
    if (rubberEnabled){
      clearRect(e.clientX,e.clientY)
    }else {
      last = [e.clientX, e.clientY];
    }
  }

  //浏览器去调用的 canvas.onmousemove(事件的相关信息),浏览器传的值
  canvas.onmousemove = (e) => {
    if (painting === true) {
      if (rubberEnabled){
        clearRect(e.clientX,e.clientY)
      }else {
        drawLine(last[0], last[1], e.clientX, e.clientY);
        last = [e.clientX, e.clientY];
      }
    }
  }

  canvas.onmouseup = () => {
    painting = false;
  }
}

function drawLine(x1, y1, x2, y2) {
  //首先，你需要创建路径起始点。
  ctx.beginPath();
  //笔触移动到指定的坐标x以及y上
  ctx.moveTo(x1, y1);
  ctx.lineWidth = lineWidth;
  //绘制一条从当前位置到指定x以及y位置的直线
  ctx.lineTo(x2, y2);
  //通过线条来绘制图形轮廓。
  ctx.stroke();//描边
  ctx.closePath()//闭合路径
}
function clearRect(x,y) {
  ctx.clearRect(x,y,lineWidth,lineWidth)
}
