

MyGame.model.Game = function (input, objects, graphics, lines){

    let myKeyboard = input.Keyboard();
    let level = 1;
    let waiting = 0;
    let explosion = new Audio();
    explosion.src = "../sounds/explosion.mp3";
    let thrustSound = new Audio();
    thrustSound.src = "../sounds/Thruster1.mp3";
    let landed = new Audio();
    landed.src = "../sounds/Landed.mp3"
    let highscore = 0;
    let startOfGame = true;
    let countDown = 3;
    let holdTime = 0;
    
    let backgroundImage = new Image();
    backgroundImage.src = "../images/background.jpg"

    let player = objects.Lander({
        imageSrc: '../images/'+localStorage.getItem('ship'),
        center: { x: graphics.canvas.width / 6, y: graphics.canvas.height * .03 },
        momentum: {x: 0, y: 0},
        rotation: Math.PI/2,
        size: { width: 65, height: 65 },
        rotationRate: 1.5/1000,
        thrustRate: 1.2 / 10000,
        radius: 30,
    });
    
    let particleSystem = ParticleSystem(graphics, {
        imageSrc: '../images/'+localStorage.getItem('particle'),
        size: {mean: 15, stdev: 5},
        speed: { mean: .3, stdev: 0.1},
        lifetime: { mean: 250, stdev: 100}
    });

    let particleExplosion = ParticleExplosion(graphics, {
        imageSrc: '../images/'+localStorage.getItem('particle'),
        size: {mean: 15, stdev: 5},
        speed: {mean: .2, stdev: 0.1},
        lifetime: { mean: 1000, stdev: 100},
    })

    // registering controls
    controls = JSON.parse(localStorage.getItem("controls"));
    myKeyboard.register(controls.left, landerRotateLeft);
    myKeyboard.register(controls.right, landerRotateRight);
    myKeyboard.register(controls.thrust, landerThrust);
    

    function processInput(elapsedTime){
        myKeyboard.update(elapsedTime);
    }
    
    function update(elapsedTime){
        if(startOfGame){
            holdTime += elapsedTime;
            if(holdTime> 1000){
                countDown -= 1;
                if(countDown <= 0){
                    countDown = 3;
                    startOfGame = false;
                }
                holdTime -= 1000;
            }
        }
        else{
            player.update(elapsedTime);
            particleSystem.update(elapsedTime);
            checkCollision();
            updateExplosion(elapsedTime);
            if(!myKeyboard.checkPress(controls.thrust) || !player.alive || player.fuel <= 0){
                thrustSound.pause();
            }

        }
        
    }

    function render(){
        graphics.clear();
        graphics.drawBackground(backgroundImage);
        drawGameText();
        graphics.drawTerrain(lines);
        graphics.stroke();
        particleSystem.render();
        particleExplosion.render();
        checkingPlayer();
    }

    function resetGame(){
        player.reset();
        particleExplosion.reset();
        if( level == 1){
            lines = MyGame.setUp.reset(2);
        }
        else if( level >= 2){
            lines = MyGame.setUp.reset(1);
        }
    }

    function checkingPlayer(){
    
        if(player.alive){
            MyGame.render.Player.render(player);
        }
        else{
            //Game Over
            graphics.drawText('You Died :(', "Arial", 50, "white", window.innerWidth/2.65);
            graphics.drawText(`Score: ${Math.floor(highscore)}`, "Arial",  50, "white", window.innerWidth/2.65, window.innerHeight/2.6);
            explosion.play();
            waiting +=1;
            if(waiting > 270){
                waiting = 0;
                highscore = Math.floor(highscore);
                MyGame.setUp.updateHighScores(highscore);
                window.location.href = "../pages/highScores.html"
            }
            
        }

        if(player.hasLanded){
            // To Next Game
            graphics.drawText('Space Ship has Landed', "Arial", 50, "white", window.innerWidth/4.2, window.innerHeight/4.5);
            graphics.drawText(`Level ${level} Completed`,"Arial", 50, "white", window.innerWidth/3.4, window.innerHeight/3.5+10);
            landed.play();
         
            waiting+= 1;
            if(waiting > 270){
                waiting = 0;
                level++;
                highscore += player.fuel;
                startOfGame = true;
                player.nextLevel();
                resetGame();
                
            }
        }
    }

    function updateExplosion(elapsedTime){
        if(!player.alive){
            particleExplosion.update(elapsedTime);
            particleExplosion.fire(player.center);
        }
    }

    function drawGameText(){
        graphics.drawText(`Fuel: ${Math.floor(player.fuel)} gal`, "Arial", 20, player.fuel <=0 ? "red" : "green", 50, 50);
        graphics.drawText(`Angle: ${player.angle}°`, "Arial", 20, player.angle > 5 && player.angle < 350 ? "red" : "green", 50, 80);
        graphics.drawText(`Speed: ${player.speed} m/s`, "Arial", 20, player.speed > 2 ? "red" : "green", 50, 110 );
        startOfGame && graphics.drawText(`${countDown}`, "Arial", 100, "white", window.innerWidth/2.4, window.innerHeight/2.5);    
    }  

    function checkCollision(){
        for(i in lines){
            circle ={
                radius: player.radius,
                center: player.center,
            }
            if(lines[i].isLanding){
                if(lineCircleIntersection(lines[i].a, lines[i].b, circle)){
                    if(conditionsMet(player)){
                        player.landed()
                    }
                    else{
                        player.die();
                    }
                }
            }
            else{
                if(lineCircleIntersection(lines[i].a, lines[i].b, circle)){
                    player.die();
                }
            }
     
        }
    }

    // Player control Functions 

    function landerThrust(elapsedTime){
        if(player.alive && !player.hasLanded && player.fuel > 0 && !startOfGame){
            player.thrust(elapsedTime)
            particleSystem.fire({...player});
            thrustSound.play();
        }
 
    }

    function landerRotateRight(elapsedTime){
        if(!player.hasLanded && !startOfGame){
            player.rotateRight(elapsedTime);
        }
    }
    function landerRotateLeft(elapsedTime){
        if(!player.hasLanded && !startOfGame){
            player.rotateLeft(elapsedTime);
        }
    }

    // Checking intersecting of rocket and ground
    // Reference: https://stackoverflow.com/questions/37224912/circle-line-segment-collision
    function lineCircleIntersection(pt1, pt2, circle) {
        let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
        let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
        let b = -2 * (v1.x * v2.x + v1.y * v2.y);
        let c =  2 * (v1.x * v1.x + v1.y * v1.y);
        let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
        if (isNaN(d)) { // no intercept
            return false;
        }
        // These represent the unit distance of point one and two on the line
        let u1 = (b - d) / c;  
        let u2 = (b + d) / c;
        if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
            return true;
        }
        if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
            return true;
        }
        return false;
    }

    function conditionsMet(player){
        if(player.speed > 2){
            return false;
        }
        if((player.angle > 5) ){
            return false;
        }
        return true;
    }

    let api = {
        processInput: processInput,
        landerThrust : landerThrust,
        landerRotateRight: landerRotateRight,
        landerRotateLeft: landerRotateLeft,
        update: update,
        render: render,
    }
    return api;
}