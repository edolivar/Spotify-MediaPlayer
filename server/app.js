import express from "express"
import cors from 'cors'
import path from "path"
import fetch from 'node-fetch';
import { dirname } from "path"
import { fileURLToPath } from 'url';


const clientID = 'c0a1baade757484da9b2fd790d541f4f'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const DB_URL = 'https://tsdb.onrender.com'

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
    const { refreshToken } = req.query

    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientID,
    });

    let response = await fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    })
    response = await response.json()
    res.send(response)

})

app.get('/api/user', async (req, res) => {
    const { accessToken } = req.query
    
    let resp = await fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    resp = await resp.json()
    
    resp = await fetch(`${DB_URL}/db/addUser/?userName=${resp.id}`, {
        method: 'POST'
    }).then( resp => resp.json())
    
    res.send(resp)
})

app.get('/api/addSong', async (req, res) => {
   
    const songName = req.query.songName 
    const id = req.query.id

    if(!id || !songName) {
        return res.status(400).json({ message: "songName or id is missing" })
    }

    const resp = await fetch(`${DB_URL}/db/addSong/?songName=${songName}&id=${id}`, { method: 'POST'}).then(resp => resp.json())

    res.send(resp)

})


app.get('/api/top5', async (req, res) => {
    const { id } = req.query
    let resp = await fetch(`${DB_URL}/db/top5/?id=${id}`).then(resp => resp.json())
    res.send(resp)
})

app.get('/api/currently-playing', async (req, res) => {
    const { accessToken } = req.query

    
    try {
        let resp = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` }
        })

        resp = await resp.json()
        const isPlaying = resp.is_playing
        const title = resp.item.name
        const artist = resp.item.artists.map(artist => artist.name).join(', ')
        const album = resp.item.album.name
        const albumImageUrl = resp.item.album.images[0].url
        res.send({ isPlaying, title, artist, album, albumImageUrl })
    } catch (e) {
        res.send({error : 'SOMETHING WRONG!!!!'})
    }
    
    

})

app.post('/api/skip', async (req, res) => {
    const { accessToken } = req.query

    await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    res.send({ status: 200 })

})

app.post('/api/prev', async (req, res) => {
    const { accessToken } = req.query

    await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    res.send({ status: 200 })

})

app.post('/api/pause', async (req, res) => {
    const { accessToken } = req.query

    await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    res.send({ status: 200 })
})

app.post('/api/play', async (req, res) => {
    const { accessToken } = req.query

    await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    res.send({ status: 200 })
})



