import { useEffect, useState } from 'react'
import { withRouter, useLocation, useHistory } from 'react-router-dom';

import { BiRightArrow, BiLeftArrow, BiPlayCircle, BiPlay } from "react-icons/bi";
import MemoCanvas from './Canvas';
import LeaderBoard from './LeaderBoard';



function SongDisplay() {

    const history = useHistory()

    const location = useLocation()
    let [songInfo, setInfo] = useState()
    const URI = import.meta.env.VITE_URI


    async function getRefreshedTokens() {
        let toks = await window.fetch(`${URI}api/refreshTokens/?refreshToken=${localStorage.getItem('rTok')}`, { method: 'GET' }).then(resp => { return resp.json() })
        localStorage.setItem('rTok', toks.refresh_token)
        return toks
    }

    async function songHandler(access_token) {
        
        let toks = await window.fetch(`${URI}api/currently-playing/?accessToken=${access_token}`, { method: 'GET' }).then(resp => { return resp.json() })
    
        return toks

    }

    async function skipCurrentSong(access_token) {
        const URI = import.meta.env.VITE_URI
        let toks = await window.fetch(`${URI}api/skip/?accessToken=${access_token}`, { method: 'POST' }).then(resp => { return resp.json() })
    }

    async function prevCurrentSong(access_token) {
        const URI = import.meta.env.VITE_URI
        let toks = await window.fetch(`${URI}api/prev/?accessToken=${access_token}`, { method: 'POST' }).then(resp => { return resp.json() })
    }

    async function playSong(access_token) {
        const URI = import.meta.env.VITE_URI
        let toks = await window.fetch(`${URI}api/play/?accessToken=${access_token}`, { method: 'POST' }).then(resp => { return resp.json() })
    }


    async function pauseSong(access_token) {
        const URI = import.meta.env.VITE_URI
        let toks = await window.fetch(`${URI}api/pause/?accessToken=${access_token}`, { method: 'POST' }).then(resp => { return resp.json() })
    }


    useEffect(() => {
        localStorage.setItem('rTok', location.state.refresh_token)
        localStorage.setItem('user_id', location.state.user_id)
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            const toks = await getRefreshedTokens()
            const spotInfo = await songHandler(toks.access_token)
            
             if(spotInfo.hasOwnProperty('error')) {
                    setInfo(undefined)
                } else {
                    const temp = localStorage.getItem('oldsong')
                    if(temp != spotInfo.title) {
                        let resp = await window.fetch(`${URI}api/addSong/?songName=${temp}&id=${localStorage.getItem('user_id')}`, { method: 'GET' }).then(resp => resp.json())
                        console.log(resp)
                    }
            
                    localStorage.setItem('oldsong', spotInfo.title)
                    setInfo(spotInfo)
                }
        }, 7500)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const setUp = async () => {
            if (localStorage.getItem('rTok')) {
                const toks = await getRefreshedTokens()
                const spotInfo = await songHandler(toks.access_token)
                if(spotInfo.hasOwnProperty('error')) {
                    setInfo(undefined)
                } else {
                    localStorage.setItem('oldsong', spotInfo.title)            
                    setInfo(spotInfo)
                }
            }
        }
        if (!songInfo) {
            setUp()
        }
    }, [songInfo])

    const skippingSong = async () => {
        const toks = await getRefreshedTokens()
        skipCurrentSong(toks.access_token)
        setTimeout(async () => {

            const toks = await getRefreshedTokens()
            const spotInfo = await songHandler(toks.access_token)
            setInfo(spotInfo)
        }, 500);
    }

    const playpause = async () => {
        if (songInfo.isPlaying) {
            let toks = await getRefreshedTokens()
            pauseSong(toks.access_token)
            setInfo({ ...songInfo, isPlaying: false })
        }
        else {
            let toks = await getRefreshedTokens()
            playSong(toks.access_token)
            setInfo({ ...songInfo, isPlaying: true })
        }
    }

    const prevSong = async () => {
        const toks = await getRefreshedTokens()
        prevCurrentSong(toks.access_token)

        setTimeout(async () => {

            const toks = await getRefreshedTokens()
            const spotInfo = await songHandler(toks.access_token)
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
                    <LeaderBoard id={localStorage.getItem('user_id')}/>
                </>
            }
        </>
    )
}

export default SongDisplay