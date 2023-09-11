import { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'

function LeaderBoard({id}) {
    const URI = import.meta.env.VITE_URI
    const [songs, setSongs] = useState()

    useEffect(() => {
        const getSongs = async () => {
            const resp = await window.fetch(`${URI}/api/top5/?id=${localStorage.getItem('user_id')}`).then(resp => resp.json())
            setSongs(resp)
        }
        getSongs()
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            const resp = await window.fetch(`${URI}/api/top5/?id=${localStorage.getItem('user_id')}`).then(resp => resp.json())
            setSongs(resp)
        }, 15000)
        return () => clearInterval(interval)
    }, [])

    return(
        <>
            <h3>Top Songs:</h3>
            {songs ? songs.map(s => { return(<p>Song: <b>{s.name}</b>   Number of Listens: <b>{s.count}</b></p>) }): <p>...</p>}
        </>
    )


}

export default withRouter(LeaderBoard)