import './App.css';
import React from 'react';
import GifWithText from './GifWithText';
import { useParams } from "react-router-dom";

const GREEN = "#99c140";

function Success() {
    const { message } = useParams();

    const [gifMessage, setGifMessage] = React.useState(message);

    return (
        <div id="background" style={{backgroundColor: GREEN}}>
            {gifMessage && (<GifWithText text={gifMessage} request={Date.now()} theme={"happy"}/>)}
            <div id="foreground">
            </div>
        </div>
    );
}

export default Success;
