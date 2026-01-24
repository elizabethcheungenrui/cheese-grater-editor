import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import "./EditorMain.css";

export default function EditorMain() { 
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="page-desktop">
      <Header />
      
      <div className="editor-main">
        <h1>Editor Dashboard</h1>

        <div className="editor-submain">
          <h3>Upload New Article</h3>
          <Link to="/editor/upload-article"><button className="editor-button">
            <p>Click Here</p>
          </button></Link>
        </div>

        <div className="editor-submain">
          <h3>Upload New Podcast</h3>
          <Link to="/editor/upload-podcast"><button className="editor-button">
            <p>Click Here</p>
          </button></Link>
        </div>
        
        <div className="editor-submain">
          <h3>Upload New Print Edition</h3>
          {/*<Link to="/editor/modify-article"><button className="editor-button">
            <p>Click Here</p>
          </button></Link>*/}
          <p>WIP</p>
        </div> 
        
        <div className="editor-submain">
          <h3>Modify/Delete Articles</h3>
          <Link to="/editor/modify-article"><button className="editor-button">
            <p>Click Here</p>
          </button></Link>
        </div>
        
        <div className="editor-submain">
          <h3>Download <i>Cheese Grater</i> Archive</h3>
          {/*<Link to="/editor/modify-article"><button className="editor-button">
            <p>Click Here</p>
          </button></Link>*/}
          <p>WIP, but essentially will allow you to download every <i>CG</i> article currently on the website.</p>
        </div> 
         
        <div className="editor-submain">
          <h3>Lizzie's Message</h3>
          <Link to="/editor/lizzies-message"><button className="editor-button">
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
