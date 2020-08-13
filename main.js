
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
  let x1;
  let y1;
  let x2;
  let y2;
  canvas.ontouchstart = (e) => {
    x1 = e.touches[0].clientX;
    y1 = e.touches[0].clientY;
    if (rubberEnabled){
      clearRect(x1,y1)
    }else {
      last = [x1, y1];
    }
  }
  canvas.ontouchmove = (e) => {
    //先在console.log(e);里面找  然后在touches[0]里面有x y console.log(e.touches[0]);
    x2 = e.touches[0].clientX;
    y2= e.touches[0].clientY;
    if (rubberEnabled){
      const asin = (lineWidth/2)*Math.sin(Math.atan((y2-y1)/(x2-x1)));
      const acos = (lineWidth/2)*Math.cos(Math.atan((y2-y1)/(x2-x1)));
      const x3 = x1+asin;
      const y3 = y1-acos;
      const x4 = x1-asin;
      const y4 = y1+acos;
      const x5 = x2+asin;
      const y5 = y2-acos;
      const x6 = x2-asin;
      const y6 = y2+acos;
      clearRect(x2,y2)

      //清除矩形剪辑区域里的像素
      clearArea(x3,y3,x4,y4,x5,y5,x6,y6)
      //记录最后坐标
      x1 = x2;
      y1 = y2;
    }else {
      drawLine(last[0], last[1], x2, y2);
      last = [x2, y2];
    }

  }
} else {
  let x1;
  let y1;
  let x2;
  let y2;
  canvas.onmousedown = (e) => {
    painting = true;
    if (rubberEnabled){
      x1 = e.clientX;
      y1 = e.clientY;
      clearRect(x1,y1)
    }else {
      last = [e.clientX, e.clientY];
    }
  }

  //浏览器去调用的 canvas.onmousemove(事件的相关信息),浏览器传的值
  canvas.onmousemove = (e) => {
    if (painting === true) {
      if (rubberEnabled){
        x2 = e.clientX;
        y2 = e.clientY
        //获取剪辑区域
        const asin = (lineWidth/2)*Math.sin(Math.atan((y2-y1)/(x2-x1)));
        const acos = (lineWidth/2)*Math.cos(Math.atan((y2-y1)/(x2-x1)));
        const x3 = x1+asin;
        const y3 = y1-acos;
        const x4 = x1-asin;
        const y4 = y1+acos;
        const x5 = x2+asin;
        const y5 = y2-acos;
        const x6 = x2-asin;
        const y6 = y2+acos;
        clearRect(x2,y2)
        console.log(asin,acos)
        //清除矩形剪辑区域里的像素
        clearArea(x3,y3,x4,y4,x5,y5,x6,y6)
        //记录最后坐标
        x1 = x2;
        y1 = y2;

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
  // ctx.closePath()//闭合路径
}
function clearRect(x,y) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x,y,lineWidth/2,0,2*Math.PI);
  ctx.clip()
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}
function clearArea(x3,y3,x4,y4,x5,y5,x6,y6) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x3,y3);
  ctx.lineTo(x5,y5);
  ctx.lineTo(x6,y6);
  ctx.lineTo(x4,y4);
  ctx.closePath();
  ctx.clip()
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}
document.body.addEventListener(
  'touchmove',(e)=>{
    e.preventDefault()
  },
  {passive:false}
)