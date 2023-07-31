import React, { useState } from "react";


export default function ExportPalette({ currentPalette }) {

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

    const imgURL = paletteCanvas.toDataURL('image/png')
    var dlLink = document.createElement('a');
    dlLink.download = "palette.png";
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

  }

  return (
    <>
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
    </>
  )
}


