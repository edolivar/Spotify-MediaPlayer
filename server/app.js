import express from "express"
import cors from 'cors'
import fetch from "node-fetch"
import querystring from 'query-string'
import { Buffer } from 'buffer'
const clientID = 'c0a1baade757484da9b2fd790d541f4f'
const clientSecret = '7c4ad0165ce546e098b42e450be697ab'
const TOKEN_URL = `https://accounts.spotify.com/api/token`
const basicAuth = Buffer.from(`${clientID}:${clientSecret}`).toString('base64')

const getAccessToken = async (refreshToken) => {
    const response = await fetch(TOKEN_URL, {
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

const getSpotifyInfo = async (refreshToken) => {
    const { access_token: token } = await getAccessToken(refreshToken)
    const resp = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    })
    return resp
}

const songHandler = async (refreshToken) => {
    const resp = await getSpotifyInfo(refreshToken)
    if (resp.status === 204) {
        return undefined
    }
    const song = await resp.json()
    const isPlaying = song.is_playing
    const title = song.item.name
    const artist = song.item.artists.map(_artist => _artist.name).join(', ')
    const album = song.item.album.name
    const albumImageUrl = song.item.album.images[0].url

    return { isPlaying, title, artist, album, albumImageUrl }
}

const app = express()

app.use(express.json())

app.use(cors())

// app.use(express.urlencoded({ extended: false }))

const PORT = 3000

app.get('/', (req, res) => {
    console.log('Hello World!')
    res.send('HELLO WORD')
})

app.get('/test', (req, res) => {
    res.send('HELLO TEST')
})

app.post('/accessTokenTest', (req, res) => {
    const refToken = req.body.refreshToken

    //console.log('hello' + refToken)
    getAccessToken(refToken).then(resp => res.send(resp))

})

app.get('/spotifyInfo/', (req, res) => {
    const rTok = req.query.rTok
    songHandler(rTok).then(resp => res.send(resp))
})

app.listen(PORT, () => {
    console.log('App listening on port' + PORT + '!')
})