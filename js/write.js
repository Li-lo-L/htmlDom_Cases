var canvasWidth = Math.min(600,$(window).innerWidth()-20);
var canvasHeight = canvasWidth;

var ismousedown = false;
var lastXY={x:0,y:0};
var NewXY={x:0,y:0};
var lastTime=0;
var NewTime=0;
var lastLineWidth=-1;
var hue="#000";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

$("#clear span").click(function(){
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	page();
})
$(".controller").css("width",canvasWidth+"px");
page();
/*dashed();*/

//getBoundingClientRect()获取元素的width\height\left\top\right\bottom
function canvasLT(){
	var aaa = canvas.getBoundingClientRect();
	console.log(aaa.top+","+aaa.left+","+aaa.bottom+","+aaa.right);
}

//鼠标按钮被按下
canvas.onmousedown = function(e) {
	e.preventDefault();
	start(e.offsetX,e.offsetY);
}

//鼠标按键被松开
canvas.onmouseup = function(e) {
	e.preventDefault();
	end();
}

//鼠标被移动
canvas.onmousemove = function(e) {
	e.preventDefault();
	if (ismousedown) {
		move(e.offsetX,e.offsetY);
	}
}

//鼠标从某元素移开
canvas.onmouseout = function(e) {
	e.preventDefault();
	end();
}

canvas.addEventListener("touchstart",function(e){
	e.preventDefault();
	touch=e.touches[0];
	start(touch.pageX,touch.pageY);
})

canvas.addEventListener("touchmove",function(e){
	e.preventDefault();
	if (ismousedown) {
		touch=e.touches[0];
		move(touch.pageX,touch.pageY);
	}
})

canvas.addEventListener("touchend",function(e){
	e.preventDefault();
	end();
})

/*绘制米字格*/
function page() {
	ctx.strokeStyle = "rgba(230,11,9,.8)"
	ctx.beginPath();
/*	ctx.setLineDash([0]);*/
	ctx.moveTo(3, 3);
	ctx.lineTo(canvasWidth - 3, 3);
	ctx.lineTo(canvasWidth - 3, canvasHeight - 3);
	ctx.lineTo(3, canvasHeight - 3);
	ctx.closePath();
	ctx.lineWidth = 6;
	ctx.stroke();

	//绘制虚线
	ctx.beginPath();
/*	ctx.setLineDash([3]);*/
    ctx.lineWidth = 1;
	/*ctx.moveTo(3, 3);
	ctx.lineTo(canvasWidth - 3, canvasHeight - 3);*/

	/*ctx.moveTo(canvasWidth - 3, 3);
	ctx.lineTo(3, canvasHeight - 3);*/

	ctx.moveTo(canvasWidth / 2, 3);
	ctx.lineTo(canvasWidth / 2, canvasHeight);

	ctx.moveTo(3, canvasHeight / 2);
	ctx.lineTo(canvasWidth - 3, canvasHeight / 2);

	
	drawDashLine(ctx, 3, 3,canvasWidth - 3, canvasHeight - 3, 5);
	drawDashLine(ctx, canvasWidth - 3,3,3,canvasHeight - 3, 5);
	/*ctx.stroke();*/
}

/*绘制虚线*/
/*function dashed() {
	var dashed = document.getElementById("dash");
	var dash= dashed.getContext("2d");

	dash.setLineDash([3]);
	
	dash.beginPath();
	dash.moveTo(0, 100);
	dash.lineTo(400, 100);
	dash.stroke();
}*/


//两点之间距离
//sqrt()方法可返回一个数的平方根
function distance(last,now){
	return Math.sqrt((last.x-now.x)*(last.x-now.x)+(last.y-now.y)*(last.y-now.y))
}


//根据速度决定线条粗细
//参数通过变量声明。便于维护修改
var minv=0.1;
var maxv=12;
var maxLine=22;
var minLine=2;
function fontWeight(t,s){
	var v=s/t;
	var returnLineWidth;
	if(v<=minv){
		returnLineWidth=maxLine;
	}else if(v>=maxv){
		returnLineWidth=minLine;
	}else{
		returnLineWidth=maxLine-(v-minv)/(maxv-minv)*(maxLine-minLine);
	}
	
	if(lastLineWidth==-1){
		return returnLineWidth;
	}
	
	return lastLineWidth*2/3+returnLineWidth*1/3;
}

//颜色切换，笔触颜色的改变
$(".color").bind("click",function(){
	$(this).css("border","2px solid #ccc").siblings(".color").css("border","2px solid #fff");
	var color=$(this).css("background-color");
	hue=color;
})


//start
function start(pointx,pointy){
	ismousedown = true;
	/*console.log(e.offsetX + "," + e.offsetY);*/
    lastXY={x:pointx,y:pointy};
    lastTime=new Date().getTime();
	/*console.log(lastXY.x+","+lastXY.y);*/
}

//move
function move(locx,locy){
    /*console.log("move");*/
	NewXY={x:locx,y:locy};
	NewTime=new Date().getTime();
	//距离
	var s=distance(lastXY,NewXY);
	//时间差
	var t=NewTime-lastTime;
	var lineWidth=fontWeight(t,s);
	console.log(lineWidth);


	//写字
	ctx.strokeStyle=hue;
	/*ctx.setLineDash([0]);*/
	ctx.beginPath();
	ctx.moveTo(lastXY.x,lastXY.y);
	ctx.lineTo(NewXY.x,NewXY.y);
	ctx.lineWidth=lineWidth;
	ctx.lineJoin="round";
	ctx.lineCap="round";
	ctx.stroke();
	
	lastXY=NewXY;
	lastTime=NewTime;
	lastLineWidth=lineWidth;
}

//end
function end(){
	ismousedown = false;
}



//虚线
function drawDashLine(ctx, x1, y1, x2, y2, dashLength){
      var dashLen = dashLength === undefined ? 5 : dashLength,
      xpos = x2 - x1, //得到横向的宽度;
      ypos = y2 - y1, //得到纵向的高度;
      numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen); 
      //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
      for(var i=0; i<numDashes; i++){
         if(i % 2 === 0){
             ctx.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i); 
             //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
          }else{
              ctx.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
          }
       }
      ctx.stroke();
}
