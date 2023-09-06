import { useEffect, useState } from 'react'
import '../App.css'
import { withRouter } from 'react-router-dom';
import { Buffer } from 'buffer'

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
}



function Login({ history }) {
    const clientID = import.meta.env.VITE_CLIENT_ID
    const URI = import.meta.env.VITE_URI

    document.body.style.backgroundColor = '#242424'


    useEffect(() => {

        const wrapperfunc = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            let code = urlParams.get('code');

            let codeVerifier = localStorage.getItem('code_verifier');

            let body = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: URI,
                client_id: clientID,
                code_verifier: codeVerifier
            });

            let resp = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            })
            resp = await resp.json()
            //getting the token: VERIFIED

            //before moving to songdisplay I need to implement contacting the database for user data!
            //Todo: find a way to store user id by hitting the https://api.spotify.com/v1/me 
            let toks = await window.fetch(`${URI}/api/refreshTokens/?refreshToken=${resp.refresh_token}`, { method: 'GET' }).then(resp => { return resp.json() })
            let user = await window.fetch(`${URI}/api/user/?accessToken=${toks.access_token}`, { method: 'GET' }).then(resp => { return resp.json() })
            history.push({ pathname: '/SongDisplay', state: toks.refresh_token })

        }

        if (window.location.href.toString().includes('code')) {
            wrapperfunc()
        }

    }, [])

    function login() {
        let codeVerifier = generateRandomString(128);

        generateCodeChallenge(codeVerifier).then(codeChallenge => {
            let state = generateRandomString(16);
            let scope = 'user-read-currently-playing user-modify-playback-state user-read-private user-read-email';

            localStorage.setItem('code_verifier', codeVerifier);

            let args = new URLSearchParams({
                response_type: 'code',
                client_id: clientID,
                scope: scope,
                redirect_uri: URI,
                state: state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge
            });

            window.location = 'https://accounts.spotify.com/authorize?' + args;
        });
    }

    return (
        <div>
            <h1>Spotify React App</h1>
            <br />
            <button onClick={login}>Login to spotify</button>
        </div >

    )
}

export default withRouter(Login)
