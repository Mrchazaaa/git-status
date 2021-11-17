import './App.css';
import React from 'react';
import GifWithText from './GifWithText';
import { useParams } from "react-router-dom";

const RED = "#cc3232";

function Failure() {
    const { message } = useParams();

    console.log("n word");

    const [gifMessage, setGifMessage] = React.useState(message);

    return (
        <div id="background" style={{backgroundColor: RED}}>
            {gifMessage && (<GifWithText text={gifMessage} request={Date.now()} theme={"failed"}/>)}
            <div id="foreground">
            </div>
        </div>
    );
}

export default Failure;
