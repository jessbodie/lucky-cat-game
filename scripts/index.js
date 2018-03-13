// DATA CONTROLLER

var dataController = (function() {

// Score
var score = 0;
var increment = 10;

// Level
var gameTimeMS = 30000;

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

        getScore: function() {
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
        
            // Create containing div, add svg and text
            var newTarget = document.createElement("div");
            newTarget.id = "target";
            newTarget.className = "target";
            var newTargetImg = document.createElement("img");
            newTargetImg.src = "img/cat.svg";
            newTargetImg.id = "target-cat";
            newTargetImg.className = "target--cat";
            newTargetImg.alt = "Catch THIS cat!";
            newTargetImg.setAttribute("draggable", false);
            
            newTarget.appendChild(newTargetImg);
            var newTargetWreathImg = document.createElement("img");
            newTargetWreathImg.src = "img/cat-clovers.svg";
            newTargetWreathImg.className = "target--wreath";
            newTargetWreathImg.alt = "Yes, THIS cat!";
            newTarget.appendChild(newTargetWreathImg);
            
            // Display button
            document.getElementById("canvas__interior").appendChild(newTarget);
            
            // Display Lucky Cat as the target
            document.getElementById("target").setAttribute("style", "top: " + y +"%; left: " + x +"%;");
            // Display Lucky Cat Target in new location, on a timer
            var timeoutID = window.setTimeout(function() {
                document.getElementById("target").setAttribute("style", "top: " + y +"%; left: " + x +"%;         transform: scale(" + sz + ") translate3d(" + moveX + "rem, " + moveY + "rem, " + "0);         transition-duration: " + dur + "ms;         opacity: 0;         transition-property: opacity, transform;         transition-timing-function: ease-in-out;");
                }, delay);
                
            return true;
        }, 

        displayScore: function(sc) {
            document.getElementById("score").textContent = sc;
        },

        hideTarget: function() {
            if (document.getElementById("target")) {
                document.getElementById("canvas__interior").removeChild(document.getElementById("target"));
            }
        },

        // Show shamrocks above score area as feedback for points earned
        displayFeedback: function() {
            var shamrocksPic = document.createElement("img");
            shamrocksPic.src = "img/3-shamrocks.svg";
            shamrocksPic.alt = "Good catch, points scored!"
            shamrocksPic.id = "shamrock-feedback";
            var visualFeedback = document.getElementById("feedback").appendChild(shamrocksPic);
            // When animation ends, removed shamrock element 
            // TODO - Trigger on another event and change to removeChild()
            document.getElementById("shamrock-feedback").addEventListener("animationend", function() {
                document.getElementById("shamrock-feedback").remove();
            });
        },

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

            if (requestFullScreen) {
                var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
              
                if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                  requestFullScreen.call(docEl);
                }
                else {
                  cancelFullScreen.call(doc);
                }
            } else {
                document.getElementById("fullscreen").setAttribute("style", "display:none");
                UIController.containerSize();
                return false;
            }
            
        },

        // Set height of container to do innerHeight
        containerSize: function() {
            // console.log('container size');
            var winHeight = window.innerHeight;
            var winWidth = window.innerWidth;
            // console.log("height: " + winHeight);
            // console.log("width: " + window.innerWidth);
            // console.log("screen height: " + window.screen.height);
            // console.log("screen width: " + window.screen.width);
            document.getElementById("container").setAttribute("style", "height: " + winHeight + "px; width: " + winWidth + "px; max-height: " + winHeight + "px; max-width: " + winWidth + "px; min-height: " + winHeight + "px; min-width: " + winWidth + "px; ")
        }    
    
    }
})();


// CONTROLLER
var controller = (function(UICtrl, dataCtrl) {

    // Event listeners
    var setupEventListeners = function() {

        // DEBUG
        document.addEventListener("dblclick", function() {
            console.log('double click');
            console.log(e.target);
        });


        // On load, resize, and reorient: reset window to innerHeight
        document.addEventListener("DOMContentLoaded", UICtrl.containerSize);
        window.addEventListener("resize", UICtrl.containerSize);
        window.addEventListener("orientationchange", UICtrl.containerSize);

        // Detect if touch device
        var touch = false;
        window.addEventListener("touchstart", function isTouch() {
            touch = true;
            window.removeEventListener("touchstart", isTouch, false);
        });

        // When animation ends, hide animation div and listen to start game
        document.getElementById("anim-last").addEventListener("animationend", function() {
            document.getElementById("splash").setAttribute("style", "display: none;")
            // Add and show Play start button
            var isReady = UICtrl.displayPlayStart();
            if (isReady) {
                // When click Play button, add listener to start game
                document.getElementById("play-start").addEventListener("click", function() {
                    console.log('play start click');
                    // If touch and small,  expand window
                    if ((touch===true) && (window.matchMedia("only screen and (max-width: 760px)").matches)) {
                        UICtrl.fullScreenToggle();
                    }
                    startGame();
                    UICtrl.hidePlayStart();
                })
            }
        });
        
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
    // TODO Vary the time interval
    // https://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running
    var newTargetInterval;
    function newTargetTimer(go) {
        var newTargetTimeout = 2500;
        if (go === true) {
            newTargetInterval = window.setInterval(showNewTarget, newTargetTimeout);
        } else if (go === false) {
            window.clearInterval(newTargetInterval);
        }
    };

    // On timer, end game 
    var gameTimer = function(time) {
        // Display pie chart timer 
        UICtrl.displayTimer(time);
        // When game ends, show replay button, hide target, 
        // clear timer, stop new targets
        var gameTimeout = window.setTimeout(function() {


            // On timeout, hide current and next target, and reset timer
            UICtrl.hideTarget();
            newTargetTimer(false);
            window.clearTimeout(gameTimeout);

            // Show the play again button and add listener to start game
            var isPlayBtn = UICtrl.displayPlayBtn();
            if (isPlayBtn) {
                document.getElementById("play-btn").addEventListener("click", function() {
                    document.getElementById("bigscore").removeChild(document.getElementById("bigscore__wow"));
                    document.getElementById("canvas__interior").removeChild(document.getElementById("bigscore"));
                    startGame();
                    UICtrl.hidePlayBtn();
                    // For iOS, check to resize game
                    UICtrl.containerSize();
                })
            }
            
            // Also, show score animation
            var bigScore = document.createElement("div");
            bigScore.className = "bigscore";
            bigScore.id = "bigscore";
            bigScore.textContent = dataCtrl.getScore();
            document.getElementById("canvas__interior").appendChild(bigScore);
            var wow = document.createElement("div");
            wow.className = "bigscore__wow";
            wow.id = "bigscore__wow";
            wow.textContent = "wow!";
            document.getElementById("bigscore").appendChild(wow);

        }, time);
    };

    // Display target in random location on canvas
    function showNewTarget() {
        // Hide prev target
        UICtrl.hideTarget();

        // Get random x and y coordinates
        var xLoc = dataCtrl.getRand(0, 100);
        var yLoc = dataCtrl.getRand(0, 100);
        
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

        // Add target listener: on click, process success
        document.getElementById("target").addEventListener("click", processSuccess);

        // Add listener: on touch, show wreath
        document.getElementById("target").addEventListener("touchstart", function(e) {
            e.target.setAttribute("style", "opacity: 1");

        });
    }
    
    // On success: hide target, update score, show new target
    function processSuccess(e) {
        // Hide target
        UICtrl.hideTarget();

        // Update score and display score
        var newScore = dataCtrl.updateScore();
        UICtrl.displayScore(newScore);
        UICtrl.displayFeedback();
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
