import React, { useState } from "react";
const tinycolor = require("tinycolor2");

export default function PreviewSwatch({ color, size, id }) {
  const [isHovering, setIsHovering] = useState(false);
  const [copyPromtText, setCopyPrompText] = useState("(click to copy)")

  function handleMouseOver() {
    setIsHovering(true);
  };

  function handleMouseOut() {
    setIsHovering(false);
    setCopyPrompText("(click to copy)")
  };

  function handleOnClick() {
    navigator.clipboard.writeText(color)
    setCopyPrompText("copied!")
  }

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleOnClick}
      style={{ display: "flex", alignItems: "center", position: "relative" }}
      id={id}
    >
      <div
        style={{
          width: (size - isHovering * 4) + "px",
          height: (size - isHovering * 4) + "px",
          background: color,
          ...(isHovering && {
            borderRadius: "2px",
            borderColor: "black",
            borderStyle: "solid"
          })
        }} />
      {
        isHovering &&
        <div
          style={{
            margin: "10px",
            position: "absolute",
            left: size + "px",
            width: "max-content",
          }}
        >
          <div style={{
            fontWeight: "500"
          }}>
            {color}
          </div>
          {copyPromtText}
        </div>
      }

    </div>
  )
}
