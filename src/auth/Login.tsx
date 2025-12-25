import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import HeaderDesktop from "../pages/header-footer/HeaderDesktop";
import Footer from "../pages/header-footer/Footer";

import "./Login.css";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthed(!!data.session);
      setCheckingSession(false);
    };

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return;
      setIsAuthed(!!session);
      setCheckingSession(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);

    setLoading(false);
  }

  if (!checkingSession && isAuthed) {
    return <Navigate to="/editor" replace />;
  }

  return (
    <div className="page-desktop">
      <HeaderDesktop /> 
      <div className="login">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Editor Login</h2>

          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          />

          <button disabled={loading}>
            <p className="send-text">{loading ? "Signing in…" : "Sign in"}</p>
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
}
