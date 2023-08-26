import { useEffect, useState } from 'react'
import { withRouter, useLocation } from 'react-router-dom';
import { skipCurrentSong, prevCurrentSong, playSong, pauseSong } from './hooks';
import { BiRightArrow, BiLeftArrow, BiPlayCircle, BiPlay } from "react-icons/bi";
import { songHandler } from './songHandler';
import MemoCanvas from './Canvas';


function SongDisplay({ history }) {

    const location = useLocation()
    const [rTok, setRefreshToken] = useState();
    const [songInfo, setInfo] = useState()

    useEffect(() => {
        setRefreshToken(location.state)
    }, [location])

    useEffect(() => {
        const interval = setInterval(async () => {
            // const spotInfo = await window.fetch(`https://spotify-mediaplayer-edolivar.onrender.com/api/spotifyInfo/?rTok=${rTok}`, {
            //     method: 'GET',
            // })
            let spotInfo = await songHandler(rTok, setRefreshToken)
            setInfo(await spotInfo.json())
        }, 7500)
        return () => clearInterval(interval)
    }, [rTok])

    useEffect(() => {
        const setUp = async () => {
            if (rTok !== undefined) {
                // const spotInfo = await window.fetch(`https://spotify-mediaplayer-edolivar.onrender.com/api/spotifyInfo/?rTok=${rTok}`, {
                //     method: 'GET',
                // })
                let spotInfo = await songHandler(rTok, setRefreshToken)
                setInfo(await spotInfo.json())
            }
        }
        if (!songInfo) {
            setUp()
        }
    }, [songInfo, rTok])

    const skippingSong = () => {
        skipCurrentSong(rTok, setRefreshToken)
        setTimeout(async () => {
            // const spotInfo = await window.fetch(`https://spotify-mediaplayer-edolivar.onrender.com/api/spotifyInfo/?rTok=${rTok}`, {
            //     method: 'GET',
            // })
            let spotInfo = await songHandler(rTok, setRefreshToken)
            setInfo(await spotInfo.json())
        }, 500);
    }

    const playpause = () => {
        if (songInfo.isPlaying) {
            pauseSong(rTok, setRefreshToken)
            setInfo({ ...songInfo, isPlaying: false })
        }
        else {
            playSong(rTok, setRefreshToken)
            setInfo({ ...songInfo, isPlaying: true })
        }
    }

    const prevSong = () => {
        prevCurrentSong(rTok, setRefreshToken)
        setTimeout(async () => {
            // const spotInfo = await window.fetch(`https://spotify-mediaplayer-edolivar.onrender.com/api/spotifyInfo/?rTok=${rTok}`, {
            //     method: 'GET',
            // })
            let spotInfo = await songHandler(rTok, setRefreshToken)
            setInfo(await spotInfo.json())
        }, 500);
    }

    return (
        <>
            <button onClick={() => {
                history.push('/')
            }}>Home</button>
            <br />
            {!songInfo ?
                <h1>
                    Loading
                </h1> :
                <>
                    <br />
                    <span>
                        <button onClick={prevSong}>
                            <BiLeftArrow size="1.5rem" />
                        </button>
                        <button onClick={playpause}>
                            {!songInfo.isPlaying ? <BiPlayCircle size="1.5rem" /> : <BiPlay size="1.5rem" />}
                        </button>
                        <button onClick={skippingSong}>
                            <BiRightArrow size="1.5rem" />
                        </button>
                    </span>
                    <h2>{songInfo.album}</h2>
                    <MemoCanvas url={songInfo.albumImageUrl} width='480px' height='480px'></MemoCanvas>
                    <h2>{songInfo.title}</h2>
                    <h2>{songInfo.artist}</h2>
                </>
            }
        </>
    )
}

export default withRouter(SongDisplay)