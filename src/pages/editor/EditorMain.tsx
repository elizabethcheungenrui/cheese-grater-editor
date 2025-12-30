import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../header-footer/Footer";
import HeaderDesktop from "../header-footer/HeaderDesktop";
import "./EditorMain.css";

export default function EditorMain() { 
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="page-desktop">
      <HeaderDesktop />
      
      <div className="editor-main">
        <h1>Hewwo Editor :3</h1>
        <p>OwO what's this??? A new article for me?? &#x1f924;</p>
        <Link to="/editor/upload-article"><button className="editor-button">
          Yaaayyy new article!!!!
        </button></Link>
        <button className="editor-button" onClick={logout}>
          Sign out
        </button>
      </div>

      <Footer />
    </div>
  ); 
}
