import { useEffect, useState } from 'react'
import { withRouter, useLocation } from 'react-router-dom';
import { skipCurrentSong, prevCurrentSong, playSong, pauseSong } from './hooks';
import { BiRightArrow, BiLeftArrow, BiPlayCircle, BiPlay } from "react-icons/bi";
import { songHandler } from './songHandler';
import MemoCanvas from './Canvas';
import { getAccessToken } from "./getAccessToken"


function SongDisplay({ history }) {

    const location = useLocation()
    let [songInfo, setInfo] = useState()

    useEffect(() => {
        localStorage.setItem('rTok', location.state)
    }, [location])

    useEffect(() => {
        const interval = setInterval(async () => {
            let toks = await getAccessToken(localStorage.getItem('rTok'))
            localStorage.setItem('rTok', toks.refresh_token)
            let spotInfo = await songHandler(toks.access_token)
            setInfo(spotInfo)
        }, 7500)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const setUp = async () => {
            if (localStorage.getItem('rTok')) {

                let toks = await getAccessToken(localStorage.getItem('rTok'))
                localStorage.setItem('rTok', toks.refresh_token)
                let spotInfo = await songHandler(toks.access_token)
                setInfo(spotInfo)
            }
        }
        if (!songInfo) {
            setUp()
        }
    }, [songInfo])

    const skippingSong = async () => {
        let toks = await getAccessToken(localStorage.getItem('rTok'))
        localStorage.setItem('rTok', toks.refresh_token)
        skipCurrentSong(toks.access_token)
        setTimeout(async () => {

            let toks = await getAccessToken(localStorage.getItem('rTok'))
            localStorage.setItem('rTok', toks.refresh_token)
            let spotInfo = await songHandler(toks.access_token)
            setInfo(spotInfo)
        }, 500);
    }

    const playpause = async () => {
        if (songInfo.isPlaying) {
            let toks = await getAccessToken(localStorage.getItem('rTok'))
            localStorage.setItem('rTok', toks.refresh_token)
            pauseSong(toks.access_token)
            setInfo({ ...songInfo, isPlaying: false })
        }
        else {
            let toks = await getAccessToken(localStorage.getItem('rTok'))
            localStorage.setItem('rTok', toks.refresh_token)
            playSong(toks.access_token)
            setInfo({ ...songInfo, isPlaying: true })
        }
    }

    const prevSong = async () => {
        let toks = await getAccessToken(localStorage.getItem('rTok'))
        localStorage.setItem('rTok', toks.refresh_token)
        prevCurrentSong(toks.access_token)

        setTimeout(async () => {

            let toks = await getAccessToken(localStorage.getItem('rTok'))
            localStorage.setItem('rTok', toks.refresh_token)
            let spotInfo = await songHandler(toks.access_token)
            setInfo(spotInfo)
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