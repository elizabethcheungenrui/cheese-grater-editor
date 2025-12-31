import { Link } from "react-router-dom"
import "./Podcast.css";

export default function Podcast() {
  return (
    <div id="podcast">
      <div className="podcast-hero">
        <img src="https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/logos/cg_podcast_transparent.png" />

        <div className="text">
          <h3 className="header">Podcast: Grater Insight</h3>

          <p>Take a deep dive beyond the headlines with Grater Insight, our weekly radio slot on Rare FM every Saturday during term time live from 12pm. Listen back to every episode by clicking the link below, or by visiting our <a href="https://open.spotify.com/show/671H9f9qfFds30m8ju8VIG" target="_blank">Spotify Page</a>.</p>

          <Link to="/podcast"><button><h3 className="button-h3">See all episodes</h3></button></Link>

        </div>
      </div>
    </div>
  );
}
