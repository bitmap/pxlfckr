var _SIZE_ = 5;
var pzzz = 1;
var test1
var test2
var test3

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

      z = (volume / 500);

      // console.log(z);



      // var test = pzzz + pzzz;
      test1 = pzzz += 1;
      pzzz = test1
      test2 = pzzz -= 1;
      pzzz = test2
      test3 = pzzz += 20;
      pzzz = test3

      if (test1 > 255) {
        pzzz = 0;
      }
      if (test2 > 255 || test2 < 0) {
        pzzz = 0;
      }
      if (test3 > 255) {
        pzzz = 0;
      }

      console.log(test1, test2, test3)

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
        pctx.fillStyle = "blue";
        pctx.fillRect(p.x * _SIZE_- z, p.y * _SIZE_, z/10, z/10);
    }

    for(i = 0, j = particles2.length; i<j; i++) {
        p = particles2[i];



        pctx.fillStyle = "rgb(100, 0, 200)";

        pctx.fillRect(p.x * _SIZE_ + z, p.y * _SIZE_, z/5, z/5);

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
  var audioCtx
  var analyser
  var audioSource

  navigator.getUserMedia({video: false, audio: true}, function(stream) {
    audioCtx = new window.AudioContext();

    analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

    audioSource = audioCtx.createMediaStreamSource(stream);

    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
  },     function(e) {
      console.log(e);
      alertError();
    })




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
