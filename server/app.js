import express from "express"
import cors from 'cors'
import path from "path"
import { dirname } from "path"
import { fileURLToPath } from 'url';

const clientID = 'c0a1baade757484da9b2fd790d541f4f'
//const TOKEN_URL = `https://accounts.spotify.com/api/token`
//const basicAuth = Buffer.from(`${clientID}:${clientSecret}`).toString('base64')
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


const app = express()

app.use(express.json()).use(cors()).use(express.static(path.join(__dirname, 'dist')))

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('App listening on port' + PORT + '!')
})

app.get('/', async (req, res) => {
    //console.log(__dirname)
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.get('/api/test', (req, res) => {
    res.send('HELLO TEST')
})

app.post('/api/accessTokenTest', (req, res) => {
    const refToken = req.body.refreshToken

    //console.log('hello' + refToken)
    getAccessToken(refToken).then(resp => res.send(resp))

})


