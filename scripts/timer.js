// Credit Anders Grimsrud for the SVG Pie Timer
// https://codepen.io/agrimsrud/pen/EmCoa

var loader = document.getElementById('timer-loader')
  , border = document.getElementById('timer-border')
  , α = 0
  , π = Math.PI
  , t = 60;

(function draw() {
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
  //[x,y].forEach(function( d ){
  //  d = Math.round( d * 1e3 ) / 1e3;
  //});
 
  loader.setAttribute( 'd', anim );
  border.setAttribute( 'd', anim );
  
  setTimeout(draw, t); // Redraw
})();
