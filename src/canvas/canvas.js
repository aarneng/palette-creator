
import { PickerEditable } from "./pickerFromScratch"

function Canvas() {

    return (
        <div
            className="App"
            style={{ display: "flex", justifyContent: "space-around" }}
        >
            <div className="sketchpicker">
                <h1>Palette editor:</h1>
                <div>
                    <PickerEditable />
                </div>
            </div>
        </div>
    );
}

export default Canvas;
