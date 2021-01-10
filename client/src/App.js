import './App.css';
import React from 'react';
import GifWithText from './GifWithText';
import { useAsync } from "react-async-hook";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif } from "@giphy/react-components";
import keys from './keys.json';
import aaa from './cool.gif';

const giphyFetch = new GiphyFetch(keys.gifyKey);

const RED = "#cc3232";
const GREEN = "#99c140";

function App() {
    const [ backgroundColor, setBackgroundColor ] = React.useState(GREEN);
    const [gifMessage, setGifMessage] = React.useState(null);
    // const [backgroundGifs, setBackgroundGifs] = React.useState([import('./cool.gif')]);

    const [gif, setGif] = React.useState(null);

    console.log(import('./logo.svg'));

    // useAsync(async () => {
    //     const {data} = await giphyFetch.gif('3oKIPq6tV74ttu4H84');
    //     setGif(data);
    //     import('./cool.gif').then(image => backgroundGifs.push({url: image}));
    // }, []);

    return (
        <div id="background" style={{backgroundColor: backgroundColor}}>
            {/* {gifMessage && (<GifWithText text={gifMessage} request={Date.now()} duration={5000} onClose={() => setGifMessage(null)}/>)} */}
            <img style={{height: "100%", width: "100%"}} src={import('./logo.svg').}/>
            <div id="foreground">
                <button onClick={() => setBackgroundColor(GREEN)} className="button">Change to green</button>
                <button onClick={() => setBackgroundColor(RED)} className="button">Change to red</button>

                {/* <button onClick={sendGifRequest} className="button">Change to gif</button> */}
                <button onClick={() => setGifMessage("hello")} className="button">Change to gif</button>
                {/* <button onClick={async () => {
                    const {data} = await giphyFetch.random({ tag: 'happy' });
                    setGif(data);

                    // const {data} = await giphyFetch.search("happy", { sort: 'relevant', lang: 'es', limit: 1, type: 'gifs' });
                    // setGif(data[0])
                }} className="button">Change gif</button> */}
            </div>
        </div>
    );
}

export default App;
