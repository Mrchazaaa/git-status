import './Text.css';
import React from 'react';
import TextTransition, { presets } from "react-text-transition";

function getRandomPreset() {
    var index = Math.floor((Math.random() * 4));
    switch (index) {
        case 0:
            return presets.default;
        case 1:
            return presets.gentle;
        case 2:
            return presets.wobbly;
        case 3:
            return presets.stiff;
        case 4:
            return presets.slow;
        case 4:
            return presets.molasses;
    }
}

function Text({text, duration}) {
    
    return (
        <div style={{backgroundColor: "white"}}>
            <h1>
                <TextTransition
                    text={text}
                    springConfig={getRandomPreset()}
                />
            </h1>
        </div>
    );
}

export default Text;
