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
        <h1>Editor Dashboard</h1>

        <div className="editor-submain">
          <h3>Upload New Article</h3>
          <Link to="/editor/upload-article"><button className="editor-button">
            <p>Click Here</p>
          </button></Link>
        </div>
        
        <div className="editor-submain">
          <h3>View/Modify Articles</h3>
          <Link to="/editor/modify-article"><button className="editor-button">
            <p>Click Here</p>
          </button></Link>
        </div>
        
        <div className="editor-submain">
          <h3>Sign Out</h3>
        <button className="editor-button" onClick={logout}>
          <p>Sign out</p>
        </button>
        </div>
      </div>

      <Footer />
    </div>
  ); 
}
