export interface Artist {
  id: string;
  name: string;
}

export interface Image {
  url: string;
  width: string;
  height: string;
}

export interface Track {
  id: string;
  name: string;
  href: string;
  external_urls: any;
  artists: Artist[];
}

export interface TrackPage {
  tracks: Track[];
  offset: number;
  total: number;
}
