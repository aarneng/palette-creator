
import PickerEditable from "./pickerFromScratch"
import MovableCanvas from "./movableCanvas";
import "./paletteMaker.css"

function PaletteMaker() {

    function drawBackground(ctx) {
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
        ctx.fillText("+5", w - 20, h / 4 - 5);
        ctx.fillText("-5", w - 20, 3 * h / 4 - 5);
    }

    return (
        <div
            className="App"
            style={{ display: "flex", justifyContent: "space-around" }}
        >
            <div className="sketchpicker">

                <div className="intro">
                    <h1>SatuPix</h1>
                    SatuPix is a 100% app that allows for
                    easy creation of palettes for pixel art.
                    Palettes created with SatuPix tend to look
                    consistent, as maintaining the same level
                    of saturation throught your palette is made
                    very easy.
                    <br />
                    Why should saturation be consistent?
                    Different environments typically have different
                    levels of saturation, which is
                    also known as the purity of a color.
                    Environments with less light, such as
                    during sundown or in shadows, are typically less saturated,
                    while brighter environments are more saturated.

                    SatuPix helps you maintain this cohesive and
                    unified visual style throught your artwork by
                    emphasising the changes in color hue and lightness.
                </div>
                <div>
                    <PickerEditable />
                </div>
                {/* <div>
                    <MovableCanvas
                        width={300}
                        height={300}
                        pointLocations={
                            [
                                {
                                    "data": [5, 150],
                                    "edgePoint": true,
                                    "optional": false,
                                    "movable": [false, true]
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
                                    "data": [295, 150],
                                    "edgePoint": true,
                                    "optional": false,
                                    "movable": [false, true]
                                },
                            ]
                        }
                        drawBackground={drawBackground}
                        id="canvasSaturationDelta"
                        setBezierSamplePoints={() => { }}
                        reRenderCanvasOn={[]}
                        numSamples={6}
                    />
                </div> */}
                {/* <div>
                    <TempCanvas />
                </div> */}
            </div>
        </div>
    );
}

export default PaletteMaker;
