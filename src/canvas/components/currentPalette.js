import React from "react";
import "./currentPalette.css"


export default function CurrentPalette({ currentPalette, colors }) {
  return (
    <>
      <h2>Your current palette is:</h2>
      <div id="currentPalette">
        <div>
          {currentPalette.map((currElement, index) => {
            return (
              <div key={index} style={{ display: "flex" }}>
                {currElement.map((innerElement, innerIndex) => {
                  return (
                    <div style={{
                      width: 40 + "px",
                      height: 40 + "px",
                      background: innerElement
                    }}>

                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div style={{
          display: "flex",
          border: "black",
          borderRadius: "3px",
          borderStyle: "solid"
        }}>
          {
            colors.map((currElement, index) => <div
              key={index}
              style={{
                width: 40 + "px",
                height: 40 + "px",
                background: currElement
              }}
              className="displaySquare"
            />
            )
          }
        </div>
      </div>
    </>
  )
}

