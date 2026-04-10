import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireEditor() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        console.error("getSession error:", error);
        setAllowed(false);
      } else {
        setAllowed(!!data.session);
      }

      setChecking(false);
    };

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAllowed(!!session);
      setChecking(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking) return null;
  if (!allowed) return <Navigate to="/" replace />;

  return <Outlet />;
}
