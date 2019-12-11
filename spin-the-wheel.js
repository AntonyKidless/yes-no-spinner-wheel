<script>
var options = ["Yes", "No", "Yes", "No"];
var colors = ["#f62a66", "#374955", "#ffd933", "#203541"];

var startAngle = 14.875;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

//var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
  var phase = 0;
  var center = 91;
  var width = 90;
  var frequency = Math.PI*2/maxitem;
  
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  
  return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 65;
    var textRadius = 33;
    var insideRadius = 0;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,140,140);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 14px Montserrat, Helvetica, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      ctx.fillStyle = colors[i];
      //ctx.fillStyle = getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(70, 70, outsideRadius, angle, angle + arc, false);
      ctx.arc(70, 70, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      if (i==1 || i==3){
        ctx.fillStyle = "white";
      }
      ctx.translate(70 + Math.cos(angle + arc / 2) * textRadius, 
                    70 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "white";
    ctx.beginPath();    
    ctx.moveTo(3, 60);
    ctx.lineTo(13, 70);
    ctx.lineTo(3, 80);
    ctx.fill();
  }
}

function spin() {
  document.getElementById("layout").classList.toggle("show", false); 
  document.getElementById("spinresult").innerHTML = "";
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  degrees = degrees - 90;  
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  //ctx.font = 'bold 30px Montserrat, Helvetica, Arial';
  var text = options[index];
  //ctx.fillStyle = "black";
  //ctx.fillText(text, 125 - ctx.measureText(text).width / 2, 125 + 10);
  document.getElementById("spinresult").innerHTML = text;
  document.getElementById("layout").classList.toggle("show", true);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();
	</script>
