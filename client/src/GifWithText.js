import React from 'react';
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif } from "@giphy/react-components";
import Text from "./Text";
import { useAsync } from "react-async-hook";
import keys from './keys.json';

const giphyFetch = new GiphyFetch(keys.gifyKey);

function GifWithText({text, request, duration, onClose}) {
    const [gif, setGif] = React.useState(null);

    React.useEffect(() => {
        // useAsync(async () => {
        async function fetchGif() {
            const {data} = await giphyFetch.random({ tag: 'happy' });
            setGif(data);
        }

        fetchGif();
        setTimeout(() => {
            setGif(null);
            onClose();
        }, duration);
    }, [text, request]);

    return (<div>
            {gif && <div>
                <Gif gif={gif} noLink={true} height={"95%"} className={"gif popup"} />
                <Text className="popup" text={text}/>
            </div>};
        </div>);
}

export default GifWithText;
