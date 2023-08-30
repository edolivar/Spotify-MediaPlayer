import express from "express"
import cors from 'cors'
import path from "path"
import { dirname } from "path"
import { fileURLToPath } from 'url';

const clientID = 'c0a1baade757484da9b2fd790d541f4f'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


const app = express()

app.use(express.json()).use(cors()).use(express.static(path.join(__dirname, 'dist')))

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('App listening on port' + PORT + '!')
})

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.get('/api/refreshTokens', async (req, res) => {
    let refreshToken = req.query.refreshToken

    let body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientID,
    });

    let response = await fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
    response = await response.json()
    res.send(response)

})

app.get('/api/currently-playing', async (req, res) => {
    let accessToken = req.query.accessToken

    let resp = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    resp = await resp.json()
    const isPlaying = resp.is_playing
    const title = resp.item.name
    const artist = resp.item.artists.map(_artist => _artist.name).join(', ')
    const album = resp.item.album.name
    const albumImageUrl = resp.item.album.images[0].url



    res.send({ isPlaying, title, artist, album, albumImageUrl })


})

app.post('/api/skip', async (req, res) => {
    let accessToken = req.query.accessToken

    await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    res.send({ status: 200 })

})

app.post('/api/prev', async (req, res) => {
    let accessToken = req.query.accessToken

    await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    res.send({ status: 200 })

})

app.post('/api/pause', async (req, res) => {
    let accessToken = req.query.accessToken

    await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    res.send({ status: 200 })
})

app.post('/api/play', async (req, res) => {
    let accessToken = req.query.accessToken

    await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    res.send({ status: 200 })
})

app.get('/api/test', (req, res) => {
    res.send('HELLO TEST')
})



