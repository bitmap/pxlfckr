var _SIZE_ = 4;


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

function drawScene(v,c,bc,w,h, audio, anal) {



  var i, p;

    if (v.paused || v.ended) return false;
    // First, draw it into the backing canvas
    bc.drawImage(v,0,0,w,h);

    // Grab the pixel data from the backing canvas
    var idata = bc.getImageData(0,0,w,h);
    var data = idata.data;

    c.clearRect(0,0,w * _SIZE_,h * _SIZE_);

  //   var self = this;
  //   this.volume = 0;
  //   this.streamData = new Uint8Array(128);
   //
  //   var sampleAudioStream = function() {
  //      analyser.getByteFrequencyData(self.streamData);
  //      // calculate an overall volume value
  //      var total = 0;
  //      for(var i in self.streamData) {
  //          total += self.streamData[i];
  //      }
  //      self.volume = total;
  //  };

    // console.log(audio);
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

      z = volume / 6000;

    // console.log(anal);
    // console.log(freqDomain.length);
    // console.log(Math.floor(volume / 1000));
    // console.log(anal.getFloatFrequencyData(freqDomain));

    //extract volume
    // for(bin = 0; bin < audioSource.streamData.length; bin ++) {
    //     // do something with each value. Here's a simple example
    //     var val = audioSource.streamData[bin];
    //     var red = val;
    //     var green = 255 - val;
    //     var blue = val / 2;
    //     c.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    //     c.fillRect(bin * 2, 0, 2, volumen);
    //     // use lines and shapes to draw to the canvas is various ways. Use your imagination!
    // }

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
        c.fillRect(p.x * _SIZE_, p.y * _SIZE_, z, z);
    }

    for(i = 0, j = particles2.length; i<j; i++) {
        p = particles2[i];

        c.fillStyle = "#0068ff ";

        c.fillRect(p.x * _SIZE_, p.y * _SIZE_, z, z);

        // c.beginPath();
        // c.arc(p.x * _SIZE_, p.y * _SIZE_, z, 0, 2 * Math.PI, false);
        // c.fill();
    }
    for(i = 0, j = particles3.length; i<j; i++) {
        p = particles3[i];
        c.fillStyle = "#AFAFAF";
        c.fillRect(p.x * _SIZE_, p.y * _SIZE_, z, z);
    }
    for(i = 0, j = particles4.length; i<j; i++) {
        p = particles4[i];
        c.fillStyle = "white";
        c.fillRect(p.x * _SIZE_, p.y * _SIZE_, z, z);
    }

    // Draw the pixels onto the visible canvas
    idata.data = data;

    // randoParticles(c, w * _SIZE_, h * _SIZE_);

    // Start over!
    requestAnimationFrame(function() {
      drawScene(v,c,bc,w,h,audio,anal);
      // drawAudio();
    }, 0);
}

document.addEventListener('DOMContentLoaded', function(){
  var vid = document.getElementById('video');
  var canvas = document.getElementById('scene');
  var context = canvas.getContext('2d');
  var back = document.createElement('canvas');
  var backcontext = back.getContext('2d');

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

      drawScene(vid,context,backcontext,cw,ch,audioSource, analyser);
  },false);



},false);
