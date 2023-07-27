import React, { useRef, useEffect, useState } from 'react'
import Switch from '@mui/material/Switch';
import "./pickerFromScratch.css"
const tinycolor = require("tinycolor2");

/*
 * 
 * run instructions: https://github.com/gitname/react-gh-pages
 * 
 * TL;DW: 
 * deploy: 
 * npm run deploy -- -m "Deploy React app to GitHub Pages"
 * 
 * commit (works as normal):
 * git add .
 * git commit -m "Configure React app for deployment to GitHub Pages"
 * git push origin master
 */

function PickerFromScratch() {
    return (
        <div style={{ width: '256px', height: '256px', position: 'relative', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgb(179, 179, 179) rgb(179, 179, 179) rgb(240, 240, 240)', borderImage: 'initial', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: '0px', background: 'rgb(253, 255, 0)' }}>
                <div style={{ position: 'absolute', inset: '0px', background: 'linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0))' }}>
                    <div style={{ position: 'absolute', inset: '0px', background: 'linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0))' }} />
                    <div style={{ position: 'absolute', top: '48.0561%', left: '61.697%', cursor: 'default' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '6px', boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset', transform: 'translate(-6px, -6px)' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PickerEditable() {
    /**
     * 
     * note to whomever ventures here:
     * this is bad code
     * idk why but i have to create a copy of the states otherwise it doesn't work
     * 
     */

    const [saturation, setSaturation] = useState(0.70)
    const [deepSamples, setDeepSamples] = useState(4)
    let numSamples = deepSamples
    const [colors, setColors] = useState(Array.from({ length: numSamples }, (_, index) => {
        return "green"
    }))


    // const [ballPosition, setBallPosition] = useState(0.70);

    let [deepCloned, setDeepCloned] = useState(null)
    let [deepClosestBallIdx, setDeepClosestBallIdx] = useState(-1)

    let cloned = deepCloned
    const canvasRef = useRef(null)

    const [deepPositions, setDeepPositions] = useState(
        [
            {
                "data": [50, 50],
                "edgePoint": true,
                "optional": false
            },
            {
                "data": [80, 90],
                "edgePoint": false,
                "optional": false
            },
            {
                "data": [30, 170],
                "edgePoint": false,
                "optional": true
            },
            {
                "data": [120, 200],
                "edgePoint": true,
                "optional": false
            },
        ]
    )
    let positions = deepPositions

    const [deepBezierChecked, setBezierChecked] = React.useState(false);
    let bezierChecked = deepBezierChecked
    const [currentPalette, setCurrentPalette] = useState([])

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        //Our first draw
        ctx.fillStyle = '#f00000'
        // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        for (let x = 0; x < ctx.canvas.width; x++) {
            let x_norm = x * 360 / ctx.canvas.width
            for (let y = 0; y < ctx.canvas.height; y++) {
                let y_norm = y * 100 / ctx.canvas.height
                let color = tinycolor(`hsl(${x_norm}, ${saturation}, ${y_norm}%)`)

                ctx.fillStyle = color.toRgbString()
                ctx.fillRect(x, ctx.canvas.height - y, 1, 1);
            }
        }
        setDeepPositions(positions)
        cloned = canvas.cloneNode(true).getContext('2d', { willReadFrequently: true });
        cloned.drawImage(canvas, 0, 0);
        setDeepCloned(cloned)
        // setCloned(clonedCpy)
        drawEverything()
    }, [saturation])

    function setNumSamples(n) {
        setDeepSamples(n)
        numSamples = n

        drawEverything()
    }

    let closestBallIdx = deepClosestBallIdx
    let closestBallLenSquared = Infinity

    function onMouseDown(e) {
        e.preventDefault()
        if (e.button !== 0) {
            return
        }
        const canvas = canvasRef.current

        let rect = canvas.getBoundingClientRect()
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top

        closestBallIdx = -1
        closestBallLenSquared = Infinity

        for (let i in positions) {
            let dx = positions[i].data[0] - x
            let dy = positions[i].data[1] - y
            let len = dx * dx + dy * dy
            if (len < closestBallLenSquared) {
                closestBallIdx = i
                closestBallLenSquared = len
            }
        }

        setDeepClosestBallIdx(closestBallIdx)

        positions[closestBallIdx].data[0] = x
        positions[closestBallIdx].data[1] = y
        setDeepPositions(positions)
        drawEverything(e)
    }

    function drawCurve(ctx) {
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

    function drawNBezierSamples(n, ctx) {
        let positionsFiltered = positions.filter(i => !i.optional || bezierChecked)
        positionsFiltered = positionsFiltered.map(i => i.data)
        let bezzy = bezier(positionsFiltered)
        let squares = new Array(n)
        n = n - 1
        for (let t = 0; t <= n; t++) {
            let point = bezzy(t / n)
            let x = point[0], y = point[1]
            let color = getColorAtPoint(x, y)
            if (t !== 0 && t !== n) {
                drawBall(x, y, 3, "#000", color, ctx)
            }
            // squares[t].props.style.background = color
            // setColors(squares)
            squares[t] = color
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


    function drawEverything(e) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.lineWidth = 2;


        if (e) {
            e.preventDefault()
            var rect = canvas.getBoundingClientRect()
            var x = e.clientX - rect.left
            var y = e.clientY - rect.top
            positions[closestBallIdx].data[0] = x
            positions[closestBallIdx].data[1] = y
            setDeepPositions(positions)
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(cloned.canvas, 0, 0);

        drawCurve(ctx)
        console.log(bezierChecked);

        for (let i in positions) {
            if (!bezierChecked && positions[i].optional) {
                console.log("here");
                continue
            }
            let isEdgePoint = positions[i].edgePoint
            drawBall(
                positions[i].data[0],
                positions[i].data[1],
                isEdgePoint ? 8 : 4,
                "#fff",
                isEdgePoint ?
                    getColorAtPoint(positions[i].data[0], positions[i].data[1]) :
                    "#000",
                ctx
            )
        }
        if (bezierChecked) {
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

            ctx.lineWidth = 2;
        }
        drawNBezierSamples(numSamples, ctx)
    }

    function getColorAtPoint(x, y) {
        let canvasColor = cloned.getImageData(x, y, 1, 1).data
        var r = canvasColor[0];
        var g = canvasColor[1];
        var b = canvasColor[2];
        return `rgb(${r}, ${g}, ${b})`
    }

    function drawBall(x, y, radius, colorOutline, colorFill, ctx) {
        ctx.strokeStyle = colorOutline
        ctx.fillStyle = colorFill
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill()
        ctx.stroke();
    }

    function onDrag(e) {
        if (e.buttons == 1) {
            e.preventDefault();
            drawEverything(e)
        }
    }

    function onMouseUp(e) {
        e.preventDefault()
        return
    }

    function expandPalette() {
        let myPalette = [...currentPalette]
        myPalette.push(colors)
        setCurrentPalette(
            myPalette
        )
    }

    const [paletteExportSize, setPaletteExportSize] = useState(1)
    function onPaletteExportSizeChange(e) {
        let val = e.target.value
        if (val < 1) val = 1
        if (val > 150) val = 150
        setPaletteExportSize(val)
    }

    function exportPalette() {
        let paletteCanvas = document.createElement("canvas")
        let paletteCtx = paletteCanvas.getContext("2d")
        let maxLen = Math.max(...currentPalette.map(i => i.length))
        paletteCtx.canvas.width = maxLen * paletteExportSize
        paletteCtx.canvas.height = currentPalette.length * paletteExportSize
        for (let sublistIndex in currentPalette) {
            for (let index in currentPalette[sublistIndex]) {
                let color = currentPalette[sublistIndex][index]
                paletteCtx.fillStyle = color
                paletteCtx.fillRect(
                    index * paletteExportSize,
                    sublistIndex * paletteExportSize,
                    paletteExportSize,
                    paletteExportSize
                );
            }
        }
        // const img = paletteCanvas.toDataURL('image/png').replace("image/png", "image/octet-stream")
        // window.location.href = img;
        // document.write('<img src="' + img + '"/>');

        const imgURL = paletteCanvas.toDataURL('image/png')
        var dlLink = document.createElement('a');
        dlLink.download = "palette.png";
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');

        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);

    }



    const handleBezierCheckedChange = (event) => {
        bezierChecked = event.target.checked
        setBezierChecked(event.target.checked);
        drawEverything()
    };


    return <div>
        hello, world!
        <div>
            <h2>Your current palette is:</h2>
            <div>
                {currentPalette.map((currElement, index) => {
                    return (
                        <div key={index} style={{ display: "flex" }}>
                            {currElement.map((innerElement, innerIndex) => {
                                return (
                                    <div style={{
                                        width: 40 + "px",
                                        height: 40 + "px",
                                        background: innerElement
                                    }}>

                                    </div>
                                )


                            })}
                        </div>
                    )
                })}
            </div>
            <div style={{
                display: "flex",
                border: "black",
                borderRadius: "3px",
                borderStyle: "solid"
            }}>
                {
                    colors.map((currElement, index) => <div
                        key={index}
                        style={{
                            width: 40 + "px",
                            height: 40 + "px",
                            background: currElement
                        }}
                    />
                    )
                }
            </div>
            <div>
                <input
                    type="number"
                    id="exportSize"
                    min={1}
                    max={150}
                    value={paletteExportSize}
                    onChange={onPaletteExportSizeChange}
                /> export size (px)
            </div>
            <button onClick={exportPalette}>export!</button>

        </div>
        <h2>Change palette:</h2>
        <div id="container">
            <canvas
                ref={canvasRef}
                id="canvas"
                width="400px"
                height="400px"
                // onClick={drawEverything}
                // draggable="true"
                // onDragStart={(e) => e.preventDefault()}
                onMouseDown={onMouseDown}
                onMouseMove={onDrag}
                onMouseUp={onMouseUp}

            // onTouchStart={onMouseDown}
            // onTouchMove={onDrag}
            // onTouchEnd={onMouseUp}
            />
            <div>
                {
                    colors.map((currElement, index) => <div
                        key={index}
                        style={{
                            width: 400 / numSamples + "px",
                            height: 400 / numSamples + "px",
                            background: currElement
                        }}
                    />
                    )
                }
            </div>
        </div>
        <div>
            <input
                type="range"
                min={0.0}
                max={1.0}
                step="0.01"
                value={saturation}
                id="saturationSlider"
                onChange={e => setSaturation(e.target.value)}
            />
            Saturation: {/*saturation*/}

            <input
                type="number"
                id="saturationInput"
                min={0.0}
                max={1.0}
                value={saturation}
                onChange={e => setSaturation(e.target.value)}
            />
        </div>
        <div>
            <input
                type="range"
                min={2}
                max={15}
                step="1"
                value={numSamples}
                id="numSamplesSlider"
                onChange={e => setNumSamples(e.target.value)}
            />
            Samples: {/** */}
            <input
                type="number"
                id="numSamplesInput"
                min={2}
                max={15}
                value={numSamples}
                onChange={e => setNumSamples(e.target.value)}
            />
        </div>
        <div>
            <button onClick={expandPalette}>Add to palette</button>
        </div>
        <div>
            Use more control points?
            <Switch
                checked={bezierChecked}
                onChange={handleBezierCheckedChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </div>
        <div>
            <h2>
                input image to use your new palette with it!
            </h2>
            TODO
        </div>
    </div>
}


export { PickerFromScratch, PickerEditable }