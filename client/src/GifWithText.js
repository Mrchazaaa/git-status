import React from 'react';
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif } from "@giphy/react-components";
import Text from "./Text";
import keys from './keys.json';

const giphyFetch = new GiphyFetch(keys.gifyKey);

function GifWithText({text, request, theme}) {
    const [gif, setGif] = React.useState(null);

    React.useEffect(() => {
        async function fetchGif() {
            const {data} = await giphyFetch.random({ tag: theme });
            setGif(data);
        }

        fetchGif();
    }, [text, request, theme]);

    return (<div>
            {gif && <div>
                <Gif gif={gif} noLink={true} height={"95%"} className={"gif popup"} />
                <Text className="popup" text={text}/>
            </div>}
        </div>);
}

export default GifWithText;
