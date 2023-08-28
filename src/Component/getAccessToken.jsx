import querystring from 'query-string'
import { Buffer } from 'buffer'

const TOKEN_URL = `https://accounts.spotify.com/api/token`
const clientID = import.meta.env.VITE_CLIENT_ID


const getAccessToken = async (refreshToken) => {

    let body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientID,
    });

    let response = await window.fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
    response = await response.json()
    return response
}

export { getAccessToken }