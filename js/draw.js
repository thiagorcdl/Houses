var borderDist = 100;
var iconSize = 75;
var phoneImg = new Image();
var waterImg = new Image();
var elecImg = new Image();
var house1Img = new Image();
var house2Img = new Image();
var house3Img = new Image();

var width = 800;
var height = 4* borderDist + 3* iconSize;
var service = 0;
var colors = ["#333333", "#0066CC", "#E6E600"]


$(function() {
    var canvasDiv = document.getElementById('drawingCanvas');
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.setAttribute('id', 'canvas');
    canvas.setAttribute('style', "background-color: #F0F0F0")
    canvasDiv.appendChild(canvas);
    if(typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    var context = canvas.getContext("2d");

    canvas = $('#canvas');
    phoneImg.src = "img/phone.png";
    waterImg.src = "img/water.png";
    elecImg.src = "img/light.png";
    house1Img.src = "img/house1.png";
    house2Img.src = "img/house2.png";
    house3Img.src = "img/house3.png";

    canvas.mousedown(function(e){
        paint = true;
		// Mouse location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
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
        } else
            paint = false;
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
    });

    canvas.mouseleave(function(e){
        clearBuffer();
        paint = false;
    });

    canvas.mouseenter(function(e){
        drawIcons();
    });

	$('#clearCanvas').mousedown(function(e){
        clickX = [];
        clickY = [];
        clickDrag = [];
        strokeColor = [];
		clearCanvas(); 
	});

    var clickX = [];
    var clickY = [];
    var clickDrag = [];
    var buffX = [];
    var buffY = [];
    var buffDrag = [];
    var strokeColor = [];
    var buffColor = [];
    var paint;

    function clearBuffer(){
        buffX = [];
        buffY = [];
        buffDrag = [];
        buffColor = [];
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
        context.lineWidth = 10;



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
        for(var i=0; i < buffX.length; i++) {
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

});