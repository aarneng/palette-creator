import React, { useRef, useEffect, useState } from 'react'
import "./pickerFromScratch.css"
import {
    drawCurve,
    drawAllBalls,
    drawBall,
    drawBezierLines,
    getColorAtPoint,
    drawNBezierSamples,
    clampXY,
    getXY
} from './helpers/helpers';
import tinycolor from "tinycolor2";

export default function MovableCanvas({
    width,
    height,
    pointLocations,
    drawBackground,
    id,
    setBezierSamplePoints,
    reRenderCanvasOn,
    numSamples,
    bezierChecked,
    reRenderExtra
}) {

    const canvasRef = useRef(null)

    const [deepCloned, setDeepCloned] = useState(null)
    let cloned = deepCloned

    const [deepPositions, setDeepPositions] = useState(
        pointLocations
    )

    let positions = deepPositions

    const [deepClosestBallIdx, setDeepClosestBallIdx] = useState(-1)
    let closestBallIdx = deepClosestBallIdx
    let closestBallLenSquared = Infinity

    const [deepOnFocus, setDeepOnFocus] = useState(false)
    let onFocus = deepOnFocus

    let ctx = null

    var timeout = false;
    useEffect(() => {
        const canvas = canvasRef.current
        ctx = canvas.getContext('2d', { willReadFrequently: true })

        drawBackground(ctx)

        cloned = canvas.cloneNode(true).getContext('2d', { willReadFrequently: true });
        cloned.drawImage(canvas, 0, 0);
        setDeepCloned(cloned)

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, reRenderCanvasOn)

    useEffect(() => {
        drawEverything()
    }, [numSamples, bezierChecked, ...reRenderCanvasOn, ...reRenderExtra])

    function handleResize() {
        clearTimeout(timeout);
        timeout = setTimeout(updateSize, 200);
    }

    function updateSize() {
    }

    function drawEverything(e) {
        const canvas = canvasRef.current
        ctx = canvas.getContext('2d', { willReadFrequently: true })

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(cloned.canvas, 0, 0);

        drawCurve(bezierChecked, positions, ctx)

        drawAllBalls(positions, bezierChecked, cloned, ctx)

        if (bezierChecked) {
            drawBezierLines(positions, ctx)
        }

        drawNBezierSamples(numSamples, positions, setBezierSamplePoints, bezierChecked, ctx, cloned)

        if (e) {
            const canvas = canvasRef.current
            var rect = canvas.getBoundingClientRect()
            let [x, y] = getXY(e, rect)

            setPositions(x, y, closestBallIdx)
        }
    }

    function findAndSetClosestBallIdx(e) {
        const canvas = canvasRef.current
        let rect = canvas.getBoundingClientRect()
        let [x, y] = getXY(e, rect)

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

        setPositions(x, y, closestBallIdx)
    }

    function setPositions(x, y, idx) {
        let pos = positions[idx]
        let nx = pos.data[0], ny = pos.data[0]
        if (pos.movable[0]) {
            nx = x
        }
        if (pos.movable[1]) {
            ny = y
        }
        positions[idx].data = [nx, ny]
        setDeepPositions(positions)
    }

    function onMouseDown(e) {
        // touch event check
        if (e.type === "mousedown") {
            e.preventDefault()
        }
        if (e.type === "mousedown" && e.buttons !== 1) {
            return
        }
        setDeepOnFocus(true)
        onFocus = true
        findAndSetClosestBallIdx(e)
        drawEverything(e)
    }

    function onDrag(e) {
        if (!onFocus) {
            return
        }
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
        setDeepOnFocus(false)
        onFocus = false
        return
    }

    return <div>
        <canvas
            ref={canvasRef}
            id={id}
            width={width}
            height={height}

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
}

