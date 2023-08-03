import tinycolor from "tinycolor2";

function drawCurve(bezierChecked, positions, ctx) {
  ctx.strokeStyle = "#000"
  ctx.beginPath();
  ctx.moveTo(
    positions[0].data[0], positions[0].data[1]
  );
  let nonOptionalPoint = positions[1].data
  let optionalPoint = positions[2].data
  // above might change in the future, needs to be a more robust check
  if (!bezierChecked) {
    ctx.quadraticCurveTo(
      nonOptionalPoint[0], nonOptionalPoint[1],
      positions[3].data[0], positions[3].data[1]
    );
  }
  else {
    ctx.bezierCurveTo(
      nonOptionalPoint[0], nonOptionalPoint[1],
      optionalPoint[0], optionalPoint[1],
      positions[3].data[0], positions[3].data[1]
    );

  }
  ctx.stroke();
}

function drawAllBalls(positions, bezierChecked, cloned, ctx) {
  for (let i in positions) {
    if (!bezierChecked && positions[i].optional) {
      continue
    }
    let isEdgePoint = positions[i].edgePoint

    let fillColor = isEdgePoint ?
      getColorAtPoint(positions[i].data[0], positions[i].data[1], cloned) :
      "#000";

    // console.log(tinycolor(fillColor));

    let outlineColor = invertColor(fillColor)

    drawBall(
      positions[i].data[0],
      positions[i].data[1],
      isEdgePoint ? 8 : 4,
      outlineColor,
      fillColor,
      ctx
    )
  }
}

function drawBall(x, y, radius, colorOutline, colorFill, ctx) {
  ctx.strokeStyle = colorOutline
  ctx.fillStyle = colorFill
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fill()
  ctx.stroke();
}

function drawBezierLines(positions, ctx) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000"
  ctx.strokeWidth = 1
  ctx.beginPath();
  ctx.moveTo(positions[0].data[0], positions[0].data[1]);
  ctx.lineTo(positions[1].data[0], positions[1].data[1]);
  ctx.stroke()
  ctx.beginPath();
  ctx.moveTo(positions[2].data[0], positions[2].data[1]);
  ctx.lineTo(positions[3].data[0], positions[3].data[1]);
  ctx.stroke()

}

function getColorAtPoint(x, y, canvas) {
  let canvasColor = canvas.getImageData(x, y, 1, 1).data
  var r = canvasColor[0];
  var g = canvasColor[1];
  var b = canvasColor[2];
  let color = tinycolor(`rgb(${r}, ${g}, ${b})`)
  return color.toHexString().toUpperCase()
}

function drawNBezierSamples(n, positions, setColors, bezierChecked, ctx, cloned) {
  let positionsFiltered = positions.filter(i => !i.optional || bezierChecked)
  positionsFiltered = positionsFiltered.map(i => i.data)
  let bezzy = bezier(positionsFiltered)
  let squares = new Array(n)
  n = n - 1
  for (let t = 0; t <= n; t++) {
    let point = bezzy(t / n)
    let x = point[0], y = point[1]
    let color = getColorAtPoint(x, y, cloned)
    if (t !== 0 && t !== n) {
      drawBall(x, y, 3, "#000", color, ctx)
    }
    // squares[t].props.style.background = color
    // setColors(squares)
    squares[t] = [x, y]
  }
  setColors(squares)
}

function bezier(pts) {
  /*
  stolen from:
  https://gist.github.com/atomizer/1049745
  */
  return function (t) {
    for (var a = pts; a.length > 1; a = b)  // do..while loop in disguise
      for (var i = 0, b = [], j; i < a.length - 1; i++)  // cycle over control points
        for (b[i] = [], j = 0; j < a[i].length; j++)  // cycle over dimensions
          b[i][j] = a[i][j] * (1 - t) + a[i + 1][j] * t;  // interpolation
    return a[0];
  }
}

function clampXY(x, y, rect) {
  if (x < 0) {
    x = 0
  }
  else if (x > rect.width) {
    x = rect.width
  }
  if (y < 0) {
    y = 0
  }
  else if (y > rect.height) {
    y = rect.height
  }
  return [x, y]
}

function invertColor(hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

function getXY(e, rect) {
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top
  if (e.type === "touchstart" || e.type === "touchmove") {
    x = e.touches[0].clientX - rect.left
    y = e.touches[0].clientY - rect.top
  }
  return clampXY(x, y, rect)
}

export {
  drawCurve,
  drawAllBalls,
  drawBall,
  drawBezierLines,
  getColorAtPoint,
  drawNBezierSamples,
  clampXY,
  getXY
}
