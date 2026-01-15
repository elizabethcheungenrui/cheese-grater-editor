export async function triggerRedeploy() {
  const hook = import.meta.env.VITE_REBUILD_HOOK;

  if (!hook) {
    console.warn("No rebuild hook configured");
    return;
  }

  try {
    const res = await fetch(hook, { method: "POST" });

    if (!res.ok) {
      console.warn("Redeploy hook failed:", res.status);
    } else {
      console.info("Redeploy triggered");
    }
  } catch (err) {
    console.warn("Redeploy hook error:", err);
  }
}
