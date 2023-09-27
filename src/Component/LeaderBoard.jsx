import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

function LeaderBoard({ id }) {
  const URI = import.meta.env.VITE_URI;
  const [songs, setSongs] = useState();

  useEffect(() => {
    const getSongs = async () => {
      const resp = await window
        .fetch(`${URI}api/top5/?id=${localStorage.getItem("user_id")}`)
        .then((resp) => resp.json());
      setSongs(resp);
    };
    getSongs();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const resp = await window
        .fetch(`${URI}api/top5/?id=${localStorage.getItem("user_id")}`)
        .then((resp) => resp.json());
      setSongs(resp);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black flex w-xl justify-center items-center text-center">
      <div className="flex-wrap">
        <h2 class="text-4xl font-extrabold dark:text-white mb-3">Top Songs:</h2>

        {songs ? (
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class=" w-full text-sm text-left text-white">
              <thead class=" text-xs text-white uppercase bg-black ">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Song Name
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Listen Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {songs.map((s) => {
                  return (
                    <tr class="border-b bg-black">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium whitespace-nowrap text-white"
                      >
                        {s.name}
                      </th>
                      <td class="px-6 py-4 text-white">{s.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>...</p>
        )}
      </div>
    </div>
  );
}

export default withRouter(LeaderBoard);
