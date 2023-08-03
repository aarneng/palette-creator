import React from "react";
import PreviewSwatch from "./previewSwatch";
import "./colorPreview.css"


export default function ColorPreview({ colors, dimensions }) {

  let size = dimensions[0]

  // if (size === window.screen.width) {

  // }

  // if (colors)

  return (
    <div id="colorPreview"
      style={{
        ...(window.screen.width <= size + size / 5 && {
          display: "flex",
          top: "-10px"
        })
      }}
    >
      {
        colors.map((currElement, index) => <PreviewSwatch
          key={"colorPreviewSize" + index}
          color={currElement}
          size={Math.min(size / colors.length, size / 5)}
          id={"previewSwatch" + index}
        />
        )
      }
    </div>
  )
}
