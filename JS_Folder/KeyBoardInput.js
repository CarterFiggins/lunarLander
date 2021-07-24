

// Using Dean my Professors code

MyGame.input.Keyboard = function (){
    let that = {
        keys: {},
        handlers: {},
    };

    function keyPress(e){
        that.keys[e.key] = e.timeStamp;
    }

    function keyRelase(e){
        delete that.keys[e.key];
    }

    that.update = function (elapsedTime){
        for (let key in that.keys){
            if(that.keys.hasOwnProperty(key)){
               if(that.handlers[key]){
                    that.handlers[key](elapsedTime);
                }
            }
        }
    };

    // takes in a key and a function that will run 
    // with the elapsedTime as its pram when pressed.
    that.register = function(key, handler){
        that.handlers[key] = handler;
    };

    that.checkPress = function(thurst){
        for(let key in that.keys){
            if(thurst == key){
                return true
            }
        }
        return false;
    }

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelase);

    return that;

};