var _SIZE_ = 3;

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

function drawScene(v,c,bc,w,h, audio, anal, pc, pctx) {

  var i, p;

    if (v.paused || v.ended) return false;

    // First, draw it into the backing canvas
    bc.drawImage(v,0,0,w,h);

    // Grab the pixel data from the backing canvas
    var idata = bc.getImageData(0,0,w,h);
    var data = idata.data;

    pc.width = w * _SIZE_;
    pc.height = h * _SIZE_;

    // clear the main scene
    pctx.clearRect(0,0,w * _SIZE_,h * _SIZE_);

    // sample the audio data
    var freqDomain = new Uint8Array(anal.frequencyBinCount);
    var volume;

      var sampleAudioStream = function() {
        anal.getByteFrequencyData(freqDomain);

       // calculate an overall volume value
       var total = 0;
       for (var i = 0; i < 128; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
           total += freqDomain[i];
       }
       volume = total;
      };

      sampleAudioStream();

      z = (volume / 1000);

      console.log(z)

    // console.log(anal);
    // console.log(freqDomain.length);
    // console.log(Math.floor(volume / 1000));
    // console.log(anal.getFloatFrequencyData(freqDomain));

    // Particlize
    var particles = [];
    var particles2 = [];
    var particles3 = [];
    var particles4 = [];

    for (var y = 0, y2 = h; y < y2; y++) {
        for (var x = 0, x2 = w; x < x2; x++) {
            if (data[(x * 4 + y * 4 * w)] > 48) {
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

            if (data[(x * 4 + y * 4 * w)] > 182) {
                p = {
                    x : x,
                    y : y
                };
                particles3.push(p);
            }

            if (data[(x * 4 + y * 4 * w)] > 202) {
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
        pctx.fillStyle = "rgba(30,30,60,1)";
        pctx.fillRect(p.x * _SIZE_- z, p.y * _SIZE_, 2, 2);
    }

    for(i = 0, j = particles2.length; i<j; i++) {
        p = particles2[i];

        pctx.fillStyle = "#0068ff ";

        pctx.fillRect(p.x * _SIZE_, p.y * _SIZE_, 2, 2);

        // pctx.beginPath();
        // pctx.arc(p.x * _SIZE_, p.y * _SIZE_, z, 0, 2 * Math.PI, false);
        // pctx.fill();
    }
    for(i = 0, j = particles3.length; i<j; i++) {
        p = particles3[i];
        pctx.fillStyle = "rgba(255,255,255,0.25)";
        pctx.fillRect(p.x * _SIZE_+ z, p.y * _SIZE_, 2, 2);
    }
    for(i = 0, j = particles4.length; i<j; i++) {
        p = particles4[i];
        pctx.fillStyle = "white";
        pctx.fillRect(p.x * _SIZE_, p.y * _SIZE_, 2, 2);
    }

    // Draw the pixels onto the visible canvas
    idata.data = data;

    // Start over!
    requestAnimationFrame(function() {
      c.clearRect(0,0,w * _SIZE_,h * _SIZE_);
      c.drawImage(pc,0,0);
      drawScene(v,c,bc,w,h,audio,anal,pc,pctx);
      // console.log(c);
    }, 0);
}

document.addEventListener('DOMContentLoaded', function(){
  var vid = document.getElementById('video');
  var canvas = document.getElementById('scene');
  var context = canvas.getContext('2d');
  var back = document.createElement('canvas');
  var backcontext = back.getContext('2d');
  var pc = document.createElement('canvas');
  var pctx = pc.getContext('2d');

  // document.body.appendChild(pc);

  var audioCtx = new window.AudioContext();

  var analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

  var audioSource = audioCtx.createMediaElementSource(vid);

  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);


  var cw,ch;

  vid.addEventListener('play', function(){
      cw = vid.clientWidth;
      ch = vid.clientHeight;
      canvas.width = cw * _SIZE_;
      canvas.height = ch * _SIZE_;
      back.width = cw;
      back.height = ch;

      drawScene(vid,context,backcontext,cw,ch,audioSource, analyser, pc, pctx);
  },false);



},false);
