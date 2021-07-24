
// gets scores from browses localStorage.

highScores = JSON.parse(localStorage.getItem('highScores'));
for(let i in highScores){
    document.getElementById('' + i).innerHTML += highScores[i];
}

