
import { PickerEditable } from "./pickerFromScratch"
import "./paletteMaker.css"

function PaletteMaker() {

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
            </div>
        </div>
    );
}

export default PaletteMaker;
