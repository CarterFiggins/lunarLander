
// Code to draw picturs, background, rectangles, Text, terrain, etc.

MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    //  Writen by Dean my Professor
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();
        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    function drawBackground(image){
        context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height,
        )
    }

    function drawRectangle(rect) {
        context.save();
        context.translate(rect.center.x, rect.center.y );
        context.rotate(rect.rotation);
        context.translate(-rect.center.x, -rect.center.y);
        
        context.fillStyle = rect.fill;
        context.fillRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);
        
        context.strokeStyle = rect.stroke;
        context.strokeRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);

        context.restore();
    }


    // Draws the ground of the game.
    function drawTerrain(lines){
        context.fillStyle = 'rgb(50, 50, 50)'
        context.beginPath();
        context.moveTo(lines[0].a.x, lines[0].a.y);
        for(let i in lines){
            context.strokeStyle = 'rgb(255, 255, 255)';
            context.lineTo(lines[i].b.x, lines[i].b.y);
        }

        context.lineTo(canvas.width, canvas.height);
        context.lineTo(0, canvas.height);
        context.closePath();
        context.fill();
    }

    function drawCircle(center){
        context.beginPath();
        context.arc(center.x,center.y, 30, 0, 2*Math.PI);
    }

    function drawText(text, font, size, color, x = canvas.width/3, y = canvas.height/3){
        context.font = `bold ${size}px ${font}`;
        context.fillStyle = color;
        context
        context.fillText(text, x, y);
    }

    function stroke(){
        context.stroke();
    }


    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawTerrain: drawTerrain,
        width: canvas.width,
        drawRectangle: drawRectangle,
        drawBackground: drawBackground,
        drawText: drawText,
        stroke: stroke,
        drawCircle: drawCircle,
        
    };

    return api;
}());
