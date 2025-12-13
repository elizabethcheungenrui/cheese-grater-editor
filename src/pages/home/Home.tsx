import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import "./Home.css";

import { useHomepageSection } from "../../hooks/useHomepageSection";

import MajorLayout from "../../components/MajorLayout";
import MinorLayout from "../../components/MinorLayout";

export default function Home() {
  const [active, setActive] = useState<"voices" | "investigations" | "humour">(
    "investigations"
  );

  const { data: voicesData, loading: voicesLoading } =
    useHomepageSection("Voices", 3);

  const { data: investigationsData, loading: investigationsLoading } =
    useHomepageSection("News", 3);

  const { data: humourData, loading: humourLoading } =
    useHomepageSection("Humour", 3);

  const spring = {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
  };

  if (voicesLoading || investigationsLoading || humourLoading) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <div className="home-grid">
        {/* VOICES COLUMN */}
        <motion.aside
          layout
          onMouseEnter={() => setActive("voices")}
          initial={{ flexGrow: 2 }}
          animate={{ flexGrow: active === "voices" ? 6 : 2 }}
          transition={spring}
        >
          <div className="ghost" />

          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={active === "voices" ? "voices-major" : "voices-minor"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active === "voices" ? (
                <MajorLayout data={voicesData!} />
              ) : (
                <MinorLayout data={voicesData!} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>

        {/* INVESTIGATIONS COLUMN */}
        <motion.main
          layout
          onMouseEnter={() => setActive("investigations")}
          initial={{ flexGrow: 6 }}
          animate={{ flexGrow: active === "investigations" ? 6 : 2 }}
          transition={spring}
        >
          <div className="ghost" />

          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={
                active === "investigations"
                  ? "investigations-major"
                  : "investigations-minor"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active === "investigations" ? (
                <MajorLayout data={investigationsData!} />
              ) : (
                <MinorLayout data={investigationsData!} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.main>

        {/* HUMOUR COLUMN */}
        <motion.aside
          layout
          onMouseEnter={() => setActive("humour")}
          initial={{ flexGrow: 2 }}
          animate={{ flexGrow: active === "humour" ? 6 : 2 }}
          transition={spring}
        >
          <div className="ghost" />

          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={active === "humour" ? "humour-major" : "humour-minor"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active === "humour" ? (
                <MajorLayout data={humourData!} />
              ) : (
                <MinorLayout data={humourData!} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      </div>
    </div>
  );
}
