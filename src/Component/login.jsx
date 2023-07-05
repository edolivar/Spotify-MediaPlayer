import { useEffect, useState } from 'react'
import '../App.css'
import { withRouter } from 'react-router-dom';
import { Buffer } from 'buffer'
async function Refresh_Key(code, URI, basicAuth) {
    const tok = await window.fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            code: code,
            redirect_uri: URI,
            grant_type: 'authorization_code',
        }),
    }).then(resp => resp.json()).then(resp => resp.refresh_token).catch(error => console.log(error))

    return tok
}


function Login({ history }) {
    const clientID = import.meta.env.VITE_CLIENT_ID
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET
    const URI = import.meta.env.VITE_URI
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const responseType = "code"
    const basicAuth = Buffer.from(`${clientID}:${clientSecret}`).toString('base64')
    const loginURL = `${AUTH_ENDPOINT}?client_id=${clientID}&response_type=${responseType}&redirect_uri=${URI}&scope=user-read-currently-playing user-modify-playback-state`

    document.body.style.backgroundColor = '#242424'


    useEffect(() => {

        const wrapperfunc = async () => {

            const authToken = window.location.href.toString().split('?')[1].split('=')[1]
            const rToken = await Refresh_Key(authToken, URI, basicAuth)
            // console.log(rToken)

            // const resp = await window.fetch('http://localhost:3000/accessTokenTest', {
            //     method: 'POST',
            //     body: JSON.stringify({ refreshToken: rToken }),
            //     headers: { 'Content-Type': 'application/json' }
            // })

            // console.log(await resp.json())


            history.push({ pathname: '/SongDisplay', state: rToken })

        }

        if (window.location.href.toString().includes('code')) {
            wrapperfunc()
        }

    }, [])



    return (
        <div>
            <h1>Spotify React App</h1>
            <br />
            <a href={loginURL}>Login to Spotify</a>
        </div >

    )
}

export default withRouter(Login)
