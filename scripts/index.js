// DATA CONTROLLER

var dataController = (function() {

// Score

var score = 0;
var increment = 10;

// Level
var gameTimeMS = 20000;

// Target location

    return {

        // Generate random number
        getRand: function(min, max) {
            //Note: max is inclusive and the min is exclusive
            min = Math.floor(min);
            max = Math.ceil(max);
            return Math.floor(Math.random() * (max - min)) + min; 
        },

        getGameTimeMS: function() {
            return gameTimeMS;
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
            document.getElementById("target").setAttribute("style", "display: none;");
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

        /////////////////////////////////////////////////
        ////////////////////////////////////////////////
        // Create and display Start Play button
        displayPlayStart: function() {
            // Create containing div, add svg and text
            var startPlayBtn = document.createElement("div");
            startPlayBtn.id = "play-start";
            startPlayBtn.className = "play";
            startPlayBtn.classList.add("play--start");
            var startPlayImg = document.createElement("img");
            startPlayImg.src = "img/play_shamrock.svg";
            startPlayImg.alt = "Play the game";
            startPlayBtn.appendChild(startPlayImg);
            var startPlayTxt = document.createElement("div");
            startPlayTxt.className = "play__text";
            startPlayTxt.textContent = "play";
            startPlayBtn.appendChild(startPlayTxt);

            // Display button
            document.getElementById("canvas__interior").appendChild(startPlayBtn);

            return true;
        },

        hidePlayStart: function() {
            document.getElementById("canvas__interior").removeChild(document.getElementById("play-start"));
        },

        displayPlayBtn: function() {
            // document.getElementById("play-btn").setAttribute("style", "display: block;")

            // Create containing div, add svg 
            var replayBtn = document.createElement("div");
            replayBtn.id = "play-btn";
            replayBtn.className = "play";
            replayBtn.classList.add("play--replay");
            var replayImg = document.createElement("img");
            replayImg.src = "img/replay_shamrock.svg";
            replayImg.alt = "Play again";
            replayBtn.appendChild(replayImg);

            // Display button
            document.getElementById("canvas__interior").appendChild(replayBtn);

            return true;
        },

        hidePlayBtn: function() {
            // document.getElementById("play-btn").setAttribute("style", "display: none;")
            document.getElementById("canvas__interior").removeChild(document.getElementById("play-btn"));
        }, 

        // Show the pie timer
        displayTimer: function(time) {

            document.getElementById("timer").setAttribute("style", "display: block;");

            // Credit Anders Grimsrud for the SVG Pie Timer
            // https://codepen.io/agrimsrud/pen/EmCoa
            var loader = document.getElementById('timer-loader')
            , border = document.getElementById('timer-border')
            , α = 0
            , π = Math.PI
            , t = (time / 360);    // 60sec / 360deg

            var timerUIInterval = window.setInterval(function() {
            α--;
            α %= -360;
            var r = ( α * π / 180 )
                , x = Math.sin( r ) * 125
                , y = Math.cos( r ) * - 125
                , mid = ( α > -180 ) ? 1 : 0
                , anim = 'M 0 0 v -125 A 125 125 1 ' 
                    + mid + ' 1 ' 
                    +  x  + ' ' 
                    +  y  + ' z';
            //[x,y].forEach(function( d ){ d = Math.round( d * 1e3 ) / 1e3; });
            
            loader.setAttribute( 'd', anim );
            border.setAttribute( 'd', anim );
            }, t);

            // Stop the timer after game time
            var timerUIStop = window.setTimeout(function() {
                window.clearInterval(timerUIInterval);
                document.getElementById("timer").setAttribute("style", "display: none;");
            }, time);
        },

        // Toggle to let web page go full screen
        fullScreenToggle: function() {
            var doc = window.document;
            var docEl = doc.documentElement;
          
            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
          
            if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
              requestFullScreen.call(docEl);
            }
            else {
              cancelFullScreen.call(doc);
            }
        }
    }
})();


// CONTROLLER
var controller = (function(UICtrl, dataCtrl) {

    // Event listeners
    var setupEventListeners = function() {

        // When animation ends, start game, hide animation div
        document.getElementById("anim-last").addEventListener("animationend", function() {
            // TODO document.getElementById("splash").setAttribute("style", "display: none;")

            // Add and show Play start button
            var isReady = UICtrl.displayPlayStart();
            if (isReady) {
                // When Play button, add listener to start game
                document.getElementById("play-start").addEventListener("click", function() {
                    // UICtrl.fullScreenToggle(); // TODO
                    startGame();
                    UICtrl.hidePlayStart();
                })
            }

            
        });
        // DEBUG
        // document.addEventListener("DOMContentLoaded", startGame);
        
        // After click target: process the success
        document.getElementById("target").addEventListener("click", processSuccess);

        // Full screen toggle
        document.getElementById("fullscreen-toggle").addEventListener("click", UICtrl.fullScreenToggle, false);  

        ///////////////////////////////////
        // TODO Double click selects target
        // Related to DBLCLICK bug in Firefox?   
        // https://github.com/mozilla/geckodriver/issues/661
        // document.getElementById("target").addEventListener("dblclick", 
        // function() {
        //     console.log('dblclick');
            // if(document.selection && document.selection.empty) {
            //     document.selection.empty();
            // } else if(window.getSelection) {
            //     var sel = window.getSelection();
            //     sel.removeAllRanges();
            // }
        // }, false);
        // document.getElementById("target").addEventListener("selectstart", function() {
        //     console.log('Selection started'); 
        //     return false;
        //   }, false);


    };

    // Set timer for showing new targets 
    // Target Interval ID, must be global
    var newTargetInterval;
    function newTargetTimer(go) {
        var newTargetTimeout = 2500;
        if (go === true) {
            newTargetInterval = window.setInterval(showNewTarget, newTargetTimeout);
        } else if (go === false) {
            window.clearInterval(newTargetInterval);
            // return;
        }
    };

    // On timer, end game 
    var gameTimer = function(time) {
        // Display pie chart timer 
        UICtrl.displayTimer(time);
        // When game ends, show replay button, hide target, 
        // clear timer, stop new targets
        var gameTimeout = window.setTimeout(function() {

            // Show the play again button and add listener to start game
            var isPlayBtn = UICtrl.displayPlayBtn();
            if (isPlayBtn) {
                document.getElementById("play-btn").addEventListener("click", function() {
                    startGame();
                    UICtrl.hidePlayBtn();
                })
            }


            UICtrl.hideTarget();
            window.clearTimeout(gameTimeout);
            newTargetTimer(false);
        }, time);
    };

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

    }
    
    // On success: hide target, update score, show new target
    function processSuccess() {
        // Hide target
        UICtrl.hideTarget();

        // Update score and display score
        var newScore = dataCtrl.updateScore();
        UICtrl.displayScore(newScore);
        UICtrl.displayFeedback();

        // To account for edge cases, hide play button
        // UICtrl.hidePlayBtn();
    }
    

    // Reset score, hide play button,  show new target
    function startGame() {
        // Reset score and display score
        var newScore = dataCtrl.resetScore();
        UICtrl.displayScore(newScore);

        // Restart game timer
        gameTimer(dataCtrl.getGameTimeMS());

        // Start showing new targets
        newTargetTimer(true);
    }


    return {
        init: function() {
            setupEventListeners();
        }
    }
})(UIController, dataController);

controller.init();
