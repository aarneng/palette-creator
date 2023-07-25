import React from 'react';
import { CustomPicker } from 'react-color';

const tinycolor = require("tinycolor2");

const { Saturation, EditableInput, Hue } = require('react-color/lib/components/common');

const inputStyles = {
    input: {
        border: 'none',
    },
    label: {
        fontSize: '12px',
        color: '#999',
    },
};
const inlineStyles = {
    container: {
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
        display: 'flex',
        flexDirection: 'column',
        height: 282,
        width: 200,
    },
    pointer: {
        width: "4px",
        height: "4px",
        boxShadow: "rgb(255, 255, 255) 0px 0px 0px 1.5px, \
        rgba(0, 0, 0, 0.3) 0px 0px 1px 1px inset, \
        rgba(0, 0, 0, 0.4) 0px 0px 1px 2px",
        borderRadius: "50 %",
        transform: "translate(-2px, -2px)"
    },
    slider: {
        marginTop: '1px',
        width: '4px',
        borderRadius: '1px',
        height: '8px',
        boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
        background: '#fff',
        transform: 'translateX(-2px)'
    },
    saturation: {
        width: '100%',
        paddingBottom: '75%',
        position: 'relative',
        overflow: 'hidden',
    },
    swatchSquare: {
        minWidth: 20,
        minHeight: 20,
        margin: '1px 2px',
        cursor: 'pointer',
        boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
    }
}

const CustomSlider = () => {
    return (
        <div style={inlineStyles.slider} />
    )
}

const CustomPointer = () => {
    return (
        <div style={inlineStyles.pointer} />
    )
}

class CustomColorPicker extends React.Component {
    state = {
        hsl: {
            h: 0,
            s: 0,
            l: 0
        },
        hsv: {
            h: 0,
            s: 0,
            v: 0
        },
        hex: 'aaaaaa'
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.hex !== this.state.hex) {
            const color = tinycolor(this.state.hex);
            // console.log(color, this.state.hex);
            this.setState({
                hsv: color.toHsv(),
                hsl: color.toHsl(),
                hex: color.toHex(),
            });
        }
    }

    handleHueChange = hue => {
        this.setState({
            hsl: hue,
        })
    }

    handleSaturationChange = hsv => {
        const color = tinycolor(hsv);
        this.setState({
            hsv: color.toHsv(),
            hsl: color.toHsl(),
            hex: color.toHex(),
        });
        this.props.onChange(color.toHex())
    }

    displayColorSwatches = colors => {
        return colors.map(color => {
            return (
                <div
                    onClick={() => this.props.onChange(color)}
                    key={color}
                    style={{ ...inlineStyles.swatchSquare, backgroundColor: color, }}
                />
            );
        })
    }

    render() {
        return (
            <div style={inlineStyles.container}>
                <div style={inlineStyles.saturation}>
                    <Saturation
                        hsl={this.state.hsl}
                        hsv={this.state.hsv}
                        pointer={CustomPointer}
                        onChange={this.handleSaturationChange}
                    />
                </div>
                <div style={{ minHeight: 10, position: 'relative', margin: 2 }}>
                    <Hue
                        hsl={this.state.hsl}
                        pointer={CustomSlider}
                        onChange={this.handleHueChange}
                        direction={'horizontal'}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0' }}>
                    <span style={{ color: 'gray', fontSize: 13, marginRight: 3, marginTop: 2, marginLeft: 3 }}>Hex</span>
                    <EditableInput
                        style={inputStyles}
                        value={this.state.hex}
                        onChange={this.props.onChange} />
                </div>
                {this.props.colors.length &&
                    <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', padding: 3 }}>
                        {this.displayColorSwatches(this.props.colors)}
                    </div>
                }
            </div>
        );
    }
}

export default CustomPicker(CustomColorPicker);
