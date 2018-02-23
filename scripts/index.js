// DATA CONTROLLER

var dataController = (function() {

// Score

var score = 0;
var increment = 10;

// Level

// Target location

    return {

        // Generate random number
        getRand: function(min, max) {
            //Note: max is inclusive and the min is exclusive
            min = Math.floor(min);
            max = Math.ceil(max);
            return Math.floor(Math.random() * (max - min)) + min; 
        },

        updateScore: function() {
            score = score + increment;
            return score;
        }, 

        resetScore: function() {
            score = 0;
            return score;
        } 

    }
    
})();


// UI CONTROLLER
var UIController = (function() {

    return {
        // Display target in rand location that 
        // animates according to rand inputs 
        displayTarget: function(x, y, delay, dur, moveX, moveY, sz) {
            document.getElementById("target").classList.remove("target"); 
            document.getElementById("target").classList.add("target--start"); 
            document.getElementById("target").setAttribute("style", "top: " + y +"%; left: " + x +"%;");

            var timeoutID = window.setTimeout(function() {
                document.getElementById("target").classList.remove("target--start"); 
                document.getElementById("target").classList.add("target--end"); 
                document.getElementById("target").setAttribute("style", "top: " + y +"%; left: " + x +"%; transform: scale(" + sz + ") translate3d(" + moveX + "rem, " + moveY + "rem, " + "0); transition-duration: " + dur + "ms;");
                }, delay);
                
            document.getElementById("target").classList.add("target"); 
        }, 

        displayScore: function(sc) {
            document.getElementById("score").textContent = sc;
        },

        hideTarget: function() {
            document.getElementById("target").setAttribute("style", "display: none;")
        },

        displayPlayBtn: function() {
            console.log('display play button');
            document.getElementById("play-btn").setAttribute("style", 
                "display: block;")
        },

        hidePlayBtn: function() {
            console.log('hide play button');
            document.getElementById("play-btn").setAttribute("style", 
                "display: none;")
        }
    }

})();


// CONTROLLER
var controller = (function(UICtrl, dataCtrl) {

    // Event listeners
    var setupEventListeners = function() {
        // Load new target on DOM load
        document.addEventListener("DOMContentLoaded", showNewTarget);

        // After click target: hide target, update score, 
        // and show new target
        document.getElementById("target").addEventListener("click", function(){
            // Update score and display score
            var newScore = dataCtrl.updateScore();
            UICtrl.displayScore(newScore);
            UICtrl.hideTarget();

            // Get random time delay and show new target
            var timeNoTarget = dataCtrl.getRand(0, 3000);
            var timeoutID = window.setTimeout(showNewTarget, timeNoTarget);
        });

        // After click play again button: reset score and show new target
        document.getElementById("play-btn").addEventListener("click", function() {

            // Reset score and display score
            var newScore = dataCtrl.resetScore();
            UICtrl.displayScore(newScore);
            UICtrl.hidePlayBtn();

            // Show new target
            showNewTarget();
        });

        // Reset timer on user activity
        document.addEventListener("mousemove", resetTimer, false);
        document.addEventListener("mousedown", resetTimer, false);
        document.addEventListener("keypress", resetTimer, false);
        document.addEventListener("touchmove", resetTimer, false);

    }

    // Display target in random location on canvas
    function showNewTarget() {
        // Hide prev target
        document.getElementById("target").classList.add("target"); 
        document.getElementById("target").classList.remove("target--end");

        // Get random x and y coordinates
        var xLoc = dataCtrl.getRand(0, 97);
        var yLoc = dataCtrl.getRand(0, 94);
        
        // Get random animation delay time, ms
        var animDelay = dataCtrl.getRand(200, 1100);

        // Get random animation duration time, ms
        var animDuration = dataCtrl.getRand(500, 1500);

        // get random movement in rem
        var xMove = dataCtrl.getRand(-5, 5);
        var yMove = dataCtrl.getRand(-5, 5);

        // Get random scale size
        var scaleSize = (dataCtrl.getRand(4, 9) / 10);
        console.log(xLoc + ", " + yLoc + " / delay: " + animDelay);
        console.log("scaleSize: " + scaleSize + " Move: " + xMove + ", " + yMove);
        
        // Display new target with random location and animation factors
        UICtrl.displayTarget(xLoc, yLoc, animDelay, animDuration, xMove, yMove, scaleSize);

    };
    
    // Set up timer for showing the Play Again button
    var intervalID;
    var timeoutInMS = 3000;
    var active;

    // Reset timer
    function resetTimer() {
        window.clearInterval(intervalID);
        startTimer();
        active = true;
    };

    function startTimer() {
        intervalID = window.setInterval(isActive, timeoutInMS);
        var test = timeoutInMS / 100;
        console.log("start timer");
    };
    
    function isActive() {
        active = false;
        if (!active) {
            console.log('active is false');
            UICtrl.displayPlayBtn();
        }
    }


    return {
        init: function() {
            setupEventListeners();
            startTimer();
            }

    }
})(UIController, dataController);

controller.init();
