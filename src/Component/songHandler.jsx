import { getSpotifyInfo } from "./hooks";

const songHandler = async (refreshToken, setRefreshToken) => {
    const resp = await getSpotifyInfo(refreshToken, setRefreshToken)
    if (resp.status === 204) {
        return undefined
    }
    console.log(resp)
    const song = await resp.json()
    const isPlaying = song.is_playing
    const title = song.item.name
    const artist = song.item.artists.map(_artist => _artist.name).join(', ')
    const album = song.item.album.name
    const albumImageUrl = song.item.album.images[0].url

    return { isPlaying, title, artist, album, albumImageUrl }
}

export { songHandler }