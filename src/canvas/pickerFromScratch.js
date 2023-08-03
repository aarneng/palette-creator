import React, { useRef, useEffect, useState } from 'react'
import Switch from '@mui/material/Switch';
import "./pickerFromScratch.css"
import ColorPreview from './components/colorPreview';
import CurrentPalette from './components/currentPalette';
import ExportPalette from "./components/exportPalette";
import StateEditor from './components/stateEditor';
import SaturationOffsetter from './components/saturationOffsetter';
import MovableCanvas from './movableCanvas';
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

export default function PickerEditable() {
    /**
     * 
     * note to whomever ventures here:
     * this is bad code
     * idk why but i have to create a copy of the states otherwise it doesn't work
     * 
     */

    const [saturation, setSaturation] = useState(60)
    const [deepSamples, setDeepSamples] = useState(7)
    let numSamples = deepSamples
    const [colors, setColors] = useState(Array.from({ length: numSamples }, (_, index) => {
        return "green"
    }))

    const [deepCloned, setDeepCloned] = useState(null)
    let cloned = deepCloned

    const [deepCanvasSize, setDeepCanvasSize] = useState(getWH());
    let canvasSize = deepCanvasSize


    let positions = [
        {
            "data": [120, 200],
            "edgePoint": true,
            "optional": false,
            "movable": [true, true]
        },
        {
            "data": [80, 90],
            "edgePoint": false,
            "optional": false,
            "movable": [true, true]
        },
        {
            "data": [30, 170],
            "edgePoint": false,
            "optional": true,
            "movable": [true, true]
        },
        {
            "data": [50, 50],
            "edgePoint": true,
            "optional": false,
            "movable": [true, true]
        },
    ]

    let saturationDeltaPositions = [
        {
            "data": [5, 50],
            "edgePoint": true,
            "optional": false,
            "movable": [false, true]
        },
        {
            "data": [97, 50],
            "edgePoint": false,
            "optional": false,
            "movable": [true, true]
        },
        {
            "data": [193, 50],
            "edgePoint": false,
            "optional": true,
            "movable": [true, true]
        },
        {
            "data": [295, 50],
            "edgePoint": true,
            "optional": false,
            "movable": [false, true]
        },
    ]

    const [deepBezierChecked, setBezierChecked] = React.useState(false);
    let bezierChecked = deepBezierChecked
    const [currentPalette, setCurrentPalette] = useState([])

    const [deepSaturationoffsets, setDeepSaturationoffsets] = useState(new Array(numSamples).fill(0))
    let saturationOffsets = deepSaturationoffsets

    function setSaturationOffsets(offsets) {
        let newOffsets = new Array(offsets.length)
        for (let i in offsets) {
            // 100 is a magic number referring to height 
            // of canvas i'm too lazt to variablize it rn 
            let offsetAmt = offsets[i][1]
            offsetAmt = 100 - offsetAmt * 2
            offsetAmt = offsetAmt / 100 * 20
            newOffsets[i] = offsetAmt
        }
        setDeepSaturationoffsets(newOffsets)
        saturationOffsets = newOffsets
    }

    function setNumSamples(n) {
        setDeepSamples(n)
        numSamples = n
    }

    var timeout = false;

    function drawColorBackground(ctx) {
        ctx.fillStyle = '#fff'
        for (let x = 0; x < ctx.canvas.width; x++) {
            let x_norm = x * 360 / ctx.canvas.width
            for (let y = 1; y <= ctx.canvas.height; y++) {
                let y_norm = (y - 1) * 100 / (ctx.canvas.height - 1)

                ctx.fillStyle = `hsl(${x_norm}, ${saturation}%, ${y_norm}%)`
                ctx.fillRect(x, ctx.canvas.height - y, 1, 1);
            }
        }

        cloned = ctx.canvas.cloneNode(true).getContext('2d', { willReadFrequently: true });
        cloned.drawImage(ctx.canvas, 0, 0);
        setDeepCloned(cloned)
    }

    function drawSaturationDeltaBackground(ctx) {
        let w = ctx.canvas.width
        let h = ctx.canvas.height

        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "#000"

        ctx.strokeWidth = 2
        ctx.beginPath();
        ctx.moveTo(0, h / 2 + .5);
        ctx.lineTo(w, h / 2 + .5);
        ctx.stroke();

        ctx.strokeWidth = 1
        ctx.beginPath();
        ctx.moveTo(0, h / 4 + .5);
        ctx.lineTo(w, h / 4 + .5);
        ctx.stroke();

        ctx.strokeWidth = 1
        ctx.beginPath();
        ctx.moveTo(0, 3 * h / 4 + .5);
        ctx.lineTo(w, 3 * h / 4 + .5);
        ctx.stroke();

        ctx.fillStyle = "#000"
        ctx.font = "14px serif";
        ctx.fillText("+0", w - 20, h / 2 - 5);
        ctx.fillText("+10", w - 20, h / 4 - 5);
        ctx.fillText("-10", w - 20, 3 * h / 4 - 5);
    }

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

    function setBezierSamplePoints(pointPositions) {
        let newColors = new Array(pointPositions.length)
        for (let i in pointPositions) {
            let x = pointPositions[i][0]
            let y = pointPositions[i][1]
            let color = getColorAtPoint(x, y, cloned)
            color = tinycolor(color)
            // console.log("here", saturationOffsets[i]);
            color.saturate(saturationOffsets[i])
            newColors[i] = color.toHexString().toUpperCase()
        }
        setColors(newColors)
    }

    function expandPalette() {
        let myPalette = [...currentPalette]
        let newColors = [...colors]
        // for (let i in saturationOffsets) {
        //     let color = tinycolor(newColors[i])
        //     color.saturate(saturationOffsets[i])
        //     newColors[i] = color
        // }
        myPalette.push(newColors)
        setCurrentPalette(
            myPalette
        )
    }

    const handleBezierCheckedChange = (event) => {
        bezierChecked = event.target.checked
        setBezierChecked(event.target.checked);
    };

    return <div style={{ marginTop: "75px" }}>
        <div>
            <CurrentPalette currentPalette={currentPalette} colors={colors} />
            <ExportPalette currentPalette={currentPalette} offsets={saturationOffsets} />
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
            <div style={{ margin: "20px", paddingBottom: "0", overflow: "clip" }}>
                <MovableCanvas
                    width={400}
                    height={400}
                    pointLocations={positions}
                    drawBackground={drawColorBackground}
                    id="canvasColorPicker"
                    setBezierSamplePoints={setBezierSamplePoints}
                    reRenderCanvasOn={[saturation, deepCanvasSize]}
                    numSamples={numSamples}
                    bezierChecked={bezierChecked}
                    reRenderExtra={[saturationOffsets]}
                />
                <div>
                    finetune the saturation:
                    <MovableCanvas
                        width={300}
                        height={100}
                        pointLocations={saturationDeltaPositions}
                        drawBackground={drawSaturationDeltaBackground}
                        id="canvasSaturationDelta"
                        setBezierSamplePoints={setSaturationOffsets}
                        reRenderCanvasOn={[]}
                        numSamples={numSamples}
                        bezierChecked={true}
                        reRenderExtra={[]}
                    />
                </div>
            </div>
            <ColorPreview colors={colors} dimensions={canvasSize} />
        </div>
        <StateEditor
            min={0}
            max={100}
            stepSize={1}
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

