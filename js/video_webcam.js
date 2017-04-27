var _SIZE_ = 6

var i, p

var idata
var data
var freqDomain
var volume
var z
var z16
var z12
var z8
var sampleAudioStream
var total
var i
var test
var particles0
var particles
var particles2
var particles3
var particles4

function drawScene (v, c, bc, w, h, audio, anal, pc, pctx) {
  if (v.paused || v.ended) return false

    // First, draw it into the backing canvas
  bc.drawImage(v, 0, 0, w, h)

    // Grab the pixel data from the backing canvas
  idata = bc.getImageData(0, 0, w, h)
  data = idata.data

  pc.width = w * _SIZE_
  pc.height = h * _SIZE_

    // clear the main scene
  pctx.clearRect(0, 0, w * _SIZE_, h * _SIZE_)

    // sample the audio data
  freqDomain = new Uint8Array(anal.frequencyBinCount)

  sampleAudioStream = function () {
    anal.getByteFrequencyData(freqDomain)

       // calculate an overall volume value
    total = 0
    for (i = 0; i < 128; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
      total += freqDomain[i]
    }
    volume = total
  }

  sampleAudioStream()

  z = (volume / 200)

  // Particlize
  particles0 = []
  particles = []
  particles2 = []
  particles3 = []
  particles4 = []

  for (var y = 0, y2 = h; y < y2; y++) {
    for (var x = 0, x2 = w; x < x2; x++) {
      if (data[(x * 4 + y * 4 * w)] > 16) {
        p = {
          x: x,
          y: y
        }
        particles0.push(p)
      }

      if (data[(x * 4 + y * 4 * w)] > 32) {
        p = {
          x: x,
          y: y
        }
        particles.push(p)
      }

      if (data[(x * 4 + y * 4 * w)] > 64) {
        p = {
          x: x,
          y: y
        }
        particles2.push(p)
      }

      if (data[(x * 4 + y * 4 * w)] > 128) {
        p = {
          x: x,
          y: y
        }
        particles3.push(p)
      }

      if (data[(x * 4 + y * 4 * w)] > 196) {
        p = {
          x: x,
          y: y
        }
        particles4.push(p)
      }
    }
  }

  z32 = z / 32
  z16 = z / 16
  z12 = z / 12
  z8 = z / 8

  for (i = 0, j = particles0.length; i < j; i++) {
    p = particles0[i]
    pctx.fillStyle = 'rgba(255, 255, 255, 0.20)'
    pctx.fillRect(p.x * _SIZE_ - z8, p.y * _SIZE_, z16, z16)
  }
  for (i = 0, j = particles.length; i < j; i++) {
    p = particles[i]
    pctx.fillStyle = 'rgba(255, 255, 255, 0.40)'
    pctx.fillRect(p.x * _SIZE_, p.y * _SIZE_ - z8, z16, z16)
  }
  for (i = 0, j = particles2.length; i < j; i++) {
    p = particles2[i]

    pctx.fillStyle = 'rgba(255, 255, 255, 0.60)'
    pctx.fillRect(p.x * _SIZE_ + z16, p.y * _SIZE_, z32, z32)
  }
  for (i = 0, j = particles3.length; i < j; i++) {
    p = particles3[i]
    pctx.fillStyle = 'rgba(255, 255, 255, 0.80)'
    pctx.fillRect(p.x * _SIZE_ + z8, p.y * _SIZE_, 2, 2)
  }
  for (i = 0, j = particles4.length; i < j; i++) {
    p = particles4[i]
    pctx.fillStyle = 'rgba(255, 255, 255, 1.00)'
    pctx.fillRect(p.x * _SIZE_, p.y * _SIZE_, 2, 2)
    // pctx.beginPath();
    // pctx.arc(p.x * _SIZE_, p.y * _SIZE_, 1, 0, 2 * Math.PI, false);
    // pctx.fill();
  }

    // Draw the pixels onto the visible canvas
  idata.data = data

    // Start over!
  requestAnimationFrame(function () {
    c.clearRect(0, 0, w * _SIZE_, h * _SIZE_)
    c.drawImage(pc, 0, 0)
    drawScene(v, c, bc, w, h, audio, anal, pc, pctx)
      // console.log(c);
  }, 0)
}

window.onload = function () {
  var video = document.getElementById('video')
  var canvas = document.getElementById('scene')
  var context = canvas.getContext('2d')
  var back = document.createElement('canvas')
  var backcontext = back.getContext('2d')
  var pc = document.createElement('canvas')
  var pctx = pc.getContext('2d')

  // document.body.appendChild(pc);
  var audioCtx
  var analyser
  var audioSource

  var streamContainer = document.getElementById('stream')
  // video = document.getElementById('video')

  // If we don't do this, the stream will not be played.
  // By the way, the play and pause controls work as usual
  // for streamed videos.
  video.setAttribute('autoplay', '1')

  // The video should fill out all of the canvas
  // video.setAttribute('width', ctx.canvas.width)
  video.setAttribute('width', 160)
  video.setAttribute('height', 120)

  // video.setAttribute('style', 'display:none')

  navigator.getUserMedia({video: true, audio: true}, function (stream) {
    audioCtx = new window.AudioContext()

    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256

    audioSource = audioCtx.createMediaStreamSource(stream)

    audioSource.connect(analyser)
    analyser.connect(audioCtx.destination)

    video.src = window.URL.createObjectURL(stream)
  }, function (e) {
    console.log(e)
    alertError()
  })

  var cw, ch

  video.addEventListener('play', function () {
    cw = video.clientWidth
    ch = video.clientHeight
    canvas.width = cw * _SIZE_
    canvas.height = ch * _SIZE_
    back.width = cw
    back.height = ch

    drawScene(video, context, backcontext, cw, ch, audioSource, analyser, pc, pctx)
  }, false)
}
