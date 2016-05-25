var img = "../samples/asap-ferg-mini.png";
var canvas = document.getElementById("scene");
var ctx = canvas.getContext("2d");

function drawScene() {

  canvas.width = png.width * _SIZE_;
  canvas.height = png.height * _SIZE_;

  var cw = canvas.width;
  var ch = canvas.height;

  ctx.drawImage(png, 0, 0);
  var data = ctx.getImageData(0, 0, png.width, png.height);
  ctx.clearRect(0, 0, cw, ch);

  var particles = [];
  var particles2 = [];
  var particles3 = [];
  var particles4 = [];

  for (var y = 0, y2 = data.height; y < y2; y++) {
    for (var x = 0, x2 = data.width; x < x2; x++) {
      if (data.data[(x * 4 + y * 4 * data.width)] > 50) {
        var particle = {
          x: x,
          y: y
        };
        particles.push(particle);
      }

      if (data.data[(x * 4 + y * 4 * data.width)] > 125) {
        var particle2 = {
          x: x,
          y: y
        };
        particles2.push(particle2);
      }

      if (data.data[(x * 4 + y * 4 * data.width)] > 175) {
        var particle3 = {
          x: x,
          y: y
        };
        particles3.push(particle3);
      }

      if (data.data[(x * 4 + y * 4 * data.width)] > 225) {
        var particle4 = {
          x: x,
          y: y
        };
        particles4.push(particle4);
      }
    }
  }





  for (var i = 0, j = particles.length; i < j; i++) {
    var particle = particles[i];
    ctx.fillStyle = "#00a";
    ctx.fillRect(particle.x * _SIZE_ + 8, particle.y * _SIZE_, 2, 2);

  }
  for (var i = 0, j = particles2.length; i < j; i++) {
    var particle = particles2[i];
    ctx.beginPath();
    ctx.fillStyle = "red";
    // ctx.fillRect(particle.x * _SIZE_, particle.y * _SIZE_, 3, 3);
    ctx.arc(particle.x * _SIZE_, particle.y * _SIZE_, 2, 0, 2 * Math.PI, false);
    ctx.fill();
  }
  for (var i = 0, j = particles3.length; i < j; i++) {
    var particle = particles3[i];
    ctx.fillStyle = "blue";
    ctx.fillRect(particle.x * _SIZE_ - 9, particle.y * _SIZE_ + 4, 1, -8);
  }
  for (var i = 0, j = particles4.length; i < j; i++) {
    var particle = particles4[i];
    ctx.fillStyle = "cyan";
    ctx.fillRect(particle.x * _SIZE_, particle.y * _SIZE_, 2, 1);
  }


}

function randoParticles() {
  for (var i = 0; i < 10000; i++) {
    ctx.beginPath();
    ctx.fillStyle = "#006";
    ctx.rect(
      Math.random() * cw | 0,
      Math.random() * ch | 0,
      1,
      1
    );
    ctx.fill();
  }
  for (var i = 0; i < 20000; i++) {
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.rect(
      Math.random() * cw / 8 | 0,
      Math.random() * ch | 0,
      4,
      4
    );
    ctx.fill();
  }

  for (var i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.fillStyle = "cyan";
    ctx.rect(
      Math.random() * cw / 2 | 0,
      Math.random() * ch | 0,
      20,
      1
    );
    ctx.fill();
  }

  for (var i = 0; i < 200; i++) {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.rect(
      Math.random() * cw / 4 | 0,
      Math.random() * ch | 0,
      1,
      40
    );
    ctx.fill();
    // ctx.rotate(10);
  }
}

function repeatOften() {
  // drawScene();
  // randoParticles();

  requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);

var png = new Image();
png.crossOrigin = "Anonymous";
png.onload = drawScene;
png.src = img;

var _SIZE_ = 6;
