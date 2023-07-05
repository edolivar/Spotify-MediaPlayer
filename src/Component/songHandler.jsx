import { getSpotifyInfo } from "./hooks";

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

export { songHandler }