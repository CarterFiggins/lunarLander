
// set up the gound of the game and also resets the game (redraws and updates highscore)

MyGame.setUp = ( function(){

    let canvas = document.getElementById('id-canvas');
    
    function generateLand(landingAreas){
        canvas.height = window.innerHeight/1.15;
        canvas.width = window.innerWidth/1.1;
        let lines = [];
        let firstLine = {a:{x: 0, y: canvas.height/1.5}, b:{x: canvas.width, y: canvas.height/1.5}};
        let roughness = 1;
        let numOfDiv = Math.floor((26/landingAreas));
        let startRange = canvas.width * .15; 
        let endRange = canvas.width * .85;
        let rangeLength = endRange - startRange;
        let divRange = rangeLength / landingAreas;
        let landingLength = canvas.width * .09;
        let StartingPoint = {x: 0, y: getNewY(firstLine, roughness)};
        let newLine = null;
        let newLanding =null;


        for(let i = 0; i < landingAreas; i++){
            let newLandingX = Random.nextDouble() * (divRange - landingLength) + startRange;
            let newLandingY = getNewY(firstLine, roughness);
            newLine = {a: StartingPoint, b: {x: newLandingX, y: newLandingY}};
            
            lines = lines.concat(makeTerrain(numOfDiv, roughness,newLine))
            newLanding = makeLanding(newLandingX, lines[lines.length -1].b.y, landingLength)
            lines = lines.concat(newLanding);

            startRange += divRange;
            StartingPoint = {x: newLandingX + landingLength, y: lines[lines.length -1].b.y};
            
        }
        
        lines = lines.concat(makeTerrain(numOfDiv, roughness, {a: newLanding.b, b:{x: canvas.width, y: 500}}))


        return lines;
    }


    function makeLanding(landingX, landingY, length){
        return {a:{x:landingX, y:landingY}, b: {x: landingX + length , y: landingY}, isLanding: true};
    }
    
    // makes an array of random lines that is the Terrain area
    function makeTerrain(numOfDiv, roughness, line){
        let lines = [line];
        let newX = line.a.x;
        let lineLegth = Math.abs(line.b.x - line.a.x) / numOfDiv;        
        
        while(numOfDiv >= 1){
            let splitLine = lines.pop();
            let newY = getNewY(splitLine, roughness)
            newX += lineLegth;
            let rightLine = {a: splitLine.a, b:{x: newX, y:newY}, isLanding: false};
            let leftLine = {a:{x: newX, y:newY}, b:splitLine.b, isLanding: false};
            lines.push(rightLine);
            lines.push(leftLine);
            numOfDiv -= 1;
        }
        lines.pop()
        return lines;
    }

    function getNewY(line, roughness){
        let randNum = Random.nextGaussian(0,1);
        let length = Math.abs(line.b.x - line.a.x);
        let r = roughness * randNum * length;
        return checkPoint(.5*(line.a.y + line.b.y) + r);
    }

    function checkPoint(theY){
        while(theY <canvas.height * .50 ){
            theY += canvas.height * .25;
        }
        while(theY > canvas.height * .99){
            theY -= canvas.height * .25;
        }
        return theY;
    }

    function reset(landingAreas){
        return generateLand(landingAreas);
    }

    function updateHighScores(newScore){
        let highScores = JSON.parse(localStorage.getItem("highScores"));
        highScores.push(newScore);
        highScores.sort(function(a,b){return b-a});
        highScores.pop();
        localStorage.setItem("highScores", JSON.stringify(highScores));
    }

   

    let api = {
        get canvas() { return canvas; },
        generateLand: generateLand,
        reset: reset,
        updateHighScores: updateHighScores,
        

        
    };

    return api;

}());