import querystring from 'query-string'
import { Buffer } from 'buffer'
const clientID = import.meta.env.VITE_CLIENT_ID
const clientSecret = import.meta.env.VITE_CLIENT_SECRET

const TOKEN_URL = `https://accounts.spotify.com/api/token`
const basicAuth = Buffer.from(`${clientID}:${clientSecret}`).toString('base64')

const getAccessToken = async (refreshToken) => {
    const response = await window.fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    })

    return response.json()
}

export { getAccessToken }