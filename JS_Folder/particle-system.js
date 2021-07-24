
function ParticleSystem(graphics, spec) {
    let that = {};
    let particles = [];
    
    let image = new Image();
    image.src = spec.imageSrc;


    that.fire = function(player){
        let center = {...player.center};
        
        center.y += Math.sin(player.rotation - Math.PI * 1.5) * 20;
        center.x += Math.cos(player.rotation - Math.PI * 1.5) * 20;

        for (let particle = 0; particle < 5; particle++) {
            let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
            let p = create({
                image: image,
                center: {...center},
                size: {width: size, height: size},
                rotation: 0,
                speed: Math.abs(Random.nextGaussian(spec.speed.mean, spec.speed.stdev)),
                direction: Random.nextThrustVector(player.rotation- Math.PI*1.5),
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
            });
            particles.push(p);
        }
    }

    function create(spec) {
        let that = {};

        spec.fill = 'rgb(255, 255, 255)';
        spec.stroke = 'rgb(0, 0, 0)';
        spec.alive = 0;

        that.update = function(elapsedTime) {
            spec.center.x += (spec.speed * spec.direction.x * elapsedTime);
            spec.center.y += (spec.speed * spec.direction.y * elapsedTime);
            spec.alive += elapsedTime;

            spec.rotation += spec.speed * 0.5;

            return spec.alive < spec.lifetime;
        };

        that.draw = function() {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        };

        return that;
    }

    that.update = function(elapsedTime) {
        let keepMe = [];
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].update(elapsedTime)) {
                keepMe.push(particles[particle]);
            }
        }
        particles = keepMe;
       
        
    };

    that.render = function() {
        for (let p = particles.length - 1; p >= 0; p--) {
            particles[p].draw();
        }
    };

    return that;
}
