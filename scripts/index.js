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

        // Show shamrocks above score area as feedback for points earned
        displayFeedback: function() {
            var shamrocksPic = document.createElement("img");
            shamrocksPic.src = "img/3-shamrocks.svg";
            shamrocksPic.alt = "Good catch, points scored!"
            shamrocksPic.id = "shamrock-feedback";
            var visualFeedback = document.getElementById("feedback").appendChild(shamrocksPic);
            // When animation ends, removed shamrock element
            document.getElementById("shamrock-feedback").addEventListener("animationend", function() {
                document.getElementById("shamrock-feedback").remove();
            });
        },

        displayPlayBtn: function() {
            document.getElementById("play-btn").setAttribute("style", 
                "display: block;")
        },

        hidePlayBtn: function() {
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
        window.addEventListener("load", showNewTarget);

        // After click target: process the success
        document.getElementById("target").addEventListener("click", processSuccess);

        // After click play again button: reset game
        document.getElementById("play-btn").addEventListener("click", resetGame);

        // Reset timer on user activity
        document.addEventListener("mousemove", resetTimer, false);
        document.addEventListener("mousedown", resetTimer, false);
        document.addEventListener("keypress", resetTimer, false);
        document.addEventListener("touchmove", resetTimer, false);

    }

    // On success: hide target, update score, show new target
    function processSuccess() {
        // Hide target
        UICtrl.hideTarget();

        // Update score and display score
        var newScore = dataCtrl.updateScore();
        UICtrl.displayScore(newScore);
        UICtrl.displayFeedback();

        // Get random time delay and show new target
        var timeNoTarget = dataCtrl.getRand(500, 1000);
        var timeoutID = window.setTimeout(showNewTarget, timeNoTarget);

        // To account for edge cases, hide play button
        UICtrl.hidePlayBtn();
    }
    
    // Reset score, hide play button,  show new target
    function resetGame() {
        // Reset score and display score
        var newScore = dataCtrl.resetScore();
        UICtrl.displayScore(newScore);

        // Hide replay button
        UICtrl.hidePlayBtn();
        waiting = false;

        // Show new target
        showNewTarget();
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
        var animDelay = dataCtrl.getRand(300, 700);

        // Get random animation duration time, ms
        var animDuration = dataCtrl.getRand(300, 900);

        // get random movement in rem
        var xMove = dataCtrl.getRand(-5, 5);
        var yMove = dataCtrl.getRand(-5, 5);

        // Get random scale size
        var scaleSize = (dataCtrl.getRand(2, 9) / 10);
        
        // Display new target with random location and animation factors
        UICtrl.displayTarget(xLoc, yLoc, animDelay, animDuration, xMove, yMove, scaleSize);
        console.log("x, y: " + xLoc + ", " + yLoc + " / delay: " + animDelay + "/ scaleSize: " + scaleSize + " Move: " + xMove + ", " + yMove);

    };

    // Flag for if user is active
    var active = true;
    // Flag for if user is waiting on new game
    var waiting = false;   
    
    // Set up timer for showing new targets
    var newTargetInterval;
    var newTargetTimeout = 5000;

    // Set timer for showing new targets 
    function newTargetTimer() {
        newTargetInterval = window.setInterval(function() {
            if ((active != false) & (waiting === false)){
                showNewTarget();
            } else if (active === false) {
                window.clearInterval(newTargetTimeout);
            }
        }, newTargetTimeout);
    };
    
    // Set up timer for showing the Play Again button
    var inactiveInterval;
    var inactiveTimeout = 5000;

    // Reset timer
    function resetTimer() {
        window.clearInterval(inactiveInterval);
        isActiveTimer();
        active = true;
    };

    // Set timer  
    function isActiveTimer() {
        inactiveInterval = window.setInterval(isActive, inactiveTimeout);
    };
    
    // On timer, if user inactive, display play button
    function isActive() {
        if (!active) {
            return false;
        }
        UICtrl.displayPlayBtn();
        active = false;
        waiting = true;
    }


    return {
        init: function() {
            setupEventListeners();
            isActiveTimer();
            newTargetTimer();
            }

    }
})(UIController, dataController);

controller.init();
