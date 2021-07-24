
// the plyaers functionality and info.
MyGame.objects.Lander = function(spec){
    let rotation = spec.rotation ;
    let alive = true;
    let hasLanded = false;
    let momentum = spec.momentum;
    let speed = Math.abs(momentum.x) + Math.abs(momentum.y);
    let fuel = 100.0;
    let gravity = .00002;
    let angle = Math.floor(Math.abs((rotation * Math.PI * 18.4 )%360));
    let center = spec.center;
    let radius = spec.radius;
    let size = spec.size;
    let startRotation = rotation
    let startMomentum = {...momentum};
    let startSpeed = speed;
    let startFuel = 100.0;
    let startAngle = angle;
    let startCenter = {...center};


    let imageReady = false;
    let image = new Image();

    image.onload = function(){
        imageReady = true;
    }
    image.src = spec.imageSrc;


    function rotateRight(elapsedTime){
        rotation += (spec.rotationRate * elapsedTime )
    }

    function rotateLeft(elapsedTime){
        rotation -= (spec.rotationRate * elapsedTime)
    }

    function thrust(elapsedTime){

        thrustX = Math.cos(rotation+Math.PI*1.5);
        thrustY = Math.sin(rotation+Math.PI *1.5);
        if(fuel <= 0){
            fuel = 0;
        }
        else{
            momentum.y +=(thrustY * spec.thrustRate *elapsedTime)
            momentum.x +=(thrustX * spec.thrustRate *elapsedTime)
            fuel -= .2;
        }

    }

    function update(elapsedTime){
        if(alive && !hasLanded){
            momentum.y += (gravity * elapsedTime)
            speed = Math.round((Math.abs(momentum.x) + Math.abs(momentum.y)+"e+2")) ;
            center.x += (momentum.x * elapsedTime)
            center.y += (momentum.y * elapsedTime)
            angle = Math.floor(Math.abs((rotation * Math.PI * 18.4 )%360))
        }
    }

    function moveTo(pos){
        center.x = pos.x;
        center.y = pos.y;
    }

    function reset(){
        moveTo({...startCenter});
        alive = true;
        hasLanded = false;
        rotation = startRotation;
        momentum = {...startMomentum};
        speed = startSpeed;
        fuel = startFuel;
        angle = startAngle;
        center = {...startCenter};
    }

    function die(){
        alive = false;
    }
    function landed(){
        hasLanded = true;
    }

    function nextLevel(){
        gravity += .000005;
    }

    let api = {
        rotateRight: rotateRight,
        rotateLeft: rotateLeft,
        thrust: thrust,
        moveTo: moveTo,
        update: update,
        die: die,
        landed: landed,
        reset: reset,
        nextLevel: nextLevel,
        get imageReady(){ return imageReady; },
        get image(){ return image;},
        get alive(){return alive},
        get hasLanded(){return hasLanded},
        get angle(){return angle},
        get speed(){return speed},
        get fuel(){return fuel},
        get rotation(){return rotation},
        get momentum(){return momentum},
        get center(){return center},
        get radius(){return radius},
        get size(){return size},

    };
    return api;
}

