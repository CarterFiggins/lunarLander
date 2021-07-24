// Changes the keys used to control Rocket ship

let thurstKey = false;
let rightKey = false;
let leftKey = false;
let ships = [];
let particles = [];
document.addEventListener('keydown',updateKey);

let controls = JSON.parse(localStorage.getItem('controls'));
document.getElementById('thrust').innerHTML += "<span class = 'red'> '" +controls.thrust + "'</span>"; 
document.getElementById('right').innerHTML += "<span class = 'red'> '" + controls.right + "'</span>";
document.getElementById('left').innerHTML += "<span class = 'red'> '" + controls.left + "'</span>";

function thrustClick(){
    document.getElementById('newControls').innerHTML = "Enter a key for Thrust";
    thurstKey = true;

}
function rightClick(){
    document.getElementById('newControls').innerHTML = "Enter a key for Rotate Right";
    rightKey = true;

}
function leftClick(){
    document.getElementById('newControls').innerHTML = "Enter a key for Rotate Left";
    leftKey = true;

}

function updateKey(event){
    if(thurstKey){
        controls.thrust = event.key;
        localStorage.setItem("controls", JSON.stringify(controls));
        document.getElementById('newControls').innerHTML = "";
        thurstKey = false;
        document.location.reload();

    }
    if(rightKey){
        controls.right = event.key;
        localStorage.setItem("controls", JSON.stringify(controls));
        document.getElementById('newControls').innerHTML = "";
        rightKey = false;
        document.location.reload();

    }
    if(leftKey){
        controls.left = event.key;
        localStorage.setItem
        localStorage.setItem("controls", JSON.stringify(controls));
        document.getElementById('newControls').innerHTML = "";
        leftKey = false;
        document.location.reload();

    }
}

function makeListOfImages(list, name, size){
    for(let i = 1; i <= size; i++){
        list.push(`${name}${i}.png`);
    }

}

function getImages(list, storageName, clickFunctionName){
    html = ""
    for(let item of list){
        if(item === localStorage.getItem(storageName)){
            html += `<img class = "image box" src= "../images/${item}" width = "100" onclick = "${clickFunctionName}('${item}')" >`
        }
        else{
            html += `<img class = "image" src= "../images/${item}" width = "100" onclick = "${clickFunctionName}('${item}')" >`
        }
    }
    return html;
}

makeListOfImages(ships, "SpaceShip", 6);
document.getElementById('ships').innerHTML = getImages(ships, 'ship', 'chooseShip')
function chooseShip(ship){
    localStorage.setItem("ship", ship);
    document.getElementById('ships').innerHTML = getImages(ships, 'ship', 'chooseShip')
}

makeListOfImages(particles, "particle", 6);
document.getElementById('particles').innerHTML = getImages(particles, 'particle', 'chooseParticle');
function chooseParticle(particle){
    localStorage.setItem('particle', particle);
    document.getElementById('particles').innerHTML = getImages(particles, 'particle', 'chooseParticle');
}