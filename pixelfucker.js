var _SIZE_ = 5
var grimes = false
var sourceWidth = 200

var i
var p
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
var test
var particles0
var particles1
var particles2
var particles3
var particles4
var dataPos

alert('Mute your speakers until I can fix the audio feedback ;)')

function drawScene(video, canvas, backCanvas, w, h, audio, anal, pc, pctx) {
  if (video.paused || video.ended) return false

  // First, draw it into the backing canvas
  backCanvas.drawImage(video, 0, 0, w, h)

  // Grab the pixel data from the backing canvas
  idata = backCanvas.getImageData(0, 0, w, h)
  data = idata.data

  pc.width = w * _SIZE_
  pc.height = h * _SIZE_

  // clear the main scene
  pctx.clearRect(0, 0, w * _SIZE_, h * _SIZE_)

  // sample the audio data
  freqDomain = new Uint8Array(anal.frequencyBinCount)

  anal.getByteFrequencyData(freqDomain)

  // calculate an overall volume value
  total = 0
  for (i = 0; i < 128; i++) {
    // get the volume from the first 80 bins, else it gets too loud with treble
    total += freqDomain[i]
  }
  volume = total

  z = volume / 200

  // Particlize
  particles0 = []
  particles1 = []
  particles2 = []
  particles3 = []
  particles4 = []

  for (var y = 0, y2 = h; y < y2; y++) {
    for (var x = 0, x2 = w; x < x2; x++) {
      dataPos = x * 4 + y * 4 * w

      if (data[dataPos] > 16) {
        p = {
          x: x,
          y: y
        }
        particles0.push(p)
      }

      if (data[dataPos] > 32) {
        p = {
          x: x,
          y: y
        }
        particles1.push(p)
      }

      if (data[dataPos] > 64) {
        p = {
          x: x,
          y: y
        }
        particles2.push(p)
      }

      if (data[dataPos] > 128) {
        p = {
          x: x,
          y: y
        }
        particles3.push(p)
      }

      if (data[dataPos] > 192) {
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
    pctx.fillStyle = 'rgba(100, 0, 100, 1)'
    pctx.fillRect(p.x * _SIZE_ + 2, p.y * _SIZE_ + z12, -1, -1)
  }
  for (i = 0, j = particles1.length; i < j; i++) {
    p = particles1[i]
    pctx.fillStyle = 'rgba(100, 0, 255, 1)'
    pctx.fillRect(p.x * _SIZE_, p.y * _SIZE_, 20, 0)
  }
  for (i = 0, j = particles2.length; i < j; i++) {
    p = particles2[i]

    pctx.fillStyle = 'rgba(0, 0, 255, 1)'
    pctx.fillRect(p.x * _SIZE_ - z8, p.y * _SIZE_, z32, z32)
  }
  for (i = 0, j = particles3.length; i < j; i++) {
    p = particles3[i]
    pctx.fillStyle = 'rgba(255, 255, 255, 1)'
    pctx.fillRect(p.x * _SIZE_, p.y * _SIZE_, -2, -2)
  }
  for (i = 0, j = particles4.length; i < j; i++) {
    p = particles4[i]
    // pctx.fillStyle = 'rgba(255, 255, 255,' + Math.random() +')'
    pctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
    pctx.fillRect(p.x * _SIZE_, p.y * _SIZE_, z32, z32)
    // pctx.beginPath();
    // pctx.arc(p.x * _SIZE_, p.y * _SIZE_, 1, 0, 2 * Math.PI, false);
    // pctx.fill();
  }

  // Draw the pixels onto the visible canvas
  idata.data = data

  // Start over!
  requestAnimationFrame(function() {
    canvas.clearRect(0, 0, w * _SIZE_, h * _SIZE_)
    canvas.drawImage(pc, 0, 0)
    drawScene(video, canvas, backCanvas, w, h, audio, anal, pc, pctx)
  })
}

window.onload = function() {
  var video = document.getElementById('video')
  var canvas = document.getElementById('scene')
  var context = canvas.getContext('2d')
  var back = document.createElement('canvas')
  var backcontext = back.getContext('2d')
  var pc = document.createElement('canvas')
  var pctx = pc.getContext('2d')

  // document.body.appendChild(pc);
  // document.body.appendChild(back);
  var audioCtx
  var analyser
  var audioSource

  var streamContainer = document.getElementById('stream')

  video.setAttribute('autoplay', true)
  video.setAttribute('muted', true)
  video.setAttribute('width', sourceWidth)

  navigator.getUserMedia(
    { video: true, audio: true },
    function(stream) {
      audioCtx = new window.AudioContext()

      analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256

      audioSource = audioCtx.createMediaStreamSource(stream)

      audioSource.connect(analyser)

      if (!grimes) {
        video.src = window.URL.createObjectURL(stream)
        analyser.connect(audioCtx.destination)
      } else {
        video.src = 'grimes.mp4'
      }
    },
    function(e) {
      console.log(e)
      alert(e)
    }
  )

  var cw, ch

  video.addEventListener(
    'play',
    function() {
      cw = video.clientWidth
      ch = video.clientHeight
      canvas.width = cw * _SIZE_
      canvas.height = ch * _SIZE_
      back.width = cw
      back.height = ch

      drawScene(
        video,
        context,
        backcontext,
        cw,
        ch,
        audioSource,
        analyser,
        pc,
        pctx
      )
    },
    false
  )
}
