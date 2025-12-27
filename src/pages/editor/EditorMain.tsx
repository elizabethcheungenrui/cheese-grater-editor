import { supabase } from "../../lib/supabaseClient";
import Footer from "../header-footer/Footer";
import HeaderDesktop from "../header-footer/HeaderDesktop";

export default function EditorMain() { 
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="page-desktop">
      <HeaderDesktop />

      <button onClick={logout}>
        Sign out
      </button>

      <Footer />
    </div>
  ); 
}
