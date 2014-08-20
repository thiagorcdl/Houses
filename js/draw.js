
var phoneImg = new Image();
var waterImg = new Image();
var elecImg = new Image();
var house1Img = new Image();
var house2Img = new Image();
var house3Img = new Image();

var service = 0;
var colors = ["#333333", "#0066CC", "#E6E600"];
var width;
var height ;
var borderDist;
var iconSize;
var penSize;

var clickX = [];
var clickY = [];
var clickDrag = [];
var buffX = [];
var buffY = [];
var buffDrag = [];
var strokeColor = [];
var buffColor = [];
var paint;
var lastPos = [];




$(function() {
    var canvasDiv = document.getElementById('drawingCanvas');
    var context;
    width = self.innerWidth;
    height = self.innerHeight;
    borderDist = height / 6;
    iconSize = height / 9;
    penSize = height / 60;

    var canvas;


    function resizeCanvas(){
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas.setAttribute('id', 'canvas');
        canvas.setAttribute('style', "background-color: #F0F0F0")
        canvasDiv.appendChild(canvas);
        if(typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        context = canvas.getContext("2d");
        canvas = $('#canvas');


        canvas.mousedown(function(e){
            paint = true;
            // Mouse location
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            click(mouseX,mouseY);
        });

        canvas.mousemove(function(e){
            if(paint){
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                redraw();
            }
        });

        canvas.mouseup(function(e){
            // Mouse location
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            var rightEdge = context.canvas.width - borderDist;
            var leftEdge = context.canvas.width - borderDist - iconSize;
            release(mouseX,mouseY,leftEdge,rightEdge);
        });

        canvas.on('touchstart',function(e){
            paint = true;
            // Mouse location
            var mouseX = event.touches[0].pageX - this.offsetLeft;
            var mouseY = event.touches[0].pageY - this.offsetTop;

            click(mouseX,mouseY);
        });

        canvas.on('touchmove',function(e){
            if(paint) {
                var touch = event.touches[0];
                addClick(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop, true);
                lastPos = [touch.pageX, touch.pageY];
                redraw();
            }
        });

        canvas.on('touchend',function(e){
            // Mouse location
            var mouseX = lastPos[0];
            var mouseY = lastPos[1];
            var rightEdge = context.canvas.width - borderDist;
            var leftEdge = context.canvas.width - borderDist - iconSize;

            release(mouseX,mouseY,leftEdge,rightEdge);
        });

        canvas.mouseleave(function(e){
            clearBuffer();
            paint = false;
        });

        canvas.mouseenter(function(e){
            drawIcons();
        });

        canvas.on('touchleave',function(e){
            clearBuffer();
            paint = false;
        });

        canvas.on('touchenter',function(e){
            drawIcons();
        });

    }

    resizeCanvas();

    phoneImg.src = "img/phone.png";
    waterImg.src = "img/water.png";
    elecImg.src = "img/light.png";
    house1Img.src = "img/house1.png";
    house2Img.src = "img/house2.png";
    house3Img.src = "img/house3.png";

    function click(mouseX,mouseY){
        if(mouseX > borderDist && mouseX < borderDist + iconSize){
            if(mouseY > borderDist && mouseY < borderDist + iconSize) {
                service = 0;
                addClick(mouseX, mouseY, false);
                redraw();
            }
            else if (mouseY > 2*borderDist+iconSize && mouseY < 2*borderDist+2*iconSize ) {
                service = 1;
                addClick(mouseX, mouseY, false);
                redraw();
            }
            else if (mouseY > 3*borderDist+2*iconSize && mouseY < 3*borderDist+3*iconSize ) {
                service = 2;
                addClick(mouseX, mouseY, false);
                redraw();
            }
        } else {
            paint = false;
        }
    }

    function release(mouseX,mouseY,leftEdge,rightEdge){
        // If stroke ends in a house
        if(paint && mouseX > leftEdge && mouseX < rightEdge){
            if((mouseY > borderDist && mouseY < borderDist + iconSize) ||
               (mouseY > 2*borderDist+iconSize && mouseY < 2*borderDist+2*iconSize ) ||
               (mouseY > 3*borderDist+2*iconSize && mouseY < 3*borderDist+3*iconSize )) {
                var tmp = clickX.concat(buffX);
                clickX = tmp;
                tmp = clickY.concat(buffY);
                clickY = tmp;
                tmp = clickDrag.concat(buffDrag);
                clickDrag = tmp;
                tmp = strokeColor.concat(buffColor);
                strokeColor = tmp;
            }
        }
        paint = false;
        clearBuffer();
    }

	$('#clearCanvas').mousedown(function(e){
        clickX = [];
        clickY = [];
        clickDrag = [];
        buffX = [];
        buffY = [];
        buffDrag = [];
        strokeColor = [];
        buffColor = [];
        paint = false;
        lastPos = [];
		clearCanvas();
        drawIcons();
	});

    function clearBuffer(){
        buffX = [];
        buffY = [];
        buffDrag = [];
        buffColor = [];
        paint = false;
        lastPos = [];
        redraw();
    }

    function addClick(x, y, dragging) {
        buffX.push(x);
        buffY.push(y);
        buffDrag.push(dragging);
        buffColor.push(colors[service]);
    }

    function clearCanvas(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    function drawIcons(){
        var rightEdge = context.canvas.width;
        context.drawImage(phoneImg, borderDist, borderDist, iconSize, iconSize);
        context.drawImage(waterImg, borderDist, 2*borderDist + iconSize, iconSize, iconSize);
        context.drawImage(elecImg, borderDist, 3*borderDist + 2*iconSize, iconSize, iconSize);
        context.drawImage(house1Img,  rightEdge - borderDist - iconSize, borderDist, iconSize, iconSize);
        context.drawImage(house2Img,  rightEdge - borderDist - iconSize, 2*borderDist + iconSize, iconSize, iconSize);
        context.drawImage(house3Img, rightEdge - borderDist - iconSize, 3*borderDist + 2*iconSize, iconSize, iconSize);
    }

    function redraw(){
        // Clears the canvas
        clearCanvas();
        context.lineJoin = "round";
        context.lineWidth = penSize;

        for(var i=0; i < clickX.length; i++) {
            context.beginPath();
            if(clickDrag[i] && i){
                context.moveTo(clickX[i-1], clickY[i-1]);
            } else {
                context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.strokeStyle = strokeColor[i];
            context.stroke();
        }

        context.strokeStyle = "#AAAAAA";
        for(i=0; i < buffX.length; i++) {
            context.beginPath();
            if(buffDrag[i] && i){
                context.moveTo(buffX[i-1], buffY[i-1]);
            } else {
                context.moveTo(buffX[i]-1, buffY[i]);
            }
            context.lineTo(buffX[i], buffY[i]);
            context.closePath();
            context.stroke();
        }
        drawIcons();
    }

    $(window).resize(function(e){
        deltaw = width / self.innerWidth;
        deltah = height / self.innerHeight;
        ratio = (self.innerWidth/self.innerHeight);
        width = self.innerWidth;
        height = self.innerHeight;
        borderDist = height / 6;
        iconSize = height / 9;
        penSize = height / 60;
        for (var c = 0; canvasDiv.childNodes.length > 0; )
            canvasDiv.removeChild(canvasDiv.childNodes.item(c));
        resizeCanvas();
        for(var i=0; i < clickX.length; i++) {
            clickX[i] /= deltaw;
            clickY[i] /= deltah ;
        }
        redraw();
    });

});

document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false);