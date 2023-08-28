import { getSpotifyInfo } from "./hooks";

const songHandler = async (accessToken) => {
    const resp = await getSpotifyInfo(accessToken)
    if (resp.status === 204) {
        return undefined
    }

    const isPlaying = resp.is_playing
    const title = resp.item.name
    const artist = resp.item.artists.map(_artist => _artist.name).join(', ')
    const album = resp.item.album.name
    const albumImageUrl = resp.item.album.images[0].url


    return { isPlaying, title, artist, album, albumImageUrl }
}

export { songHandler }