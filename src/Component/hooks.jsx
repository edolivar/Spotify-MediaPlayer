const getSpotifyInfo = async (accessToken) => {

    let resp = await window.fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    resp = await resp.json()
    return resp
}

const skipCurrentSong = async (accessToken) => {
    let resp = window.fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

}

const prevCurrentSong = async (accessToken) => {
    let resp = window.fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
    })
}

const pauseSong = async (accessToken) => {
    let resp = window.fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

}

const playSong = async (accessToken) => {
    let resp = window.fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` }
    })

}


export { getSpotifyInfo, skipCurrentSong, prevCurrentSong, playSong, pauseSong } 