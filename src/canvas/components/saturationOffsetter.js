import React, { useRef, useEffect, useState } from "react";


export default function SaturationOffsetter({ offsets, setOffsets }) {

    let canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current

        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#000"
        // ctx.lineWidth = 1;
        ctx.strokeWidth = 1
        ctx.beginPath(); // Start a new path
        ctx.moveTo(0, canvas.height / 2); // Move the pen to (30, 50)
        ctx.lineTo(canvas.width, canvas.height / 2); // Move the pen to (30, 50)
        ctx.stroke(); // Render the path

        // window.addEventListener('resize', handleResize);
        // return () => window.removeEventListener('resize', handleResize);
    }, [])

    return <div>
        Offset saturation?
        <div>
            <div>
                still WIP!
            </div>
            <canvas
                ref={canvasRef}
                id="canvas"
                width="200px"
                height="80px"

                style={{
                    touchAction: "none"
                }}
            />
        </div>
    </div>
}
