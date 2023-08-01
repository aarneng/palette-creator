import React, { useRef, useEffect, useState } from 'react'
import Switch from '@mui/material/Switch';
import "./pickerFromScratch.css"
import ColorPreview from './components/colorPreview';
import CurrentPalette from './components/currentPalette';
import ExportPalette from "./components/exportPalette";
import StateEditor from './components/stateEditor';
import {
    drawCurve,
    drawAllBalls,
    drawBall,
    drawBezierLines,
    getColorAtPoint,
    drawNBezierSamples,
    clampXY
} from './helpers/helpers';
import tinycolor from "tinycolor2";

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

function PickerEditable() {
    /**
     * 
     * note to whomever ventures here:
     * this is bad code
     * idk why but i have to create a copy of the states otherwise it doesn't work
     * 
     */

    const [saturation, setSaturation] = useState(0.60)
    const [deepSamples, setDeepSamples] = useState(7)
    let numSamples = deepSamples
    const [colors, setColors] = useState(Array.from({ length: numSamples }, (_, index) => {
        return "green"
    }))

    // const [ballPosition, setBallPosition] = useState(0.70);

    const [deepCloned, setDeepCloned] = useState(null)
    let cloned = deepCloned
    const [canvasElement, setCanvasElement] = useState(null)
    const [deepClosestBallIdx, setDeepClosestBallIdx] = useState(-1)
    let closestBallIdx = deepClosestBallIdx
    let closestBallLenSquared = Infinity
    const [deepCanvasSize, setDeepCanvasSize] = useState(getWH());
    let canvasSize = deepCanvasSize

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

    function setNumSamples(n) {
        setDeepSamples(n)
        numSamples = n
        drawEverything()
    }


    var timeout = false;
    useEffect(() => {
        const canvas = canvasRef.current
        // setCanvasElement(canvas)

        canvas.width = canvasSize[0]
        canvas.height = canvasSize[1]

        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        //Our first draw
        ctx.fillStyle = '#fff'
        for (let x = 0; x < ctx.canvas.width; x++) {
            let x_norm = x * 360 / ctx.canvas.width
            for (let y = 0; y <= ctx.canvas.height; y++) {
                let y_norm = y * 100 / ctx.canvas.height
                let color = tinycolor(`hsl(${x_norm}, ${saturation}, ${y_norm}%)`)

                if (ctx.canvas.height - y === 0 && x <= 5) {
                    console.log(x_norm, y_norm, color);
                }

                ctx.fillStyle = color.toRgbString()
                ctx.fillRect(x, ctx.canvas.height - y, 1, 1);
            }
        }
        setDeepPositions(positions)
        cloned = canvas.cloneNode(true).getContext('2d', { willReadFrequently: true });
        cloned.drawImage(canvas, 0, 0);
        setDeepCloned(cloned)
        drawEverything()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [saturation, deepCanvasSize])

    function handleResize() {
        clearTimeout(timeout);
        timeout = setTimeout(updateSize, 200);
    }

    function updateSize() {
        let wh = getWH()

        if (JSON.stringify(wh) === JSON.stringify(canvasSize)) {
            return
        }

        for (let i in positions) {
            let point = positions[i].data
            let x = point[0]
            let y = point[1]
            x = x * wh[0] / canvasSize[0]
            y = y * wh[1] / canvasSize[1]
            positions[i].data = [x, y]
        }
        setDeepPositions(positions)

        canvasSize = wh
        setDeepCanvasSize(wh);
    }

    function getWH() {
        let w = window.screen.width
        let h = window.screen.height
        if (w >= 360) {
            w = 360
        }
        if (w < 150) {
            // clamp height to not have an impossibly small canvas
            h = 150
        }
        else {
            h = w
        }
        return [w, h]
    }

    function drawEverything(e) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.lineWidth = 2;

        if (e) {
            var rect = canvas.getBoundingClientRect()
            var x = e.clientX - rect.left
            var y = e.clientY - rect.top
            if (e.type === "touchstart" || e.type === "touchmove") {
                x = e.touches[0].clientX - rect.left
                y = e.touches[0].clientY - rect.top
            }
            positions[closestBallIdx].data = clampXY(x, y, rect)
            setDeepPositions(positions)
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(cloned.canvas, 0, 0);

        drawCurve(bezierChecked, positions, ctx)

        drawAllBalls(positions, bezierChecked, cloned, ctx)

        if (bezierChecked) {
            drawBezierLines(positions, ctx)
        }
        drawNBezierSamples(numSamples, positions, setColors, bezierChecked, ctx, cloned)
    }

    function findAndSetClosestBallIdx(e) {
        const canvas = canvasRef.current
        let rect = canvas.getBoundingClientRect()
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top
        if (e.type === "touchstart" || e.type === "touchmove") {
            x = e.touches[0].clientX - rect.left
            y = e.touches[0].clientY - rect.top
        }

        closestBallIdx = -1
        closestBallLenSquared = Infinity

        for (let i in positions) {
            if (positions[i].optional && !bezierChecked) {
                continue
            }
            let dx = positions[i].data[0] - x
            let dy = positions[i].data[1] - y
            let len = dx * dx + dy * dy
            if (len < closestBallLenSquared) {
                closestBallIdx = i
                closestBallLenSquared = len
            }
        }

        setDeepClosestBallIdx(closestBallIdx)
    }

    function onMouseDown(e) {
        // touch event check
        if (e.type === "mousedown") {
            e.preventDefault()
        }
        if (e.type === "mousedown" && e.buttons !== 1) {
            return
        }
        findAndSetClosestBallIdx(e)
        drawEverything(e)
    }

    function onDrag(e) {
        // touch event check
        if (e.type === "mousemove") {
            e.preventDefault()
        }
        if (e.type === "mousemove" && e.buttons !== 1) {
            return
        }
        drawEverything(e)
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

    const handleBezierCheckedChange = (event) => {
        bezierChecked = event.target.checked
        setBezierChecked(event.target.checked);
        drawEverything()
    };

    return <div>
        <div>
            <CurrentPalette currentPalette={currentPalette} colors={colors} />
            <ExportPalette currentPalette={currentPalette} />
        </div>
        <h2>Change palette:</h2>
        <div id="container"
            style={{
                ...(window.screen.width <= canvasSize[0] + canvasSize[0] / 5 && {
                    flexDirection: "column"
                }),
                ...(window.screen.width > canvasSize[0] + canvasSize[0] / 5 && {
                    flexDirection: "row"
                })
            }}
        >
            <div style={{ padding: "20px", paddingBottom: "0" }}>
                <canvas
                    ref={canvasRef}
                    id="canvas"
                    width="400px"
                    height="400px"

                    style={{
                        touchAction: "none"
                    }}

                    onMouseDown={onMouseDown}
                    onMouseMove={onDrag}
                    onMouseUp={onMouseUp}

                    onTouchStart={onMouseDown}
                    onTouchMove={onDrag}
                    onTouchEnd={onMouseUp}
                />
            </div>
            <ColorPreview colors={colors} dimensions={canvasSize} />
        </div>
        <StateEditor
            min={0.0}
            max={1.0}
            stepSize={0.01}
            value={saturation}
            setValue={setSaturation}
            name="saturation"
            nameProper="Saturation"
        />
        <StateEditor
            min={2}
            max={15}
            stepSize={1}
            value={numSamples}
            setValue={setNumSamples}
            name="numSamples"
            nameProper="Samples"
        />
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


export { PickerEditable }