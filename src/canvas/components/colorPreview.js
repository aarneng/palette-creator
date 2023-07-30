import React from "react";
import PreviewSwatch from "./previewSwatch";


export default function ColorPreview({ colors }) {

  return (
    colors.map((currElement, index) => <PreviewSwatch
      key={index}
      color={currElement}
      size={400 / colors.length}
      id={"previewSwatch" + index}
    />
    )
  )
}
