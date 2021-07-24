
// set up the games highScores and controls if none are there.
function game(){
    // if no highScores then set up
    if(localStorage.getItem('highScores') == null){
        let highScores = [0,0,0,0,0];
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }
    // if no custom controls then sets up
    if(localStorage.getItem('controls')== null){
        let controls = {
            thrust: 'ArrowUp',
            right: 'ArrowRight',
            left: 'ArrowLeft',
        };
        localStorage.setItem('controls', JSON.stringify(controls));
    }
    if(localStorage.getItem('ship') == null){
        let ship = 'SpaceShip1.png'
        localStorage.setItem('ship', ship);
    }
    if(localStorage.getItem('particle') == null){
        let particle = 'particle1.png'
        localStorage.setItem('particle', particle)
    }
}

game()
