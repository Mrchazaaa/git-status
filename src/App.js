import './App.css';
import React from 'react';
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif } from "@giphy/react-components";
import { useAsync } from "react-async-hook";
import keys from './keys.json';

const giphyFetch = new GiphyFetch(keys.gifyKey);

function App() {
    const [ backgroundColor, setBackgroundColor ] = React.useState("white");
    const [gif, setGif] = React.useState(null);

    function changeBackgroundColor(color) {
        setBackgroundColor(color);
    }

    return (
        <div id="background" style={{backgroundColor: backgroundColor}}>
            {gif && <Gif gif={gif} noLink={true} height={"95%"} className={"gif"} />}
            <div id="foreground">
                <button onClick={() => changeBackgroundColor("green")} className="button">Change to green</button>
                <button onClick={() => changeBackgroundColor("red")} className="button">Change to red</button>
                <button onClick={async () => {
                    // const {data} = await giphyFetch.gif("fpXxIjftmkk9y");
                    const {data} = await giphyFetch.search("happy", { sort: 'relevant', lang: 'es', limit: 1, type: 'gifs' });
                    setGif(data[0])
                }} className="button">Change gif</button>
            </div>
        </div>
    );
}

export default App;
