import { getAccessToken } from "./getAccessToken"

const getSpotifyInfo = async (refreshToken, setRefreshToken) => {
    const { access_token: token } = await getAccessToken(refreshToken, setRefreshToken)
    const resp = window.fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    })
    return resp
}

const skipCurrentSong = async (refreshToken, setRefreshToken) => {
    const { access_token: token } = await getAccessToken(refreshToken, setRefreshToken)
    const resp = window.fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
    })
    return resp
}

const prevCurrentSong = async (refreshToken, setRefreshToken) => {
    const { access_token: token } = await getAccessToken(refreshToken, setRefreshToken)
    const resp = window.fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
    })
    return resp
}

const pauseSong = async (refreshToken, setRefreshToken) => {
    const { access_token: token } = await getAccessToken(refreshToken, setRefreshToken)
    const resp = window.fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
    })
    return resp
}

const playSong = async (refreshToken, setRefreshToken) => {
    const { access_token: token } = await getAccessToken(refreshToken, setRefreshToken)
    const resp = window.fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
    })
    return resp
}


export { getSpotifyInfo, skipCurrentSong, prevCurrentSong, playSong, pauseSong } 