var _SIZE_ = 6;

function randoParticles(ctx, cw, ch) {
    var i;

	  for (i = 0; i < 10000; i++) {
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
    for (i = 0; i < 20000; i++) {
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

    for (i = 0; i < 100; i++) {
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

    for (i = 0; i < 200; i++) {
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

function drawScene(v,c,bc,w,h) {

  var i, p;

    if (v.paused || v.ended) return false;
    // First, draw it into the backing canvas
    bc.drawImage(v,0,0,w,h);

    // Grab the pixel data from the backing canvas
    var idata = bc.getImageData(0,0,w,h);
    var data = idata.data;

    c.clearRect(0,0,w * _SIZE_,h * _SIZE_);


    // console.log(data)

    // Particlize
    var particles = [];
    var particles2 = [];
    var particles3 = [];
    var particles4 = [];

    for (var y = 0, y2 = h; y < y2; y++) {
        for (var x = 0, x2 = w; x < x2; x++) {
            if (data[(x * 4 + y * 4 * w)] > 64) {
                p = {
                    x : x,
                    y : y
                };
                particles.push(p);
            }

            if (data[(x * 4 + y * 4 * w)] > 128) {
                p = {
                    x : x,
                    y : y
                };
                particles2.push(p);
            }

            if (data[(x * 4 + y * 4 * w)] > 192) {
                p = {
                    x : x,
                    y : y
                };
                particles3.push(p);
            }

            if (data[(x * 4 + y * 4 * w)] > 204) {
                p = {
                    x : x,
                    y : y
                };
                particles4.push(p);
            }
        }
    }

    for(i = 0, j = particles.length; i<j; i++) {
        p = particles[i];
        c.fillStyle = "#323232";
        c.fillRect(p.x * _SIZE_ + 8, p.y * _SIZE_, 2, 2);
    }

    for(i = 0, j = particles2.length; i<j; i++) {
        p = particles2[i];

        c.fillStyle = "#0068ff ";

        c.fillRect(p.x * _SIZE_, p.y * _SIZE_, 3, 3);

        // c.beginPath();
        // c.arc(p.x * _SIZE_, p.y * _SIZE_, 2, 0, 2 * Math.PI, false);
        // c.fill();
    }
    for(i = 0, j = particles3.length; i<j; i++) {
        p = particles3[i];
        c.fillStyle = "#AFAFAF";
        c.fillRect(p.x * _SIZE_ - 9, p.y * _SIZE_ + 4, 1, 2);
    }
    for(i = 0, j = particles4.length; i<j; i++) {
        p = particles4[i];
        c.fillStyle = "white";
        c.fillRect(p.x * _SIZE_, p.y * _SIZE_, 1, 8);
    }

    // Draw the pixels onto the visible canvas
    idata.data = data;

    // randoParticles(c, w * _SIZE_, h * _SIZE_);

    // Start over!
    requestAnimationFrame(function() {
      drawScene(v,c,bc,w,h);
    }, 0);
}

document.addEventListener('DOMContentLoaded', function(){
  var vid = document.getElementById('video');
  var canvas = document.getElementById('scene');
  var context = canvas.getContext('2d');
  var back = document.createElement('canvas');
  var backcontext = back.getContext('2d');

  var cw,ch;


  vid.addEventListener('play', function(){
      cw = vid.clientWidth;
      ch = vid.clientHeight;
      canvas.width = cw * _SIZE_;
      canvas.height = ch * _SIZE_;
      back.width = cw;
      back.height = ch;
      drawScene(vid,context,backcontext,cw,ch);
  },false);
    // vid.src = img;
},false);
