window.addEventListener('load', function(ev) {
  var sourceimage = document.querySelector('img');
  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');
  canvas.height = sourceimage.height;
  canvas.width = sourceimage.width;
  context.drawImage(sourceimage, 0, 0);
  canvas.style.display = 'none';

  context.drawImage(img, 0, 0, sourceimage.width, sourceimage.height);

  // then draw that scaled image thumb back to fill canvas
  // As smoothing is off the result will be pixelated
  context.drawImage(canvas, 0, 0, sourceimage.width, sourceimage.height, 0, 0, canvas.width, canvas.height);

  function shiftcolour() {

    var pixels = context.getImageData(
      0, 0, canvas.width, canvas.height
    );

    var top_left_50_by_50_square = context.getImageData(
      0, 0, 250, 150
    );

    var data = pixels.data;
    var Data_2 = top_left_50_by_50_square.data;

    var pixelArray = [];

    for (var i = 0, loop = data.length; i < loop; i += 4) {
      var color = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2]
      };
      pixelArray.push(color);
    }

    function setPixel(imageData, x, y, r, g, b, a) {
      index = (x + y * imageData.width) * 4;
      data[index + 0] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = a;
    }

    //draw random dots
    // for (i = 0; i < 10000; i++) {
    //   x = Math.random() * canvas.width | 0; // |0 to truncate to Int32
    //   y = Math.random() * canvas.height | 0;
    //   r = Math.random() * 256 | 0;
    //   g = Math.random() * 256 | 0;
    //   b = Math.random() * 256 | 0;
    //   setPixel(pixels, x, y, r, g, b, 255); // 255 opaque
    // }

    for (var i = 0; i < data.length; i += 4) {
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];
      var bit;

      if (rgb2hsv(r, g, b)[2] >= 0.75) {
        if (bit == 1) {
          data[i] = 0;
          data[i + 1] = 255;
          data[i + 2] = 20;

          bit = 0;
        } else {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;

          bit++;
        }
      } else if (rgb2hsv(r, g, b)[2] >= 0.5) {

        if (bit == 2) {
          data[i] = 57;
          data[i + 1] = 255;
          data[i + 2] = 20;

          bit = 0;
        } else {
          data[i] = 20;
          data[i + 1] = 57;
          data[i + 2] = 57;

          bit++;
        }

      } else if (rgb2hsv(r, g, b)[2] >= 0.25) {
        if (bit == 1) {
          data[i] = 57;
          data[i + 1] = 200;
          data[i + 2] = 20;

          bit = 0;
        } else {
          data[i] = 20;
          data[i + 1] = 125;
          data[i + 2] = 138;

          bit++;
        }
      } else {

        if (bit == 2) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 10;

          bit = 1;
        } else if (bit == 1) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;

          bit = -8;
        } else {
          data[i] = 50;
          data[i + 1] = 100;
          data[i + 2] = 0;

          bit = 2;
        }

      }
    }

    // overwrite original image
    context.putImageData(pixels, 0, 0);
    canvas.style.display = 'inline';
  }
  var button = document.querySelector('button');
  button.addEventListener('click', shiftcolour, false);

  function rgb2hsv(r, g, b) {
    var computedH = 0;
    var computedS = 0;
    var computedV = 0;

    //remove spaces from input RGB values, convert to int
    var r = parseInt(('' + r).replace(/\s/g, ''), 10);
    var g = parseInt(('' + g).replace(/\s/g, ''), 10);
    var b = parseInt(('' + b).replace(/\s/g, ''), 10);

    if (r == null || g == null || b == null ||
      isNaN(r) || isNaN(g) || isNaN(b)) {
      alert('Please enter numeric RGB values!');
      return;
    }
    if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
      alert('RGB values must be in the range 0 to 255.');
      return;
    }
    r = r / 255;
    g = g / 255;
    b = b / 255;
    var minRGB = Math.min(r, Math.min(g, b));
    var maxRGB = Math.max(r, Math.max(g, b));

    // Black-gray-white
    if (minRGB == maxRGB) {
      computedV = minRGB;
      return [0, 0, computedV];
    }

    // Colors other than black-gray-white:
    var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
    var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
    computedH = 60 * (h - d / (maxRGB - minRGB));
    computedS = (maxRGB - minRGB) / maxRGB;
    computedV = maxRGB;
    return [computedH, computedS, computedV];
  }

}, false);
