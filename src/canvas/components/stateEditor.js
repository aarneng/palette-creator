import React from "react";


export default function StateEditor({ min, max, stepSize, value, setValue, name, nameProper }) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={stepSize}
        value={value}
        id={name + "Slider"}
        onChange={e => setValue(e.target.value)}
      />
      {nameProper}:
      <input
        type="number"
        id={name + "Input"}
        min={min}
        max={max}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}

