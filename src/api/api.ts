import axios, { isAxiosError } from "axios";
import qs from "querystring";
import { TrackPage } from "../types/types";

const CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_APP_CLIENT_SECRET;
const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;

const getToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error getting token:",
        error.response?.data || error.message
      );
    }
  }
};

export async function search(
  songName: string,
  limit?: number,
  offset?: number
): Promise<TrackPage> {
  const payload: any = {
    q: songName,
    type: "track",
  };

  if (limit) payload.limit = limit;
  if (offset) payload.offset = offset;

  const queryString = qs.encode(payload);

  const token = await getToken();

  const results = await axios.get(`${API_ENDPOINT}/search?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const tracks = results.data.tracks.items.map((track: any) => {
    const { id, name, href, external_urls, album } = track;
    const { images } = album;

    const artists = track.artists.map((artist: any) => {
      return {
        id: artist.id,
        name: artist.name,
      };
    });

    return {
      id,
      name,
      href,
      external_urls,
      artists,
      images,
    };
  });

  const { total, offset: rOffset } = results.data.tracks;
  return {
    tracks,
    offset: rOffset,
    total,
  };
}
