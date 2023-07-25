import {
    SketchPicker,
    ColorResult,
    TwitterPicker,
    MaterialPicker
} from "react-color";
import { useState } from "react";
import CustomisedPicker from "./custompicker";
import { PickerFromScratch, PickerEditable } from "./pickerFromScratch"

function Canvas() {
    //creating state to store our color and also set color using onChange event for sketch picker
    const [sketchPickerColor, setSketchPickerColor] = useState({
        r: "241",
        g: "112",
        b: "19",
        a: "1",
    });
    // destructuring rgba from state
    const { r, g, b, a } = sketchPickerColor;
    const colors = ["#fff", "#000", "#fdd", "#ff0", "#f00"];
    const [hexCode, setHexCode] = useState("#ff0")


    return (
        <div
            className="App"
            style={{ display: "flex", justifyContent: "space-around" }}
        >
            <div className="sketchpicker">
                <h6>Sketch Picker</h6>
                {/* Div to display the color  */}
                <div
                    style={{
                        backgroundColor: `rgba(${r},${g},${b},${a})`,
                        width: 100,
                        height: 50,
                        border: "2px solid white",
                    }}
                ></div>
                {/* Sketch Picker from react-color and handling color on onChange event */}
                <SketchPicker
                    onChange={(color) => {
                        setSketchPickerColor(color.rgb);
                    }}
                    color={sketchPickerColor}
                />
                <CustomisedPicker
                    colors={colors}
                    hexCode={hexCode}
                    onChange={(color) => {
                        // console.log("click swatch: ", color);
                        document.body.style.backgroundColor = color.hex;
                        setHexCode(color.hex)
                    }}
                />
                <div>
                    <PickerFromScratch />
                </div>
                <div>
                    <PickerEditable />
                </div>
                {/* <div>
                    <PickerEditable />
                </div> */}
            </div>
        </div>
    );
}

export default Canvas;
